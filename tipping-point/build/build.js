!function(){"use strict";function t(){}const e=t=>t;function n(t){return t()}function s(){return Object.create(null)}function i(t){t.forEach(n)}function o(t){return"function"==typeof t}function r(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function c(e,n,s){e.$$.on_destroy.push(function(e,...n){if(null==e)return t;const s=e.subscribe(...n);return s.unsubscribe?()=>s.unsubscribe():s}(n,s))}function a(t,e,n,s){if(t){const i=l(t,e,n,s);return t[0](i)}}function l(t,e,n,s){return t[1]&&s?function(t,e){for(const n in e)t[n]=e[n];return t}(n.ctx.slice(),t[1](s(e))):n.ctx}function h(t,e,n,s){if(t[2]&&s){const i=t[2](s(n));if(void 0===e.dirty)return i;if("object"==typeof i){const t=[],n=Math.max(e.dirty.length,i.length);for(let s=0;s<n;s+=1)t[s]=e.dirty[s]|i[s];return t}return e.dirty|i}return e.dirty}function u(t,e,n,s,i,o){if(i){const r=l(e,n,s,o);t.p(r,i)}}function d(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let t=0;t<n;t++)e[t]=-1;return e}return-1}function f(t,e,n){return t.set(n),e}const m="undefined"!=typeof window;let g=m?()=>window.performance.now():()=>Date.now(),p=m?t=>requestAnimationFrame(t):t;const _=new Set;function $(t){_.forEach((e=>{e.c(t)||(_.delete(e),e.f())})),0!==_.size&&p($)}function w(t,e){t.appendChild(e)}function x(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function v(t){const e=k("style");return function(t,e){w(t.head||t,e)}(x(t),e),e.sheet}function y(t,e,n){t.insertBefore(e,n||null)}function b(t){t.parentNode.removeChild(t)}function k(t){return document.createElement(t)}function T(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function S(t){return document.createTextNode(t)}function P(){return S(" ")}function I(){return S("")}function E(t,e,n,s){return t.addEventListener(e,n,s),()=>t.removeEventListener(e,n,s)}function N(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function M(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function O(t,e){t.value=null==e?"":e}function A(t,e,n,s){null===n?t.style.removeProperty(e):t.style.setProperty(e,n,s?"important":"")}function R(t,e,n){t.classList[n?"add":"remove"](e)}function L(t,e,{bubbles:n=!1,cancelable:s=!1}={}){const i=document.createEvent("CustomEvent");return i.initCustomEvent(t,n,s,e),i}const z=new Map;let C,B=0;function K(t,e,n,s,i,o,r,c=0){const a=16.666/s;let l="{\n";for(let t=0;t<=1;t+=a){const s=e+(n-e)*o(t);l+=100*t+`%{${r(s,1-s)}}\n`}const h=l+`100% {${r(n,1-n)}}\n}`,u=`__svelte_${function(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}(h)}_${c}`,d=x(t),{stylesheet:f,rules:m}=z.get(d)||function(t,e){const n={stylesheet:v(e),rules:{}};return z.set(t,n),n}(d,t);m[u]||(m[u]=!0,f.insertRule(`@keyframes ${u} ${h}`,f.cssRules.length));const g=t.style.animation||"";return t.style.animation=`${g?`${g}, `:""}${u} ${s}ms linear ${i}ms 1 both`,B+=1,u}function Y(t,e){const n=(t.style.animation||"").split(", "),s=n.filter(e?t=>t.indexOf(e)<0:t=>-1===t.indexOf("__svelte")),i=n.length-s.length;i&&(t.style.animation=s.join(", "),B-=i,B||p((()=>{B||(z.forEach((t=>{const{stylesheet:e}=t;let n=e.cssRules.length;for(;n--;)e.deleteRule(n);t.rules={}})),z.clear())})))}function G(t){C=t}function X(){if(!C)throw new Error("Function called outside component initialization");return C}function Z(){const t=X();return(e,n,{cancelable:s=!1}={})=>{const i=t.$$.callbacks[e];if(i){const o=L(e,n,{cancelable:s});return i.slice().forEach((e=>{e.call(t,o)})),!o.defaultPrevented}return!0}}function U(t,e){const n=t.$$.callbacks[e.type];n&&n.slice().forEach((t=>t.call(this,e)))}const W=[],D=[],F=[],q=[],j=Promise.resolve();let H=!1;function J(t){F.push(t)}function V(t){q.push(t)}const Q=new Set;let tt,et=0;function nt(){const t=C;do{for(;et<W.length;){const t=W[et];et++,G(t),st(t.$$)}for(G(null),W.length=0,et=0;D.length;)D.pop()();for(let t=0;t<F.length;t+=1){const e=F[t];Q.has(e)||(Q.add(e),e())}F.length=0}while(W.length);for(;q.length;)q.pop()();H=!1,Q.clear(),G(t)}function st(t){if(null!==t.fragment){t.update(),i(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(J)}}function it(t,e,n){t.dispatchEvent(L(`${e?"intro":"outro"}${n}`))}const ot=new Set;let rt;function ct(){rt={r:0,c:[],p:rt}}function at(){rt.r||i(rt.c),rt=rt.p}function lt(t,e){t&&t.i&&(ot.delete(t),t.i(e))}function ht(t,e,n,s){if(t&&t.o){if(ot.has(t))return;ot.add(t),rt.c.push((()=>{ot.delete(t),s&&(n&&t.d(1),s())})),t.o(e)}}const ut={duration:0};function dt(n,s,r,c){let a=s(n,r),l=c?0:1,h=null,u=null,d=null;function f(){d&&Y(n,d)}function m(t,e){const n=t.b-l;return e*=Math.abs(n),{a:l,b:t.b,d:n,duration:e,start:t.start,end:t.start+e,group:t.group}}function w(s){const{delay:o=0,duration:r=300,easing:c=e,tick:w=t,css:x}=a||ut,v={start:g()+o,b:s};s||(v.group=rt,rt.r+=1),h||u?u=v:(x&&(f(),d=K(n,l,s,r,o,c,x)),s&&w(0,1),h=m(v,r),J((()=>it(n,s,"start"))),function(t){let e;0===_.size&&p($),new Promise((n=>{_.add(e={c:t,f:n})}))}((t=>{if(u&&t>u.start&&(h=m(u,r),u=null,it(n,h.b,"start"),x&&(f(),d=K(n,l,h.b,h.duration,0,c,a.css))),h)if(t>=h.end)w(l=h.b,1-l),it(n,h.b,"end"),u||(h.b?f():--h.group.r||i(h.group.c)),h=null;else if(t>=h.start){const e=t-h.start;l=h.a+h.d*c(e/h.duration),w(l,1-l)}return!(!h&&!u)})))}return{run(t){o(a)?(tt||(tt=Promise.resolve(),tt.then((()=>{tt=null}))),tt).then((()=>{a=a(),w(t)})):w(t)},end(){f(),h=u=null}}}function ft(t,e,n){const s=t.$$.props[e];void 0!==s&&(t.$$.bound[s]=n,n(t.$$.ctx[s]))}function mt(t){t&&t.c()}function gt(t,e,s,r){const{fragment:c,on_mount:a,on_destroy:l,after_update:h}=t.$$;c&&c.m(e,s),r||J((()=>{const e=a.map(n).filter(o);l?l.push(...e):i(e),t.$$.on_mount=[]})),h.forEach(J)}function pt(t,e){const n=t.$$;null!==n.fragment&&(i(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function _t(t,e){-1===t.$$.dirty[0]&&(W.push(t),H||(H=!0,j.then(nt)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function $t(e,n,o,r,c,a,l,h=[-1]){const u=C;G(e);const d=e.$$={fragment:null,ctx:null,props:a,update:t,not_equal:c,bound:s(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(n.context||(u?u.$$.context:[])),callbacks:s(),dirty:h,skip_bound:!1,root:n.target||u.$$.root};l&&l(d.root);let f=!1;if(d.ctx=o?o(e,n.props||{},((t,n,...s)=>{const i=s.length?s[0]:n;return d.ctx&&c(d.ctx[t],d.ctx[t]=i)&&(!d.skip_bound&&d.bound[t]&&d.bound[t](i),f&&_t(e,t)),n})):[],d.update(),f=!0,i(d.before_update),d.fragment=!!r&&r(d.ctx),n.target){if(n.hydrate){const t=function(t){return Array.from(t.childNodes)}(n.target);d.fragment&&d.fragment.l(t),t.forEach(b)}else d.fragment&&d.fragment.c();n.intro&&lt(e.$$.fragment),gt(e,n.target,n.anchor,n.customElement),nt()}G(u)}class wt{$destroy(){pt(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function xt(t){let e,n,s,o,r,c,l,f,m,g,p,_,$,x;const v=t[3].default,I=a(v,t,t[2],null);return{c(){e=k("div"),n=P(),s=k("div"),o=k("div"),r=k("h1"),c=S(t[0]),l=P(),f=T("svg"),m=T("line"),g=T("line"),p=P(),I&&I.c(),N(e,"class","modal-background svelte-qag648"),N(r,"class","svelte-qag648"),N(m,"x1","5"),N(m,"y1","5"),N(m,"x2","35"),N(m,"y2","35"),A(m,"stroke","white"),A(m,"stroke-width","4"),N(g,"x1","35"),N(g,"y1","5"),N(g,"x2","5"),N(g,"y2","35"),A(g,"stroke","white"),A(g,"stroke-width","4"),N(f,"class","svelte-qag648"),N(o,"class","modal-top-bar svelte-qag648"),N(s,"class","modal svelte-qag648")},m(i,a){y(i,e,a),y(i,n,a),y(i,s,a),w(s,o),w(o,r),w(r,c),w(o,l),w(o,f),w(f,m),w(f,g),w(s,p),I&&I.m(s,null),_=!0,$||(x=[E(e,"click",t[4]),E(f,"click",t[5])],$=!0)},p(t,[e]){(!_||1&e)&&M(c,t[0]),I&&I.p&&(!_||4&e)&&u(I,v,t,t[2],_?h(v,t[2],e,null):d(t[2]),null)},i(t){_||(lt(I,t),_=!0)},o(t){ht(I,t),_=!1},d(t){t&&b(e),t&&b(n),t&&b(s),I&&I.d(t),$=!1,i(x)}}}function vt(t,e,n){let{$$slots:s={},$$scope:i}=e,{title:o="Title Missing"}=e;const r=Z();return t.$$set=t=>{"title"in t&&n(0,o=t.title),"$$scope"in t&&n(2,i=t.$$scope)},[o,r,i,s,()=>r("close"),()=>r("close")]}class yt extends wt{constructor(t){super(),$t(this,t,vt,xt,r,{title:0})}}function bt(e){let n,s,i,o,r,c,a,l,h,u,d;return{c(){n=k("div"),s=k("span"),i=S(e[1]),o=S(":"),r=P(),c=k("div"),a=k("div"),a.innerHTML='<div class="toggle-circle svelte-w69rp9"></div>',l=P(),h=k("input"),N(s,"class","svelte-w69rp9"),N(a,"class","toggle svelte-w69rp9"),R(a,"toggled",e[0]),N(h,"type","checkbox"),N(h,"class","svelte-w69rp9"),N(n,"class","toggle-wrapper svelte-w69rp9")},m(t,f){y(t,n,f),w(n,s),w(s,i),w(s,o),w(n,r),w(n,c),w(c,a),w(c,l),w(c,h),h.checked=e[0],u||(d=E(h,"change",e[2]),u=!0)},p(t,[e]){2&e&&M(i,t[1]),1&e&&R(a,"toggled",t[0]),1&e&&(h.checked=t[0])},i:t,o:t,d(t){t&&b(n),u=!1,d()}}}function kt(t,e,n){let{value:s=!1}=e,{label:i="Missing Label"}=e;return t.$$set=t=>{"value"in t&&n(0,s=t.value),"label"in t&&n(1,i=t.label)},[s,i,function(){s=this.checked,n(0,s)}]}class Tt extends wt{constructor(t){super(),$t(this,t,kt,bt,r,{value:0,label:1})}}const St=[];function Pt(e,n=t){let s;const i=new Set;function o(t){if(r(e,t)&&(e=t,s)){const t=!St.length;for(const t of i)t[1](),St.push(t,e);if(t){for(let t=0;t<St.length;t+=2)St[t][0](St[t+1]);St.length=0}}}return{set:o,update:function(t){o(t(e))},subscribe:function(r,c=t){const a=[r,c];return i.add(a),1===i.size&&(s=n(o)||t),r(e),()=>{i.delete(a),0===i.size&&(s(),s=null)}}}}const It=Pt(!1),Et=Pt(!1),Nt=Pt(!1);function Mt(t){let e,n,s;function i(e){t[2](e)}let o={label:"Use Grid (g)"};return void 0!==t[1]&&(o.value=t[1]),e=new Tt({props:o}),D.push((()=>ft(e,"value",i))),{c(){mt(e.$$.fragment)},m(t,n){gt(e,t,n),s=!0},p(t,s){const i={};!n&&2&s&&(n=!0,i.value=t[1],V((()=>n=!1))),e.$set(i)},i(t){s||(lt(e.$$.fragment,t),s=!0)},o(t){ht(e.$$.fragment,t),s=!1},d(t){pt(e,t)}}}function Ot(t){let e,n;return e=new yt({props:{title:"Settings",$$slots:{default:[Mt]},$$scope:{ctx:t}}}),e.$on("close",t[3]),{c(){mt(e.$$.fragment)},m(t,s){gt(e,t,s),n=!0},p(t,[n]){const s={};18&n&&(s.$$scope={dirty:n,ctx:t}),e.$set(s)},i(t){n||(lt(e.$$.fragment,t),n=!0)},o(t){ht(e.$$.fragment,t),n=!1},d(t){pt(e,t)}}}function At(t,e,n){let s,i;c(t,It,(t=>n(0,s=t))),c(t,Nt,(t=>n(1,i=t)));return[s,i,function(t){i=t,Nt.set(i)},()=>f(It,s=!1,s)]}class Rt extends wt{constructor(t){super(),$t(this,t,At,Ot,r,{})}}function Lt(e){let n,s,i;return{c(){n=k("input"),N(n,"type","text")},m(t,o){y(t,n,o),O(n,e[0]),s||(i=E(n,"input",e[1]),s=!0)},p(t,[e]){1&e&&n.value!==t[0]&&O(n,t[0])},i:t,o:t,d(t){t&&b(n),s=!1,i()}}}function zt(t,e,n){let{value:s=""}=e;return t.$$set=t=>{"value"in t&&n(0,s=t.value)},[s,function(){s=this.value,n(0,s)}]}class Ct extends wt{constructor(t){super(),$t(this,t,zt,Lt,r,{value:0})}}function Bt(e){let n,s,i,o;return{c(){n=k("div"),s=S(e[0]),N(n,"class","svelte-1aripa7")},m(t,r){y(t,n,r),w(n,s),i||(o=E(n,"click",e[1]),i=!0)},p(t,[e]){1&e&&M(s,t[0])},i:t,o:t,d(t){t&&b(n),i=!1,o()}}}function Kt(t,e,n){let{label:s=""}=e;return t.$$set=t=>{"label"in t&&n(0,s=t.label)},[s,function(e){U.call(this,t,e)}]}class Yt extends wt{constructor(t){super(),$t(this,t,Kt,Bt,r,{label:0})}}function Gt(t){let e,n,s,i,o,r,c,a,l,h,u,d,f;function m(e){t[3](e)}let g={};return void 0!==t[0]&&(g.value=t[0]),s=new Ct({props:g}),D.push((()=>ft(s,"value",m))),a=new Yt({props:{label:"Save Slot"}}),a.$on("click",t[4]),d=new Yt({props:{label:"Load Slot"}}),d.$on("click",t[5]),{c(){e=k("div"),n=S("Save Slot: "),mt(s.$$.fragment),o=P(),r=k("br"),c=P(),mt(a.$$.fragment),l=P(),h=k("br"),u=P(),mt(d.$$.fragment),N(e,"class","svelte-1619d8k")},m(t,i){y(t,e,i),w(e,n),gt(s,e,null),w(e,o),w(e,r),w(e,c),gt(a,e,null),w(e,l),w(e,h),w(e,u),gt(d,e,null),f=!0},p(t,e){const n={};!i&&1&e&&(i=!0,n.value=t[0],V((()=>i=!1))),s.$set(n)},i(t){f||(lt(s.$$.fragment,t),lt(a.$$.fragment,t),lt(d.$$.fragment,t),f=!0)},o(t){ht(s.$$.fragment,t),ht(a.$$.fragment,t),ht(d.$$.fragment,t),f=!1},d(t){t&&b(e),pt(s),pt(a),pt(d)}}}function Xt(t){let e,n;return e=new yt({props:{title:"Save",$$slots:{default:[Gt]},$$scope:{ctx:t}}}),e.$on("close",t[6]),{c(){mt(e.$$.fragment)},m(t,s){gt(e,t,s),n=!0},p(t,[n]){const s={};129&n&&(s.$$scope={dirty:n,ctx:t}),e.$set(s)},i(t){n||(lt(e.$$.fragment,t),n=!0)},o(t){ht(e.$$.fragment,t),n=!1},d(t){pt(e,t)}}}function Zt(t,e,n){let s;c(t,Et,(t=>n(1,s=t)));let i="Save Slot 1";const o=Z();return[i,s,o,function(t){i=t,n(0,i)},()=>o("save",i),()=>o("load",i),()=>f(Et,s=!1,s)]}class Ut extends wt{constructor(t){super(),$t(this,t,Zt,Xt,r,{})}}function Wt(t){let e,n,s,i;const o=t[1].default,r=a(o,t,t[0],null);return{c(){e=k("div"),r&&r.c(),N(e,"class","svelte-1b1mv0y")},m(o,c){y(o,e,c),r&&r.m(e,null),n=!0,s||(i=E(e,"click",t[2]),s=!0)},p(t,[e]){r&&r.p&&(!n||1&e)&&u(r,o,t,t[0],n?h(o,t[0],e,null):d(t[0]),null)},i(t){n||(lt(r,t),n=!0)},o(t){ht(r,t),n=!1},d(t){t&&b(e),r&&r.d(t),s=!1,i()}}}function Dt(t,e,n){let{$$slots:s={},$$scope:i}=e;return t.$$set=t=>{"$$scope"in t&&n(0,i=t.$$scope)},[i,s,function(e){U.call(this,t,e)}]}class Ft extends wt{constructor(t){super(),$t(this,t,Dt,Wt,r,{})}}function qt(t){const e=t-1;return e*e*e+1}function jt(t,{delay:e=0,duration:n=400,easing:s=qt,x:i=0,y:o=0,opacity:r=0}={}){const c=getComputedStyle(t),a=+c.opacity,l="none"===c.transform?"":c.transform,h=a*(1-r);return{delay:e,duration:n,easing:s,css:(t,e)=>`\n\t\t\ttransform: ${l} translate(${(1-t)*i}px, ${(1-t)*o}px);\n\t\t\topacity: ${a-h*e}`}}function Ht(e){let n,s,i;return{c(){n=k("div"),n.innerHTML='<a href="../spin-up" class="svelte-1814ztf">Spin Up</a> \n    <a href="../tipping-point" class="svelte-1814ztf">Tipping Point</a>',N(n,"class","svelte-1814ztf")},m(t,e){y(t,n,e),i=!0},p:t,i(t){i||(J((()=>{s||(s=dt(n,jt,{x:200,duration:100},!0)),s.run(1)})),i=!0)},o(t){s||(s=dt(n,jt,{x:200,duration:100},!1)),s.run(0),i=!1},d(t){t&&b(n),t&&s&&s.end()}}}class Jt extends wt{constructor(t){super(),$t(this,t,null,Ht,r,{})}}function Vt(t){let e;return{c(){e=S("Settings")},m(t,n){y(t,e,n)},d(t){t&&b(e)}}}function Qt(t){let e;return{c(){e=S("Save/Load")},m(t,n){y(t,e,n)},d(t){t&&b(e)}}}function te(t){let e;return{c(){e=S("GitHub")},m(t,n){y(t,e,n)},d(t){t&&b(e)}}}function ee(t){let e;return{c(){e=S("≡")},m(t,n){y(t,e,n)},d(t){t&&b(e)}}}function ne(t){let e,n;return e=new Jt({}),{c(){mt(e.$$.fragment)},m(t,s){gt(e,t,s),n=!0},i(t){n||(lt(e.$$.fragment,t),n=!0)},o(t){ht(e.$$.fragment,t),n=!1},d(t){pt(e,t)}}}function se(t){let e,n,s,i,o,r,c,a,l,h,u,d,f,m,g,p;o=new Ft({props:{$$slots:{default:[Vt]},$$scope:{ctx:t}}}),o.$on("click",t[3]),c=new Ft({props:{$$slots:{default:[Qt]},$$scope:{ctx:t}}}),c.$on("click",t[4]),h=new Ft({props:{$$slots:{default:[te]},$$scope:{ctx:t}}}),f=new Ft({props:{$$slots:{default:[ee]},$$scope:{ctx:t}}}),f.$on("click",t[5]);let _=t[0]&&ne();return{c(){e=k("div"),n=k("span"),s=k("p"),s.textContent="VRC Field Map",i=P(),mt(o.$$.fragment),r=P(),mt(c.$$.fragment),a=P(),l=k("a"),mt(h.$$.fragment),u=P(),d=k("div"),mt(f.$$.fragment),m=P(),_&&_.c(),g=I(),N(s,"class","svelte-oy4bv0"),N(l,"href","https://github.com/iseau395/vrc-map"),N(l,"target","_blank"),N(l,"rel","noopener noreferrer"),N(l,"class","svelte-oy4bv0"),N(n,"class","svelte-oy4bv0"),N(d,"class","hamburger-button svelte-oy4bv0"),N(e,"class","svelte-oy4bv0")},m(t,$){y(t,e,$),w(e,n),w(n,s),w(n,i),gt(o,n,null),w(n,r),gt(c,n,null),w(n,a),w(n,l),gt(h,l,null),w(e,u),w(e,d),gt(f,d,null),y(t,m,$),_&&_.m(t,$),y(t,g,$),p=!0},p(t,[e]){const n={};64&e&&(n.$$scope={dirty:e,ctx:t}),o.$set(n);const s={};64&e&&(s.$$scope={dirty:e,ctx:t}),c.$set(s);const i={};64&e&&(i.$$scope={dirty:e,ctx:t}),h.$set(i);const r={};64&e&&(r.$$scope={dirty:e,ctx:t}),f.$set(r),t[0]?_?1&e&&lt(_,1):(_=ne(),_.c(),lt(_,1),_.m(g.parentNode,g)):_&&(ct(),ht(_,1,1,(()=>{_=null})),at())},i(t){p||(lt(o.$$.fragment,t),lt(c.$$.fragment,t),lt(h.$$.fragment,t),lt(f.$$.fragment,t),lt(_),p=!0)},o(t){ht(o.$$.fragment,t),ht(c.$$.fragment,t),ht(h.$$.fragment,t),ht(f.$$.fragment,t),ht(_),p=!1},d(t){t&&b(e),pt(o),pt(c),pt(h),pt(f),t&&b(m),_&&_.d(t),t&&b(g)}}}function ie(t,e,n){let s,i;c(t,It,(t=>n(1,s=t))),c(t,Et,(t=>n(2,i=t)));let o=!1;return[o,s,i,()=>f(It,s=!0,s),()=>f(Et,i=!0,i),()=>n(0,o=!o)]}class oe extends wt{constructor(t){super(),$t(this,t,ie,se,r,{})}}const re=1785;var ce,ae;async function le(t){switch(t){case ce.TIPPING_POINT:return async function(){return new((await Promise.resolve().then((function(){return Me}))).default)}();case ce.SPIN_UP:return async function(){return new((await Promise.resolve().then((function(){return Re}))).default)}();default:throw new Error(`Unknown game type: ${t}`)}}!function(t){t[t.TIPPING_POINT=0]="TIPPING_POINT",t[t.SPIN_UP=1]="SPIN_UP"}(ce||(ce={})),function(t){t[t.NORMAL=0]="NORMAL",t[t.POINTER=1]="POINTER",t[t.GRAB=2]="GRAB",t[t.GRABBING=3]="GRABBING",t[t.ZOOM_IN=4]="ZOOM_IN",t[t.ZOOM_OUT=5]="ZOOM_OUT",t[t.PAN=6]="PAN"}(ae||(ae={}));class he{constructor(t){this._dragX=0,this._dragY=0,this._mouseButton=-1,this._zoom=1,this._deltaScroll=0,this._mouseX=0,this._mouseY=0,this._altKey=!1,this._ctrlKey=!1,this._shiftKey=!1,this.keys=new Map,t.addEventListener("mousemove",(t=>this.mousemove(t))),t.addEventListener("mousedown",(t=>this.mousedown(t))),t.addEventListener("mouseup",(t=>this.mouseup(t))),t.addEventListener("contextmenu",(t=>this.contextmenu(t))),t.addEventListener("wheel",(t=>this.wheel(t)),{passive:!0}),t.addEventListener("scroll",(t=>this.scroll(t))),window.addEventListener("keydown",(t=>this.keydown(t))),window.addEventListener("keyup",(t=>this.keyup(t)))}mousemove(t){(1==this._mouseButton||0==this._mouseButton&&this._altKey)&&(this._dragX+=t.movementX,this._dragY+=t.movementY),this._mouseX=t.x,this._mouseY=t.y-50}mousedown(t){this._mouseButton=t.button}mouseup(t){this._mouseButton=-1}contextmenu(t){t.preventDefault()}wheel(t){this._shiftKey||(this._zoom+=-.002*t.deltaY,this._zoom=Math.min(Math.max(.125,this._zoom),4)),this._deltaScroll+=t.deltaY}scroll(t){t.preventDefault()}keydown(t){this._altKey=t.altKey,this._ctrlKey=t.ctrlKey,this._shiftKey=t.shiftKey,this.keys.set(t.code,!0)}keyup(t){this._altKey=t.altKey,this._ctrlKey=t.ctrlKey,this._shiftKey=t.shiftKey,this.keys.delete(t.code)}get dragX(){const t=this._dragX;return this._dragX=0,t}get dragY(){const t=this._dragY;return this._dragY=0,t}get zoom(){const t=this._zoom;return this._zoom=1,t}get deltaScroll(){const t=this._deltaScroll;return this._deltaScroll=0,t}get mouseButton(){return this._mouseButton}get mouseX(){return this._mouseX}get mouseY(){return this._mouseY}get altKey(){return this._altKey}get ctrlKey(){return this._ctrlKey}get shiftKey(){return this._shiftKey}keyPressed(t){var e;return null!==(e=this.keys.get(t))&&void 0!==e&&e}}class ue{constructor(t,e){this.fieldZoom=.065,this.prevFieldZoom=this.fieldZoom,this.fieldX=t/2-re*this.fieldZoom*3.05,this.fieldY=e/2-re*this.fieldZoom*3.05,this.prevFieldX=this.fieldX,this.prevFieldY=this.fieldY}tick(t,e,n){this.fieldX+=t,this.fieldY+=e,this.fieldX=Math.floor(this.fieldX),this.fieldY=Math.floor(this.fieldY),this.fieldZoom*=n,this.fieldZoom=Math.min(Math.max(.4,this.fieldZoom),1.5)}getCursor(t){let e;return e=this.prevFieldZoom<this.fieldZoom?ae.ZOOM_OUT:this.prevFieldZoom>this.fieldZoom?ae.ZOOM_IN:t?ae.PAN:ae.NORMAL,e}translate(t){t.translate(this.fieldX,this.fieldY),t.scale(this.fieldZoom,this.fieldZoom)}render(t){this.cache_ctx||this.cache(),t.drawImage(this.cache_ctx.canvas,0,0)}changed(){const t=this.fieldX!=this.prevFieldX||this.fieldY!=this.prevFieldY||this.fieldZoom!=this.prevFieldZoom;return this.prevFieldX=this.fieldX,this.prevFieldY=this.fieldY,this.prevFieldZoom=this.fieldZoom,t}cache(){this.cache_ctx=document.createElement("canvas").getContext("2d"),this.cache_ctx.canvas.width=re,this.cache_ctx.canvas.height=re,this.cache_ctx.fillStyle="rgb(159, 159, 159)",this.cache_ctx.fillRect(0,0,re,re),this.cache_ctx.beginPath();for(let t=0;t<6;t++)this.cache_ctx.moveTo(297.5*(t+1),0),this.cache_ctx.lineTo(297.5*(t+1),re);for(let t=0;t<6;t++)this.cache_ctx.moveTo(0,297.5*(t+1)),this.cache_ctx.lineTo(re,297.5*(t+1));this.cache_ctx.strokeStyle="rgba(100, 100, 100, 0.2)",this.cache_ctx.lineWidth=5,this.cache_ctx.stroke()}zoom(){return this.fieldZoom}x(){return this.fieldX}y(){return this.fieldY}}class de{constructor(){this.gridSize=48}snap(t,e){return[Math.round(t/(re/this.gridSize))*(re/this.gridSize),Math.round(e/(re/this.gridSize))*(re/this.gridSize)]}render(t,e,n,s){const i=re/this.gridSize*s;let o=e%i,r=n%i;for(t.beginPath();o<t.canvas.width;)t.moveTo(o,Math.min(-n/s,0)),t.lineTo(o,t.canvas.height),o+=i;for(;r<t.canvas.height;)t.moveTo(Math.min(-e/s,0),r),t.lineTo(t.canvas.width,r),r+=i;t.strokeStyle="rgba(100, 100, 100, 0.5)",t.lineWidth=1,t.stroke()}}class fe extends class{constructor(t,e,n){this.x=t,this.y=e,this.r=n}pointInside(t,e){throw new Error("Unimplimented")}update(t,e,n){if(this.x=t,this.y=e,n/=1.25,!this.rotate_step)throw new Error("Missing rotate_step!");this.r+=Math.floor(n/this.rotate_step)*this.rotate_step}render(t){throw new Error("Unimplimented")}getX(){return this.x}getY(){return this.y}getRot(){return this.r}}{pointInside(t,e){if(!this.diameter)throw new Error("Missing diameter!");return(t-this.x)**2+(e-this.y)**2<=(this.diameter/2*5+5)**2}}class me extends fe{constructor(){super(...arguments),this.diameter=8.5,this.rotate_step=1}render(t){t.lineWidth=0,t.beginPath(),t.arc(this.x,this.y,this.diameter/2*5-7.5,0,2*Math.PI),t.closePath(),t.fill(),t.lineWidth=5,t.beginPath(),t.arc(this.x,this.y,this.diameter/2*5,0,2*Math.PI),t.closePath(),t.stroke()}get_x(){return this.x}get_y(){return this.y}}class ge{constructor(){this.selection=-1,this.added_point=!1,this.points=[]}tick(t,e,n,s,i,o,r,c){if(o&&0==i){if(!this.hasSelection())for(const n of this.points)if(n.pointInside(t,e)){this.selection=this.points.indexOf(n);break}this.hasSelection()&&this.points[this.selection].update(n,s,c)}else 2==i&&0==this.added_point?(this.points.push(new me(n,s,0)),this.added_point=!0):2!=i&&(this.added_point=!1),this.selection=-1}saveData(){const t=[];for(const e of this.points)t.push({x:e.get_x(),y:e.get_y()});return t}loadData(t){this.points.length=0;for(const e of t)this.points.push(new me(e.x,e.y,0))}getCursor(t,e){if(this.hasSelection())return ae.GRABBING;{let n=!1;for(const s of this.points)s.pointInside(t,e)&&(n=!0);if(n)return ae.GRAB}return ae.NORMAL}render(t){t.fillStyle="rgb(255, 0, 0)",t.strokeStyle="rgb(255, 0, 0)",t.lineWidth=5,t.beginPath(),this.points.forEach(((e,n)=>0==n?t.moveTo(e.get_x(),e.get_y()):t.lineTo(e.get_x(),e.get_y()))),t.stroke(),this.points.forEach((e=>e.render(t)))}hasSelection(){return this.selection>=0}}function pe(e){let n,s,i;return{c(){n=k("canvas"),s=P(),i=k("canvas"),A(n,"z-index","-1"),N(n,"class","svelte-19dzfsr"),A(i,"z-index","0"),N(i,"class","svelte-19dzfsr")},m(t,o){y(t,n,o),e[4](n),y(t,s,o),y(t,i,o),e[5](i)},p:t,i:t,o:t,d(t){t&&b(n),e[4](null),t&&b(s),t&&b(i),e[5](null)}}}function _e(t,e,n){let s,i,o;c(t,Nt,(t=>n(10,s=t)));const r=(a=Symbol.for("game"),X().$$.context.get(a));var a;let l,h,u;window.onbeforeunload=function(){return!0};let d;var m;return m=async()=>{const t=i.getContext("2d",{alpha:!1}),e=o.getContext("2d",{alpha:!0}),c=new he(o),a=new ue(window.innerWidth,window.innerHeight-50),m=new de,g=await le(r),p=new ge;function _(t){switch(t){case ae.POINTER:n(1,o.style.cursor="pointer",o);break;case ae.GRAB:n(1,o.style.cursor="grab",o);break;case ae.GRABBING:n(1,o.style.cursor="grabbing",o);break;case ae.ZOOM_IN:n(1,o.style.cursor="zoom-in",o);break;case ae.ZOOM_OUT:n(1,o.style.cursor="zoom-out",o);break;case ae.PAN:n(1,o.style.cursor="move",o)}}function $(){n(0,i.width=window.innerWidth,i),n(0,i.height=window.innerHeight-50,i),n(1,o.width=window.innerWidth,o),n(1,o.height=window.innerHeight-50,o),w(e,t,!0,!0)}function w(t,e,n,r){(a.changed()||r)&&(e.fillStyle="rgb(80, 80, 80)",e.fillRect(0,0,i.width,i.height),e.save(),a.translate(e),a.render(e),g.render_static(e),e.restore()),t.clearRect(0,0,o.width,o.height),t.save(),n&&a.translate(t),g.render(t),p.render(t),t.restore(),s&&m.render(t,a.x(),a.y(),a.zoom()),r||(h=requestAnimationFrame((()=>w(t,e,n,!1))))}u=t=>function(t,e,...n){const s={v:0,g:e,d:n};localStorage.setItem(`slot-${e}-${t}`,JSON.stringify(s)),localStorage.getItem("slots")||localStorage.setItem("slots",JSON.stringify([]));const i=JSON.parse(localStorage.getItem("slots"));i.includes(t)||(i.push(t),localStorage.setItem("slots",JSON.stringify(i)))}(t,r,g.saveData(),p.saveData()),d=t=>{const e=JSON.parse(localStorage.getItem(`slot-${r}-${t}`));if(e||alert("Unable to find slot! make sure you spelt the name right, and you have the right game selected!"),e.g!=r)throw new Error("Incompatable game type");if(0!=e.v)throw new Error("Unknown save version");console.log(e.d[0]),g.loadData(e.d[0]),p.loadData(e.d[1])},window.addEventListener("resize",$);let x=!1;async function v(){n(1,o.style.cursor="wait",o);const t=(c.mouseX-a.x())/a.zoom(),e=(c.mouseY-a.y())/a.zoom();c.keyPressed("KeyG")&&!x?(f(Nt,s=!s,s),x=!0):c.keyPressed("KeyG")||(x=!1);const[i,r]=s?m.snap(t,e):[t,e];a.tick(c.dragX,c.dragY,c.zoom),g.hasSelection()||p.tick(t,e,i,r,c.mouseButton,c.shiftKey,c.ctrlKey,c.deltaScroll),c.altKey||p.hasSelection()||g.tick(t,e,i,r,c.mouseButton,c.shiftKey,c.ctrlKey,c.deltaScroll),n(1,o.style.cursor="default",o);const l=a.getCursor(c.altKey),h=g.getCursor(t,e),u=h!=ae.GRABBING?p.getCursor(t,e):ae.NORMAL;_(l),_(h),_(u)}l=setInterval(v,20),v(),$(),w(e,t,!0,!1)},X().$$.on_mount.push(m),function(t){X().$$.on_destroy.push(t)}((()=>{clearInterval(l),cancelAnimationFrame(h)})),[i,o,t=>{if(!u)throw new Error("Save not defined yet");u(t)},t=>{if(!d)throw new Error("Load not defined yet");d(t)},function(t){D[t?"unshift":"push"]((()=>{i=t,n(0,i)}))},function(t){D[t?"unshift":"push"]((()=>{o=t,n(1,o)}))}]}class $e extends wt{constructor(t){super(),$t(this,t,_e,pe,r,{save:2,load:3})}get save(){return this.$$.ctx[2]}get load(){return this.$$.ctx[3]}}function we(e){let n;return{c(){n=k("p"),n.textContent="It looks like you are on a device without a mouse or touchpad. If you can, please plug in one of these devices, as this field map is designed to use them.\r\n    If you can't plug one in, then try to switch to another device which can have on plugged in.",N(n,"class","svelte-48ahf8")},m(t,e){y(t,n,e)},p:t,i:t,o:t,d(t){t&&b(n)}}}function xe(t){let e,n;return e=new $e({props:{}}),t[6](e),{c(){mt(e.$$.fragment)},m(t,s){gt(e,t,s),n=!0},p(t,n){e.$set({})},i(t){n||(lt(e.$$.fragment,t),n=!0)},o(t){ht(e.$$.fragment,t),n=!1},d(n){t[6](null),pt(e,n)}}}function ve(e){let n,s;return n=new Ut({}),n.$on("save",e[7]),n.$on("load",e[8]),{c(){mt(n.$$.fragment)},m(t,e){gt(n,t,e),s=!0},p:t,i(t){s||(lt(n.$$.fragment,t),s=!0)},o(t){ht(n.$$.fragment,t),s=!1},d(t){pt(n,t)}}}function ye(e){let n,s;return n=new Rt({}),{c(){mt(n.$$.fragment)},m(t,e){gt(n,t,e),s=!0},p:t,i(t){s||(lt(n.$$.fragment,t),s=!0)},o(t){ht(n.$$.fragment,t),s=!1},d(t){pt(n,t)}}}function be(t){let e,n,s,i,o,r,c,a,l;e=new oe({});const h=[xe,we],u=[];function d(t,e){return t[1]?0:1}s=d(t),i=u[s]=h[s](t);const f=[ye,ve],m=[];function g(t,e){return t[2]?0:t[3]?1:-1}return~(r=g(t))&&(c=m[r]=f[r](t)),{c(){mt(e.$$.fragment),n=P(),i.c(),o=P(),c&&c.c(),a=I()},m(t,i){gt(e,t,i),y(t,n,i),u[s].m(t,i),y(t,o,i),~r&&m[r].m(t,i),y(t,a,i),l=!0},p(t,[e]){let n=s;s=d(t),s===n?u[s].p(t,e):(ct(),ht(u[n],1,1,(()=>{u[n]=null})),at(),i=u[s],i?i.p(t,e):(i=u[s]=h[s](t),i.c()),lt(i,1),i.m(o.parentNode,o));let l=r;r=g(t),r===l?~r&&m[r].p(t,e):(c&&(ct(),ht(m[l],1,1,(()=>{m[l]=null})),at()),~r?(c=m[r],c?c.p(t,e):(c=m[r]=f[r](t),c.c()),lt(c,1),c.m(a.parentNode,a)):c=null)},i(t){l||(lt(e.$$.fragment,t),lt(i),lt(c),l=!0)},o(t){ht(e.$$.fragment,t),ht(i),ht(c),l=!1},d(t){pt(e,t),t&&b(n),u[s].d(t),t&&b(o),~r&&m[r].d(t),t&&b(a)}}}function ke(t,e,n){let s,i,o;c(t,It,(t=>n(2,i=t))),c(t,Et,(t=>n(3,o=t)));const r=window.matchMedia("(hover: hover)"),a=window.matchMedia("(pointer: fine)");let l,h=r.matches,u=a.matches;r.onchange=t=>{n(4,h=t.matches)},a.onchange=t=>{n(5,u=t.matches)};return t.$$.update=()=>{48&t.$$.dirty&&n(1,s=h||u)},[l,s,i,o,h,u,function(t){D[t?"unshift":"push"]((()=>{l=t,n(0,l)}))},t=>l.save(t.detail),t=>confirm("Are you sure?")&&l.load(t.detail)]}new class extends wt{constructor(t){super(),$t(this,t,ke,be,r,{})}}({target:document.body,context:new Map([[Symbol.for("game"),ce.TIPPING_POINT]])});const Te="rgb(255, 0, 0)",Se="rgb(0, 0, 255)",Pe="rgb(255, 255, 255)";var Ie;!function(t){t[t.RED_ALLIANCE=0]="RED_ALLIANCE",t[t.BLUE_ALLIANCE=1]="BLUE_ALLIANCE",t[t.NEUTRAL=2]="NEUTRAL"}(Ie||(Ie={}));class Ee extends fe{constructor(t,e,n,s){super(t,e,n),this.diameter=33,this.rotate_step=90,this.variation=s}drawMogo(t){switch(this.variation){case 0:t.fillStyle=Te;break;case 1:t.fillStyle=Se;break;case 2:t.fillStyle="rgb(255, 255, 0)"}t.strokeStyle="rgb(50, 50, 50)",t.lineWidth=2.5,function(t,e,n,s,i,o){const r=2*Math.PI/s,c=Math.PI+i/360*(2*Math.PI);o.beginPath();for(let i=0;i<=s;i++){const s=i*r+c;o.lineTo(t+n*Math.cos(s),e+n*Math.sin(s))}o.fill(),o.stroke(),o.closePath()}(this.diameter/2*5,this.diameter/2*5,this.diameter/2*5,7,4*Math.PI,t)}render(t){switch(this.variation){case Ie.RED_ALLIANCE:Ee.red_cache||(Ee.red_cache=document.createElement("canvas").getContext("2d"),Ee.red_cache.canvas.width=5*this.diameter,Ee.red_cache.canvas.height=5*this.diameter,this.drawMogo(Ee.red_cache)),t.save(),t.translate(this.x,this.y),t.rotate(this.r),t.drawImage(Ee.red_cache.canvas,-this.diameter/2*5,-this.diameter/2*5),t.restore();break;case Ie.BLUE_ALLIANCE:Ee.blue_cache||(Ee.blue_cache=document.createElement("canvas").getContext("2d"),Ee.blue_cache.canvas.width=5*this.diameter,Ee.blue_cache.canvas.height=5*this.diameter,this.drawMogo(Ee.blue_cache)),t.save(),t.translate(this.x,this.y),t.rotate(this.r),t.drawImage(Ee.blue_cache.canvas,-this.diameter/2*5,-this.diameter/2*5),t.restore();break;case Ie.NEUTRAL:Ee.neutral_cache||(Ee.neutral_cache=document.createElement("canvas").getContext("2d"),Ee.neutral_cache.canvas.width=5*this.diameter,Ee.neutral_cache.canvas.height=5*this.diameter,this.drawMogo(Ee.neutral_cache)),t.save(),t.translate(this.x,this.y),t.rotate(this.r),t.drawImage(Ee.neutral_cache.canvas,-this.diameter/2*5,-this.diameter/2*5),t.restore()}}getVariation(){return this.variation}}class Ne extends fe{constructor(){super(...arguments),this.diameter=5.23875,this.rotate_step=1}render(t){t.strokeStyle="rgb(200, 100, 200)",t.lineWidth=13.4925,t.beginPath(),t.arc(this.x,this.y,this.diameter/2*5,0,2*Math.PI),t.stroke(),t.fill}}var Me=Object.freeze({__proto__:null,default:class{constructor(){this.selection={arr:-1,index:-1},this.mogos=[new Ee(446.25,1636.25,90,0),new Ee(148.75,557.8125,0,0),new Ee(1338.75,148.75,270,1),new Ee(1636.25,1227.1875,180,1),new Ee(892.5,446.25,180,2),new Ee(892.5,892.5,180,2),new Ee(892.5,1338.75,0,2)],this.rings=[new Ne(50,50,0)]}drawPlatform(t,e,n,s){const i=673.1,o=254;t+=27.625000000000014,e-=40,s.strokeStyle=n,s.lineCap="butt",s.lineWidth=20,s.beginPath(),s.moveTo(t+o/9,e+84.1375),s.lineTo(t+o-o/9,e+84.1375),s.lineTo(t+o-o/9,e+588.9625),s.lineTo(t+o/9,e+588.9625),s.lineTo(t+o/9,e+84.1375-s.lineWidth/2),s.stroke(),s.fillStyle="rgba(255, 255, 255, 0.12)",s.fillRect(t,e,o,i),s.strokeStyle="rgb(0, 0, 0)",s.lineWidth=1.5,s.beginPath(),s.moveTo(t+o+1,e),s.lineTo(t+o+1,e+i),s.moveTo(t-1,e),s.lineTo(t-1,e+i),s.stroke()}cache(){this.cache_ctx=document.createElement("canvas").getContext("2d"),this.cache_ctx.canvas.width=re,this.cache_ctx.canvas.height=re,this.cache_ctx.strokeStyle=Pe,this.cache_ctx.lineWidth=5.5,this.cache_ctx.beginPath(),this.cache_ctx.moveTo(595,0),this.cache_ctx.lineTo(595,re),this.cache_ctx.moveTo(887.5,0),this.cache_ctx.lineTo(887.5,re),this.cache_ctx.moveTo(897.5,0),this.cache_ctx.lineTo(897.5,re),this.cache_ctx.moveTo(1190,0),this.cache_ctx.lineTo(1190,re),this.cache_ctx.moveTo(1190,297.5),this.cache_ctx.lineTo(1487.5,0),this.cache_ctx.moveTo(595,1487.5),this.cache_ctx.lineTo(297.5,re),this.cache_ctx.stroke(),this.drawPlatform(0,595,Te,this.cache_ctx),this.drawPlatform(1487.5,595,Se,this.cache_ctx)}tick(t,e,n,s,i,o,r,c){if(o&&0==i){if(-1==this.selection.arr){for(const n of this.mogos)if(n.pointInside(t,e)){this.selection.arr=0,this.selection.index=this.mogos.indexOf(n);break}for(const n of this.rings)if(n.pointInside(t,e)){this.selection.arr=1,this.selection.index=this.rings.indexOf(n);break}}0==this.selection.arr&&this.mogos[this.selection.index].update(n,s,c),1==this.selection.arr&&this.rings[this.selection.index].update(n,s,c)}else this.selection.arr=-1,this.selection.index=-1}getCursor(t,e){if(this.hasSelection())return ae.GRABBING;{let n=!1;for(const s of this.mogos)s.pointInside(t,e)&&(n=!0);for(const s of this.rings)s.pointInside(t,e)&&(n=!0);if(n)return ae.GRAB}return ae.NORMAL}saveData(){const t={r:[],m:[]};for(const e of this.rings)t.r.push({x:e.getX(),y:e.getY()});for(const e of this.mogos)t.m.push({x:e.getX(),y:e.getY(),r:e.getRot(),v:e.getVariation()});return t}loadData(t){this.rings.length=0,this.mogos.length=0;for(const e of t.r)this.rings.push(new Ne(e.x,e.y,0));for(const e of t.m)this.mogos.push(new Ee(e.x,e.y,e.r,e.v))}render(t){this.mogos.forEach((e=>e.render(t))),this.rings.forEach((e=>e.render(t)))}render_static(t){this.cache_ctx||this.cache(),t.drawImage(this.cache_ctx.canvas,0,0)}hasSelection(){return this.selection.arr>=0}}});class Oe extends fe{constructor(t,e){super(t,e,0),this.diameter=14,this.rotate_step=1}render(t){t.fillStyle="rgb(232, 212, 33)",t.lineWidth=13.4925,t.beginPath(),t.arc(this.x,this.y,this.diameter/2*5,0,2*Math.PI),t.closePath(),t.fill(),t.fillStyle="rgb(220, 200, 21)",t.beginPath(),t.arc(this.x,this.y,this.diameter/2*5-12.7,0,2*Math.PI),t.closePath(),t.fill()}}class Ae{constructor(t,e,n,s=0){this.was_pressed=!1,this.x=t,this.y=e,this.horrizontal=n,this.state=s}render(t){t.strokeStyle="rgba(0, 0, 0, 0)",0!=this.state?(-1==this.state&&(t.fillStyle=Se),1==this.state&&(t.fillStyle=Te),t.fillRect(this.x,this.y,this.horrizontal?Ae.long_side:Ae.short_side,this.horrizontal?Ae.short_side:Ae.long_side)):this.horrizontal?(t.fillStyle=Se,t.fillRect(this.x,this.y,Ae.long_side,Ae.short_side/2),t.fillStyle=Te,t.fillRect(this.x,this.y+Ae.short_side/2,Ae.long_side,Ae.short_side/2)):(t.fillStyle=Se,t.fillRect(this.x,this.y,Ae.short_side/2,Ae.long_side),t.fillStyle=Te,t.fillRect(this.x+Ae.short_side/2,this.y,Ae.short_side/2,Ae.long_side))}update(t,e,n){this.pointInside(t,e)&&0==n&&!this.was_pressed?(this.state++,this.state>1&&(this.state=-1),this.was_pressed=!0):0!=n&&(this.was_pressed=!1)}getState(){return this.state}pointInside(t,e){return t>this.x&&e>this.y&&t<this.x+(this.horrizontal?Ae.long_side:Ae.short_side)&&e<this.y+(this.horrizontal?Ae.short_side:Ae.long_side)}}Ae.long_side=124.46,Ae.short_side=30.48;var Re=Object.freeze({__proto__:null,default:class{constructor(){this.selected_disc=-1,this.discs=[new Oe(148.75,148.75),new Oe(297.5,297.5),new Oe(446.25,441.25),new Oe(446.25,436.25),new Oe(446.25,431.25),new Oe(595,595),new Oe(743.75,743.75),new Oe(1041.25,1041.25),new Oe(1190,1190),new Oe(1338.75,1333.75),new Oe(1338.75,1328.75),new Oe(1338.75,1323.75),new Oe(1487.5,1487.5),new Oe(1636.25,1636.25),new Oe(743.75,446.25),new Oe(892.5,595),new Oe(1041.25,743.75),new Oe(1338.75,1036.25),new Oe(1338.75,1031.25),new Oe(1338.75,1026.25),new Oe(743.75,1041.25),new Oe(892.5,1190),new Oe(1041.25,1338.75),new Oe(446.25,738.75),new Oe(446.25,733.75),new Oe(446.25,728.75),new Oe(1152.8125,334.6875),new Oe(1152.8125,446.25),new Oe(1152.8125,557.8125),new Oe(1227.1875,632.1875),new Oe(1338.75,632.1875),new Oe(1450.3125,632.1875),new Oe(334.6875,1152.8125),new Oe(446.25,1152.8125),new Oe(557.8125,1152.8125),new Oe(632.1875,1227.1875),new Oe(632.1875,1338.75),new Oe(632.1875,1450.3125),new Oe(-148.75,624.75),new Oe(-148.75,714),new Oe(-148.75,1160.25),new Oe(-148.75,1071),new Oe(1933.75,624.75),new Oe(1933.75,714),new Oe(1933.75,1160.25),new Oe(1933.75,1071),new Oe(-297.5,624.75),new Oe(-297.5,714),new Oe(-297.5,803.25),new Oe(-297.5,892.5),new Oe(-297.5,981.75),new Oe(-297.5,1071),new Oe(-297.5,1160.25),new Oe(2082.5,624.75),new Oe(2082.5,714),new Oe(2082.5,803.25),new Oe(2082.5,892.5),new Oe(2082.5,981.75),new Oe(2082.5,1071),new Oe(2082.5,1160.25)],this.rollers=[new Ae(0,297.5,!1),new Ae(297.5,0,!0),new Ae(re-Ae.short_side,1487.5-Ae.long_side,!1),new Ae(1487.5-Ae.long_side,re-Ae.short_side,!0)]}cache(){this.cache_ctx=document.createElement("canvas").getContext("2d"),this.cache_ctx.canvas.width=re,this.cache_ctx.canvas.height=re,this.cache_ctx.strokeStyle=Pe,this.cache_ctx.lineWidth=5.5,this.cache_ctx.lineCap="square",this.cache_ctx.beginPath(),this.cache_ctx.moveTo(25,0),this.cache_ctx.lineTo(re,1760),this.cache_ctx.moveTo(0,25),this.cache_ctx.lineTo(1760,re),this.cache_ctx.moveTo(0,297.5),this.cache_ctx.lineTo(148.75,297.5),this.cache_ctx.moveTo(595,0),this.cache_ctx.lineTo(595,148.75),this.cache_ctx.moveTo(re,1487.5),this.cache_ctx.lineTo(1636.25,1487.5),this.cache_ctx.moveTo(1190,re),this.cache_ctx.lineTo(1190,1636.25),this.cache_ctx.moveTo(1190,0),this.cache_ctx.lineTo(1190,297.5),this.cache_ctx.moveTo(re,595),this.cache_ctx.lineTo(1487.5,595),this.cache_ctx.moveTo(0,1190),this.cache_ctx.lineTo(297.5,1190),this.cache_ctx.moveTo(595,re),this.cache_ctx.lineTo(595,1487.5),this.cache_ctx.stroke(),this.cache_ctx.strokeStyle=Te,this.cache_ctx.lineWidth=12.7,this.cache_ctx.lineCap="round",this.cache_ctx.beginPath(),this.cache_ctx.moveTo(297.5,1190),this.cache_ctx.lineTo(595,1190),this.cache_ctx.lineTo(595,1487.5),this.cache_ctx.stroke(),this.cache_ctx.strokeStyle=Se,this.cache_ctx.beginPath(),this.cache_ctx.moveTo(1190,297.5),this.cache_ctx.lineTo(1190,595),this.cache_ctx.lineTo(1487.5,595),this.cache_ctx.stroke(),this.cache_ctx.strokeStyle="rgb(200, 200, 200)",this.cache_ctx.lineWidth=25.4,this.cache_ctx.lineCap="square",this.cache_ctx.beginPath(),this.cache_ctx.moveTo(1190,0),this.cache_ctx.lineTo(re,595),this.cache_ctx.moveTo(0,1190),this.cache_ctx.lineTo(595,re),this.cache_ctx.stroke();this.cache_ctx.fillStyle=Te,this.cache_ctx.beginPath(),this.cache_ctx.arc(1487.5,297.5,19.9771*5,0,2*Math.PI),this.cache_ctx.closePath(),this.cache_ctx.fill(),this.cache_ctx.fillStyle=Se,this.cache_ctx.beginPath(),this.cache_ctx.arc(297.5,1487.5,19.9771*5,0,2*Math.PI),this.cache_ctx.closePath(),this.cache_ctx.fill()}tick(t,e,n,s,i,o,r,c){if(o&&0==i){if(!this.hasSelection())for(const n of this.discs)if(n.pointInside(t,e)){this.selected_disc=this.discs.indexOf(n);break}this.selected_disc>=0&&this.discs[this.selected_disc].update(n,s,c)}else this.selected_disc=-1;if(!this.hasSelection())for(const n of this.rollers)n.update(t,e,i)}getCursor(t,e){if(this.hasSelection())return ae.GRABBING;{let n=!1;for(const s of this.discs)s.pointInside(t,e)&&(n=!0);if(n)return ae.GRAB;let s=!1;for(const n of this.rollers)n.pointInside(t,e)&&(s=!0);if(s)return ae.POINTER}return ae.NORMAL}saveData(){const t={d:[],r:[]};for(const e of this.discs)t.d.push({x:e.getX(),y:e.getY()});for(const e of this.rollers)t.r.push({s:e.getState()});return t}loadData(t){this.discs.length=0,this.rollers.length=0;for(const e of t.d)this.discs.push(new Oe(e.x,e.y));this.rollers[0]=new Ae(0,297.5,!1,t.r[0].s),this.rollers[1]=new Ae(297.5,0,!0,t.r[1].s),this.rollers[2]=new Ae(re-Ae.short_side,1487.5-Ae.long_side,!1,t.r[2].s),this.rollers[3]=new Ae(1487.5-Ae.long_side,re-Ae.short_side,!0,t.r[3].s)}render(t){t.strokeStyle=Te,t.lineWidth=15,t.lineCap="square",t.beginPath(),t.moveTo(-446.25,148.75),t.lineTo(-74.375,148.75),t.lineTo(-74.375,1636.25),t.lineTo(-446.25,1636.25),t.stroke(),t.strokeStyle=Se,t.beginPath(),t.moveTo(2231.25,148.75),t.lineTo(1859.375,148.75),t.lineTo(1859.375,1636.25),t.lineTo(2231.25,1636.25),t.stroke(),this.rollers.forEach((e=>{e.render(t)})),this.discs.forEach((e=>{e.render(t)}))}render_static(t){this.cache_ctx||this.cache(),t.drawImage(this.cache_ctx.canvas,0,0)}hasSelection(){return this.selected_disc>=0}}})}();