!function(e){var t={};function n(r){if(t[r])return t[r].exports;var a=t[r]={i:r,l:!1,exports:{}};return e[r].call(a.exports,a,a.exports,n),a.l=!0,a.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)n.d(r,a,function(t){return e[t]}.bind(null,a));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t){window.Cap=function(){var e=[],t=0;this.results=e;var n={v:function(e){this.v=parseFloat(e.line[e.line.length-1]),this.tick=function(e,t,n){}},r:function(e){this.r=parseFloat(e.line[e.line.length-1]),this.tick=function(e,t,n){}},c:function(e){var t=this;this.C=parseFloat(e.line[3]),this.v=0,this.i=0,this.tick=function(e,n,r){var a=n["i#"+e.name];t.v+=1/t.C*a*r,t.i=a}},l:function(e){var t=this;this.L=parseFloat(e.line[3]),this.v=0,this.i=0,this.tick=function(e,n,r){n["i#"+e.name];var a=n[e.nodes[0]];t.i,t.v=a,t.i-=1/t.L*t.v*r}}};this.parse=(e=>{var t={};return t.parsedElements=e.map(e=>e.split(" ").filter(e=>""!==e)).map(e=>{var t=e[0][0],r={line:e,nodes:[e[1],e[2]],value:void 0,name:e[0],type:t,connections:[],state:void 0};return r.state=n[t]?new n[t](r):null,r}),t.elements={},t.parsedElements.map(e=>t.elements[e.name]=e),t.parsedElements.map(e=>{t.parsedElements.filter(t=>t.name!==e.name).map(t=>{for(var n=0;n<t.nodes.length;n++){var r=t.nodes[n];-1!==e.nodes.indexOf(r)&&e.connections.push({el:t,on:r})}})}),t.allNodes=[],t.parsedElements.map(e=>e.nodes.map(e=>t.allNodes.push(e))),t.voltageSources=t.parsedElements.filter(e=>-1!==["v","c"].indexOf(e.type)),t.voltageSources.map(e=>{t.allNodes.push("i#"+e.name)}),t.currNodes=t.allNodes.filter((e,t,n)=>n.indexOf(e)===t&&"0"!==e),t}),this.simulate=function(n,r){var a={},i=[];a.Ymx=[],a.Imx=[],n.currNodes.map((e,t)=>{for(var r={},s=0;s<n.currNodes.length;s++)r[n.currNodes[s]]=0;var o=0;n.parsedElements.filter(t=>-1!==t.nodes.indexOf(e)).map(t=>{-1!==["i","l"].indexOf(t.type)&&(o+=t.state.i),-1!==["v","c"].indexOf(t.type)&&(r["i#"+t.name]=t.nodes[0]===e?1:-1),-1!==["r"].indexOf(t.type)&&(r[e]+=1/t.state.r,t.nodes.filter(t=>t!==e&"0"!==t).map(e=>r[e]-=1/t.state.r))}),i.push(r);var l=n.currNodes.map(e=>r[e]);a.Ymx.push(l),a.Imx.push(o)});var s=a.Imx.length-n.voltageSources.length,o=a.Ymx.map(e=>e.slice(s)),l=o[0].map((e,t)=>o.map(e=>e[t]));n.voltageSources.map((e,t)=>{a.Imx[t+s]=e.state.v,a.Ymx[t+s]=l[t]});var u={};return numeric.solve(a.Ymx,a.Imx).map((e,t)=>u[n.currNodes[t]]=e),e.push({time:t,data:u}),n.parsedElements.map(e=>{e.state&&e.state.tick(e,u,r)}),t+=r,u}}}]);