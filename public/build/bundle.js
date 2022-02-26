
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\components\settings\Switch.svelte generated by Svelte v3.46.4 */

    const file$4 = "src\\components\\settings\\Switch.svelte";

    function create_fragment$4(ctx) {
    	let span0;
    	let t0;
    	let t1;
    	let t2;
    	let label_1;
    	let input;
    	let t3;
    	let span1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			span0 = element("span");
    			t0 = text(/*label*/ ctx[0]);
    			t1 = text(":");
    			t2 = space();
    			label_1 = element("label");
    			input = element("input");
    			t3 = space();
    			span1 = element("span");
    			add_location(span0, file$4, 7, 0, 118);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", "svelte-1j727hj");
    			add_location(input, file$4, 9, 4, 170);
    			attr_dev(span1, "class", "slider svelte-1j727hj");
    			add_location(span1, file$4, 10, 4, 231);
    			attr_dev(label_1, "class", "switch svelte-1j727hj");
    			add_location(label_1, file$4, 8, 0, 142);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span0, anchor);
    			append_dev(span0, t0);
    			append_dev(span0, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, label_1, anchor);
    			append_dev(label_1, input);
    			/*input_binding*/ ctx[4](input);
    			append_dev(label_1, t3);
    			append_dev(label_1, span1);

    			if (!mounted) {
    				dispose = listen_dev(input, "click", /*click_handler*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*label*/ 1) set_data_dev(t0, /*label*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(label_1);
    			/*input_binding*/ ctx[4](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Switch', slots, []);
    	let { label } = $$props;
    	let checkbox;

    	function click() {
    		checkbox.click();
    	}

    	const writable_props = ['label'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Switch> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			checkbox = $$value;
    			$$invalidate(1, checkbox);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    	};

    	$$self.$capture_state = () => ({ label, checkbox, click });

    	$$self.$inject_state = $$props => {
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    		if ('checkbox' in $$props) $$invalidate(1, checkbox = $$props.checkbox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [label, checkbox, click, click_handler, input_binding];
    }

    class Switch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { label: 0, click: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Switch",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*label*/ ctx[0] === undefined && !('label' in props)) {
    			console.warn("<Switch> was created without expected prop 'label'");
    		}
    	}

    	get label() {
    		throw new Error("<Switch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get click() {
    		return this.$$.ctx[2];
    	}

    	set click(value) {
    		throw new Error("<Switch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const skills$1 = writable(false);
    const imperial = writable(false);

    /* src\components\settings\SettingsPanel.svelte generated by Svelte v3.46.4 */
    const file$3 = "src\\components\\settings\\SettingsPanel.svelte";

    function create_fragment$3(ctx) {
    	let div1;
    	let img;
    	let img_src_value;
    	let t0;
    	let input;
    	let t1;
    	let div0;
    	let switch0;
    	let t2;
    	let br0;
    	let br1;
    	let t3;
    	let switch1;
    	let current;
    	let switch0_props = { label: "Skills Mode" };
    	switch0 = new Switch({ props: switch0_props, $$inline: true });
    	/*switch0_binding*/ ctx[4](switch0);
    	switch0.$on("click", /*onskills*/ ctx[2]);
    	let switch1_props = { label: "Imperial Mode" };
    	switch1 = new Switch({ props: switch1_props, $$inline: true });
    	/*switch1_binding*/ ctx[5](switch1);
    	switch1.$on("click", /*onunit*/ ctx[3]);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			img = element("img");
    			t0 = space();
    			input = element("input");
    			t1 = space();
    			div0 = element("div");
    			create_component(switch0.$$.fragment);
    			t2 = space();
    			br0 = element("br");
    			br1 = element("br");
    			t3 = space();
    			create_component(switch1.$$.fragment);
    			if (!src_url_equal(img.src, img_src_value = "./media/GrayGearIcon.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Toggle Settings");
    			attr_dev(img, "class", "gear-icon svelte-t0nrcw");
    			add_location(img, file$3, 33, 4, 948);
    			attr_dev(input, "class", "settings-button svelte-t0nrcw");
    			attr_dev(input, "type", "checkbox");
    			add_location(input, file$3, 38, 4, 1064);
    			add_location(br0, file$3, 41, 8, 1245);
    			add_location(br1, file$3, 41, 14, 1251);
    			attr_dev(div0, "class", "settings-wrapper svelte-t0nrcw");
    			add_location(div0, file$3, 39, 4, 1119);
    			attr_dev(div1, "class", "settings-panel svelte-t0nrcw");
    			add_location(div1, file$3, 32, 0, 914);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, input);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			mount_component(switch0, div0, null);
    			append_dev(div0, t2);
    			append_dev(div0, br0);
    			append_dev(div0, br1);
    			append_dev(div0, t3);
    			mount_component(switch1, div0, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch0_changes = {};
    			switch0.$set(switch0_changes);
    			const switch1_changes = {};
    			switch1.$set(switch1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(switch0.$$.fragment, local);
    			transition_in(switch1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(switch0.$$.fragment, local);
    			transition_out(switch1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			/*switch0_binding*/ ctx[4](null);
    			destroy_component(switch0);
    			/*switch1_binding*/ ctx[5](null);
    			destroy_component(switch1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $imperial;
    	let $skills;
    	validate_store(imperial, 'imperial');
    	component_subscribe($$self, imperial, $$value => $$invalidate(6, $imperial = $$value));
    	validate_store(skills$1, 'skills');
    	component_subscribe($$self, skills$1, $$value => $$invalidate(7, $skills = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SettingsPanel', slots, []);
    	let skills_switch;
    	let unit_switch;

    	const onskills = () => {
    		set_store_value(skills$1, $skills = !$skills, $skills);
    		reloadSave();
    	};

    	const onunit = () => {
    		set_store_value(imperial, $imperial = !$imperial, $imperial);
    		reloadSave();
    	};

    	function reloadSave() {
    		localStorage.setItem("settings", `skills=${$skills}/imperial=${$imperial}`);
    	}

    	function loadSave() {
    		const regex = /skills=((?:false)|(?:true))\/imperial=((?:false)|(?:true))/;
    		const raw_save = localStorage.getItem("settings");
    		if (!regex.test(raw_save)) reloadSave();
    		const save = regex.exec(raw_save);
    		save[1] == "true" && skills_switch.click();
    		save[2] == "true" && unit_switch.click();
    	}

    	onMount(() => {
    		if (!localStorage.getItem("settings")) reloadSave();
    		loadSave();
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SettingsPanel> was created with unknown prop '${key}'`);
    	});

    	function switch0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			skills_switch = $$value;
    			$$invalidate(0, skills_switch);
    		});
    	}

    	function switch1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			unit_switch = $$value;
    			$$invalidate(1, unit_switch);
    		});
    	}

    	$$self.$capture_state = () => ({
    		Switch,
    		skills: skills$1,
    		imperial,
    		onMount,
    		skills_switch,
    		unit_switch,
    		onskills,
    		onunit,
    		reloadSave,
    		loadSave,
    		$imperial,
    		$skills
    	});

    	$$self.$inject_state = $$props => {
    		if ('skills_switch' in $$props) $$invalidate(0, skills_switch = $$props.skills_switch);
    		if ('unit_switch' in $$props) $$invalidate(1, unit_switch = $$props.unit_switch);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [skills_switch, unit_switch, onskills, onunit, switch0_binding, switch1_binding];
    }

    class SettingsPanel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SettingsPanel",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\components\Button.svelte generated by Svelte v3.46.4 */

    const file$2 = "src\\components\\Button.svelte";

    function create_fragment$2(ctx) {
    	let button;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(/*label*/ ctx[0]);
    			attr_dev(button, "class", "svelte-miff50");
    			add_location(button, file$2, 4, 0, 71);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*onclick*/ ctx[1])) /*onclick*/ ctx[1].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if (dirty & /*label*/ 1) set_data_dev(t, /*label*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, []);
    	let { label } = $$props;
    	let { onclick } = $$props;
    	const writable_props = ['label', 'onclick'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    		if ('onclick' in $$props) $$invalidate(1, onclick = $$props.onclick);
    	};

    	$$self.$capture_state = () => ({ label, onclick });

    	$$self.$inject_state = $$props => {
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    		if ('onclick' in $$props) $$invalidate(1, onclick = $$props.onclick);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [label, onclick];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { label: 0, onclick: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*label*/ ctx[0] === undefined && !('label' in props)) {
    			console.warn("<Button> was created without expected prop 'label'");
    		}

    		if (/*onclick*/ ctx[1] === undefined && !('onclick' in props)) {
    			console.warn("<Button> was created without expected prop 'onclick'");
    		}
    	}

    	get label() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onclick() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onclick(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const FIELD_SIDE$1 = 713.74;
    class Color {
        constructor(r, g, b, a = 1) {
            this.toUnfinished = () => new Color(this.r + 40, this.g + 40, this.b + 40, this.a);
            this.toTransparent = () => new Color(this.r, this.g, this.b, 0.1);
            this.toString = () => `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
    }
    const NEUTRAL_MOGO = new Color(255, 255, 0);
    const RED_ALLIANCE = new Color(255, 0, 0);
    const BLUE_ALLIANCE = new Color(0, 0, 255);
    const RING_COLOR = new Color(255, 0, 255);
    const GRID_COLOR = "rgba(155, 155, 155, 0.5)";
    const FIELD_COLOR = "rgb(125, 125, 125)";
    const LINE_COLOR = "rgb(255, 255, 255)";
    /**
     *
     * @param {number} centerX
     * @param {number} centerY
     * @param {number} radius
     * @param {string | CanvasGradient | CanvasPattern | null} fillStyle
     * @param {string | CanvasGradient | CanvasPattern | null} strokeStyle
     * @param {CanvasRenderingContext2D} ctx
     */
    function drawCircle(centerX, centerY, radius, fillStyle, strokeStyle, ctx) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = fillStyle;
        if (fillStyle)
            ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = strokeStyle;
        if (strokeStyle)
            ctx.stroke();
        ctx.closePath();
    }
    /**
     *
     * @param {number} centerX
     * @param {number} centerY
     * @param {number} radius
     * @param {string | CanvasGradient | CanvasPattern} fillStyle
     * @param {string | CanvasGradient | CanvasPattern} strokeStyle
     * @param {CanvasRenderingContext2D} ctx
     */
    function drawDot(centerX, centerY, style, ctx) {
        ctx.lineWidth = 1;
        drawCircle(centerX, centerY, 13, null, style, ctx);
        drawCircle(centerX, centerY, 5, style, null, ctx);
    }
    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {number} radius
     * @param {number} nsides
     * @param {number} rotation
     * @param {CanvasRenderingContext2D} ctx
     */
    function drawPolygon(x, y, radius, nsides, rotation, ctx) {
        const step = (2 * Math.PI) / nsides, shift = Math.PI + (rotation / 360) * (Math.PI * 2);
        ctx.beginPath();
        for (let i = 0; i <= nsides; i++) {
            const curStep = i * step + shift;
            ctx.lineTo(x + radius * Math.cos(curStep), y + radius * Math.sin(curStep));
        }
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
    function drawPlatform(x, y, color, ctx) {
        const longEdge = FIELD_SIDE$1 / 3;
        const shortEdge = FIELD_SIDE$1 / 6;
        ctx.strokeStyle = color;
        ctx.lineCap = "butt";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(x + shortEdge / 10, y + longEdge / 8);
        ctx.lineTo(x + shortEdge - shortEdge / 10, y + longEdge / 8);
        ctx.lineTo(x + shortEdge - shortEdge / 10, y + (longEdge / 8) * 7);
        ctx.lineTo(x + shortEdge / 10, y + (longEdge / 8) * 7);
        ctx.lineTo(x + shortEdge / 10, y + longEdge / 8 - 5);
        ctx.stroke();
        ctx.closePath();
        ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
        ctx.fillRect(x, y, shortEdge, longEdge);
        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + shortEdge + 1, y);
        ctx.lineTo(x + shortEdge + 1, y + longEdge);
        ctx.moveTo(x - 1, y);
        ctx.lineTo(x - 1, y + longEdge);
        ctx.stroke();
        ctx.closePath();
    }
    function drawField(ctx) {
        ctx.fillStyle = FIELD_COLOR;
        ctx.lineWidth = 5;
        ctx.fillRect(0, 0, FIELD_SIDE$1, FIELD_SIDE$1);
        let gridScale = 6;
        let fieldGrid = FIELD_SIDE$1 / gridScale;
        ctx.lineWidth = 3;
        ctx.strokeStyle = GRID_COLOR;
        ctx.beginPath();
        for (let i = 0; i < gridScale; i++) {
            ctx.moveTo(fieldGrid * i, 0);
            ctx.lineTo(fieldGrid * i, FIELD_SIDE$1);
        }
        for (let i = 0; i < gridScale; i++) {
            ctx.moveTo(0, fieldGrid * i);
            ctx.lineTo(FIELD_SIDE$1, fieldGrid * i);
        }
        ctx.stroke();
        ctx.strokeStyle = LINE_COLOR;
        ctx.beginPath();
        ctx.moveTo(FIELD_SIDE$1 / 3, 0);
        ctx.lineTo(FIELD_SIDE$1 / 3, FIELD_SIDE$1);
        ctx.moveTo(FIELD_SIDE$1 / 2 - 2, 0);
        ctx.lineTo(FIELD_SIDE$1 / 2 - 2, FIELD_SIDE$1);
        ctx.moveTo(FIELD_SIDE$1 / 2 + 2, 0);
        ctx.lineTo(FIELD_SIDE$1 / 2 + 2, FIELD_SIDE$1);
        ctx.moveTo((FIELD_SIDE$1 / 3) * 2, 0);
        ctx.lineTo((FIELD_SIDE$1 / 3) * 2, FIELD_SIDE$1);
        ctx.moveTo((FIELD_SIDE$1 / 6) * 4, FIELD_SIDE$1 / 6);
        ctx.lineTo((FIELD_SIDE$1 / 6) * 5, 0);
        ctx.moveTo((FIELD_SIDE$1 / 6) * 2, (FIELD_SIDE$1 / 6) * 5);
        ctx.lineTo((FIELD_SIDE$1 / 6) * 1, FIELD_SIDE$1);
        ctx.stroke();
        ctx.closePath();
        drawPlatform(0, (FIELD_SIDE$1 / 6) * 2, RED_ALLIANCE, ctx);
        drawPlatform((FIELD_SIDE$1 / 6) * 5, (FIELD_SIDE$1 / 6) * 2, BLUE_ALLIANCE, ctx);
    }
    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {CanvasRenderingContext2D} ctx
     */
    function drawTrashCan(x, y, ctx) {
        ctx.strokeStyle = "rgb(255, 255, 255)";
        ctx.lineCap = "round";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(x + 150 / 4, y + 150 / 4);
        ctx.lineTo(x + 150 * (3 / 4), y + 150 / 4);
        ctx.moveTo(x + 150 * (4 / 12), y + 150 / 4);
        ctx.lineTo(x + 150 * (4 / 12), y + 150 * (3 / 4));
        ctx.moveTo(x + 150 * (5 / 12), y + 150 / 4);
        ctx.lineTo(x + 150 * (5 / 12), y + 150 * (3 / 4));
        ctx.moveTo(x + 150 * (6 / 12), y + 150 / 4);
        ctx.lineTo(x + 150 * (6 / 12), y + 150 * (3 / 4));
        ctx.moveTo(x + 150 * (7 / 12), y + 150 / 4);
        ctx.lineTo(x + 150 * (7 / 12), y + 150 * (3 / 4));
        ctx.moveTo(x + 150 * (8 / 12), y + 150 / 4);
        ctx.lineTo(x + 150 * (8 / 12), y + 150 * (3 / 4));
        ctx.moveTo(x + 150 * (1 / 3), y + 150 * (3 / 4));
        ctx.lineTo(x + 150 * (2 / 3), y + 150 * (3 / 4));
        ctx.moveTo(x + 150 * (5 / 12), y + 150 / 4);
        ctx.lineTo(x + 150 * (5 / 12), y + 150 / 4 - 10);
        ctx.lineTo(x + 150 * (7 / 12), y + 150 / 4 - 10);
        ctx.lineTo(x + 150 * (7 / 12), y + 150 / 4);
        ctx.stroke();
        ctx.closePath();
    }

    var _a, _b;
    let skills = false;
    skills$1.subscribe(v => skills = v);
    class GameObject {
        /**
         * Create a new {@link GameObject GameObject}
         * @param {number} x The x coordinate to start at
         * @param {number} y The y coordinate to start at
         * @param {number} rotation The rotation to start at
         * @param {number} variation The variation of the gameobject
         */
        constructor(x, y, rotation, variation) {
            this.x = x;
            this.y = y;
            this.rotation = rotation;
            this.variation = variation;
        }
        /**
         * Move the gameobject to a specific x and y
         * @param {number} x The x to move to
         * @param {number} y The y to move to
         */
        moveTo(x, y) {
            this.x = x;
            this.y = y;
        }
        /**
         * Rotate the gameobject to a specific rotation
         * @param {number} rotation The rotation to turn to
         */
        rotateTo(rotation) {
            this.rotation = rotation;
        }
        /**
         * Draw the GameObject
         * @param {CanvasRenderingContext2D} ctx The context to draw on
         */
        render(ctx) {
            throw new Error("Unimplemented");
        }
        /**
         * Check if a point is inside of a GameObject
         * @param {number} x
         * @param {number} y
         */
        pointInside(x, y) {
            throw new Error("Unimplemented");
        }
        encode() {
            throw new Error("Unimplemented");
        }
        static decode(string) {
            throw new Error("Unimplemented");
        }
        static isEncode(value) {
            throw new Error("Unimplemented");
        }
    }
    class Mogo extends GameObject {
        constructor() {
            super(...arguments);
            this.pointInside = (x, y) => (x - this.x) ** 2 + (y - this.y) ** 2 <= 25.94 ** 2;
        }
        /**
         * Draw the Mogo
         * @param {CanvasRenderingContext2D} ctx The context to draw on
         */
        render(ctx) {
            if (skills)
                switch (this.variation) {
                    case 0:
                        ctx.fillStyle = NEUTRAL_MOGO;
                        break;
                    case 1:
                        ctx.fillStyle = BLUE_ALLIANCE;
                        break;
                    case 2:
                        ctx.fillStyle = RED_ALLIANCE;
                        break;
                }
            else
                switch (this.variation) {
                    case 0:
                        ctx.fillStyle = NEUTRAL_MOGO;
                        break;
                    case 1:
                        ctx.fillStyle = RED_ALLIANCE;
                        break;
                    case 2:
                        ctx.fillStyle = BLUE_ALLIANCE;
                        break;
                }
            let rotation = this.rotation + 14;
            ctx.strokeStyle = "rgb(50, 50, 50)";
            ctx.lineWidth = 3;
            drawPolygon(this.x, this.y, 25.94, 7, rotation, ctx);
        }
        encode() {
            return `mogo-${this.x.toFixed(2)}-${this.y.toFixed(2)}-${this.rotation.toFixed(0)}-${this.variation}`;
        }
        static decode(string) {
            const decoded = this.regex.exec(string).groups;
            return new Mogo(+decoded.x, +decoded.y, +decoded.rotation, +decoded.variation);
        }
    }
    _a = Mogo;
    Mogo.regex = /mogo-(?<x>(?:\d|\.)+)-(?<y>(?:\d|\.)+)-(?<rotation>(?:\d|\.)+)-(?<variation>\d)/;
    Mogo.isEncode = (string) => _a.regex.test(string);
    class Ring extends GameObject {
        /**
         *
         * @param {number} x
         * @param {number} y
         */
        constructor(x, y) {
            super(x, y, 0, 0);
            this.pointInside = (x, y) => (x - this.x) ** 2 + (y - this.y) ** 2 <= 14 ** 2;
        }
        render(ctx) {
            ctx.lineWidth = 2;
            drawCircle(this.x, this.y, 6, "rgba(0, 0, 0, 0)", RING_COLOR, ctx);
        }
        encode() {
            return `ring-${this.x.toFixed(2)}-${this.y.toFixed(2)}`;
        }
        static decode(string) {
            const decoded = this.regex.exec(string).groups;
            return new Ring(+decoded.x, +decoded.y);
        }
    }
    _b = Ring;
    Ring.regex = /ring-(?<x>(?:\d|\.)+)-(?<y>(?:\d|\.)+)/;
    Ring.isEncode = (string) => _b.regex.test(string);

    const default_save = "|mogo-356.50-178.25-180-0/mogo-356.50-356.50-0-0/mogo-356.50-534.75-0-0/mogo-178.25-653.58-270-1/mogo-59.42-237.67-0-1/mogo-534.75-59.42-90-2/mogo-653.58-475.33-180-2/ring-356.50-29.71/ring-356.50-59.42/ring-356.50-89.13/ring-356.50-118.83/ring-386.21-118.83/ring-415.92-118.83/ring-445.63-118.83/ring-475.33-118.83/ring-356.50-237.67/ring-356.50-267.38/ring-356.50-297.08/ring-356.50-475.33/ring-356.50-445.63/ring-356.50-445.63/ring-356.50-415.92/ring-356.50-594.17/ring-356.50-623.88/ring-356.50-653.58/ring-356.50-683.29/ring-326.79-594.17/ring-297.08-594.17/ring-267.38-594.17/ring-237.67-594.17/ring-475.33-356.50/ring-490.19-356.50/ring-475.33-341.65/ring-460.48-356.50/ring-475.33-371.35/ring-475.33-475.33/ring-490.19-475.33/ring-475.33-460.48/ring-460.48-475.33/ring-475.33-490.19/ring-237.67-356.50/ring-252.52-356.50/ring-222.81-356.50/ring-237.67-341.65/ring-237.67-371.35/ring-237.67-237.67/ring-237.67-222.81/ring-252.52-237.67/ring-237.67-252.52/ring-222.81-237.67/";
    // document.getElementById("clear-button").addEventListener("click", () => {
    //     localStorage.removeItem(getSlot());
    //     const slots = localStorage.getItem("all-slots-list")?.split("|");
    //     if (slots)
    //         localStorage.setItem(
    //             "all-slots-list",
    //             slots.filter((v) => v != getSlot()).join("|")
    //         );
    //     else localStorage.setItem("all-slots-list", getSlot());
    //     load(getSlot());
    // });
    // document
    //     .getElementById("clear-all-button")
    //     .addEventListener("click", () => {
    //         const settings = localStorage.getItem("settings");
    //         localStorage.clear();
    //         localStorage.setItem("settings", settings);
    //         setSlot("slot1");
    //         (document.getElementById("slot-selector") as HTMLInputElement).value = "slot1";
    //         load(getSlot());
    //     });
    /**
     * @param {string} slot
     * @param {Array<{x:number,y:number,reversed:boolean}>} points
     * @param {Array<GameObject>} gameobjects
     */
    function save(slot, points, gameobjects) {
        var _a;
        slot = `slot-${slot}`;
        let data = "";
        points.forEach((point) => {
            data += point.x.toFixed(2) + "-";
            data += point.y.toFixed(2) + "-";
            data += point.step.toFixed(0);
            data += "/";
        });
        data += "|";
        gameobjects.forEach((gameobject) => {
            data += gameobject.encode() + "/";
        });
        window.localStorage.setItem(slot, data);
        const slots = (_a = localStorage.getItem("all-slots-list")) === null || _a === void 0 ? void 0 : _a.split("|");
        if (slots) {
            if (!slots.includes(slot)) {
                slots.push(slot);
                localStorage.setItem("all-slots-list", slots.join("|"));
            }
        }
        else {
            localStorage.setItem("all-slots-list", slot);
        }
    }
    /**
     * @param {string} slot
     *
     */
    async function load(slot) {
        if (!localStorage.getItem("all-slots-list"))
            localStorage.setItem("all-slots-list", "slot-slot1");
        const data = window.localStorage.getItem(slot);
        let raw = data === null || data === void 0 ? void 0 : data.split("|");
        const points = [];
        const gameobjects = [];
        if (data == null) {
            raw = default_save.split("|");
        }
        let raw_points = raw[0].split("/");
        let raw_gameobjects = raw[1].split("/");
        if (raw_points[raw_points.length - 1] == "")
            raw_points.pop();
        if (raw_gameobjects[raw_gameobjects.length - 1] == "")
            raw_gameobjects.pop();
        raw_points.forEach((raw_point) => {
            let raw = raw_point.split("-");
            let x = +raw[0];
            let y = +raw[1];
            let step = +raw[2];
            if (!isNaN(x) && !isNaN(y))
                points.push({
                    x,
                    y,
                    step,
                });
        });
        raw_gameobjects.forEach((raw_gameobject) => {
            if (!raw_gameobject)
                return;
            let gameobject;
            if (Ring.isEncode(raw_gameobject))
                gameobject = Ring.decode(raw_gameobject);
            if (Mogo.isEncode(raw_gameobject))
                gameobject = Mogo.decode(raw_gameobject);
            if (gameobject)
                gameobjects.push(gameobject);
        });
        return [points, gameobjects];
    }

    let slot = "slot1";
    function setSlot(v) {
        slot = v;
    }
    function getSlot() {
        return slot;
    }

    const FIELD_SIDE = 713.74;
    const points = writable(new Array());
    const gameobjects = writable([
        new Mogo(FIELD_SIDE / 2, FIELD_SIDE / 4, 180, 0),
        new Mogo(FIELD_SIDE / 2, (FIELD_SIDE / 4) * 2, 0, 0),
        new Mogo(FIELD_SIDE / 2, (FIELD_SIDE / 4) * 3, 0, 0),
        new Mogo((FIELD_SIDE / 12) * 3, (FIELD_SIDE / 12) * 11, 270, 1),
        new Mogo((FIELD_SIDE / 12) * 1, (FIELD_SIDE / 6) * 2, 0, 1),
        new Mogo((FIELD_SIDE / 12) * 9, (FIELD_SIDE / 12) * 1, 90, 2),
        new Mogo((FIELD_SIDE / 12) * 11, (FIELD_SIDE / 3) * 2, 180, 2),
        new Ring(FIELD_SIDE / 2, 29.708333333333332),
        new Ring(FIELD_SIDE / 2, 59.416666666666664),
        new Ring(FIELD_SIDE / 2, 89.125),
        new Ring(FIELD_SIDE / 2, FIELD_SIDE / 6),
        new Ring(386.2083333333333, FIELD_SIDE / 6),
        new Ring(415.91666666666663, FIELD_SIDE / 6),
        new Ring(445.625, FIELD_SIDE / 6),
        new Ring(475.3333333333333, FIELD_SIDE / 6),
        new Ring(FIELD_SIDE / 2, 237.66666666666666),
        new Ring(FIELD_SIDE / 2, 267.375),
        new Ring(FIELD_SIDE / 2, 297.0833333333333),
        new Ring(FIELD_SIDE / 2, 475.3333333333333),
        new Ring(FIELD_SIDE / 2, 445.625),
        new Ring(FIELD_SIDE / 2, 445.625),
        new Ring(FIELD_SIDE / 2, 415.91666666666663),
        new Ring(FIELD_SIDE / 2, 594.1666666666666),
        new Ring(FIELD_SIDE / 2, 623.875),
        new Ring(FIELD_SIDE / 2, 653.5833333333333),
        new Ring(FIELD_SIDE / 2, 683.2916666666666),
        new Ring(326.79166666666663, 594.1666666666666),
        new Ring(297.0833333333333, 594.1666666666666),
        new Ring(267.375, 594.1666666666666),
        new Ring(237.66666666666666, 594.1666666666666),
        new Ring(475.3333333333333, FIELD_SIDE / 2),
        new Ring(490.1875, FIELD_SIDE / 2),
        new Ring(475.3333333333333, 341.6458333333333),
        new Ring(460.47916666666663, FIELD_SIDE / 2),
        new Ring(475.3333333333333, 371.35416666666663),
        new Ring(475.3333333333333, 475.3333333333333),
        new Ring(490.1875, 475.3333333333333),
        new Ring(475.3333333333333, 460.47916666666663),
        new Ring(460.47916666666663, 475.3333333333333),
        new Ring(475.3333333333333, 490.1875),
        new Ring(237.66666666666666, FIELD_SIDE / 2),
        new Ring(252.52083333333331, FIELD_SIDE / 2),
        new Ring(222.8125, FIELD_SIDE / 2),
        new Ring(237.66666666666666, 341.6458333333333),
        new Ring(237.66666666666666, 371.35416666666663),
        new Ring(237.66666666666666, 237.66666666666666),
        new Ring(237.66666666666666, 222.8125),
        new Ring(252.52083333333331, 237.66666666666666),
        new Ring(237.66666666666666, 252.52083333333331),
        new Ring(222.8125, 237.66666666666666),
    ]);

    /* src\map\Map.svelte generated by Svelte v3.46.4 */
    const file$1 = "src\\map\\Map.svelte";

    function create_fragment$1(ctx) {
    	let canvas_1;

    	const block = {
    		c: function create() {
    			canvas_1 = element("canvas");
    			attr_dev(canvas_1, "width", "863.74");
    			attr_dev(canvas_1, "height", "713.74");
    			attr_dev(canvas_1, "tabindex", "0");
    			add_location(canvas_1, file$1, 294, 0, 12927);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, canvas_1, anchor);
    			/*canvas_1_binding*/ ctx[1](canvas_1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(canvas_1);
    			/*canvas_1_binding*/ ctx[1](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $points;
    	let $imperial;
    	let $gameobjects;
    	validate_store(points, 'points');
    	component_subscribe($$self, points, $$value => $$invalidate(2, $points = $$value));
    	validate_store(imperial, 'imperial');
    	component_subscribe($$self, imperial, $$value => $$invalidate(3, $imperial = $$value));
    	validate_store(gameobjects, 'gameobjects');
    	component_subscribe($$self, gameobjects, $$value => $$invalidate(4, $gameobjects = $$value));
    	let { $$slots: slots$1 = {}, $$scope } = $$props;
    	validate_slots('Map', slots$1, []);
    	let canvas;

    	onMount(() => {
    		const FIELD_SIDE = 713.74;

    		const PATH_COLORS = [
    			new Color(210, 10, 10),
    			new Color(210, 110, 10),
    			new Color(210, 210, 10),
    			// new Color(110, 210,  10),
    			new Color(10, 210, 10),
    			new Color(10, 210, 110),
    			new Color(10, 210, 210),
    			new Color(10, 110, 210),
    			new Color(10, 10, 210),
    			new Color(110, 10, 210),
    			new Color(210, 10, 210),
    			new Color(210, 10, 110)
    		];

    		function toImperial(cm) {
    			return cm * 0.393701;
    		}

    		const slot_list = document.getElementById("slots-list");
    		canvas.focus();
    		const GRID_SCALE = 48;
    		const FIELD_GRID = FIELD_SIDE / GRID_SCALE;
    		const ctx = canvas.getContext("2d");

    		/**
     * @type {Array<{x:number,y:number}}
     */
    		let undo = new Array();

    		/**
     * @type {{array:string,index:number}}
     */
    		let selection = { array: "none", index: NaN };

    		let lastX = 0;
    		let lastY = 0;
    		let mouseDown = false;
    		let mouseX;
    		let mouseY;
    		let ctrlDown = false;
    		let shiftDown = false;
    		let altDown = false;
    		let numberKey = 0;

    		{
    			document.getElementById("slot-selector").addEventListener("input", event => {
    				if (event.target.value == "all-slots-list") {
    					event.target.value = "invalid value!";
    					return;
    				}

    				if (localStorage.getItem(getSlot())) save(getSlot(), $points, $gameobjects);
    				setSlot(event.target.value);
    				load(getSlot());
    			});

    			canvas.addEventListener("mousedown", event => {
    				if (event.button != 0) return;
    				mouseDown = true;
    			});

    			canvas.addEventListener("mouseup", event => {
    				if (event.button == 0) {
    					mouseDown = false;

    					if (!shiftDown) {
    						$points.push({ x: mouseX, y: mouseY, step: numberKey });
    						undo = [];
    					}

    					if (selection.array == "gameobjects" && mouseX > FIELD_SIDE && mouseY <= 160) $gameobjects.splice(selection.index, 1);
    					if (selection.array == "points" && mouseX > FIELD_SIDE && mouseY <= 160) $points.splice(selection.index, 1);
    					if ($points.length > 0 && $points[$points.length - 1].x > FIELD_SIDE && $points[$points.length - 1].y <= 160) $points.splice($points.length - 1, 1);
    					selection = { array: "none", index: NaN };
    				}

    				save(getSlot(), $points, $gameobjects);
    			});

    			canvas.addEventListener("contextmenu", event => {
    				event.preventDefault();
    				if (mouseX < FIELD_SIDE) $gameobjects.push(new Ring(mouseX, mouseY));
    				save(getSlot(), $points, $gameobjects);
    			});

    			canvas.addEventListener("mousemove", event => {
    				const x = event.x - canvas.offsetLeft;
    				const y = event.y - canvas.offsetTop;

    				mouseX = !event.ctrlKey
    				? event.altKey
    					? lastX % FIELD_GRID
    					: 0 + Math.round((x - (event.altKey ? lastX % FIELD_GRID : 0)) / FIELD_GRID) * FIELD_GRID
    				: x;

    				mouseY = !event.ctrlKey
    				? event.altKey
    					? lastY % FIELD_GRID
    					: 0 + Math.round((y - (event.altKey ? lastY % FIELD_GRID : 0)) / FIELD_GRID) * FIELD_GRID
    				: y;

    				mouseX = mouseX <= FIELD_SIDE
    				? mouseX
    				: mouseY < 160 ? mouseX : Math.min(mouseX, FIELD_SIDE);

    				if (event.shiftKey && mouseDown && selection.array == "none") {
    					$gameobjects.forEach((gameobject, i) => {
    						if (gameobject.pointInside(x, y)) {
    							selection = { array: "gameobjects", index: i };
    						}
    					});

    					$points.forEach((point, i) => {
    						if ((x - point.x) ** 2 + (y - point.y) ** 2 <= 16 ** 2) {
    							selection = { array: "points", index: i };
    						}
    					});
    				} else if (!event.shiftKey) {
    					selection = { array: "none", index: NaN };
    				}

    				switch (selection.array) {
    					case "gameobjects":
    						set_store_value(gameobjects, $gameobjects[selection.index].x = mouseX, $gameobjects);
    						set_store_value(gameobjects, $gameobjects[selection.index].y = mouseY, $gameobjects);
    						break;
    					case "points":
    						set_store_value(points, $points[selection.index].x = mouseX, $points);
    						set_store_value(points, $points[selection.index].y = mouseY, $points);
    						break;
    				}
    			});

    			canvas.addEventListener("keydown", event => {
    				if (event.ctrlKey && event.code == "KeyZ") {
    					const point = $points.pop();
    					if (point) undo.push(point);
    				}

    				if (event.ctrlKey && event.code == "KeyY") {
    					const point = undo.pop();
    					if (point) $points.push(point);
    				}

    				ctrlDown = event.ctrlKey;
    				shiftDown = event.shiftKey;
    				altDown = event.altKey;
    				if ((/\d/).test(event.key) && +event.key != 0) numberKey = +event.key - 1; else if (+event.key == 0) numberKey = 10;
    				if (ctrlDown || shiftDown || altDown) event.preventDefault();
    			});

    			canvas.addEventListener("keyup", event => {
    				ctrlDown = event.ctrlKey;
    				shiftDown = event.shiftKey;
    				altDown = event.altKey;
    			});
    		}

    		async function onTick() {
    			var _a,
    				_b,
    				_c,
    				_d,
    				_e,
    				_f,
    				_g,
    				_h,
    				_j,
    				_k,
    				_l,
    				_m,
    				_o,
    				_p,
    				_q,
    				_r,
    				_s,
    				_t,
    				_u,
    				_v,
    				_w,
    				_x,
    				_y,
    				_z;

    			lastX = (_b = (_a = $points[$points.length - 1]) === null || _a === void 0
    			? void 0
    			: _a.x) !== null && _b !== void 0
    			? _b
    			: 0;

    			lastY = (_d = (_c = $points[$points.length - 1]) === null || _c === void 0
    			? void 0
    			: _c.y) !== null && _d !== void 0
    			? _d
    			: 0;

    			ctx.fillStyle = "rgb(255, 50, 50)";
    			ctx.fillRect(FIELD_SIDE, 0, 150, 150);
    			ctx.fillStyle = "rgb(50, 50, 50)";
    			ctx.fillRect(FIELD_SIDE, 150, 150, FIELD_SIDE - 150);
    			drawTrashCan(FIELD_SIDE, 0, ctx);
    			drawField(ctx);
    			$gameobjects.forEach(gameobject => gameobject.render(ctx));

    			if (!ctrlDown) {
    				ctx.lineWidth = 1;
    				ctx.strokeStyle = GRID_COLOR.toString();
    				ctx.beginPath();

    				for (let i = 0; i < GRID_SCALE; i++) {
    					ctx.moveTo(FIELD_GRID * i + (altDown ? lastX % FIELD_GRID : 0), 0);
    					ctx.lineTo(FIELD_GRID * i + (altDown ? lastX % FIELD_GRID : 0), FIELD_SIDE);
    				}

    				for (let i = 0; i < GRID_SCALE; i++) {
    					ctx.moveTo(0, FIELD_GRID * i + (altDown ? lastY % FIELD_GRID : 0));
    					ctx.lineTo(FIELD_SIDE, FIELD_GRID * i + (altDown ? lastY % FIELD_GRID : 0));
    				}

    				ctx.stroke();
    				ctx.closePath();
    			}

    			for (let i = 0; i < $points.length; i++) {
    				if (selection.index == i && selection.array == "points") drawDot($points[i].x, $points[i].y, PATH_COLORS[$points[i].step].toUnfinished().toString(), ctx); else drawDot($points[i].x, $points[i].y, PATH_COLORS[$points[i].step].toString(), ctx);

    				ctx.strokeStyle = (selection.index == i || selection.index + 1 == i) && selection.array == "points"
    				? PATH_COLORS[$points[i].step].toUnfinished().toString()
    				: PATH_COLORS[$points[i].step].toString();

    				ctx.lineWidth = 3;
    				ctx.beginPath();

    				ctx.moveTo(
    					(_f = (_e = $points[i - 1]) === null || _e === void 0
    					? void 0
    					: _e.x) !== null && _f !== void 0
    					? _f
    					: $points[i].x,
    					(_h = (_g = $points[i - 1]) === null || _g === void 0
    					? void 0
    					: _g.y) !== null && _h !== void 0
    					? _h
    					: $points[i].y
    				);

    				ctx.lineTo($points[i].x, $points[i].y);
    				ctx.stroke();
    				ctx.closePath();

    				/**
     * @type {number}
     */
    				let angle = Math.atan2(
    					$points[i].y - ((_j = $points[i + 1]) === null || _j === void 0
    					? void 0
    					: _j.y),
    					$points[i].x - ((_k = $points[i + 1]) === null || _k === void 0
    					? void 0
    					: _k.x)
    				) * 180 / Math.PI - Math.atan2(
    					((_l = $points[i - 1]) === null || _l === void 0
    					? void 0
    					: _l.y) - ((_m = $points[i]) === null || _m === void 0
    					? void 0
    					: _m.y),
    					((_o = $points[i - 1]) === null || _o === void 0
    					? void 0
    					: _o.x) - $points[i].x
    				) * 180 / Math.PI;

    				if (i == 0) angle = Math.atan2(
    					$points[0].y - ((_p = $points[1]) === null || _p === void 0
    					? void 0
    					: _p.y),
    					$points[0].x - ((_q = $points[1]) === null || _q === void 0
    					? void 0
    					: _q.x)
    				) * 180 / Math.PI;

    				if (!isNaN(angle)) ctx.fillText(`${Math.round(angle)}\u00B0`, $points[i].x + 20, $points[i].y + 20);

    				ctx.fillStyle = (selection.index == i || selection.index - 1 == i) && selection.array == "points"
    				? PATH_COLORS[(_s = (_r = $points[i + 1]) === null || _r === void 0
    					? void 0
    					: _r.step) !== null && _s !== void 0
    					? _s
    					: $points[i].step].toUnfinished().toString()
    				: PATH_COLORS[(_u = (_t = $points[i + 1]) === null || _t === void 0
    					? void 0
    					: _t.step) !== null && _u !== void 0
    					? _u
    					: $points[i].step].toString();

    				const distance = Math.sqrt(($points[i].x - ((_v = $points[i + 1]) === null || _v === void 0
    				? void 0
    				: _v.x)) ** 2 + ($points[i].y - ((_w = $points[i + 1]) === null || _w === void 0
    				? void 0
    				: _w.y)) ** 2) / 2;

    				if (!isNaN(distance)) ctx.fillText(
    					`${Math.round(($imperial ? toImperial(distance) : distance) * 100) / 100}${$imperial ? "in" : "cm"}`,
    					$points[i].x - ($points[i].x - ((_x = $points[i + 1]) === null || _x === void 0
    					? void 0
    					: _x.x)) / 2,
    					$points[i].y - ($points[i].y - ((_y = $points[i + 1]) === null || _y === void 0
    					? void 0
    					: _y.y)) / 2 - 20
    				);
    			}

    			if (mouseDown && !shiftDown && selection.array == "none") {
    				ctx.lineWidth = 3;
    				ctx.strokeStyle = PATH_COLORS[numberKey].toUnfinished().toString();
    				ctx.beginPath();
    				if ($points.length == 0) ctx.moveTo(mouseX, mouseY); else ctx.moveTo(lastX, lastY);
    				ctx.lineTo(mouseX, mouseY);
    				ctx.stroke();
    				ctx.closePath();
    				drawDot(mouseX, mouseY, PATH_COLORS[numberKey].toUnfinished().toString(), ctx);
    			}

    			const slots = (_z = localStorage.getItem("all-slots-list")) === null || _z === void 0
    			? void 0
    			: _z.split("|").map(v => v.substring(5));

    			if (slots) slot_list.textContent = "Save Slots: " + slots.join(", ");
    			await tick();
    			setTimeout(onTick, 0);
    		}

    		load(getSlot());
    		onTick();
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Map> was created with unknown prop '${key}'`);
    	});

    	function canvas_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			canvas = $$value;
    			$$invalidate(0, canvas);
    		});
    	}

    	$$self.$capture_state = () => ({
    		tick,
    		onMount,
    		Ring,
    		drawDot,
    		drawField,
    		drawTrashCan,
    		GRID_COLOR,
    		Color,
    		load,
    		save,
    		imperial,
    		getSlot,
    		setSlot,
    		points,
    		gameobjects,
    		canvas,
    		$points,
    		$imperial,
    		$gameobjects
    	});

    	$$self.$inject_state = $$props => {
    		if ('canvas' in $$props) $$invalidate(0, canvas = $$props.canvas);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [canvas, canvas_1_binding];
    }

    class Map$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Map",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.4 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let div0;
    	let t0;
    	let div2;
    	let div1;
    	let form;
    	let button0;
    	let t1;
    	let button1;
    	let t2;
    	let input;
    	let t3;
    	let p;
    	let t4;
    	let map;
    	let t5;
    	let settingspanel;
    	let current;

    	button0 = new Button({
    			props: {
    				label: "Delete Save",
    				onclick: /*deleteSave*/ ctx[0]
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				label: "Delete All Saves",
    				onclick: /*deleteAllSaves*/ ctx[1]
    			},
    			$$inline: true
    		});

    	map = new Map$1({ $$inline: true });
    	settingspanel = new SettingsPanel({ $$inline: true });

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			form = element("form");
    			create_component(button0.$$.fragment);
    			t1 = space();
    			create_component(button1.$$.fragment);
    			t2 = space();
    			input = element("input");
    			t3 = space();
    			p = element("p");
    			t4 = space();
    			create_component(map.$$.fragment);
    			t5 = space();
    			create_component(settingspanel.$$.fragment);
    			add_location(div0, file, 25, 0, 951);
    			attr_dev(input, "id", "slot-selector");
    			attr_dev(input, "type", "text");
    			input.value = "slot1";
    			add_location(input, file, 31, 12, 1163);
    			add_location(form, file, 28, 8, 1004);
    			attr_dev(p, "id", "slots-list");
    			add_location(p, file, 33, 8, 1244);
    			add_location(div1, file, 27, 4, 989);
    			attr_dev(div2, "class", "map-panel");
    			add_location(div2, file, 26, 0, 960);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, form);
    			mount_component(button0, form, null);
    			append_dev(form, t1);
    			mount_component(button1, form, null);
    			append_dev(form, t2);
    			append_dev(form, input);
    			append_dev(div1, t3);
    			append_dev(div1, p);
    			append_dev(div1, t4);
    			mount_component(map, div1, null);
    			insert_dev(target, t5, anchor);
    			mount_component(settingspanel, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(map.$$.fragment, local);
    			transition_in(settingspanel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(map.$$.fragment, local);
    			transition_out(settingspanel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			destroy_component(button0);
    			destroy_component(button1);
    			destroy_component(map);
    			if (detaching) detach_dev(t5);
    			destroy_component(settingspanel, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots$1 = {}, $$scope } = $$props;
    	validate_slots('App', slots$1, []);

    	function deleteSave() {
    		var _a;
    		localStorage.removeItem(getSlot());

    		const slots = (_a = localStorage.getItem("all-slots-list")) === null || _a === void 0
    		? void 0
    		: _a.split("|");

    		if (slots) localStorage.setItem("all-slots-list", slots.filter(v => v != getSlot()).join("|")); else localStorage.setItem("all-slots-list", getSlot());
    		load(getSlot());
    	}

    	function deleteAllSaves() {
    		const settings = localStorage.getItem("settings");
    		localStorage.clear();
    		localStorage.setItem("settings", settings);
    		setSlot("slot1");
    		document.getElementById("slot-selector").value = "slot1";
    		load(getSlot());
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		SettingsPanel,
    		Button,
    		Map: Map$1,
    		getSlot,
    		setSlot,
    		load,
    		deleteSave,
    		deleteAllSaves
    	});

    	return [deleteSave, deleteAllSaves];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
