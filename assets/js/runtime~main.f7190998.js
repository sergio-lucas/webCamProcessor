(()=>{"use strict";var e,t,a,r,o,f={},d={};function n(e){var t=d[e];if(void 0!==t)return t.exports;var a=d[e]={id:e,loaded:!1,exports:{}};return f[e].call(a.exports,a,a.exports,n),a.loaded=!0,a.exports}n.m=f,n.c=d,e=[],n.O=(t,a,r,o)=>{if(!a){var f=1/0;for(i=0;i<e.length;i++){a=e[i][0],r=e[i][1],o=e[i][2];for(var d=!0,c=0;c<a.length;c++)(!1&o||f>=o)&&Object.keys(n.O).every((e=>n.O[e](a[c])))?a.splice(c--,1):(d=!1,o<f&&(f=o));if(d){e.splice(i--,1);var b=r();void 0!==b&&(t=b)}}return t}o=o||0;for(var i=e.length;i>0&&e[i-1][2]>o;i--)e[i]=e[i-1];e[i]=[a,r,o]},n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},a=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__,n.t=function(e,r){if(1&r&&(e=this(e)),8&r)return e;if("object"==typeof e&&e){if(4&r&&e.__esModule)return e;if(16&r&&"function"==typeof e.then)return e}var o=Object.create(null);n.r(o);var f={};t=t||[null,a({}),a([]),a(a)];for(var d=2&r&&e;"object"==typeof d&&!~t.indexOf(d);d=a(d))Object.getOwnPropertyNames(d).forEach((t=>f[t]=()=>e[t]));return f.default=()=>e,n.d(o,f),o},n.d=(e,t)=>{for(var a in t)n.o(t,a)&&!n.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})},n.f={},n.e=e=>Promise.all(Object.keys(n.f).reduce(((t,a)=>(n.f[a](e,t),t)),[])),n.u=e=>"assets/js/"+({38:"3e32758f",53:"935f2afb",77:"2854e535",85:"1f391b9e",98:"763aa50f",159:"b0b03649",183:"4b84f6d5",193:"f55d3e7a",226:"707baeff",237:"1df93b7f",238:"eaea2bee",255:"70101f2a",414:"393be207",504:"822bd8ab",514:"1be78505",516:"b905ed40",523:"54a87783",538:"296d4827",589:"5c868d36",597:"5e8c322a",607:"533a09ca",671:"0e384e19",755:"e44a2883",792:"dff1c289",799:"30c3fc85",818:"1e4232ab",859:"18c41134",918:"17896441",971:"abb64d4a"}[e]||e)+"."+{38:"6ae511a1",53:"499456fc",77:"87c31844",85:"1fa38a83",98:"f2faf943",159:"1dcd8d7a",183:"8b4b086f",193:"4d9e4668",226:"59239242",237:"0584e114",238:"377d1096",255:"1ed7fd5d",414:"915d904a",504:"da4bb820",514:"2255e213",516:"b05ff8d3",523:"167e6e08",538:"f18720b9",589:"dafac84a",597:"7e751891",607:"da4ccd3e",666:"73cab8a2",671:"b12c8e4b",755:"c4381aa5",792:"a043669b",799:"287c9dc9",818:"154fe916",859:"8de1d82d",918:"7c8a903f",971:"0a6e1ce3",972:"2eb0d7f7"}[e]+".js",n.miniCssF=e=>{},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r={},o="my-website:",n.l=(e,t,a,f)=>{if(r[e])r[e].push(t);else{var d,c;if(void 0!==a)for(var b=document.getElementsByTagName("script"),i=0;i<b.length;i++){var u=b[i];if(u.getAttribute("src")==e||u.getAttribute("data-webpack")==o+a){d=u;break}}d||(c=!0,(d=document.createElement("script")).charset="utf-8",d.timeout=120,n.nc&&d.setAttribute("nonce",n.nc),d.setAttribute("data-webpack",o+a),d.src=e),r[e]=[t];var l=(t,a)=>{d.onerror=d.onload=null,clearTimeout(s);var o=r[e];if(delete r[e],d.parentNode&&d.parentNode.removeChild(d),o&&o.forEach((e=>e(a))),t)return t(a)},s=setTimeout(l.bind(null,void 0,{type:"timeout",target:d}),12e4);d.onerror=l.bind(null,d.onerror),d.onload=l.bind(null,d.onload),c&&document.head.appendChild(d)}},n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.p="/webCamProcessor/",n.gca=function(e){return e={17896441:"918","3e32758f":"38","935f2afb":"53","2854e535":"77","1f391b9e":"85","763aa50f":"98",b0b03649:"159","4b84f6d5":"183",f55d3e7a:"193","707baeff":"226","1df93b7f":"237",eaea2bee:"238","70101f2a":"255","393be207":"414","822bd8ab":"504","1be78505":"514",b905ed40:"516","54a87783":"523","296d4827":"538","5c868d36":"589","5e8c322a":"597","533a09ca":"607","0e384e19":"671",e44a2883:"755",dff1c289:"792","30c3fc85":"799","1e4232ab":"818","18c41134":"859",abb64d4a:"971"}[e]||e,n.p+n.u(e)},(()=>{var e={303:0,532:0};n.f.j=(t,a)=>{var r=n.o(e,t)?e[t]:void 0;if(0!==r)if(r)a.push(r[2]);else if(/^(303|532)$/.test(t))e[t]=0;else{var o=new Promise(((a,o)=>r=e[t]=[a,o]));a.push(r[2]=o);var f=n.p+n.u(t),d=new Error;n.l(f,(a=>{if(n.o(e,t)&&(0!==(r=e[t])&&(e[t]=void 0),r)){var o=a&&("load"===a.type?"missing":a.type),f=a&&a.target&&a.target.src;d.message="Loading chunk "+t+" failed.\n("+o+": "+f+")",d.name="ChunkLoadError",d.type=o,d.request=f,r[1](d)}}),"chunk-"+t,t)}},n.O.j=t=>0===e[t];var t=(t,a)=>{var r,o,f=a[0],d=a[1],c=a[2],b=0;if(f.some((t=>0!==e[t]))){for(r in d)n.o(d,r)&&(n.m[r]=d[r]);if(c)var i=c(n)}for(t&&t(a);b<f.length;b++)o=f[b],n.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return n.O(i)},a=self.webpackChunkmy_website=self.webpackChunkmy_website||[];a.forEach(t.bind(null,0)),a.push=t.bind(null,a.push.bind(a))})()})();