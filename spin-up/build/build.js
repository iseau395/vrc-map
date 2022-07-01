
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
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
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
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
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
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
    function getContext(key) {
        return get_current_component().$$.context.get(key);
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
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
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.47.0' }, detail), true));
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

    /* src\components\Modal.svelte generated by Svelte v3.47.0 */

    const file$5 = "src\\components\\Modal.svelte";

    function create_fragment$5(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let h1;
    	let t0;
    	let t1;
    	let svg;
    	let line0;
    	let line1;
    	let t2;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			svg = svg_element("svg");
    			line0 = svg_element("line");
    			line1 = svg_element("line");
    			t2 = space();
    			if (default_slot) default_slot.c();
    			attr_dev(h1, "class", "svelte-17a23oi");
    			add_location(h1, file$5, 6, 12, 174);
    			attr_dev(line0, "x1", "5");
    			attr_dev(line0, "y1", "5");
    			attr_dev(line0, "x2", "35");
    			attr_dev(line0, "y2", "35");
    			set_style(line0, "stroke", "white");
    			set_style(line0, "stroke-width", "4");
    			add_location(line0, file$5, 8, 16, 236);
    			attr_dev(line1, "x1", "35");
    			attr_dev(line1, "y1", "5");
    			attr_dev(line1, "x2", "5");
    			attr_dev(line1, "y2", "35");
    			set_style(line1, "stroke", "white");
    			set_style(line1, "stroke-width", "4");
    			add_location(line1, file$5, 9, 16, 333);
    			attr_dev(svg, "class", "svelte-17a23oi");
    			add_location(svg, file$5, 7, 12, 204);
    			attr_dev(div0, "class", "modal-top-bar svelte-17a23oi");
    			add_location(div0, file$5, 5, 8, 133);
    			attr_dev(div1, "class", "modal svelte-17a23oi");
    			add_location(div1, file$5, 4, 4, 104);
    			attr_dev(div2, "class", "modal-background svelte-17a23oi");
    			add_location(div2, file$5, 3, 0, 68);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    			append_dev(h1, t0);
    			append_dev(div0, t1);
    			append_dev(div0, svg);
    			append_dev(svg, line0);
    			append_dev(svg, line1);
    			append_dev(div1, t2);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(svg, "click", /*click_handler*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['default']);
    	let { title = "Title Missing" } = $$props;
    	const writable_props = ['title'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ title });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, $$scope, slots, click_handler];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { title: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get title() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\navbar\NavBarButton.svelte generated by Svelte v3.47.0 */

    const file$4 = "src\\components\\navbar\\NavBarButton.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "svelte-1vayqny");
    			add_location(div, file$4, 2, 0, 31);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
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
    	validate_slots('NavBarButton', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NavBarButton> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots, click_handler];
    }

    class NavBarButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavBarButton",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* src\components\navbar\Sidemenu.svelte generated by Svelte v3.47.0 */
    const file$3 = "src\\components\\navbar\\Sidemenu.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let a0;
    	let t1;
    	let a1;
    	let div_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a0 = element("a");
    			a0.textContent = "Spin Up";
    			t1 = space();
    			a1 = element("a");
    			a1.textContent = "Tipping Point";
    			attr_dev(a0, "href", "../spin-up");
    			attr_dev(a0, "class", "svelte-1814ztf");
    			add_location(a0, file$3, 4, 4, 129);
    			attr_dev(a1, "href", "../tipping-point");
    			attr_dev(a1, "class", "svelte-1814ztf");
    			add_location(a1, file$3, 5, 4, 167);
    			attr_dev(div, "class", "svelte-1814ztf");
    			add_location(div, file$3, 3, 0, 73);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a0);
    			append_dev(div, t1);
    			append_dev(div, a1);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { x: 200, duration: 100 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { x: 200, duration: 100 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_transition) div_transition.end();
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Sidemenu', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Sidemenu> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ fly });
    	return [];
    }

    class Sidemenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Sidemenu",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\components\navbar\NavBar.svelte generated by Svelte v3.47.0 */
    const file$2 = "src\\components\\navbar\\NavBar.svelte";

    // (11:8) <NavBarButton on:click={() => sidemenu = !sidemenu}>
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("≡");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(11:8) <NavBarButton on:click={() => sidemenu = !sidemenu}>",
    		ctx
    	});

    	return block;
    }

    // (15:0) {#if sidemenu}
    function create_if_block$1(ctx) {
    	let sidemenu_1;
    	let current;
    	sidemenu_1 = new Sidemenu({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(sidemenu_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sidemenu_1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidemenu_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidemenu_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sidemenu_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(15:0) {#if sidemenu}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div1;
    	let span;
    	let p;
    	let t1;
    	let div0;
    	let navbarbutton;
    	let t2;
    	let if_block_anchor;
    	let current;

    	navbarbutton = new NavBarButton({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navbarbutton.$on("click", /*click_handler*/ ctx[1]);
    	let if_block = /*sidemenu*/ ctx[0] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			span = element("span");
    			p = element("p");
    			p.textContent = "VRC Field Map";
    			t1 = space();
    			div0 = element("div");
    			create_component(navbarbutton.$$.fragment);
    			t2 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(p, "class", "svelte-1uts12u");
    			add_location(p, file$2, 7, 8, 175);
    			attr_dev(span, "class", "svelte-1uts12u");
    			add_location(span, file$2, 6, 4, 159);
    			attr_dev(div0, "class", "hamburger-button svelte-1uts12u");
    			add_location(div0, file$2, 9, 4, 214);
    			attr_dev(div1, "class", "svelte-1uts12u");
    			add_location(div1, file$2, 5, 0, 148);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, span);
    			append_dev(span, p);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			mount_component(navbarbutton, div0, null);
    			insert_dev(target, t2, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const navbarbutton_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				navbarbutton_changes.$$scope = { dirty, ctx };
    			}

    			navbarbutton.$set(navbarbutton_changes);

    			if (/*sidemenu*/ ctx[0]) {
    				if (if_block) {
    					if (dirty & /*sidemenu*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbarbutton.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbarbutton.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(navbarbutton);
    			if (detaching) detach_dev(t2);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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
    	validate_slots('NavBar', slots, []);
    	let sidemenu = false;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NavBar> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, sidemenu = !sidemenu);
    	$$self.$capture_state = () => ({ NavBarButton, Sidemenu, sidemenu });

    	$$self.$inject_state = $$props => {
    		if ('sidemenu' in $$props) $$invalidate(0, sidemenu = $$props.sidemenu);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [sidemenu, click_handler];
    }

    class NavBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavBar",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    const FIELD_SCALE = 5;
    const FIELD_SIDE = 357 * FIELD_SCALE;
    var GameType;
    (function (GameType) {
        GameType[GameType["TIPPING_POINT"] = 0] = "TIPPING_POINT";
        GameType[GameType["SPIN_UP"] = 1] = "SPIN_UP";
    })(GameType || (GameType = {}));

    async function create_tipping_point() {
        return new (await Promise.resolve().then(function () { return tippingPoint; })).default();
    }
    async function create_spin_up() {
        return new (await Promise.resolve().then(function () { return spin_up; })).default();
    }
    async function get_game(game) {
        switch (game) {
            case GameType.TIPPING_POINT:
                return create_tipping_point();
            case GameType.SPIN_UP:
                return create_spin_up();
            default:
                throw new Error(`Unknown game type: ${game}`);
        }
    }

    class InputController {
        constructor(canvas) {
            this._dragX = 0;
            this._dragY = 0;
            this._mouseButton = -1;
            this._zoom = 1;
            this._deltaScroll = 0;
            this._mouseX = 0;
            this._mouseY = 0;
            this._altKey = false;
            this._ctrlKey = false;
            this._shiftKey = false;
            this.keys = new Map();
            canvas.addEventListener("mousemove", ev => this.mousemove(ev));
            canvas.addEventListener("mousedown", ev => this.mousedown(ev));
            canvas.addEventListener("mouseup", ev => this.mouseup(ev));
            canvas.addEventListener("contextmenu", ev => this.contextmenu(ev));
            canvas.addEventListener("wheel", ev => this.wheel(ev));
            canvas.addEventListener("scroll", ev => this.scroll(ev));
            window.addEventListener("keydown", ev => this.keydown(ev));
            window.addEventListener("keyup", ev => this.keyup(ev));
        }
        mousemove(ev) {
            if (this._mouseButton == 1 || this._mouseButton == 0 && this._altKey) {
                this._dragX += ev.movementX;
                this._dragY += ev.movementY;
            }
            this._mouseX = ev.x;
            this._mouseY = ev.y - 50;
        }
        mousedown(ev) {
            this._mouseButton = ev.button;
        }
        mouseup(_ev) {
            this._mouseButton = -1;
        }
        contextmenu(ev) {
            ev.preventDefault();
        }
        wheel(ev) {
            ev.preventDefault();
            if (!this._shiftKey) {
                this._zoom += ev.deltaY * -0.002;
                this._zoom = Math.min(Math.max(.125, this._zoom), 4);
            }
            this._deltaScroll += ev.deltaY;
        }
        scroll(ev) {
            ev.preventDefault();
        }
        keydown(ev) {
            this._altKey = ev.altKey;
            this._ctrlKey = ev.ctrlKey;
            this._shiftKey = ev.shiftKey;
            this.keys.set(ev.key, true);
        }
        keyup(ev) {
            this._altKey = ev.altKey;
            this._ctrlKey = ev.ctrlKey;
            this._shiftKey = ev.shiftKey;
            this.keys.delete(ev.key);
        }
        get dragX() {
            const ret = this._dragX;
            this._dragX = 0;
            return ret;
        }
        get dragY() {
            const ret = this._dragY;
            this._dragY = 0;
            return ret;
        }
        get zoom() {
            const ret = this._zoom;
            this._zoom = 1;
            return ret;
        }
        get deltaScroll() {
            const ret = this._deltaScroll;
            this._deltaScroll = 0;
            return ret;
        }
        get mouseButton() {
            return this._mouseButton;
        }
        get mouseX() {
            return this._mouseX;
        }
        get mouseY() {
            return this._mouseY;
        }
        get altKey() {
            return this._altKey;
        }
        get ctrlKey() {
            return this._ctrlKey;
        }
        get shiftKey() {
            return this._shiftKey;
        }
        keyPressed(key) {
            return this.keys.has(key);
        }
    }

    class FieldRenderer {
        constructor(canvasWidth, canvasHeight) {
            this.fieldZoom = 0.065;
            this.prevFieldZoom = this.fieldZoom;
            this.fieldX = canvasWidth / 2 - FIELD_SIDE * this.fieldZoom * 3.05;
            this.fieldY = canvasHeight / 2 - FIELD_SIDE * this.fieldZoom * 3.05;
            this.prevFieldX = this.fieldX;
            this.prevFieldY = this.fieldY;
        }
        tick(deltaX, deltaY, zoom) {
            this.fieldX += deltaX;
            this.fieldY += deltaY;
            this.fieldX = Math.floor(this.fieldX);
            this.fieldY = Math.floor(this.fieldY);
            this.fieldZoom *= zoom;
            this.fieldZoom = Math.min(Math.max(0.08 * FIELD_SCALE, this.fieldZoom), 0.3 * FIELD_SCALE);
        }
        translate(ctx) {
            ctx.translate(this.fieldX, this.fieldY);
            ctx.scale(this.fieldZoom, this.fieldZoom);
        }
        render(ctx) {
            if (!this.cache_ctx)
                this.cache();
            ctx.drawImage(this.cache_ctx.canvas, 0, 0);
        }
        changed() {
            const changed = this.fieldX != this.prevFieldX ||
                this.fieldY != this.prevFieldY ||
                this.fieldZoom != this.prevFieldZoom;
            this.prevFieldX = this.fieldX;
            this.prevFieldY = this.fieldY;
            this.prevFieldZoom = this.fieldZoom;
            return changed;
        }
        cache() {
            this.cache_ctx =
                document.createElement("canvas")
                    .getContext("2d");
            this.cache_ctx.canvas.width = FIELD_SIDE;
            this.cache_ctx.canvas.height = FIELD_SIDE;
            this.cache_ctx.fillStyle = "rgb(159, 159, 159)";
            this.cache_ctx.fillRect(0, 0, FIELD_SIDE, FIELD_SIDE);
            this.cache_ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                this.cache_ctx.moveTo((FIELD_SIDE / 6) * (i + 1), 0);
                this.cache_ctx.lineTo((FIELD_SIDE / 6) * (i + 1), FIELD_SIDE);
            }
            for (let i = 0; i < 6; i++) {
                this.cache_ctx.moveTo(0, (FIELD_SIDE / 6) * (i + 1));
                this.cache_ctx.lineTo(FIELD_SIDE, (FIELD_SIDE / 6) * (i + 1));
            }
            this.cache_ctx.strokeStyle = "rgba(100, 100, 100, 0.2)";
            this.cache_ctx.lineWidth = 1 * FIELD_SCALE;
            this.cache_ctx.stroke();
        }
        zoom() {
            return this.fieldZoom;
        }
        x() {
            return this.fieldX;
        }
        y() {
            return this.fieldY;
        }
    }

    /**
     * A class for processing the grid for placing things
     */
    class Grid {
        constructor() {
            this.gridSize = 48;
        }
        snap(x, y) {
            return [
                Math.round(x / (FIELD_SIDE / this.gridSize)) * (FIELD_SIDE / this.gridSize),
                Math.round(y / (FIELD_SIDE / this.gridSize)) * (FIELD_SIDE / this.gridSize)
            ];
        }
        render(ctx, fieldX, fieldY, fieldZoom) {
            // const grid_spacing = FIELD_SIDE * fieldZoom / this.gridSize;
            const grid_spacing = FIELD_SIDE / this.gridSize * fieldZoom;
            // let current_x = fieldX % grid_spacing / 2;
            // let current_y = fieldY % grid_spacing / 2;
            let current_x = fieldX % grid_spacing;
            let current_y = fieldY % grid_spacing;
            ctx.beginPath();
            while (current_x < ctx.canvas.width) {
                ctx.moveTo(current_x, Math.min(-fieldY / fieldZoom, 0));
                ctx.lineTo(current_x, ctx.canvas.height);
                current_x += grid_spacing;
            }
            while (current_y < ctx.canvas.height) {
                ctx.moveTo(Math.min(-fieldX / fieldZoom, 0), current_y);
                ctx.lineTo(ctx.canvas.width, current_y);
                current_y += grid_spacing;
            }
            ctx.strokeStyle = "rgba(100, 100, 100, 0.5)";
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }

    class MovableObject {
        constructor(x, y, r) {
            this.x = x;
            this.y = y;
            this.r = r;
        }
        pointInside(_x, _y) {
            throw new Error("Unimplimented");
        }
        update(mouseX, mouseY, deltaScroll) {
            this.x = mouseX;
            this.y = mouseY;
            deltaScroll /= 1.25;
            if (!this.rotate_step)
                throw new Error("Missing rotate_step!");
            this.r += Math.floor(deltaScroll / this.rotate_step) * this.rotate_step;
        }
        render(_ctx) {
            throw new Error("Unimplimented");
        }
    }
    class RoundMovableObject extends MovableObject {
        pointInside(x, y) {
            if (!this.diameter)
                throw new Error("Missing diameter!");
            return (x - this.x) ** 2 + (y - this.y) ** 2 <= (this.diameter / 2 * FIELD_SCALE + 1 * FIELD_SCALE) ** 2;
        }
    }

    class Point extends RoundMovableObject {
        constructor() {
            super(...arguments);
            this.diameter = 8.5;
            this.rotate_step = 1;
        }
        render(ctx) {
            ctx.lineWidth = 0;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.diameter / 2 * FIELD_SCALE - 1.5 * FIELD_SCALE, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            ctx.lineWidth = 1 * FIELD_SCALE;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.diameter / 2 * FIELD_SCALE, 0, Math.PI * 2);
            ctx.closePath();
            ctx.stroke();
        }
        get_x() {
            return this.x;
        }
        get_y() {
            return this.y;
        }
    }
    class BasicPath {
        constructor() {
            this.selection = -1;
            this.added_point = false;
            this.points = [];
        }
        tick(mouseX, mouseY, snappedMouseX, snappedMouseY, mouseButton, shiftKey, ctrlKey, deltaScroll) {
            if (shiftKey && mouseButton == 0) {
                if (!this.has_selection()) {
                    for (const point of this.points) {
                        if (point.pointInside(mouseX, mouseY)) {
                            this.selection = this.points.indexOf(point);
                            break;
                        }
                    }
                }
                if (this.has_selection())
                    this.points[this.selection]
                        .update(snappedMouseX, snappedMouseY, deltaScroll);
            }
            else {
                if (mouseButton == 2 && this.added_point == false) {
                    this.points.push(new Point(snappedMouseX, snappedMouseY, 0));
                    this.added_point = true;
                }
                else if (mouseButton != 2) {
                    this.added_point = false;
                }
                this.selection = -1;
            }
        }
        render(ctx) {
            ctx.fillStyle = "rgb(255, 0, 0)";
            ctx.strokeStyle = "rgb(255, 0, 0)";
            ctx.lineWidth = 1 * FIELD_SCALE;
            ctx.beginPath();
            this.points.forEach((point, i) => i == 0 ?
                ctx.moveTo(point.get_x(), point.get_y()) :
                ctx.lineTo(point.get_x(), point.get_y()));
            ctx.stroke();
            this.points.forEach(point => point.render(ctx));
        }
        has_selection() {
            return this.selection >= 0;
        }
    }

    /* src\map\Map.svelte generated by Svelte v3.47.0 */
    const file$1 = "src\\map\\Map.svelte";

    function create_fragment$1(ctx) {
    	let canvas0;
    	let t;
    	let canvas1;

    	const block = {
    		c: function create() {
    			canvas0 = element("canvas");
    			t = space();
    			canvas1 = element("canvas");
    			set_style(canvas0, "z-index", "-1");
    			attr_dev(canvas0, "class", "svelte-19dzfsr");
    			add_location(canvas0, file$1, 81, 0, 3513);
    			set_style(canvas1, "z-index", "0");
    			attr_dev(canvas1, "class", "svelte-19dzfsr");
    			add_location(canvas1, file$1, 82, 0, 3583);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, canvas0, anchor);
    			/*canvas0_binding*/ ctx[2](canvas0);
    			insert_dev(target, t, anchor);
    			insert_dev(target, canvas1, anchor);
    			/*canvas1_binding*/ ctx[3](canvas1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(canvas0);
    			/*canvas0_binding*/ ctx[2](null);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(canvas1);
    			/*canvas1_binding*/ ctx[3](null);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Map', slots, []);
    	let background_canvas;
    	let forground_canvas;
    	const game = getContext(Symbol.for("game"));
    	let interval;
    	let animationFrame;
    	let redraw = true;

    	onMount(async () => {
    		const background_ctx = background_canvas.getContext("2d", { alpha: false });
    		const forground_ctx = forground_canvas.getContext("2d", { alpha: true });
    		const InputController$1 = new InputController(forground_canvas);
    		const FieldRenderer$1 = new FieldRenderer(window.innerWidth, window.innerHeight - 50);
    		const Grid$1 = new Grid();
    		const Path = new BasicPath();
    		const GameRenderer = await get_game(game);

    		const resize = () => {
    			$$invalidate(0, background_canvas.width = window.innerWidth, background_canvas);
    			$$invalidate(0, background_canvas.height = window.innerHeight - 50, background_canvas);
    			$$invalidate(1, forground_canvas.width = window.innerWidth, forground_canvas);
    			$$invalidate(1, forground_canvas.height = window.innerHeight - 50, forground_canvas);
    			redraw = true;
    			render();
    		};

    		window.addEventListener("resize", resize);

    		function render() {
    			const changed = FieldRenderer$1.changed();

    			if (changed || redraw) {
    				background_ctx.fillStyle = "rgb(80, 80, 80)";
    				background_ctx.fillRect(0, 0, background_canvas.width, background_canvas.height);
    				background_ctx.save();
    				FieldRenderer$1.translate(background_ctx);
    				FieldRenderer$1.render(background_ctx);
    				GameRenderer.render_static(background_ctx);
    				background_ctx.restore();
    				redraw = false;
    			}

    			forground_ctx.clearRect(0, 0, forground_canvas.width, forground_canvas.height);
    			forground_ctx.save();
    			FieldRenderer$1.translate(forground_ctx);
    			GameRenderer.render(forground_ctx);
    			Path.render(forground_ctx);
    			forground_ctx.restore();
    			if (InputController$1.ctrlKey) Grid$1.render(forground_ctx, FieldRenderer$1.x(), FieldRenderer$1.y(), FieldRenderer$1.zoom());
    			animationFrame = requestAnimationFrame(render);
    		}

    		function tick() {
    			const mouseX = (InputController$1.mouseX - FieldRenderer$1.x()) / FieldRenderer$1.zoom();
    			const mouseY = (InputController$1.mouseY - FieldRenderer$1.y()) / FieldRenderer$1.zoom();

    			const [snappedMouseX, snappedMouseY] = InputController$1.ctrlKey
    			? Grid$1.snap(mouseX, mouseY)
    			: [mouseX, mouseY];

    			FieldRenderer$1.tick(InputController$1.dragX, InputController$1.dragY, InputController$1.zoom);
    			if (!GameRenderer.has_selection()) Path.tick(mouseX, mouseY, snappedMouseX, snappedMouseY, InputController$1.mouseButton, InputController$1.shiftKey, InputController$1.ctrlKey, InputController$1.deltaScroll);
    			if (!InputController$1.altKey && !Path.has_selection()) GameRenderer.tick(mouseX, mouseY, snappedMouseX, snappedMouseY, InputController$1.mouseButton, InputController$1.shiftKey, InputController$1.ctrlKey, InputController$1.deltaScroll);
    		}

    		interval = setInterval(tick, 20);
    		tick();
    		resize();
    	});

    	onDestroy(() => {
    		clearInterval(interval);
    		cancelAnimationFrame(animationFrame);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Map> was created with unknown prop '${key}'`);
    	});

    	function canvas0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			background_canvas = $$value;
    			$$invalidate(0, background_canvas);
    		});
    	}

    	function canvas1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			forground_canvas = $$value;
    			$$invalidate(1, forground_canvas);
    		});
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		onDestroy,
    		getContext,
    		get_game,
    		_InputController: InputController,
    		_FieldRenderer: FieldRenderer,
    		_Grid: Grid,
    		_Path: BasicPath,
    		background_canvas,
    		forground_canvas,
    		game,
    		interval,
    		animationFrame,
    		redraw
    	});

    	$$self.$inject_state = $$props => {
    		if ('background_canvas' in $$props) $$invalidate(0, background_canvas = $$props.background_canvas);
    		if ('forground_canvas' in $$props) $$invalidate(1, forground_canvas = $$props.forground_canvas);
    		if ('interval' in $$props) interval = $$props.interval;
    		if ('animationFrame' in $$props) animationFrame = $$props.animationFrame;
    		if ('redraw' in $$props) redraw = $$props.redraw;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [background_canvas, forground_canvas, canvas0_binding, canvas1_binding];
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

    /* src\App.svelte generated by Svelte v3.47.0 */
    const file = "src\\App.svelte";

    // (22:0) {:else}
    function create_else_block(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "It looks like you are on a device without a mouse or touchpad. If you can, please plug in one of these devices, as this field map is designed to use them.\r\n    If you can't plug one in, then try to switch to another device which can have on plugged in.";
    			attr_dev(p, "class", "svelte-48ahf8");
    			add_location(p, file, 22, 0, 624);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(22:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (20:0) {#if hasMouse}
    function create_if_block_1(ctx) {
    	let map;
    	let current;
    	map = new Map$1({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(map.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(map, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(map.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(map.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(map, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(20:0) {#if hasMouse}",
    		ctx
    	});

    	return block;
    }

    // (29:0) {#if settings_modal}
    function create_if_block(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: { title: "Settings" },
    			$$inline: true
    		});

    	modal.$on("click", /*click_handler*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(29:0) {#if settings_modal}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let navbar;
    	let t0;
    	let current_block_type_index;
    	let if_block0;
    	let t1;
    	let if_block1_anchor;
    	let current;
    	navbar = new NavBar({ $$inline: true });
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*hasMouse*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = /*settings_modal*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(navbar, target, anchor);
    			insert_dev(target, t0, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(t1.parentNode, t1);
    			}

    			if (/*settings_modal*/ ctx[0]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*settings_modal*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navbar, detaching);
    			if (detaching) detach_dev(t0);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
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
    	let hasMouse;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const hover_query = window.matchMedia("(hover: hover)");
    	const pointer_query = window.matchMedia("(pointer: fine)");
    	let has_hover = hover_query.matches;
    	let has_pointer = pointer_query.matches;

    	hover_query.onchange = q => {
    		$$invalidate(2, has_hover = q.matches);
    	};

    	pointer_query.onchange = q => {
    		$$invalidate(3, has_pointer = q.matches);
    	};

    	let settings_modal = false;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, settings_modal = false);

    	$$self.$capture_state = () => ({
    		Modal,
    		NavBar,
    		Map: Map$1,
    		hover_query,
    		pointer_query,
    		has_hover,
    		has_pointer,
    		settings_modal,
    		hasMouse
    	});

    	$$self.$inject_state = $$props => {
    		if ('has_hover' in $$props) $$invalidate(2, has_hover = $$props.has_hover);
    		if ('has_pointer' in $$props) $$invalidate(3, has_pointer = $$props.has_pointer);
    		if ('settings_modal' in $$props) $$invalidate(0, settings_modal = $$props.settings_modal);
    		if ('hasMouse' in $$props) $$invalidate(1, hasMouse = $$props.hasMouse);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*has_hover, has_pointer*/ 12) {
    			$$invalidate(1, hasMouse = has_hover || has_pointer);
    		}
    	};

    	return [settings_modal, hasMouse, has_hover, has_pointer, click_handler];
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
        target: document.body,
        context: new Map([
            [Symbol.for("game"), GameType.SPIN_UP]
        ])
    });

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

    const NEUTRAL = "rgb(255, 255, 0)";
    const RED_ALLIANCE = "rgb(255, 0, 0)";
    const BLUE_ALLIANCE = "rgb(0, 0, 255)";
    const LINE_COLOR = "rgb(255, 255, 255)";

    var MogoVariation;
    (function (MogoVariation) {
        MogoVariation[MogoVariation["RED_ALLIANCE"] = 0] = "RED_ALLIANCE";
        MogoVariation[MogoVariation["BLUE_ALLIANCE"] = 1] = "BLUE_ALLIANCE";
        MogoVariation[MogoVariation["NEUTRAL"] = 2] = "NEUTRAL";
    })(MogoVariation || (MogoVariation = {}));
    class Mogo extends RoundMovableObject {
        constructor(x, y, r, variation) {
            super(x, y, r);
            this.diameter = 33;
            this.rotate_step = 90;
            this.variation = variation;
        }
        drawMogo(ctx) {
            switch (this.variation) {
                case 0:
                    ctx.fillStyle = RED_ALLIANCE;
                    break;
                case 1:
                    ctx.fillStyle = BLUE_ALLIANCE;
                    break;
                case 2:
                    ctx.fillStyle = NEUTRAL;
                    break;
            }
            ctx.strokeStyle = "rgb(50, 50, 50)";
            ctx.lineWidth = 0.5 * FIELD_SCALE;
            drawPolygon(this.diameter / 2 * FIELD_SCALE, this.diameter / 2 * FIELD_SCALE, this.diameter / 2 * FIELD_SCALE, 7, Math.PI * 4, ctx);
        }
        render(ctx) {
            switch (this.variation) {
                case MogoVariation.RED_ALLIANCE:
                    {
                        if (!Mogo.red_cache) {
                            Mogo.red_cache =
                                document.createElement("canvas")
                                    .getContext("2d");
                            Mogo.red_cache.canvas.width = this.diameter * FIELD_SCALE;
                            Mogo.red_cache.canvas.height = this.diameter * FIELD_SCALE;
                            this.drawMogo(Mogo.red_cache);
                        }
                        ctx.save();
                        ctx.translate(this.x, this.y);
                        ctx.rotate(this.r);
                        ctx.drawImage(Mogo.red_cache.canvas, -this.diameter / 2 * FIELD_SCALE, -this.diameter / 2 * FIELD_SCALE);
                        ctx.restore();
                    }
                    break;
                case MogoVariation.BLUE_ALLIANCE:
                    {
                        if (!Mogo.blue_cache) {
                            Mogo.blue_cache =
                                document.createElement("canvas")
                                    .getContext("2d");
                            Mogo.blue_cache.canvas.width = this.diameter * FIELD_SCALE;
                            Mogo.blue_cache.canvas.height = this.diameter * FIELD_SCALE;
                            this.drawMogo(Mogo.blue_cache);
                        }
                        ctx.save();
                        ctx.translate(this.x, this.y);
                        ctx.rotate(this.r);
                        ctx.drawImage(Mogo.blue_cache.canvas, -this.diameter / 2 * FIELD_SCALE, -this.diameter / 2 * FIELD_SCALE);
                        ctx.restore();
                    }
                    break;
                case MogoVariation.NEUTRAL:
                    {
                        if (!Mogo.neutral_cache) {
                            Mogo.neutral_cache =
                                document.createElement("canvas")
                                    .getContext("2d");
                            Mogo.neutral_cache.canvas.width = this.diameter * FIELD_SCALE;
                            Mogo.neutral_cache.canvas.height = this.diameter * FIELD_SCALE;
                            this.drawMogo(Mogo.neutral_cache);
                        }
                        ctx.save();
                        ctx.translate(this.x, this.y);
                        ctx.rotate(this.r);
                        ctx.drawImage(Mogo.neutral_cache.canvas, -this.diameter / 2 * FIELD_SCALE, -this.diameter / 2 * FIELD_SCALE);
                        ctx.restore();
                    }
                    break;
            }
        }
    }

    class Ring extends RoundMovableObject {
        constructor() {
            super(...arguments);
            this.diameter = 5.23875;
            this.rotate_step = 1;
        }
        render(ctx) {
            ctx.strokeStyle = "rgb(200, 100, 200)";
            ctx.lineWidth = 2.6985 * FIELD_SCALE;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.diameter / 2 * FIELD_SCALE, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fill;
        }
    }

    class TippingPoint {
        constructor() {
            this.selection = {
                arr: -1,
                index: -1
            };
            this.mogos = [
                // Red Alliance Goals
                new Mogo(FIELD_SIDE / 4, FIELD_SIDE / 12 * 11, 90, 0),
                new Mogo(FIELD_SIDE / 12, FIELD_SIDE / 48 * 15, 0, 0),
                // Blue Alliance Goals
                new Mogo(FIELD_SIDE / 4 * 3, FIELD_SIDE / 12, 270, 1),
                new Mogo(FIELD_SIDE / 12 * 11, FIELD_SIDE / 48 * 33, 180, 1),
                // Neutral Goals
                new Mogo(FIELD_SIDE / 2, FIELD_SIDE / 4, 180, 2),
                new Mogo(FIELD_SIDE / 2, FIELD_SIDE / 4 * 2, 180, 2),
                new Mogo(FIELD_SIDE / 2, FIELD_SIDE / 4 * 3, 0, 2),
            ];
            this.rings = [
                new Ring(50, 50, 0)
            ];
        }
        drawPlatform(x, y, color, ctx) {
            const longEdge = 134.62 * FIELD_SCALE;
            const shortEdge = 50.8 * FIELD_SCALE;
            x += (59.5 - 50.8 - 3.175) * FIELD_SCALE;
            y -= 8 * FIELD_SCALE;
            ctx.strokeStyle = color;
            ctx.lineCap = "butt";
            ctx.lineWidth = 4 * FIELD_SCALE;
            ctx.beginPath();
            ctx.moveTo(x + shortEdge / 9, y + longEdge / 8);
            ctx.lineTo(x + shortEdge - shortEdge / 9, y + longEdge / 8);
            ctx.lineTo(x + shortEdge - shortEdge / 9, y + (longEdge / 8) * 7);
            ctx.lineTo(x + shortEdge / 9, y + (longEdge / 8) * 7);
            ctx.lineTo(x + shortEdge / 9, y + longEdge / 8 - ctx.lineWidth / 2);
            ctx.stroke();
            ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
            ctx.fillRect(x, y, shortEdge, longEdge);
            ctx.strokeStyle = "rgb(0, 0, 0)";
            ctx.lineWidth = 0.3 * FIELD_SCALE;
            ctx.beginPath();
            ctx.moveTo(x + shortEdge + 1, y);
            ctx.lineTo(x + shortEdge + 1, y + longEdge);
            ctx.moveTo(x - 1, y);
            ctx.lineTo(x - 1, y + longEdge);
            ctx.stroke();
        }
        cache() {
            this.cache_ctx =
                document.createElement("canvas")
                    .getContext("2d");
            this.cache_ctx.canvas.width = FIELD_SIDE;
            this.cache_ctx.canvas.height = FIELD_SIDE;
            this.cache_ctx.strokeStyle = LINE_COLOR;
            this.cache_ctx.lineWidth = 1.1 * FIELD_SCALE;
            this.cache_ctx.beginPath();
            this.cache_ctx.moveTo(FIELD_SIDE / 3, 0);
            this.cache_ctx.lineTo(FIELD_SIDE / 3, FIELD_SIDE);
            this.cache_ctx.moveTo(FIELD_SIDE / 2 - 5, 0);
            this.cache_ctx.lineTo(FIELD_SIDE / 2 - 5, FIELD_SIDE);
            this.cache_ctx.moveTo(FIELD_SIDE / 2 + 5, 0);
            this.cache_ctx.lineTo(FIELD_SIDE / 2 + 5, FIELD_SIDE);
            this.cache_ctx.moveTo((FIELD_SIDE / 3) * 2, 0);
            this.cache_ctx.lineTo((FIELD_SIDE / 3) * 2, FIELD_SIDE);
            this.cache_ctx.moveTo((FIELD_SIDE / 6) * 4, FIELD_SIDE / 6);
            this.cache_ctx.lineTo((FIELD_SIDE / 6) * 5, 0);
            this.cache_ctx.moveTo((FIELD_SIDE / 6) * 2, (FIELD_SIDE / 6) * 5);
            this.cache_ctx.lineTo((FIELD_SIDE / 6) * 1, FIELD_SIDE);
            this.cache_ctx.stroke();
            this.drawPlatform(0, (FIELD_SIDE / 6) * 2, RED_ALLIANCE, this.cache_ctx);
            this.drawPlatform((FIELD_SIDE / 6) * 5, (FIELD_SIDE / 6) * 2, BLUE_ALLIANCE, this.cache_ctx);
        }
        tick(mouseX, mouseY, snappedMouseX, snappedMouseY, mouseButton, shiftKey, ctrlKey, deltaScroll) {
            if (shiftKey && mouseButton == 0) {
                if (this.selection.arr == -1) {
                    for (const mogo of this.mogos) {
                        if (mogo.pointInside(mouseX, mouseY)) {
                            this.selection.arr = 0;
                            this.selection.index = this.mogos.indexOf(mogo);
                            break;
                        }
                    }
                    for (const ring of this.rings) {
                        if (ring.pointInside(mouseX, mouseY)) {
                            this.selection.arr = 1;
                            this.selection.index = this.rings.indexOf(ring);
                            break;
                        }
                    }
                }
                if (this.selection.arr == 0)
                    this.mogos[this.selection.index]
                        .update(snappedMouseX, snappedMouseY, deltaScroll);
                if (this.selection.arr == 1)
                    this.rings[this.selection.index]
                        .update(snappedMouseX, snappedMouseY, deltaScroll);
            }
            else {
                this.selection.arr = -1;
                this.selection.index = -1;
            }
        }
        render(ctx) {
            this.mogos.forEach(mogo => mogo.render(ctx));
            this.rings.forEach(ring => ring.render(ctx));
        }
        render_static(ctx) {
            if (!this.cache_ctx)
                this.cache();
            ctx.drawImage(this.cache_ctx.canvas, 0, 0);
        }
        has_selection() {
            return this.selection.arr >= 0;
        }
    }

    var tippingPoint = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': TippingPoint
    });

    class Disk extends RoundMovableObject {
        constructor(x, y) {
            super(x, y, 0);
            this.diameter = 14;
            this.rotate_step = 1;
        }
        render(ctx) {
            ctx.fillStyle = "rgb(232, 212, 33)";
            ctx.lineWidth = 2.6985 * FIELD_SCALE;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.diameter / 2 * FIELD_SCALE, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = "rgb(220, 200, 21)";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.diameter / 2 * FIELD_SCALE - 2.54 * FIELD_SCALE, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
    }

    class Roller {
        constructor(x, y, horrizontal, state = 0) {
            this.was_pressed = false;
            this.x = x;
            this.y = y;
            this.horrizontal = horrizontal;
            this.state = state;
        }
        render(ctx) {
            ctx.strokeStyle = "rgba(0, 0, 0, 0)";
            if (this.state != 0) {
                if (this.state == -1)
                    ctx.fillStyle = BLUE_ALLIANCE;
                if (this.state == 1)
                    ctx.fillStyle = RED_ALLIANCE;
                ctx.fillRect(this.x, this.y, (this.horrizontal ? Roller.long_side : Roller.short_side), (this.horrizontal ? Roller.short_side : Roller.long_side));
            }
            else {
                if (this.horrizontal) {
                    ctx.fillStyle = BLUE_ALLIANCE;
                    ctx.fillRect(this.x, this.y, Roller.long_side, Roller.short_side / 2);
                    ctx.fillStyle = RED_ALLIANCE;
                    ctx.fillRect(this.x, this.y + Roller.short_side / 2, Roller.long_side, Roller.short_side / 2);
                }
                else {
                    ctx.fillStyle = BLUE_ALLIANCE;
                    ctx.fillRect(this.x, this.y, Roller.short_side / 2, Roller.long_side);
                    ctx.fillStyle = RED_ALLIANCE;
                    ctx.fillRect(this.x + Roller.short_side / 2, this.y, Roller.short_side / 2, Roller.long_side);
                }
            }
        }
        update(mouseX, mouseY, mouseButton) {
            if (this.pointInside(mouseX, mouseY) && mouseButton == 0 && !this.was_pressed) {
                this.state++;
                if (this.state > 1)
                    this.state = -1;
                this.was_pressed = true;
            }
            else if (mouseButton != 0) {
                this.was_pressed = false;
            }
        }
        pointInside(x, y) {
            return x > this.x &&
                y > this.y &&
                x < this.x + (this.horrizontal ? Roller.long_side : Roller.short_side) &&
                y < this.y + (this.horrizontal ? Roller.short_side : Roller.long_side);
        }
    }
    Roller.long_side = 24.892 * FIELD_SCALE;
    Roller.short_side = 6.096 * FIELD_SCALE;

    const HIGH_GOAL_SUPPORT = "rgb(200, 200, 200)";

    class SpinUp {
        constructor() {
            this.selected_disk = -1;
            this.disks = [
                new Disk(FIELD_SIDE / 12 * 1, FIELD_SIDE / 12 * 1),
                new Disk(FIELD_SIDE / 12 * 2, FIELD_SIDE / 12 * 2),
                new Disk(FIELD_SIDE / 12 * 3, FIELD_SIDE / 12 * 3 - 1 * FIELD_SCALE),
                new Disk(FIELD_SIDE / 12 * 3, FIELD_SIDE / 12 * 3 - 2 * FIELD_SCALE),
                new Disk(FIELD_SIDE / 12 * 3, FIELD_SIDE / 12 * 3 - 3 * FIELD_SCALE),
                new Disk(FIELD_SIDE / 12 * 4, FIELD_SIDE / 12 * 4),
                new Disk(FIELD_SIDE / 12 * 5, FIELD_SIDE / 12 * 5),
                new Disk(FIELD_SIDE / 12 * 7, FIELD_SIDE / 12 * 7),
                new Disk(FIELD_SIDE / 12 * 8, FIELD_SIDE / 12 * 8),
                new Disk(FIELD_SIDE / 12 * 9, FIELD_SIDE / 12 * 9 - 1 * FIELD_SCALE),
                new Disk(FIELD_SIDE / 12 * 9, FIELD_SIDE / 12 * 9 - 2 * FIELD_SCALE),
                new Disk(FIELD_SIDE / 12 * 9, FIELD_SIDE / 12 * 9 - 3 * FIELD_SCALE),
                new Disk(FIELD_SIDE / 12 * 10, FIELD_SIDE / 12 * 10),
                new Disk(FIELD_SIDE / 12 * 11, FIELD_SIDE / 12 * 11),
                new Disk(FIELD_SIDE / 12 * 5, FIELD_SIDE / 12 * 3),
                new Disk(FIELD_SIDE / 12 * 6, FIELD_SIDE / 12 * 4),
                new Disk(FIELD_SIDE / 12 * 7, FIELD_SIDE / 12 * 5),
                new Disk(FIELD_SIDE / 12 * 9, FIELD_SIDE / 12 * 7 - 1 * FIELD_SCALE),
                new Disk(FIELD_SIDE / 12 * 9, FIELD_SIDE / 12 * 7 - 2 * FIELD_SCALE),
                new Disk(FIELD_SIDE / 12 * 9, FIELD_SIDE / 12 * 7 - 3 * FIELD_SCALE),
                new Disk(FIELD_SIDE / 12 * 5, FIELD_SIDE / 12 * 7),
                new Disk(FIELD_SIDE / 12 * 6, FIELD_SIDE / 12 * 8),
                new Disk(FIELD_SIDE / 12 * 7, FIELD_SIDE / 12 * 9),
                new Disk(FIELD_SIDE / 12 * 3, FIELD_SIDE / 12 * 5 - 1 * FIELD_SCALE),
                new Disk(FIELD_SIDE / 12 * 3, FIELD_SIDE / 12 * 5 - 2 * FIELD_SCALE),
                new Disk(FIELD_SIDE / 12 * 3, FIELD_SIDE / 12 * 5 - 3 * FIELD_SCALE),
                new Disk(FIELD_SIDE / 48 * 31, FIELD_SIDE / 48 * 9),
                new Disk(FIELD_SIDE / 48 * 31, FIELD_SIDE / 48 * 12),
                new Disk(FIELD_SIDE / 48 * 31, FIELD_SIDE / 48 * 15),
                new Disk(FIELD_SIDE / 48 * 33, FIELD_SIDE / 48 * 17),
                new Disk(FIELD_SIDE / 48 * 36, FIELD_SIDE / 48 * 17),
                new Disk(FIELD_SIDE / 48 * 39, FIELD_SIDE / 48 * 17),
                new Disk(FIELD_SIDE / 48 * 9, FIELD_SIDE / 48 * 31),
                new Disk(FIELD_SIDE / 48 * 12, FIELD_SIDE / 48 * 31),
                new Disk(FIELD_SIDE / 48 * 15, FIELD_SIDE / 48 * 31),
                new Disk(FIELD_SIDE / 48 * 17, FIELD_SIDE / 48 * 33),
                new Disk(FIELD_SIDE / 48 * 17, FIELD_SIDE / 48 * 36),
                new Disk(FIELD_SIDE / 48 * 17, FIELD_SIDE / 48 * 39),
                // Preloads and Match Loads
                new Disk(-FIELD_SIDE / 12, FIELD_SIDE / 20 * 7),
                new Disk(-FIELD_SIDE / 12, FIELD_SIDE / 20 * 8),
                new Disk(-FIELD_SIDE / 12, FIELD_SIDE / 20 * 13),
                new Disk(-FIELD_SIDE / 12, FIELD_SIDE / 20 * 12),
                new Disk(FIELD_SIDE + FIELD_SIDE / 12, FIELD_SIDE / 20 * 7),
                new Disk(FIELD_SIDE + FIELD_SIDE / 12, FIELD_SIDE / 20 * 8),
                new Disk(FIELD_SIDE + FIELD_SIDE / 12, FIELD_SIDE / 20 * 13),
                new Disk(FIELD_SIDE + FIELD_SIDE / 12, FIELD_SIDE / 20 * 12),
                new Disk(-FIELD_SIDE / 12 * 2, FIELD_SIDE / 20 * 7),
                new Disk(-FIELD_SIDE / 12 * 2, FIELD_SIDE / 20 * 8),
                new Disk(-FIELD_SIDE / 12 * 2, FIELD_SIDE / 20 * 9),
                new Disk(-FIELD_SIDE / 12 * 2, FIELD_SIDE / 20 * 10),
                new Disk(-FIELD_SIDE / 12 * 2, FIELD_SIDE / 20 * 11),
                new Disk(-FIELD_SIDE / 12 * 2, FIELD_SIDE / 20 * 12),
                new Disk(-FIELD_SIDE / 12 * 2, FIELD_SIDE / 20 * 13),
                new Disk(FIELD_SIDE + FIELD_SIDE / 12 * 2, FIELD_SIDE / 20 * 7),
                new Disk(FIELD_SIDE + FIELD_SIDE / 12 * 2, FIELD_SIDE / 20 * 8),
                new Disk(FIELD_SIDE + FIELD_SIDE / 12 * 2, FIELD_SIDE / 20 * 9),
                new Disk(FIELD_SIDE + FIELD_SIDE / 12 * 2, FIELD_SIDE / 20 * 10),
                new Disk(FIELD_SIDE + FIELD_SIDE / 12 * 2, FIELD_SIDE / 20 * 11),
                new Disk(FIELD_SIDE + FIELD_SIDE / 12 * 2, FIELD_SIDE / 20 * 12),
                new Disk(FIELD_SIDE + FIELD_SIDE / 12 * 2, FIELD_SIDE / 20 * 13),
            ];
            this.rollers = [
                new Roller(0, FIELD_SIDE / 6, false),
                new Roller(FIELD_SIDE / 6, 0, true),
                new Roller(FIELD_SIDE - Roller.short_side, FIELD_SIDE / 6 * 5 - Roller.long_side, false),
                new Roller(FIELD_SIDE / 6 * 5 - Roller.long_side, FIELD_SIDE - Roller.short_side, true)
            ];
        }
        cache() {
            this.cache_ctx =
                document.createElement("canvas")
                    .getContext("2d");
            this.cache_ctx.canvas.width = FIELD_SIDE;
            this.cache_ctx.canvas.height = FIELD_SIDE;
            ////// Tape //////
            this.cache_ctx.strokeStyle = LINE_COLOR;
            this.cache_ctx.lineWidth = 1.1 * FIELD_SCALE;
            this.cache_ctx.lineCap = "square";
            this.cache_ctx.beginPath();
            // Diagonal Lines
            this.cache_ctx.moveTo(5 * FIELD_SCALE, 0);
            this.cache_ctx.lineTo(FIELD_SIDE, FIELD_SIDE - 5 * FIELD_SCALE);
            this.cache_ctx.moveTo(0, 5 * FIELD_SCALE);
            this.cache_ctx.lineTo(FIELD_SIDE - 5 * FIELD_SCALE, FIELD_SIDE);
            // Starting lines
            this.cache_ctx.moveTo(0, FIELD_SIDE / 6);
            this.cache_ctx.lineTo(FIELD_SIDE / 12, FIELD_SIDE / 6);
            this.cache_ctx.moveTo(FIELD_SIDE / 3, 0);
            this.cache_ctx.lineTo(FIELD_SIDE / 3, FIELD_SIDE / 12);
            this.cache_ctx.moveTo(FIELD_SIDE, FIELD_SIDE / 6 * 5);
            this.cache_ctx.lineTo(FIELD_SIDE / 12 * 11, FIELD_SIDE / 6 * 5);
            this.cache_ctx.moveTo(FIELD_SIDE / 3 * 2, FIELD_SIDE);
            this.cache_ctx.lineTo(FIELD_SIDE / 3 * 2, FIELD_SIDE / 12 * 11);
            // Low Goal Lines
            this.cache_ctx.moveTo(FIELD_SIDE / 3 * 2, 0);
            this.cache_ctx.lineTo(FIELD_SIDE / 3 * 2, FIELD_SIDE / 6);
            this.cache_ctx.moveTo(FIELD_SIDE, FIELD_SIDE / 3);
            this.cache_ctx.lineTo(FIELD_SIDE / 6 * 5, FIELD_SIDE / 3);
            this.cache_ctx.moveTo(0, FIELD_SIDE / 3 * 2);
            this.cache_ctx.lineTo(FIELD_SIDE / 6, FIELD_SIDE / 3 * 2);
            this.cache_ctx.moveTo(FIELD_SIDE / 3, FIELD_SIDE);
            this.cache_ctx.lineTo(FIELD_SIDE / 3, FIELD_SIDE / 6 * 5);
            this.cache_ctx.stroke();
            ////// Bumpers //////
            this.cache_ctx.strokeStyle = RED_ALLIANCE;
            this.cache_ctx.lineWidth = 5.08 / 2 * FIELD_SCALE;
            this.cache_ctx.lineCap = "round";
            this.cache_ctx.beginPath();
            this.cache_ctx.moveTo(FIELD_SIDE / 6, FIELD_SIDE / 3 * 2);
            this.cache_ctx.lineTo(FIELD_SIDE / 3, FIELD_SIDE / 3 * 2);
            this.cache_ctx.lineTo(FIELD_SIDE / 3, FIELD_SIDE / 6 * 5);
            this.cache_ctx.stroke();
            this.cache_ctx.strokeStyle = BLUE_ALLIANCE;
            this.cache_ctx.beginPath();
            this.cache_ctx.moveTo(FIELD_SIDE / 3 * 2, FIELD_SIDE / 6);
            this.cache_ctx.lineTo(FIELD_SIDE / 3 * 2, FIELD_SIDE / 3);
            this.cache_ctx.lineTo(FIELD_SIDE / 6 * 5, FIELD_SIDE / 3);
            this.cache_ctx.stroke();
            ////// High Goals //////
            this.cache_ctx.strokeStyle = HIGH_GOAL_SUPPORT;
            this.cache_ctx.lineWidth = 5.08 * FIELD_SCALE;
            this.cache_ctx.lineCap = "square";
            this.cache_ctx.beginPath();
            this.cache_ctx.moveTo(FIELD_SIDE / 3 * 2, 0);
            this.cache_ctx.lineTo(FIELD_SIDE, FIELD_SIDE / 3);
            this.cache_ctx.moveTo(0, FIELD_SIDE / 3 * 2);
            this.cache_ctx.lineTo(FIELD_SIDE / 3, FIELD_SIDE);
            this.cache_ctx.stroke();
            const high_goal_diameter = 39.9542;
            this.cache_ctx.fillStyle = RED_ALLIANCE;
            this.cache_ctx.beginPath();
            this.cache_ctx.arc(FIELD_SIDE / 6 * 5, FIELD_SIDE / 6, high_goal_diameter / 2 * FIELD_SCALE, 0, Math.PI * 2);
            this.cache_ctx.closePath();
            this.cache_ctx.fill();
            this.cache_ctx.fillStyle = BLUE_ALLIANCE;
            this.cache_ctx.beginPath();
            this.cache_ctx.arc(FIELD_SIDE / 6, FIELD_SIDE / 6 * 5, high_goal_diameter / 2 * FIELD_SCALE, 0, Math.PI * 2);
            this.cache_ctx.closePath();
            this.cache_ctx.fill();
        }
        tick(mouseX, mouseY, snappedMouseX, snappedMouseY, mouseButton, shiftKey, ctrlKey, deltaScroll) {
            if (shiftKey && mouseButton == 0) {
                if (!this.has_selection()) {
                    for (const disk of this.disks) {
                        if (disk.pointInside(mouseX, mouseY)) {
                            this.selected_disk = this.disks.indexOf(disk);
                            break;
                        }
                    }
                }
                if (this.selected_disk >= 0)
                    this.disks[this.selected_disk]
                        .update(snappedMouseX, snappedMouseY, deltaScroll);
            }
            else {
                this.selected_disk = -1;
            }
            if (!this.has_selection())
                for (const roller of this.rollers) {
                    roller.update(mouseX, mouseY, mouseButton);
                }
        }
        render(ctx) {
            // Alliance Stations
            ctx.strokeStyle = RED_ALLIANCE;
            ctx.lineWidth = 3 * FIELD_SCALE;
            ctx.lineCap = "square";
            ctx.beginPath();
            ctx.moveTo(-FIELD_SIDE / 12 * 3, FIELD_SIDE / 12);
            ctx.lineTo(-FIELD_SIDE / 12 / 2, FIELD_SIDE / 12);
            ctx.lineTo(-FIELD_SIDE / 12 / 2, FIELD_SIDE / 12 * 11);
            ctx.lineTo(-FIELD_SIDE / 12 * 3, FIELD_SIDE / 12 * 11);
            ctx.stroke();
            ctx.strokeStyle = BLUE_ALLIANCE;
            ctx.beginPath();
            ctx.moveTo(FIELD_SIDE + FIELD_SIDE / 12 * 3, FIELD_SIDE / 12);
            ctx.lineTo(FIELD_SIDE + FIELD_SIDE / 12 / 2, FIELD_SIDE / 12);
            ctx.lineTo(FIELD_SIDE + FIELD_SIDE / 12 / 2, FIELD_SIDE / 12 * 11);
            ctx.lineTo(FIELD_SIDE + FIELD_SIDE / 12 * 3, FIELD_SIDE / 12 * 11);
            ctx.stroke();
            this.rollers.forEach(roller => {
                roller.render(ctx);
            });
            this.disks.forEach(disk => {
                disk.render(ctx);
            });
        }
        render_static(ctx) {
            if (!this.cache_ctx)
                this.cache();
            ctx.drawImage(this.cache_ctx.canvas, 0, 0);
        }
        has_selection() {
            return this.selected_disk >= 0;
        }
    }

    var spin_up = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SpinUp
    });

})();
//# sourceMappingURL=build.js.map
