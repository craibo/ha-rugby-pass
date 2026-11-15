var z=globalThis,B=z.ShadowRoot&&(z.ShadyCSS===void 0||z.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Q=Symbol(),pt=new WeakMap,S=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==Q)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(B&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=pt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&pt.set(e,t))}return t}toString(){return this.cssText}},mt=i=>new S(typeof i=="string"?i:i+"",void 0,Q),T=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((s,n,r)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+i[r+1],i[0]);return new S(e,i,Q)},gt=(i,t)=>{if(B)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),n=z.litNonce;n!==void 0&&s.setAttribute("nonce",n),s.textContent=e.cssText,i.appendChild(s)}},G=B?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return mt(e)})(i):i;var{is:Dt,defineProperty:zt,getOwnPropertyDescriptor:Bt,getOwnPropertyNames:jt,getOwnPropertySymbols:It,getPrototypeOf:Ft}=Object,j=globalThis,ft=j.trustedTypes,Wt=ft?ft.emptyScript:"",qt=j.reactiveElementPolyfillSupport,k=(i,t)=>i,Z={toAttribute(i,t){switch(t){case Boolean:i=i?Wt:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},yt=(i,t)=>!Dt(i,t),_t={attribute:!0,type:String,converter:Z,reflect:!1,useDefault:!1,hasChanged:yt};Symbol.metadata??=Symbol("metadata"),j.litPropertyMetadata??=new WeakMap;var _=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=_t){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),n=this.getPropertyDescriptor(t,s,e);n!==void 0&&zt(this.prototype,t,n)}}static getPropertyDescriptor(t,e,s){let{get:n,set:r}=Bt(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:n,set(o){let c=n?.call(this);r?.call(this,o),this.requestUpdate(t,c,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??_t}static _$Ei(){if(this.hasOwnProperty(k("elementProperties")))return;let t=Ft(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(k("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(k("properties"))){let e=this.properties,s=[...jt(e),...It(e)];for(let n of s)this.createProperty(n,e[n])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,n]of e)this.elementProperties.set(s,n)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let n=this._$Eu(e,s);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let n of s)e.unshift(G(n))}else t!==void 0&&e.push(G(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return gt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,s);if(n!==void 0&&s.reflect===!0){let r=(s.converter?.toAttribute!==void 0?s.converter:Z).toAttribute(e,s.type);this._$Em=t,r==null?this.removeAttribute(n):this.setAttribute(n,r),this._$Em=null}}_$AK(t,e){let s=this.constructor,n=s._$Eh.get(t);if(n!==void 0&&this._$Em!==n){let r=s.getPropertyOptions(n),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:Z;this._$Em=n;let c=o.fromAttribute(e,r.type);this[n]=c??this._$Ej?.get(n)??c,this._$Em=null}}requestUpdate(t,e,s,n=!1,r){if(t!==void 0){let o=this.constructor;if(n===!1&&(r=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??yt)(r,e)||s.useDefault&&s.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:n,wrapped:r},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),r!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),n===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,r]of this._$Ep)this[n]=r;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[n,r]of s){let{wrapped:o}=r,c=this[n];o!==!0||this._$AL.has(n)||c===void 0||this.C(n,void 0,r,c)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};_.elementStyles=[],_.shadowRootOptions={mode:"open"},_[k("elementProperties")]=new Map,_[k("finalized")]=new Map,qt?.({ReactiveElement:_}),(j.reactiveElementVersions??=[]).push("2.1.2");var ot=globalThis,$t=i=>i,I=ot.trustedTypes,vt=I?I.createPolicy("lit-html",{createHTML:i=>i}):void 0,Ct="$lit$",y=`lit$${Math.random().toFixed(9).slice(2)}$`,St="?"+y,Kt=`<${St}>`,w=document,P=()=>w.createComment(""),R=i=>i===null||typeof i!="object"&&typeof i!="function",at=Array.isArray,Jt=i=>at(i)||typeof i?.[Symbol.iterator]=="function",tt=`[ 	
\f\r]`,H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,wt=/-->/g,bt=/>/g,$=RegExp(`>|${tt}(?:([^\\s"'>=/]+)(${tt}*=${tt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),At=/'/g,Et=/"/g,Tt=/^(?:script|style|textarea|title)$/i,ct=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),p=ct(1),le=ct(2),de=ct(3),b=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),xt=new WeakMap,v=w.createTreeWalker(w,129);function kt(i,t){if(!at(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return vt!==void 0?vt.createHTML(t):t}var Xt=(i,t)=>{let e=i.length-1,s=[],n,r=t===2?"<svg>":t===3?"<math>":"",o=H;for(let c=0;c<e;c++){let a=i[c],l,u,h=-1,g=0;for(;g<a.length&&(o.lastIndex=g,u=o.exec(a),u!==null);)g=o.lastIndex,o===H?u[1]==="!--"?o=wt:u[1]!==void 0?o=bt:u[2]!==void 0?(Tt.test(u[2])&&(n=RegExp("</"+u[2],"g")),o=$):u[3]!==void 0&&(o=$):o===$?u[0]===">"?(o=n??H,h=-1):u[1]===void 0?h=-2:(h=o.lastIndex-u[2].length,l=u[1],o=u[3]===void 0?$:u[3]==='"'?Et:At):o===Et||o===At?o=$:o===wt||o===bt?o=H:(o=$,n=void 0);let f=o===$&&i[c+1].startsWith("/>")?" ":"";r+=o===H?a+Kt:h>=0?(s.push(l),a.slice(0,h)+Ct+a.slice(h)+y+f):a+y+(h===-2?c:f)}return[kt(i,r+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},U=class i{constructor({strings:t,_$litType$:e},s){let n;this.parts=[];let r=0,o=0,c=t.length-1,a=this.parts,[l,u]=Xt(t,e);if(this.el=i.createElement(l,s),v.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(n=v.nextNode())!==null&&a.length<c;){if(n.nodeType===1){if(n.hasAttributes())for(let h of n.getAttributeNames())if(h.endsWith(Ct)){let g=u[o++],f=n.getAttribute(h).split(y),D=/([.?@])?(.*)/.exec(g);a.push({type:1,index:r,name:D[2],strings:f,ctor:D[1]==="."?st:D[1]==="?"?it:D[1]==="@"?nt:E}),n.removeAttribute(h)}else h.startsWith(y)&&(a.push({type:6,index:r}),n.removeAttribute(h));if(Tt.test(n.tagName)){let h=n.textContent.split(y),g=h.length-1;if(g>0){n.textContent=I?I.emptyScript:"";for(let f=0;f<g;f++)n.append(h[f],P()),v.nextNode(),a.push({type:2,index:++r});n.append(h[g],P())}}}else if(n.nodeType===8)if(n.data===St)a.push({type:2,index:r});else{let h=-1;for(;(h=n.data.indexOf(y,h+1))!==-1;)a.push({type:7,index:r}),h+=y.length-1}r++}}static createElement(t,e){let s=w.createElement("template");return s.innerHTML=t,s}};function A(i,t,e=i,s){if(t===b)return t;let n=s!==void 0?e._$Co?.[s]:e._$Cl,r=R(t)?void 0:t._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),r===void 0?n=void 0:(n=new r(i),n._$AT(i,e,s)),s!==void 0?(e._$Co??=[])[s]=n:e._$Cl=n),n!==void 0&&(t=A(i,n._$AS(i,t.values),n,s)),t}var et=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,n=(t?.creationScope??w).importNode(e,!0);v.currentNode=n;let r=v.nextNode(),o=0,c=0,a=s[0];for(;a!==void 0;){if(o===a.index){let l;a.type===2?l=new N(r,r.nextSibling,this,t):a.type===1?l=new a.ctor(r,a.name,a.strings,this,t):a.type===6&&(l=new rt(r,this,t)),this._$AV.push(l),a=s[++c]}o!==a?.index&&(r=v.nextNode(),o++)}return v.currentNode=w,n}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},N=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,n){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=A(this,t,e),R(t)?t===d||t==null||t===""?(this._$AH!==d&&this._$AR(),this._$AH=d):t!==this._$AH&&t!==b&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Jt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==d&&R(this._$AH)?this._$AA.nextSibling.data=t:this.T(w.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,n=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=U.createElement(kt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===n)this._$AH.p(e);else{let r=new et(n,this),o=r.u(this.options);r.p(e),this.T(o),this._$AH=r}}_$AC(t){let e=xt.get(t.strings);return e===void 0&&xt.set(t.strings,e=new U(t)),e}k(t){at(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,n=0;for(let r of t)n===e.length?e.push(s=new i(this.O(P()),this.O(P()),this,this.options)):s=e[n],s._$AI(r),n++;n<e.length&&(this._$AR(s&&s._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=$t(t).nextSibling;$t(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},E=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,n,r){this.type=1,this._$AH=d,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=d}_$AI(t,e=this,s,n){let r=this.strings,o=!1;if(r===void 0)t=A(this,t,e,0),o=!R(t)||t!==this._$AH&&t!==b,o&&(this._$AH=t);else{let c=t,a,l;for(t=r[0],a=0;a<r.length-1;a++)l=A(this,c[s+a],e,a),l===b&&(l=this._$AH[a]),o||=!R(l)||l!==this._$AH[a],l===d?t=d:t!==d&&(t+=(l??"")+r[a+1]),this._$AH[a]=l}o&&!n&&this.j(t)}j(t){t===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},st=class extends E{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===d?void 0:t}},it=class extends E{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==d)}},nt=class extends E{constructor(t,e,s,n,r){super(t,e,s,n,r),this.type=5}_$AI(t,e=this){if((t=A(this,t,e,0)??d)===b)return;let s=this._$AH,n=t===d&&s!==d||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==d&&(s===d||n);n&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},rt=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){A(this,t)}};var Yt=ot.litHtmlPolyfillSupport;Yt?.(U,N),(ot.litHtmlVersions??=[]).push("3.3.3");var Ht=(i,t,e)=>{let s=e?.renderBefore??t,n=s._$litPart$;if(n===void 0){let r=e?.renderBefore??null;s._$litPart$=n=new N(t.insertBefore(P(),r),r,void 0,e??{})}return n._$AI(i),n};var ht=globalThis,m=class extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ht(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return b}};m._$litElement$=!0,m.finalized=!0,ht.litElementHydrateSupport?.({LitElement:m});var Qt=ht.litElementPolyfillSupport;Qt?.({LitElement:m});(ht.litElementVersions??=[]).push("4.2.2");var Gt=[{name:"entity",selector:{entity:{domain:"sensor",integration:"rugbypass"}}}],F=class extends m{constructor(){super(...arguments);this._label=e=>e.name==="entity"?"Game entity":e.name}setConfig(e){this._config=e}set hass(e){this._hass=e}_changed(e){let s={...this._config,...e.detail.value};this._config=s,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:s},bubbles:!0,composed:!0}))}render(){if(this._config)return p`<ha-form
      .hass=${this._hass}
      .data=${this._config}
      .schema=${Gt}
      .computeLabel=${this._label}
      @value-changed=${this._changed}
    ></ha-form>`}};F.properties={_config:{state:!0},_hass:{state:!0}};customElements.get("rugbypass-game-card-editor")||customElements.define("rugbypass-game-card-editor",F);var Zt={mode:"empty",home:{name:""},away:{name:""},headline:"No game"},M=()=>({...Zt,home:{name:""},away:{name:""}}),x=i=>typeof i=="string"&&i!==""?i:void 0,lt=i=>typeof i=="number"&&Number.isFinite(i)?i:void 0;function Pt(i,t,e){let s=x(i);if(!s)return"TBC";let n=new Date(s);if(Number.isNaN(n.getTime()))return s;try{return new Intl.DateTimeFormat(t,{weekday:"short",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit",timeZone:e}).format(n)}catch{return s}}function C(i,t,e){try{if(!i||i.state==="unavailable"||i.state==="unknown")return M();let s=i.attributes;if(!s||typeof s!="object")return M();let n=x(s.period),r=x(s.home_team),o=x(s.away_team);if(!n||!r||!o)return M();let c=s.logos&&typeof s.logos=="object"?s.logos:{},a=lt(s.home_score),l=lt(s.away_score),u={name:r,logo:x(c.home),score:a},h={name:o,logo:x(c.away),score:l},g=`${a??"-"} \u2013 ${l??"-"}`;switch(n){case"Kick off":return{mode:"upcoming",home:u,away:h,headline:Pt(s.kickoff,t,e)};case"Postponed":case"Cancelled":return{mode:"upcoming",home:u,away:h,headline:Pt(s.kickoff,t,e),badge:n};case"First Half":case"Second Half":{let f=lt(s.minute);return{mode:"live",home:u,away:h,headline:g,badge:f===void 0?n:`${n} ${f}'`}}case"Result":return{mode:"final",home:u,away:h,headline:g,badge:"Full time"};default:return M()}}catch{return M()}}var dt=5,Rt=/_(?:current_game|next_game|previous_game_[1-5])$/,te=/^([WLD]) \d+–\d+$/,O=i=>typeof i=="string"&&i!==""?i:void 0;function W(i){if(typeof i!="string"||!Rt.test(i))return;let t=i.replace(Rt,"");return{current:`${t}_current_game`,next:`${t}_next_game`,previous:[1,2,3,4,5].map(e=>`${t}_previous_game_${e}`)}}function Ut(i){let t=Array.isArray(i?.previous)?i.previous.filter(n=>typeof n=="string"&&n!==""):[],e=O(i?.current),s=O(i?.next);if(!e&&!s&&t.length===0)throw new Error("rugbypass-team-card: configure at least 'next', 'current' or 'previous'");return{...i,previous:t.slice(0,dt)}}function Nt(i){return[i.current,i.next,...(i.previous??[]).slice(0,dt)].filter(t=>typeof t=="string"&&t!=="")}function ee(i,t,e){let s=O(i);if(!s)return"\u2013";let n=new Date(s);if(Number.isNaN(n.getTime()))return s;try{return new Intl.DateTimeFormat(t,{day:"numeric",month:"short",year:"2-digit",timeZone:e}).format(n)}catch{return s}}function se(i,t,e){try{if(!i||i.state==="unknown"||i.state==="unavailable")return;let s=i.attributes;if(!s||typeof s!="object")return;let n=O(s.opposition);if(!n)return;let r=typeof i.state=="string"?i.state:"",o=te.exec(r),c=o?{W:"win",L:"loss",D:"draw"}[o[1]]:"unknown";return{date:ee(s.kickoff,t,e),opposition:n,venue:s.home_away==="away"?"away":"home",score:r||"Result unavailable",outcome:c}}catch{return}}function Mt(i,t,e,s){let n=l=>l?i[l]:void 0,r=C(n(t.current),e,s),o=C(n(t.next),e,s),c=r.mode==="live"?r:o.mode==="upcoming"?o:C(void 0,e,s),a=(t.previous??[]).slice(0,dt).map(l=>se(n(l),e,s)).filter(l=>l!==void 0);return{top:c,previous:a,heading:O(t.title)}}var ie=[{name:"entity",selector:{entity:{domain:"sensor",integration:"rugbypass"}}},{name:"title",selector:{text:{}}}],ne={entity:"Any game sensor for the team",title:"Title (optional)"},q=class extends m{constructor(){super(...arguments);this._label=e=>ne[e.name]??e.name}setConfig(e){this._config=e}set hass(e){this._hass=e}_changed(e){let s=e.detail?.value??{},n=typeof s.entity=="string"?s.entity:"",r=typeof s.title=="string"&&s.title!==""?s.title:void 0,o=n?W(n):void 0,c={type:this._config?.type??"custom:rugbypass-team-card"};r&&(c.title=r),o?(c.current=o.current,c.next=o.next,c.previous=[...o.previous]):c.next=n,this._config=c,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:c},bubbles:!0,composed:!0}))}render(){if(!this._config)return;let e={entity:this._config.next||this._config.current||this._config.previous?.[0]||"",title:this._config.title??""};return p`<ha-form
      .hass=${this._hass}
      .data=${e}
      .schema=${ie}
      .computeLabel=${this._label}
      @value-changed=${this._changed}
    ></ha-form>`}};q.properties={_config:{state:!0},_hass:{state:!0}};customElements.get("rugbypass-team-card-editor")||customElements.define("rugbypass-team-card-editor",q);var re=/^sensor\..*(current|next|previous)_game/;function K(i){return i?Object.keys(i).find(t=>re.test(t))??"":""}function Ot(i,t,e){return!i||!t?!0:i[e]!==t[e]}function Vt(i,t,e){return!i||!t?!0:e.some(s=>i[s]!==t[s])}function Lt(i){return p`<div class="team">
    ${i.logo?p`<img class="logo" src=${i.logo} alt="" />`:p`<div class="logo"></div>`}
    <div class="name">${i.name}</div>
  </div>`}function J(i){return i.mode==="empty"?p`<div class="empty">${i.headline}</div>`:p`<div class="game ${i.mode}">
    <div class="row">
      ${Lt(i.home)}
      <div class="centre">
        <div class="headline">${i.headline}</div>
        ${i.badge?p`<div class="badge">${i.badge}</div>`:d}
      </div>
      ${Lt(i.away)}
    </div>
  </div>`}var X=T`
    ha-card {
      padding: 16px;
      color: var(--primary-text-color);
    }
    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .team {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      min-width: 0;
    }
    .logo {
      width: 56px;
      height: 56px;
      object-fit: contain;
    }
    .name {
      margin-top: 6px;
      font-weight: 500;
    }
    .centre {
      flex: 1;
      text-align: center;
    }
    .headline {
      font-size: 1.4em;
      font-weight: 600;
    }
    .badge {
      display: inline-block;
      margin-top: 6px;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 0.85em;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
    }
    ha-card .game.live .badge {
      background: var(--error-color, #db4437);
      color: var(--text-primary-color, #fff);
    }
    ha-card .game.live .headline {
      color: var(--primary-color);
    }
    .empty {
      text-align: center;
      color: var(--secondary-text-color);
      padding: 8px;
    }
`;var V=class extends m{static getConfigElement(){return document.createElement("rugbypass-team-card-editor")}static getStubConfig(t){let e=W(K(t?.states));return e?{type:"custom:rugbypass-team-card",...e}:{type:"custom:rugbypass-team-card",next:""}}shouldUpdate(t){if(!this._config||t.has("_config"))return!0;if(t.has("_hass")){let e=t.get("_hass");return Vt(e?.states,this._hass?.states,Nt(this._config))}return!0}setConfig(t){this._config=Ut(t)}set hass(t){this._hass=t}getCardSize(){return 2+Math.min(5,this._view()?.previous.length??0)}_view(){if(!this._config)return;let t=this._hass;return Mt(t?.states??{},this._config,t?.locale?.language??"en",t?.config?.time_zone??"UTC")}render(){let t=this._view();return t?p`<ha-card>
      ${t.heading?p`<div class="heading">${t.heading}</div>`:d}
      ${J(t.top)}
      <hr class="divider" />
      ${t.previous.length===0?p`<div class="none">No previous games</div>`:p`<ul class="previous">
            ${t.previous.map(e=>p`<li class="prev-row">
                <span class="date">${e.date}</span>
                <span class="opp">${e.venue==="home"?"vs":"at"} ${e.opposition}</span>
                <span class="score ${e.outcome}">${e.score}</span>
              </li>`)}
          </ul>`}
    </ha-card>`:d}};V.properties={_config:{state:!0},_hass:{state:!0}},V.styles=[X,T`
      .heading {
        font-size: 1.1em;
        font-weight: 600;
        margin-bottom: 8px;
      }
      .divider {
        border: 0;
        border-top: 1px solid var(--divider-color);
        margin: 12px 0;
      }
      .previous {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .prev-row {
        display: flex;
        gap: 8px;
        align-items: baseline;
        padding: 3px 0;
        font-size: 0.9em;
      }
      .date {
        flex: 0 0 auto;
        min-width: 5.5em;
        color: var(--secondary-text-color);
      }
      .opp {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .score {
        flex: 0 0 auto;
        font-weight: 600;
      }
      .score.win {
        color: var(--success-color);
      }
      .score.loss {
        color: var(--error-color);
      }
      .score.draw {
        color: var(--warning-color);
      }
      .score.unknown {
        color: var(--secondary-text-color);
      }
      .none {
        text-align: center;
        color: var(--secondary-text-color);
      }
    `];customElements.get("rugbypass-team-card")||customElements.define("rugbypass-team-card",V);var Y=window;Y.customCards=Y.customCards||[];Y.customCards.some(i=>i.type==="rugbypass-team-card")||Y.customCards.push({type:"rugbypass-team-card",name:"RugbyPass Team Card",description:"Current or next game plus the previous five results for one team"});var L=class extends m{static getConfigElement(){return document.createElement("rugbypass-game-card-editor")}static getStubConfig(t){return{type:"custom:rugbypass-game-card",entity:K(t?.states)}}shouldUpdate(t){if(!this._config||t.has("_config"))return!0;if(t.has("_hass")){let e=t.get("_hass");return Ot(e?.states,this._hass?.states,this._config.entity)}return!0}setConfig(t){if(!t||typeof t.entity!="string"||!t.entity)throw new Error("rugbypass-game-card: 'entity' is required");this._config=t}set hass(t){this._hass=t}getCardSize(){return 2}_view(){let t=this._hass,e=t&&this._config?t.states[this._config.entity]:void 0;return C(e,t?.locale?.language??"en",t?.config?.time_zone??"UTC")}render(){return this._config?p`<ha-card>${J(this._view())}</ha-card>`:d}};L.properties={_config:{state:!0},_hass:{state:!0}},L.styles=X;customElements.get("rugbypass-game-card")||customElements.define("rugbypass-game-card",L);var ut=window;ut.customCards=ut.customCards||[];ut.customCards.push({type:"rugbypass-game-card",name:"RugbyPass Game Card",description:"Shows a RugbyPass game: kick-off, live score or final result."});export{L as RugbyPassGameCard};
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
