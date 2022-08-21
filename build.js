(function () {
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
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
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
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
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
        else if (callback) {
            callback();
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.49.0' }, detail), { bubbles: true }));
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

    const points = writable(0);

    /* src\store\StoreButton.svelte generated by Svelte v3.49.0 */
    const file$2 = "src\\store\\StoreButton.svelte";

    function create_fragment$2(ctx) {
    	let div1;
    	let div0;
    	let h1;
    	let t0;
    	let t1;
    	let p0;
    	let t2;
    	let t3;
    	let p1;
    	let t4;
    	let div1_style_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			t0 = text(/*name*/ ctx[0]);
    			t1 = space();
    			p0 = element("p");
    			t2 = text(/*description*/ ctx[1]);
    			t3 = space();
    			p1 = element("p");
    			t4 = text(/*price*/ ctx[2]);
    			attr_dev(h1, "class", "svelte-13bqun9");
    			add_location(h1, file$2, 16, 8, 531);
    			attr_dev(p0, "class", "svelte-13bqun9");
    			add_location(p0, file$2, 17, 8, 556);
    			attr_dev(div0, "class", "text");
    			add_location(div0, file$2, 15, 4, 503);
    			set_style(p1, "font-size", "xx-large");
    			attr_dev(p1, "class", "svelte-13bqun9");
    			add_location(p1, file$2, 19, 4, 594);
    			attr_dev(div1, "class", "button svelte-13bqun9");

    			attr_dev(div1, "style", div1_style_value = /*clicking*/ ctx[3]
    			? "box-shadow: 0px 0px; margin-top: 23px; margin-left: 23px"
    			: "box-shadow: 3px 3px");

    			add_location(div1, file$2, 12, 0, 331);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    			append_dev(h1, t0);
    			append_dev(div0, t1);
    			append_dev(div0, p0);
    			append_dev(p0, t2);
    			append_dev(div1, t3);
    			append_dev(div1, p1);
    			append_dev(p1, t4);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*click_handler*/ ctx[5], false, false, false),
    					listen_dev(div1, "mousedown", /*click*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 1) set_data_dev(t0, /*name*/ ctx[0]);
    			if (dirty & /*description*/ 2) set_data_dev(t2, /*description*/ ctx[1]);
    			if (dirty & /*price*/ 4) set_data_dev(t4, /*price*/ ctx[2]);

    			if (dirty & /*clicking*/ 8 && div1_style_value !== (div1_style_value = /*clicking*/ ctx[3]
    			? "box-shadow: 0px 0px; margin-top: 23px; margin-left: 23px"
    			: "box-shadow: 3px 3px")) {
    				attr_dev(div1, "style", div1_style_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
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
    	let $points;
    	validate_store(points, 'points');
    	component_subscribe($$self, points, $$value => $$invalidate(6, $points = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('StoreButton', slots, []);
    	let { name = "Name Missing" } = $$props;
    	let { description = "Description missing" } = $$props;
    	let { price } = $$props;
    	let clicking = false;
    	window.addEventListener("mouseup", () => $$invalidate(3, clicking = false));

    	function click() {
    		if ($points >= price) $$invalidate(3, clicking = true);
    	}

    	const writable_props = ['name', 'description', 'price'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<StoreButton> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('description' in $$props) $$invalidate(1, description = $$props.description);
    		if ('price' in $$props) $$invalidate(2, price = $$props.price);
    	};

    	$$self.$capture_state = () => ({
    		points,
    		name,
    		description,
    		price,
    		clicking,
    		click,
    		$points
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('description' in $$props) $$invalidate(1, description = $$props.description);
    		if ('price' in $$props) $$invalidate(2, price = $$props.price);
    		if ('clicking' in $$props) $$invalidate(3, clicking = $$props.clicking);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, description, price, clicking, click, click_handler];
    }

    class StoreButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { name: 0, description: 1, price: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StoreButton",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*price*/ ctx[2] === undefined && !('price' in props)) {
    			console.warn("<StoreButton> was created without expected prop 'price'");
    		}
    	}

    	get name() {
    		throw new Error("<StoreButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<StoreButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error("<StoreButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error("<StoreButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get price() {
    		throw new Error("<StoreButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set price(value) {
    		throw new Error("<StoreButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\store\Store.svelte generated by Svelte v3.49.0 */
    const file$1 = "src\\store\\Store.svelte";

    function create_fragment$1(ctx) {
    	let div0;
    	let div0_style_value;
    	let t0;
    	let img;
    	let img_src_value;
    	let t1;
    	let div3;
    	let div1;
    	let t2;
    	let div2;
    	let storebutton;
    	let current;
    	let mounted;
    	let dispose;

    	storebutton = new StoreButton({
    			props: {
    				name: "Crewmate",
    				description: "Does tasks for you!",
    				price: 50
    			},
    			$$inline: true
    		});

    	storebutton.$on("click", /*click_handler_1*/ ctx[3]);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			img = element("img");
    			t1 = space();
    			div3 = element("div");
    			div1 = element("div");
    			t2 = space();
    			div2 = element("div");
    			create_component(storebutton.$$.fragment);
    			attr_dev(div0, "class", "background svelte-1w2jlbs");
    			attr_dev(div0, "style", div0_style_value = /*open*/ ctx[0] ? "" : "display: none");
    			add_location(div0, file$1, 18, 0, 471);
    			if (!src_url_equal(img.src, img_src_value = "/media/store-button.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "open store");
    			set_style(img, "right", /*open*/ ctx[0] ? "40%" : "0%");
    			attr_dev(img, "class", "svelte-1w2jlbs");
    			add_location(img, file$1, 19, 0, 539);
    			attr_dev(div1, "class", "store-trim svelte-1w2jlbs");
    			add_location(div1, file$1, 21, 4, 732);
    			attr_dev(div2, "class", "store-contents svelte-1w2jlbs");
    			add_location(div2, file$1, 22, 4, 768);
    			attr_dev(div3, "class", "store-wrapper svelte-1w2jlbs");
    			set_style(div3, "left", /*open*/ ctx[0] ? "60%" : "100%");
    			add_location(div3, file$1, 20, 0, 661);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, img, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			mount_component(storebutton, div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(img, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*open*/ 1 && div0_style_value !== (div0_style_value = /*open*/ ctx[0] ? "" : "display: none")) {
    				attr_dev(div0, "style", div0_style_value);
    			}

    			if (!current || dirty & /*open*/ 1) {
    				set_style(img, "right", /*open*/ ctx[0] ? "40%" : "0%");
    			}

    			if (!current || dirty & /*open*/ 1) {
    				set_style(div3, "left", /*open*/ ctx[0] ? "60%" : "100%");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(storebutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(storebutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div3);
    			destroy_component(storebutton);
    			mounted = false;
    			dispose();
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
    	validate_store(points, 'points');
    	component_subscribe($$self, points, $$value => $$invalidate(4, $points = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Store', slots, []);
    	let open = false;
    	const dispatch = createEventDispatcher();

    	function register_purchase(item) {
    		switch (item) {
    			case 0:
    				if ($points < 50) return; else set_store_value(points, $points -= 50, $points);
    				break;
    		}

    		dispatch("purchase", item);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Store> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, open = !open);
    	const click_handler_1 = () => register_purchase(0);

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		points,
    		StoreButton,
    		open,
    		dispatch,
    		register_purchase,
    		$points
    	});

    	$$self.$inject_state = $$props => {
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [open, register_purchase, click_handler, click_handler_1];
    }

    class Store extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Store",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.49.0 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let p;
    	let t0_value = /*$points*/ ctx[3].toString().padStart(6, "0") + "";
    	let t0;
    	let t1;
    	let main;
    	let img;
    	let img_src_value;
    	let t2;
    	let store;
    	let current;
    	let mounted;
    	let dispose;
    	store = new Store({ $$inline: true });
    	store.$on("purchase", /*purchase*/ ctx[4]);

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			main = element("main");
    			img = element("img");
    			t2 = space();
    			create_component(store.$$.fragment);
    			attr_dev(p, "class", "svelte-16g8kzr");
    			add_location(p, file, 37, 0, 1010);
    			if (!src_url_equal(img.src, img_src_value = "/media/amongus.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "among us");
    			attr_dev(img, "draggable", "false");
    			set_style(img, "rotate", /*crewmate_rotation*/ ctx[2] + "deg");
    			attr_dev(img, "class", "svelte-16g8kzr");
    			add_location(img, file, 39, 4, 1153);
    			set_style(main, "background-position", Math.floor(/*backgound_x*/ ctx[0]) + "px " + Math.floor(/*backgound_y*/ ctx[1]) + "px");
    			attr_dev(main, "class", "svelte-16g8kzr");
    			add_location(main, file, 38, 0, 1056);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, img);
    			insert_dev(target, t2, anchor);
    			mount_component(store, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(img, "click", /*click_handler*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*$points*/ 8) && t0_value !== (t0_value = /*$points*/ ctx[3].toString().padStart(6, "0") + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty & /*crewmate_rotation*/ 4) {
    				set_style(img, "rotate", /*crewmate_rotation*/ ctx[2] + "deg");
    			}

    			if (!current || dirty & /*backgound_x, backgound_y*/ 3) {
    				set_style(main, "background-position", Math.floor(/*backgound_x*/ ctx[0]) + "px " + Math.floor(/*backgound_y*/ ctx[1]) + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(store.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(store.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(main);
    			if (detaching) detach_dev(t2);
    			destroy_component(store, detaching);
    			mounted = false;
    			dispose();
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
    	let $points;
    	validate_store(points, 'points');
    	component_subscribe($$self, points, $$value => $$invalidate(3, $points = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let backgound_x = 0;
    	let backgound_y = 0;
    	let crewmate_rotation = 0;
    	let animation_frame = null;
    	let crewmates = 0;
    	let timer;

    	function purchase(e) {
    		if (e.detail == 0) crewmates++;
    	}

    	onMount(() => {
    		function tick_animation() {
    			$$invalidate(0, backgound_x += 0.05);
    			$$invalidate(1, backgound_y += 0.05);
    			$$invalidate(0, backgound_x = backgound_x % 512);
    			$$invalidate(1, backgound_y = backgound_y % 512);
    			$$invalidate(2, crewmate_rotation += 0.05);
    			$$invalidate(2, crewmate_rotation = crewmate_rotation % 360);
    			animation_frame = requestAnimationFrame(tick_animation);
    		}

    		tick_animation();

    		function tick_crewmates() {
    			set_store_value(points, $points += crewmates, $points);
    		}

    		timer = setInterval(tick_crewmates, 1000);
    	});

    	onDestroy(() => {
    		if (animation_frame) cancelAnimationFrame(animation_frame);
    		if (timer) clearTimeout(timer);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => set_store_value(points, $points++, $points);

    	$$self.$capture_state = () => ({
    		onMount,
    		onDestroy,
    		points,
    		Store,
    		backgound_x,
    		backgound_y,
    		crewmate_rotation,
    		animation_frame,
    		crewmates,
    		timer,
    		purchase,
    		$points
    	});

    	$$self.$inject_state = $$props => {
    		if ('backgound_x' in $$props) $$invalidate(0, backgound_x = $$props.backgound_x);
    		if ('backgound_y' in $$props) $$invalidate(1, backgound_y = $$props.backgound_y);
    		if ('crewmate_rotation' in $$props) $$invalidate(2, crewmate_rotation = $$props.crewmate_rotation);
    		if ('animation_frame' in $$props) animation_frame = $$props.animation_frame;
    		if ('crewmates' in $$props) crewmates = $$props.crewmates;
    		if ('timer' in $$props) timer = $$props.timer;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [backgound_x, backgound_y, crewmate_rotation, $points, purchase, click_handler];
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

    new App({
        target: document.body
    });

})();
//# sourceMappingURL=build.js.map
