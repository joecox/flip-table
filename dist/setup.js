import{a as h,b as D}from"./chunk-NG2YUV46.js";import{a as m,b as c,c as u}from"./chunk-5SGWBU2F.js";import{b as y}from"./chunk-EK7ODJWE.js";function Y(){let e=document.createElement("button");e.style.position="fixed",e.style.zIndex="9999",e.style.top="10px",e.style.left="10px",e.style.display="none",e.innerText="Put table back \u252C\u2500\u252C\u30CE( \xBA _ \xBA\u30CE)",e.addEventListener("click",()=>{document.dispatchEvent(c),e.style.display="none"}),document.addEventListener(m.type,()=>{e.style.removeProperty("display")}),document.addEventListener(u.type,()=>{e.style.removeProperty("display")}),document.body.append(e)}var T=new CSSStyleSheet;document.adoptedStyleSheets=[...document.adoptedStyleSheets,T];function F(){T.replaceSync(`
    body {
      overflow: hidden;
    }
  `)}function z(){T.replaceSync("")}var o=y(h());var b=y(h());var N={x:.1,y:2.1};function G(e,t,n){let{x:i,y:r,height:l}=n.getBoundingClientRect(),a=i+window.pageXOffset,s=document.createElement("div");s.innerText="(-\u25A0_\u25A0)",s.className="table-flip-flipper",s.style.top=`${r+window.pageYOffset+l-40}px`,s.style.left="-200px",document.body.append(s),document.addEventListener(c.type,()=>{s.remove()}),b.Events.on(e,"beforeUpdate",p=>{p.timestamp>0&&p.timestamp<666?s.style.left=`${a*.33-200}px`:p.timestamp>666&&p.timestamp<1333?s.style.left=`${a*.66-200}px`:p.timestamp>1333&&p.timestamp<2e3?s.style.left=`${a-200}px`:p.timestamp>2e3&&t.angle<.75?(s.innerText="(\u30CE\u0CA0\u76CA\u0CA0)\u30CE",s.style.animation="0.2s shake infinite",it(t)):(s.innerText="(\u30CE\xB0\u25A1\xB0)\u30CE",s.style.removeProperty("animation"))})}var P=new CSSStyleSheet;P.replaceSync(`
  @keyframes shake {
    0% { transform: translate(1px, 1px) rotate(0deg); }
    10% { transform: translate(-1px, -2px) rotate(-1deg); }
    20% { transform: translate(-3px, 0px) rotate(1deg); }
    30% { transform: translate(3px, 2px) rotate(0deg); }
    40% { transform: translate(1px, -1px) rotate(1deg); }
    50% { transform: translate(-1px, 2px) rotate(-1deg); }
    60% { transform: translate(-3px, 1px) rotate(0deg); }
    70% { transform: translate(3px, 1px) rotate(-1deg); }
    80% { transform: translate(-1px, -1px) rotate(1deg); }
    90% { transform: translate(1px, 2px) rotate(0deg); }
    100% { transform: translate(1px, -2px) rotate(-1deg); }
  }

  .table-flip-flipper {
    font-size: 40px;
    font-family: system-ui;
    transition: all 0.2s;
    position: absolute;
  }
`);document.adoptedStyleSheets=[...document.adoptedStyleSheets,P];function it(e){b.Body.applyForce(e,{x:e.bounds.max.x+10,y:e.bounds.max.y},N)}var X=y(h());function S(e,t){let{x:n,y:i,width:r,height:l}=e.getBoundingClientRect(),a=n+r/2,s=i+l/2;return X.Bodies.rectangle(a,s,r,l,t)}var E=y(h());function O(e,t){return e.group===t.group&&e.group!==0?e.group>0:!e.collidesWith||!t.collidesWith?!1:e.collidesWith?.includes(t.group)&&t.collidesWith?.includes(e.group)}var C=E.Body.nextGroup(!1),q=E.Body.nextGroup(!1),v=E.Body.nextGroup(!1),I={group:C,collidesWith:[q,v]},_={group:q,collidesWith:[C]};function J(e){return{group:v,collidesWith:[e,C]}}function U(e){return{group:e,collidesWith:[v]}}function R(e){return Array.from(e.children).filter(t=>t instanceof HTMLElement).flatMap(t=>{if(t.nodeType!==Node.ELEMENT_NODE)return;if(t.nodeName==="svg")return t;if(t.children.length)return R(t);let n=window.getComputedStyle(t);if(!(n.display==="none"||n.visibility==="hidden")&&(t.textContent||t.nodeName==="img"))return t}).filter(t=>t!==void 0)}o.Detector.canCollide=O;var x=class{engine;runner;renderer;constructor(){this.engine=o.Engine.create(),this.runner=o.Runner.create()}flip(t,n){this.renderer=new n(this.engine);let{bottom:i}=t.getBoundingClientRect(),r=20,l=o.Bodies.rectangle(window.innerWidth/2,i+r/2,window.innerWidth*2,r,{isStatic:!0});l.collisionFilter=I;let a=S(t,{mass:80,inverseMass:1/80});a.collisionFilter=_;let s=o.Composite.create({label:"table",bodies:[a]}),p=R(t),H=[],$=[];for(let L of p){let V=o.Body.nextGroup(!1),W=Math.random()*4+1,f=S(L,{label:"leaf",mass:W,inverseMass:1/W});o.Body.scale(f,.8,.9,{x:f.position.x,y:f.bounds.max.y}),f.collisionFilter=J(V),H.push(f),$.push({body:f,elem:L});let{left:tt,bottom:et,width:A}=L.getBoundingClientRect(),d=o.Bodies.rectangle(tt+A/2,et,A,1,{label:"shelf",density:.1});d.collisionFilter=U(V);let nt=o.Constraint.create({bodyA:a,bodyB:d,pointA:{x:d.bounds.min.x-a.position.x,y:d.position.y-a.position.y},pointB:{x:d.bounds.min.x-d.position.x,y:0},length:0}),ot=o.Constraint.create({bodyA:a,bodyB:d,pointA:{x:d.bounds.max.x-a.position.x,y:d.position.y-a.position.y},pointB:{x:d.bounds.max.x-d.position.x,y:0},length:0});o.Composite.add(s,d),o.Composite.add(s,nt),o.Composite.add(s,ot)}o.Composite.add(this.engine.world,[s,...H,l]),G(this.engine,a,t),this.renderer.start({body:a,elem:t},$),o.Runner.run(this.runner,this.engine)}stop(){this.renderer?.stop(),o.Runner.stop(this.runner),o.World.clear(this.engine.world,!1),o.Engine.clear(this.engine),this.engine.timing={...this.engine.timing,timestamp:0,lastDelta:0,lastElapsed:0}}};var M=y(h());var w=class extends D{#t;#e=[];start(t,n){let i=new B(t.elem,t.body);this.#e.push(i),this.#e.push(...n.map(r=>new B(r.elem,r.body,i))),this.#t=requestAnimationFrame(()=>this.#n())}#n(){for(let t of this.#e)t.render();this.#t=requestAnimationFrame(()=>this.#n())}stop(){this.#t&&cancelAnimationFrame(this.#t);for(let t of this.#e)t.reset()}},B=class{elem;container;body;#t;#e;#n;#o;#i;constructor(t,n,i){this.elem=t,this.container=i,this.body=n;let{x:r,y:l,width:a,height:s}=t.getBoundingClientRect();this.#e=a,this.#t=s,this.#n=M.Vector.create(r,l),this.#o=M.Vector.create(r+a/2,l+s/2),this.#i=this.elem.style.cssText,this.elem.style.position="relative",this.elem.style.transition="none"}render(){let{parentRotationTranslation:t,parentRotation:n,parentTranslation:i,translation:r,rotation:l}=this.transform();this.elem.style.transform=`
      rotate(${-n}rad)
      translate(${-t.x}px, ${-t.y}px)
      translate(${-i.x}px, ${-i.y}px)
      translate(${r.x}px, ${r.y}px)
      rotate(${l}rad)
    `}transform(){let t;if(this.container){let n=this.#o.x-this.container.#o.x,i=this.#o.y-this.container.#o.y,r=this.container.body.angle,[l,a]=[n*Math.cos(r)-i*Math.sin(r),n*Math.sin(r)+i*Math.cos(r)];t={x:l-n,y:a-i}}return{parentRotationTranslation:t||M.Vector.create(0,0),parentRotation:this.container?.body.angle||0,parentTranslation:{x:this.container?.translateX()||0,y:this.container?.translateY()||0},translation:{x:this.translateX(),y:this.translateY()},rotation:this.body.angle}}translateX(){return this.body.position.x-this.#n.x-this.#e/2}translateY(){return this.body.position.y-this.#n.y-this.#t/2}reset(){this.elem.style.cssText=this.#i}};var g;async function Q(e=!1){if(document.addEventListener(m.type,t=>{t.target instanceof HTMLElement&&(F(),g=new x,g.flip(t.target,w))}),e){let{DebugRenderer:t}=await import("./debug-X4753CP6.js");document.addEventListener(u.type,n=>{n.target instanceof HTMLElement&&(F(),g=new x,g.flip(n.target,t))})}document.addEventListener(c.type,()=>{z(),g?.stop()})}var Z=new CSSStyleSheet;Z.replaceSync(`
  :root {
    --flip-button-height: 50px;
    --flip-button-width: 100px;
  }
  .flip-button {
    all: initial;

    position: absolute;
    cursor: pointer;
    border: none;
    outline: 1px dotted yellow;
    outline-width: 3px;
    outline-offset: -5px;
    border-radius: 4px;
    background-color: red;
    font-size: 20px;
    font-family: system-ui;
    color: white;
    height: var(--flip-button-height);
    width: var(--flip-button-width);

    &:hover {
      filter: brightness(85%);
    }
  }
`);document.adoptedStyleSheets=[...document.adoptedStyleSheets,Z];function st(e){let t=document.createElement("button");t.innerText="Flip Me",t.className="flip-button";let{x:n,y:i}=e.getBoundingClientRect();return t.style.left=`calc(${n+window.pageXOffset}px - var(--flip-button-width) + 20px)`,t.style.top=`calc(${i+window.pageYOffset}px - var(--flip-button-height) + 20px)`,t.addEventListener("click",()=>{e.dispatchEvent(m)}),document.addEventListener(m.type,()=>{t.style.display="none"}),document.addEventListener(u.type,()=>{t.style.display="none"}),document.addEventListener(c.type,()=>{t.style.removeProperty("display")}),t}function k(e,t=st){let n=t(e);document.body.append(n)}async function Wt({tableSelector:e,debug:t=!1}){let n=document.querySelectorAll(e);for(let i of n)if(i instanceof HTMLElement&&(k(i),t)){let{makeDebugButton:r}=await import("./debug-MVXKYX3G.js");k(i,r)}Y(),await Q(t),console.log("%cYOU MAY FLIP WHEN READY \u{1FAE1}","background-color: aquamarine; color: black; font-size: 2rem"),console.log("%cFor best results, close DevTools before flipping.","font-style: italic; font-size: 1.2rem")}export{Wt as setup};
