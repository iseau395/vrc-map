!function(){"use strict";function t(){}const e=t=>t;function n(t){return t()}function i(){return Object.create(null)}function s(t){t.forEach(n)}function o(t){return"function"==typeof t}function r(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function c(t,e,n,i){return t[1]&&i?function(t,e){for(const n in e)t[n]=e[n];return t}(n.ctx.slice(),t[1](i(e))):n.ctx}const a="undefined"!=typeof window;let h=a?()=>window.performance.now():()=>Date.now(),l=a?t=>requestAnimationFrame(t):t;const u=new Set;function d(t){u.forEach((e=>{e.c(t)||(u.delete(e),e.f())})),0!==u.size&&l(d)}function f(t,e){t.appendChild(e)}function m(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function _(t){const e=v("style");return function(t,e){f(t.head||t,e)}(m(t),e),e.sheet}function g(t,e,n){t.insertBefore(e,n||null)}function p(t){t.parentNode.removeChild(t)}function v(t){return document.createElement(t)}function y(t){return document.createTextNode(t)}function x(){return y(" ")}function w(){return y("")}function $(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function b(t,e,n,i){null===n?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}const E=new Map;let k,P=0;function I(t,e,n,i,s,o,r,c=0){const a=16.666/i;let h="{\n";for(let t=0;t<=1;t+=a){const i=e+(n-e)*o(t);h+=100*t+`%{${r(i,1-i)}}\n`}const l=h+`100% {${r(n,1-n)}}\n}`,u=`__svelte_${function(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}(l)}_${c}`,d=m(t),{stylesheet:f,rules:g}=E.get(d)||function(t,e){const n={stylesheet:_(e),rules:{}};return E.set(t,n),n}(d,t);g[u]||(g[u]=!0,f.insertRule(`@keyframes ${u} ${l}`,f.cssRules.length));const p=t.style.animation||"";return t.style.animation=`${p?`${p}, `:""}${u} ${i}ms linear ${s}ms 1 both`,P+=1,u}function T(t,e){const n=(t.style.animation||"").split(", "),i=n.filter(e?t=>t.indexOf(e)<0:t=>-1===t.indexOf("__svelte")),s=n.length-i.length;s&&(t.style.animation=i.join(", "),P-=s,P||l((()=>{P||(E.forEach((t=>{const{stylesheet:e}=t;let n=e.cssRules.length;for(;n--;)e.deleteRule(n);t.rules={}})),E.clear())})))}function L(t){k=t}function M(){if(!k)throw new Error("Function called outside component initialization");return k}function S(t,e){const n=t.$$.callbacks[e.type];n&&n.slice().forEach((t=>t.call(this,e)))}const N=[],Y=[],A=[],K=[],X=Promise.resolve();let z=!1;function C(t){A.push(t)}const R=new Set;let O,Z=0;function F(){const t=k;do{for(;Z<N.length;){const t=N[Z];Z++,L(t),B(t.$$)}for(L(null),N.length=0,Z=0;Y.length;)Y.pop()();for(let t=0;t<A.length;t+=1){const e=A[t];R.has(e)||(R.add(e),e())}A.length=0}while(N.length);for(;K.length;)K.pop()();z=!1,R.clear(),L(t)}function B(t){if(null!==t.fragment){t.update(),s(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(C)}}function U(t,e,n){t.dispatchEvent(function(t,e,n=!1){const i=document.createEvent("CustomEvent");return i.initCustomEvent(t,n,!1,e),i}(`${e?"intro":"outro"}${n}`))}const W=new Set;let j;function D(t,e){t&&t.i&&(W.delete(t),t.i(e))}function q(t,e,n,i){if(t&&t.o){if(W.has(t))return;W.add(t),j.c.push((()=>{W.delete(t),i&&(n&&t.d(1),i())})),t.o(e)}}const G={duration:0};function H(n,i,r,c){let a=i(n,r),f=c?0:1,m=null,_=null,g=null;function p(){g&&T(n,g)}function v(t,e){const n=t.b-f;return e*=Math.abs(n),{a:f,b:t.b,d:n,duration:e,start:t.start,end:t.start+e,group:t.group}}function y(i){const{delay:o=0,duration:r=300,easing:c=e,tick:y=t,css:x}=a||G,w={start:h()+o,b:i};i||(w.group=j,j.r+=1),m||_?_=w:(x&&(p(),g=I(n,f,i,r,o,c,x)),i&&y(0,1),m=v(w,r),C((()=>U(n,i,"start"))),function(t){let e;0===u.size&&l(d),new Promise((n=>{u.add(e={c:t,f:n})}))}((t=>{if(_&&t>_.start&&(m=v(_,r),_=null,U(n,m.b,"start"),x&&(p(),g=I(n,f,m.b,m.duration,0,c,a.css))),m)if(t>=m.end)y(f=m.b,1-f),U(n,m.b,"end"),_||(m.b?p():--m.group.r||s(m.group.c)),m=null;else if(t>=m.start){const e=t-m.start;f=m.a+m.d*c(e/m.duration),y(f,1-f)}return!(!m&&!_)})))}return{run(t){o(a)?(O||(O=Promise.resolve(),O.then((()=>{O=null}))),O).then((()=>{a=a(),y(t)})):y(t)},end(){p(),m=_=null}}}function V(t){t&&t.c()}function J(t,e,i,r){const{fragment:c,on_mount:a,on_destroy:h,after_update:l}=t.$$;c&&c.m(e,i),r||C((()=>{const e=a.map(n).filter(o);h?h.push(...e):s(e),t.$$.on_mount=[]})),l.forEach(C)}function Q(t,e){const n=t.$$;null!==n.fragment&&(s(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function tt(t,e){-1===t.$$.dirty[0]&&(N.push(t),z||(z=!0,X.then(F)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function et(e,n,o,r,c,a,h,l=[-1]){const u=k;L(e);const d=e.$$={fragment:null,ctx:null,props:a,update:t,not_equal:c,bound:i(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(n.context||(u?u.$$.context:[])),callbacks:i(),dirty:l,skip_bound:!1,root:n.target||u.$$.root};h&&h(d.root);let f=!1;if(d.ctx=o?o(e,n.props||{},((t,n,...i)=>{const s=i.length?i[0]:n;return d.ctx&&c(d.ctx[t],d.ctx[t]=s)&&(!d.skip_bound&&d.bound[t]&&d.bound[t](s),f&&tt(e,t)),n})):[],d.update(),f=!0,s(d.before_update),d.fragment=!!r&&r(d.ctx),n.target){if(n.hydrate){const t=function(t){return Array.from(t.childNodes)}(n.target);d.fragment&&d.fragment.l(t),t.forEach(p)}else d.fragment&&d.fragment.c();n.intro&&D(e.$$.fragment),J(e,n.target,n.anchor,n.customElement),F()}L(u)}class nt{$destroy(){Q(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function it(t){let e,n,i,s;const o=t[1].default,r=function(t,e,n,i){if(t){const s=c(t,e,n,i);return t[0](s)}}(o,t,t[0],null);return{c(){e=v("div"),r&&r.c(),$(e,"class","svelte-1vayqny")},m(o,c){var a,h,l,u;g(o,e,c),r&&r.m(e,null),n=!0,i||(a=e,h="click",l=t[2],a.addEventListener(h,l,u),s=()=>a.removeEventListener(h,l,u),i=!0)},p(t,[e]){r&&r.p&&(!n||1&e)&&function(t,e,n,i,s,o){if(s){const r=c(e,n,i,o);t.p(r,s)}}(r,o,t,t[0],n?function(t,e,n,i){if(t[2]&&i){const s=t[2](i(n));if(void 0===e.dirty)return s;if("object"==typeof s){const t=[],n=Math.max(e.dirty.length,s.length);for(let i=0;i<n;i+=1)t[i]=e.dirty[i]|s[i];return t}return e.dirty|s}return e.dirty}(o,t[0],e,null):function(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let t=0;t<n;t++)e[t]=-1;return e}return-1}(t[0]),null)},i(t){n||(D(r,t),n=!0)},o(t){q(r,t),n=!1},d(t){t&&p(e),r&&r.d(t),i=!1,s()}}}function st(t,e,n){let{$$slots:i={},$$scope:s}=e;return t.$$set=t=>{"$$scope"in t&&n(0,s=t.$$scope)},[s,i,function(e){S.call(this,t,e)}]}class ot extends nt{constructor(t){super(),et(this,t,st,it,r,{})}}function rt(t){const e=t-1;return e*e*e+1}function ct(t,{delay:e=0,duration:n=400,easing:i=rt,x:s=0,y:o=0,opacity:r=0}={}){const c=getComputedStyle(t),a=+c.opacity,h="none"===c.transform?"":c.transform,l=a*(1-r);return{delay:e,duration:n,easing:i,css:(t,e)=>`\n\t\t\ttransform: ${h} translate(${(1-t)*s}px, ${(1-t)*o}px);\n\t\t\topacity: ${a-l*e}`}}function at(e){let n,i,s;return{c(){n=v("div"),$(n,"class","svelte-1ihgyp3")},m(t,e){g(t,n,e),s=!0},p:t,i(t){s||(C((()=>{i||(i=H(n,ct,{x:200,duration:100},!0)),i.run(1)})),s=!0)},o(t){i||(i=H(n,ct,{x:200,duration:100},!1)),i.run(0),s=!1},d(t){t&&p(n),t&&i&&i.end()}}}class ht extends nt{constructor(t){super(),et(this,t,null,at,r,{})}}function lt(t){let e;return{c(){e=y("≡")},m(t,n){g(t,e,n)},d(t){t&&p(e)}}}function ut(t){let e,n;return e=new ht({}),{c(){V(e.$$.fragment)},m(t,i){J(e,t,i),n=!0},i(t){n||(D(e.$$.fragment,t),n=!0)},o(t){q(e.$$.fragment,t),n=!1},d(t){Q(e,t)}}}function dt(t){let e,n,i,o,r,c,a,h;r=new ot({props:{$$slots:{default:[lt]},$$scope:{ctx:t}}}),r.$on("click",t[1]);let l=t[0]&&ut();return{c(){e=v("div"),n=v("span"),n.innerHTML='<p class="svelte-1uts12u">VRC Field Map</p>',i=x(),o=v("div"),V(r.$$.fragment),c=x(),l&&l.c(),a=w(),$(n,"class","svelte-1uts12u"),$(o,"class","hamburger-button svelte-1uts12u"),$(e,"class","svelte-1uts12u")},m(t,s){g(t,e,s),f(e,n),f(e,i),f(e,o),J(r,o,null),g(t,c,s),l&&l.m(t,s),g(t,a,s),h=!0},p(t,[e]){const n={};4&e&&(n.$$scope={dirty:e,ctx:t}),r.$set(n),t[0]?l?1&e&&D(l,1):(l=ut(),l.c(),D(l,1),l.m(a.parentNode,a)):l&&(j={r:0,c:[],p:j},q(l,1,1,(()=>{l=null})),j.r||s(j.c),j=j.p)},i(t){h||(D(r.$$.fragment,t),D(l),h=!0)},o(t){q(r.$$.fragment,t),q(l),h=!1},d(t){t&&p(e),Q(r),t&&p(c),l&&l.d(t),t&&p(a)}}}function ft(t,e,n){let i=!1;return[i,()=>n(0,i=!i)]}class mt extends nt{constructor(t){super(),et(this,t,ft,dt,r,{})}}const _t=1785;var gt;async function pt(t){switch(t){case gt.TIPPING_POINT:return async function(){return new((await Promise.resolve().then((function(){return St}))).default)}();case gt.SPIN_UP:return async function(){return new((await Promise.resolve().then((function(){return Nt}))).default)}();default:throw new Error(`Unknown game type: ${t}`)}}function vt(e){let n,i,s;return{c(){n=v("canvas"),i=x(),s=v("canvas"),b(n,"z-index","-1"),$(n,"class","svelte-19dzfsr"),b(s,"z-index","0"),$(s,"class","svelte-19dzfsr")},m(t,o){g(t,n,o),e[2](n),g(t,i,o),g(t,s,o),e[3](s)},p:t,i:t,o:t,d(t){t&&p(n),e[2](null),t&&p(i),t&&p(s),e[3](null)}}}function yt(t,e,n){let i,s;const o=(r=Symbol.for("game"),M().$$.context.get(r));var r;let c,a,h=!0;var l;return window.onbeforeunload=function(){return!0},l=async()=>{const t=i.getContext("2d",{alpha:!1}),e=s.getContext("2d",{alpha:!0}),r=new((await Promise.resolve().then((function(){return Yt}))).default)(s),l=new((await Promise.resolve().then((function(){return At}))).default)(window.innerWidth,window.innerHeight-50),u=await pt(o),d=()=>{n(0,i.width=window.innerWidth,i),n(0,i.height=window.innerHeight-50,i),n(1,s.width=window.innerWidth,s),n(1,s.height=window.innerHeight-50,s),h=!0,f()};function f(){(l.changed()||h)&&(t.fillStyle="rgb(80, 80, 80)",t.fillRect(0,0,i.width,i.height),t.save(),l.translate(t),l.render(t),u.render_static(t),t.restore(),h=!1),e.clearRect(0,0,s.width,s.height),e.save(),l.translate(e),u.render(e),e.restore(),a=requestAnimationFrame(f)}function m(){const t=(r.mouseX-l.x)/l.zoom,e=(r.mouseY-l.y)/l.zoom;l.tick(r.dragX,r.dragY,r.zoom),u.tick(t,e,r.mouseButton,r.shiftKey,r.deltaScroll)}window.addEventListener("resize",d),c=setInterval(m,20),m(),d()},M().$$.on_mount.push(l),function(t){M().$$.on_destroy.push(t)}((()=>{clearInterval(c),cancelAnimationFrame(a)})),[i,s,function(t){Y[t?"unshift":"push"]((()=>{i=t,n(0,i)}))},function(t){Y[t?"unshift":"push"]((()=>{s=t,n(1,s)}))}]}!function(t){t[t.TIPPING_POINT=0]="TIPPING_POINT",t[t.SPIN_UP=1]="SPIN_UP"}(gt||(gt={}));class xt extends nt{constructor(t){super(),et(this,t,yt,vt,r,{})}}function wt(e){let n;return{c(){n=v("p"),n.textContent="It looks like you are on a touchscreen only device like a phone or tablet.\r\n    As this field map doesn't work on touchscreen devices (yet), so try to instead use a computer.",$(n,"class","svelte-48ahf8")},m(t,e){g(t,n,e)},i:t,o:t,d(t){t&&p(n)}}}function $t(t){let e,n;return e=new xt({}),{c(){V(e.$$.fragment)},m(t,i){J(e,t,i),n=!0},i(t){n||(D(e.$$.fragment,t),n=!0)},o(t){q(e.$$.fragment,t),n=!1},d(t){Q(e,t)}}}function bt(e){let n,i,s,o,r,c;n=new mt({});const a=[$t,wt],h=[];return s=function(t,e){return t[0]?0:1}(e),o=h[s]=a[s](e),{c(){V(n.$$.fragment),i=x(),o.c(),r=w()},m(t,e){J(n,t,e),g(t,i,e),h[s].m(t,e),g(t,r,e),c=!0},p:t,i(t){c||(D(n.$$.fragment,t),D(o),c=!0)},o(t){q(n.$$.fragment,t),q(o),c=!1},d(t){Q(n,t),t&&p(i),h[s].d(t),t&&p(r)}}}function Et(t){return["onmousemove"in window]}new class extends nt{constructor(t){super(),et(this,t,Et,bt,r,{})}}({target:document.body,context:new Map([[Symbol.for("game"),gt.TIPPING_POINT]])});class kt extends class{constructor(t,e,n){this.x=t,this.y=e,this.r=n}pointInside(t,e){throw new Error("Unimplimented")}update(t,e,n){if(this.x=t,this.y=e,n/=1.25,!this.rotate_step)throw new Error("Missing rotate_step!");this.r+=Math.floor(n/this.rotate_step)*this.rotate_step}render(t){throw new Error("Unimplimented")}}{pointInside(t,e){if(!this.diameter)throw new Error("Missing diameter!");return(t-this.x)**2+(e-this.y)**2<=(5*this.diameter)**2}}const Pt="rgb(255, 0, 0)",It="rgb(0, 0, 255)";var Tt;!function(t){t[t.RED_ALLIANCE=0]="RED_ALLIANCE",t[t.BLUE_ALLIANCE=1]="BLUE_ALLIANCE",t[t.NEUTRAL=2]="NEUTRAL"}(Tt||(Tt={}));class Lt extends kt{constructor(t,e,n,i){super(t,e,n),this.diameter=33,this.rotate_step=90,this.variation=i}drawMogo(t){switch(this.variation){case 0:t.fillStyle=Pt;break;case 1:t.fillStyle=It;break;case 2:t.fillStyle="rgb(255, 255, 0)"}t.strokeStyle="rgb(50, 50, 50)",t.lineWidth=2.5,function(t,e,n,i,s,o){const r=2*Math.PI/i,c=Math.PI+s/360*(2*Math.PI);o.beginPath();for(let s=0;s<=i;s++){const i=s*r+c;o.lineTo(t+n*Math.cos(i),e+n*Math.sin(i))}o.fill(),o.stroke(),o.closePath()}(this.diameter/2*5,this.diameter/2*5,this.diameter/2*5,7,4*Math.PI,t)}render(t){switch(this.variation){case Tt.RED_ALLIANCE:Lt.red_cache||(Lt.red_cache=document.createElement("canvas").getContext("2d"),Lt.red_cache.canvas.width=5*this.diameter,Lt.red_cache.canvas.height=5*this.diameter,this.drawMogo(Lt.red_cache)),t.save(),t.translate(this.x,this.y),t.rotate(this.r),t.drawImage(Lt.red_cache.canvas,-this.diameter/2*5,-this.diameter/2*5),t.restore();break;case Tt.BLUE_ALLIANCE:Lt.blue_cache||(Lt.blue_cache=document.createElement("canvas").getContext("2d"),Lt.blue_cache.canvas.width=5*this.diameter,Lt.blue_cache.canvas.height=5*this.diameter,this.drawMogo(Lt.blue_cache)),t.save(),t.translate(this.x,this.y),t.rotate(this.r),t.drawImage(Lt.blue_cache.canvas,-this.diameter/2*5,-this.diameter/2*5),t.restore();break;case Tt.NEUTRAL:Lt.neutral_cache||(Lt.neutral_cache=document.createElement("canvas").getContext("2d"),Lt.neutral_cache.canvas.width=5*this.diameter,Lt.neutral_cache.canvas.height=5*this.diameter,this.drawMogo(Lt.neutral_cache)),t.save(),t.translate(this.x,this.y),t.rotate(this.r),t.drawImage(Lt.neutral_cache.canvas,-this.diameter/2*5,-this.diameter/2*5),t.restore()}}}class Mt extends kt{constructor(){super(...arguments),this.diameter=5.23875,this.rotate_step=1}render(t){t.strokeStyle="rgb(200, 100, 200)",t.lineWidth=13.4925,t.beginPath(),t.arc(this.x,this.y,19.44625,0,2*Math.PI),t.stroke(),t.fill}}var St=Object.freeze({__proto__:null,default:class{constructor(){this.selection={arr:-1,index:-1},this.mogos=[new Lt(446.25,1636.25,90,0),new Lt(148.75,557.8125,0,0),new Lt(1338.75,148.75,270,1),new Lt(1636.25,1227.1875,180,1),new Lt(892.5,446.25,180,2),new Lt(892.5,892.5,180,2),new Lt(892.5,1338.75,0,2)],this.rings=[new Mt(50,50,0)]}drawPlatform(t,e,n,i){const s=673.1,o=254;t+=27.625000000000014,e-=40,i.strokeStyle=n,i.lineCap="butt",i.lineWidth=20,i.beginPath(),i.moveTo(t+o/9,e+84.1375),i.lineTo(t+o-o/9,e+84.1375),i.lineTo(t+o-o/9,e+588.9625),i.lineTo(t+o/9,e+588.9625),i.lineTo(t+o/9,e+84.1375-i.lineWidth/2),i.stroke(),i.fillStyle="rgba(255, 255, 255, 0.12)",i.fillRect(t,e,o,s),i.strokeStyle="rgb(0, 0, 0)",i.lineWidth=1.5,i.beginPath(),i.moveTo(t+o+1,e),i.lineTo(t+o+1,e+s),i.moveTo(t-1,e),i.lineTo(t-1,e+s),i.stroke()}cache(){this.cache_ctx=document.createElement("canvas").getContext("2d"),this.cache_ctx.canvas.width=_t,this.cache_ctx.canvas.height=_t,this.cache_ctx.strokeStyle="rgb(255, 255, 255)",this.cache_ctx.lineWidth=5.5,this.cache_ctx.beginPath(),this.cache_ctx.moveTo(595,0),this.cache_ctx.lineTo(595,_t),this.cache_ctx.moveTo(887.5,0),this.cache_ctx.lineTo(887.5,_t),this.cache_ctx.moveTo(897.5,0),this.cache_ctx.lineTo(897.5,_t),this.cache_ctx.moveTo(1190,0),this.cache_ctx.lineTo(1190,_t),this.cache_ctx.moveTo(1190,297.5),this.cache_ctx.lineTo(1487.5,0),this.cache_ctx.moveTo(595,1487.5),this.cache_ctx.lineTo(297.5,_t),this.cache_ctx.stroke(),this.drawPlatform(0,595,Pt,this.cache_ctx),this.drawPlatform(1487.5,595,It,this.cache_ctx)}tick(t,e,n,i,s){if(i&&0==n){if(-1==this.selection.arr){for(const n of this.mogos)if(n.pointInside(t,e)){this.selection.arr=0,this.selection.index=this.mogos.indexOf(n);break}for(const n of this.rings)if(n.pointInside(t,e)){this.selection.arr=1,this.selection.index=this.rings.indexOf(n);break}}0==this.selection.arr&&this.mogos[this.selection.index].update(t,e,s),1==this.selection.arr&&this.rings[this.selection.index].update(t,e,s)}else this.selection.arr=-1,this.selection.index=-1}render(t){this.mogos.forEach((e=>e.render(t))),this.rings.forEach((e=>e.render(t)))}render_static(t){this.cache_ctx||this.cache(),t.drawImage(this.cache_ctx.canvas,0,0)}}});var Nt=Object.freeze({__proto__:null,default:class{cache(){this.cache_ctx=document.createElement("canvas").getContext("2d"),this.cache_ctx.canvas.width=_t,this.cache_ctx.canvas.height=_t}tick(t,e,n){}render(t){}render_static(t){this.cache_ctx||this.cache(),t.drawImage(this.cache_ctx.canvas,0,0)}}});var Yt=Object.freeze({__proto__:null,default:class{constructor(t){this._dragX=0,this._dragY=0,this._mouseButton=-1,this._zoom=1,this._deltaScroll=0,this._mouseX=0,this._mouseY=0,this._altKey=!1,this._ctrlKey=!1,this._shiftKey=!1,t.addEventListener("mousemove",(t=>this.mousemove(t))),t.addEventListener("mousedown",(t=>this.mousedown(t))),t.addEventListener("mouseup",(t=>this.mouseup(t))),t.addEventListener("wheel",(t=>this.wheel(t))),t.addEventListener("scroll",(t=>this.scroll(t))),window.addEventListener("keydown",(t=>this.keydown(t))),window.addEventListener("keyup",(t=>this.keyup(t)))}mousemove(t){(1==this._mouseButton||0==this._mouseButton&&this._altKey)&&(this._dragX+=t.movementX,this._dragY+=t.movementY),this._mouseX=t.x,this._mouseY=t.y-50}mousedown(t){this._mouseButton=t.button}mouseup(t){this._mouseButton=-1}wheel(t){this._shiftKey||(this._zoom+=-.002*t.deltaY,this._zoom=Math.min(Math.max(.125,this._zoom),4)),this._deltaScroll+=t.deltaY}scroll(t){t.preventDefault()}keydown(t){this._altKey=t.altKey,this._ctrlKey=t.ctrlKey,this._shiftKey=t.shiftKey}keyup(t){this._altKey=t.altKey,this._ctrlKey=t.ctrlKey,this._shiftKey=t.shiftKey}get dragX(){const t=this._dragX;return this._dragX=0,t}get dragY(){const t=this._dragY;return this._dragY=0,t}get zoom(){const t=this._zoom;return this._zoom=1,t}get deltaScroll(){const t=this._deltaScroll;return this._deltaScroll=0,t}get mouseButton(){return this._mouseButton}get mouseX(){return this._mouseX}get mouseY(){return this._mouseY}get altKey(){return this._altKey}get ctrlKey(){return this._ctrlKey}get shiftKey(){return this._shiftKey}}});var At=Object.freeze({__proto__:null,default:class{constructor(t,e){this.fieldZoom=.065,this.prevFieldZoom=this.fieldZoom,this.fieldX=t/2-_t*this.fieldZoom*3.05,this.fieldY=e/2-_t*this.fieldZoom*3.05,this.prevFieldX=this.fieldX,this.prevFieldY=this.fieldY}tick(t,e,n){this.fieldX+=t,this.fieldY+=e,this.fieldX=Math.floor(this.fieldX),this.fieldY=Math.floor(this.fieldY),this.fieldZoom*=n,this.fieldZoom=Math.min(Math.max(.4,this.fieldZoom),1.5)}translate(t){t.translate(this.fieldX,this.fieldY),t.scale(this.fieldZoom,this.fieldZoom)}render(t){this.cache_ctx||this.cache(),t.drawImage(this.cache_ctx.canvas,0,0)}changed(){const t=this.fieldX!=this.prevFieldX||this.fieldY!=this.prevFieldY||this.fieldZoom!=this.prevFieldZoom;return this.prevFieldX=this.fieldX,this.prevFieldY=this.fieldY,this.prevFieldZoom=this.fieldZoom,t}cache(){this.cache_ctx=document.createElement("canvas").getContext("2d"),this.cache_ctx.canvas.width=_t,this.cache_ctx.canvas.height=_t,this.cache_ctx.fillStyle="rgb(159, 159, 159)",this.cache_ctx.fillRect(0,0,_t,_t),this.cache_ctx.beginPath();for(let t=0;t<6;t++)this.cache_ctx.moveTo(297.5*(t+1),0),this.cache_ctx.lineTo(297.5*(t+1),_t);for(let t=0;t<6;t++)this.cache_ctx.moveTo(0,297.5*(t+1)),this.cache_ctx.lineTo(_t,297.5*(t+1));this.cache_ctx.strokeStyle="rgba(100, 100, 100, 0.2)",this.cache_ctx.lineWidth=5,this.cache_ctx.stroke()}get zoom(){return this.fieldZoom}get x(){return this.fieldX}get y(){return this.fieldY}}})}();
