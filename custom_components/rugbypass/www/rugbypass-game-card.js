var D=globalThis,z=D.ShadowRoot&&(D.ShadyCSS===void 0||D.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Y=Symbol(),he=new WeakMap,S=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==Y)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(z&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=he.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&he.set(t,e))}return e}toString(){return this.cssText}},ue=i=>new S(typeof i=="string"?i:i+"",void 0,Y),T=(i,...e)=>{let t=i.length===1?i[0]:e.reduce((s,n,r)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+i[r+1],i[0]);return new S(t,i,Y)},pe=(i,e)=>{if(z)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),n=D.litNonce;n!==void 0&&s.setAttribute("nonce",n),s.textContent=t.cssText,i.appendChild(s)}},Q=z?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return ue(t)})(i):i;var{is:je,defineProperty:Be,getOwnPropertyDescriptor:Ie,getOwnPropertyNames:Fe,getOwnPropertySymbols:We,getPrototypeOf:qe}=Object,j=globalThis,me=j.trustedTypes,Ke=me?me.emptyScript:"",Je=j.reactiveElementPolyfillSupport,k=(i,e)=>i,G={toAttribute(i,e){switch(e){case Boolean:i=i?Ke:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},fe=(i,e)=>!je(i,e),ge={attribute:!0,type:String,converter:G,reflect:!1,useDefault:!1,hasChanged:fe};Symbol.metadata??=Symbol("metadata"),j.litPropertyMetadata??=new WeakMap;var _=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ge){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),n=this.getPropertyDescriptor(e,s,t);n!==void 0&&Be(this.prototype,e,n)}}static getPropertyDescriptor(e,t,s){let{get:n,set:r}=Ie(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:n,set(o){let h=n?.call(this);r?.call(this,o),this.requestUpdate(e,h,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ge}static _$Ei(){if(this.hasOwnProperty(k("elementProperties")))return;let e=qe(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(k("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(k("properties"))){let t=this.properties,s=[...Fe(t),...We(t)];for(let n of s)this.createProperty(n,t[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,n]of t)this.elementProperties.set(s,n)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let n=this._$Eu(t,s);n!==void 0&&this._$Eh.set(n,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let n of s)t.unshift(Q(n))}else e!==void 0&&t.push(Q(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return pe(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,s);if(n!==void 0&&s.reflect===!0){let r=(s.converter?.toAttribute!==void 0?s.converter:G).toAttribute(t,s.type);this._$Em=e,r==null?this.removeAttribute(n):this.setAttribute(n,r),this._$Em=null}}_$AK(e,t){let s=this.constructor,n=s._$Eh.get(e);if(n!==void 0&&this._$Em!==n){let r=s.getPropertyOptions(n),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:G;this._$Em=n;let h=o.fromAttribute(t,r.type);this[n]=h??this._$Ej?.get(n)??h,this._$Em=null}}requestUpdate(e,t,s,n=!1,r){if(e!==void 0){let o=this.constructor;if(n===!1&&(r=this[e]),s??=o.getPropertyOptions(e),!((s.hasChanged??fe)(r,t)||s.useDefault&&s.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:n,wrapped:r},o){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),r!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),n===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,r]of this._$Ep)this[n]=r;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[n,r]of s){let{wrapped:o}=r,h=this[n];o!==!0||this._$AL.has(n)||h===void 0||this.C(n,void 0,r,h)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};_.elementStyles=[],_.shadowRootOptions={mode:"open"},_[k("elementProperties")]=new Map,_[k("finalized")]=new Map,Je?.({ReactiveElement:_}),(j.reactiveElementVersions??=[]).push("2.1.2");var re=globalThis,_e=i=>i,B=re.trustedTypes,ye=B?B.createPolicy("lit-html",{createHTML:i=>i}):void 0,Ce="$lit$",y=`lit$${Math.random().toFixed(9).slice(2)}$`,xe="?"+y,Xe=`<${xe}>`,w=document,P=()=>w.createComment(""),R=i=>i===null||typeof i!="object"&&typeof i!="function",oe=Array.isArray,Ye=i=>oe(i)||typeof i?.[Symbol.iterator]=="function",Z=`[ 	
\f\r]`,H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,$e=/-->/g,ve=/>/g,$=RegExp(`>|${Z}(?:([^\\s"'>=/]+)(${Z}*=${Z}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),we=/'/g,be=/"/g,Ee=/^(?:script|style|textarea|title)$/i,ae=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),p=ae(1),pt=ae(2),mt=ae(3),b=Symbol.for("lit-noChange"),l=Symbol.for("lit-nothing"),Ae=new WeakMap,v=w.createTreeWalker(w,129);function Se(i,e){if(!oe(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return ye!==void 0?ye.createHTML(e):e}var Qe=(i,e)=>{let t=i.length-1,s=[],n,r=e===2?"<svg>":e===3?"<math>":"",o=H;for(let h=0;h<t;h++){let a=i[h],d,u,c=-1,g=0;for(;g<a.length&&(o.lastIndex=g,u=o.exec(a),u!==null);)g=o.lastIndex,o===H?u[1]==="!--"?o=$e:u[1]!==void 0?o=ve:u[2]!==void 0?(Ee.test(u[2])&&(n=RegExp("</"+u[2],"g")),o=$):u[3]!==void 0&&(o=$):o===$?u[0]===">"?(o=n??H,c=-1):u[1]===void 0?c=-2:(c=o.lastIndex-u[2].length,d=u[1],o=u[3]===void 0?$:u[3]==='"'?be:we):o===be||o===we?o=$:o===$e||o===ve?o=H:(o=$,n=void 0);let f=o===$&&i[h+1].startsWith("/>")?" ":"";r+=o===H?a+Xe:c>=0?(s.push(d),a.slice(0,c)+Ce+a.slice(c)+y+f):a+y+(c===-2?h:f)}return[Se(i,r+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},U=class i{constructor({strings:e,_$litType$:t},s){let n;this.parts=[];let r=0,o=0,h=e.length-1,a=this.parts,[d,u]=Qe(e,t);if(this.el=i.createElement(d,s),v.currentNode=this.el.content,t===2||t===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(n=v.nextNode())!==null&&a.length<h;){if(n.nodeType===1){if(n.hasAttributes())for(let c of n.getAttributeNames())if(c.endsWith(Ce)){let g=u[o++],f=n.getAttribute(c).split(y),V=/([.?@])?(.*)/.exec(g);a.push({type:1,index:r,name:V[2],strings:f,ctor:V[1]==="."?te:V[1]==="?"?se:V[1]==="@"?ie:C}),n.removeAttribute(c)}else c.startsWith(y)&&(a.push({type:6,index:r}),n.removeAttribute(c));if(Ee.test(n.tagName)){let c=n.textContent.split(y),g=c.length-1;if(g>0){n.textContent=B?B.emptyScript:"";for(let f=0;f<g;f++)n.append(c[f],P()),v.nextNode(),a.push({type:2,index:++r});n.append(c[g],P())}}}else if(n.nodeType===8)if(n.data===xe)a.push({type:2,index:r});else{let c=-1;for(;(c=n.data.indexOf(y,c+1))!==-1;)a.push({type:7,index:r}),c+=y.length-1}r++}}static createElement(e,t){let s=w.createElement("template");return s.innerHTML=e,s}};function A(i,e,t=i,s){if(e===b)return e;let n=s!==void 0?t._$Co?.[s]:t._$Cl,r=R(e)?void 0:e._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),r===void 0?n=void 0:(n=new r(i),n._$AT(i,t,s)),s!==void 0?(t._$Co??=[])[s]=n:t._$Cl=n),n!==void 0&&(e=A(i,n._$AS(i,e.values),n,s)),e}var ee=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,n=(e?.creationScope??w).importNode(t,!0);v.currentNode=n;let r=v.nextNode(),o=0,h=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new N(r,r.nextSibling,this,e):a.type===1?d=new a.ctor(r,a.name,a.strings,this,e):a.type===6&&(d=new ne(r,this,e)),this._$AV.push(d),a=s[++h]}o!==a?.index&&(r=v.nextNode(),o++)}return v.currentNode=w,n}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},N=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,n){this.type=2,this._$AH=l,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=A(this,e,t),R(e)?e===l||e==null||e===""?(this._$AH!==l&&this._$AR(),this._$AH=l):e!==this._$AH&&e!==b&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ye(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==l&&R(this._$AH)?this._$AA.nextSibling.data=e:this.T(w.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,n=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=U.createElement(Se(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===n)this._$AH.p(t);else{let r=new ee(n,this),o=r.u(this.options);r.p(t),this.T(o),this._$AH=r}}_$AC(e){let t=Ae.get(e.strings);return t===void 0&&Ae.set(e.strings,t=new U(e)),t}k(e){oe(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,n=0;for(let r of e)n===t.length?t.push(s=new i(this.O(P()),this.O(P()),this,this.options)):s=t[n],s._$AI(r),n++;n<t.length&&(this._$AR(s&&s._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=_e(e).nextSibling;_e(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},C=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,n,r){this.type=1,this._$AH=l,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=l}_$AI(e,t=this,s,n){let r=this.strings,o=!1;if(r===void 0)e=A(this,e,t,0),o=!R(e)||e!==this._$AH&&e!==b,o&&(this._$AH=e);else{let h=e,a,d;for(e=r[0],a=0;a<r.length-1;a++)d=A(this,h[s+a],t,a),d===b&&(d=this._$AH[a]),o||=!R(d)||d!==this._$AH[a],d===l?e=l:e!==l&&(e+=(d??"")+r[a+1]),this._$AH[a]=d}o&&!n&&this.j(e)}j(e){e===l?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},te=class extends C{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===l?void 0:e}},se=class extends C{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==l)}},ie=class extends C{constructor(e,t,s,n,r){super(e,t,s,n,r),this.type=5}_$AI(e,t=this){if((e=A(this,e,t,0)??l)===b)return;let s=this._$AH,n=e===l&&s!==l||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,r=e!==l&&(s===l||n);n&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},ne=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){A(this,e)}};var Ge=re.litHtmlPolyfillSupport;Ge?.(U,N),(re.litHtmlVersions??=[]).push("3.3.3");var Te=(i,e,t)=>{let s=t?.renderBefore??e,n=s._$litPart$;if(n===void 0){let r=t?.renderBefore??null;s._$litPart$=n=new N(e.insertBefore(P(),r),r,void 0,t??{})}return n._$AI(i),n};var ce=globalThis,m=class extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Te(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return b}};m._$litElement$=!0,m.finalized=!0,ce.litElementHydrateSupport?.({LitElement:m});var Ze=ce.litElementPolyfillSupport;Ze?.({LitElement:m});(ce.litElementVersions??=[]).push("4.2.2");var et=[{name:"entity",selector:{entity:{domain:"sensor",integration:"rugbypass"}}}],I=class extends m{constructor(){super(...arguments);this._label=t=>t.name==="entity"?"Game entity":t.name}setConfig(t){this._config=t}set hass(t){this._hass=t}_changed(t){let s={...this._config,...t.detail.value};this._config=s,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:s},bubbles:!0,composed:!0}))}render(){if(this._config)return p`<ha-form
      .hass=${this._hass}
      .data=${this._config}
      .schema=${et}
      .computeLabel=${this._label}
      @value-changed=${this._changed}
    ></ha-form>`}};I.properties={_config:{state:!0},_hass:{state:!0}};customElements.get("rugbypass-game-card-editor")||customElements.define("rugbypass-game-card-editor",I);var tt=/^sensor\..*(current|next|previous)_game/;function F(i){return i?Object.keys(i).find(e=>tt.test(e))??"":""}function ke(i,e,t){return!i||!e?!0:i[t]!==e[t]}function He(i,e,t){return!i||!e?!0:t.some(s=>i[s]!==e[s])}var st={mode:"empty",home:{name:""},away:{name:""},headline:"No game"},M=()=>({...st,home:{name:""},away:{name:""}}),x=i=>typeof i=="string"&&i!==""?i:void 0,de=i=>typeof i=="number"&&Number.isFinite(i)?i:void 0;function Pe(i,e,t){let s=x(i);if(!s)return{headline:"TBC"};let n=new Date(s);if(Number.isNaN(n.getTime()))return{headline:s};try{return{dateLine:new Intl.DateTimeFormat(e,{weekday:"short",day:"numeric",month:"short",timeZone:t}).format(n),headline:new Intl.DateTimeFormat(e,{hour:"2-digit",minute:"2-digit",timeZone:t}).format(n)}}catch{return{headline:s}}}function E(i,e,t){try{if(!i||i.state==="unavailable"||i.state==="unknown")return M();let s=i.attributes;if(!s||typeof s!="object")return M();let n=x(s.period),r=x(s.home_team),o=x(s.away_team);if(!n||!r||!o)return M();let h=s.logos&&typeof s.logos=="object"?s.logos:{},a=de(s.home_score),d=de(s.away_score),u={name:r,logo:x(h.home),score:a},c={name:o,logo:x(h.away),score:d},g=`${a??"-"} \u2013 ${d??"-"}`;switch(n){case"Kick off":return{mode:"upcoming",home:u,away:c,...Pe(s.kickoff,e,t)};case"Postponed":case"Cancelled":return{mode:"upcoming",home:u,away:c,...Pe(s.kickoff,e,t),badge:n};case"First Half":case"Second Half":{let f=de(s.minute);return{mode:"live",home:u,away:c,headline:g,badge:f===void 0?n:`${n} ${f}'`}}case"Result":return{mode:"final",home:u,away:c,headline:g,badge:"Full time"};default:return M()}}catch{return M()}}var W=5,Re=/_(?:current_game|next_game|previous_game_[1-5])$/,it=/^([WLD]) \d+–\d+$/,le=i=>typeof i=="string"&&i!==""?i:void 0;function Ue(i){if(typeof i!="string"||!Re.test(i))return;let e=i.replace(Re,"");return{current:`${e}_current_game`,next:`${e}_next_game`,previous:[1,2,3,4,5].map(t=>`${e}_previous_game_${t}`)}}function Ne(i){let e=Array.isArray(i?.previous)?i.previous.filter(s=>typeof s=="string"&&s!==""):[];if(!(!!i&&typeof i=="object"&&(typeof i.current=="string"||typeof i.next=="string"||Array.isArray(i.previous))))throw new Error("rugbypass-team-card: configure at least 'next', 'current' or 'previous'");return{...i,previous:e.slice(0,W)}}function nt(i){return[i.current,i.next,...(i.previous??[]).slice(0,W)].filter(e=>typeof e=="string"&&e!=="")}function rt(i,e,t){let s=le(i);if(!s)return"\u2013";let n=new Date(s);if(Number.isNaN(n.getTime()))return s;try{return new Intl.DateTimeFormat(e,{day:"numeric",month:"short",timeZone:t}).format(n)}catch{return s}}function ot(i,e,t){try{if(!i||i.state==="unknown"||i.state==="unavailable")return;let s=i.attributes;if(!s||typeof s!="object")return;let n=le(s.opposition);if(!n)return;let r=typeof i.state=="string"?i.state:"",o=it.exec(r),h=o?{W:"win",L:"loss",D:"draw"}[o[1]]:"unknown";return{date:rt(s.kickoff,e,t),opposition:n,location:typeof s.venue=="string"&&s.venue.trim()!==""?s.venue.trim():void 0,score:r||"Result unavailable",outcome:h}}catch{return}}function Me(i,e,t,s){let n=d=>d?i[d]:void 0,r=E(n(e.current),t,s),o=E(n(e.next),t,s),h=r.mode==="live"?r:o.mode==="upcoming"?o:E(void 0,t,s),a=(e.previous??[]).slice(0,W).map(d=>ot(n(d),t,s)).filter(d=>d!==void 0);return{top:h,previous:a,heading:le(e.title)}}function Oe(i,e,t,s,n){return!i||e?!0:t?He(s,n,nt(i)):!0}function Le(i){return 2+Math.min(W,i)}function Ve(i){let e=Ue(F(i));return e?{type:"custom:rugbypass-team-card",...e}:{type:"custom:rugbypass-team-card",next:""}}function De(i,e,t,s){let n={type:t??"custom:rugbypass-team-card"};e&&(n.title=e);let r=i?Ue(i):void 0;return r?(n.current=r.current,n.next=r.next,n.previous=[...r.previous]):n.next=i??"",n}var at=[{name:"entity",selector:{entity:{domain:"sensor",integration:"rugbypass"}}},{name:"title",selector:{text:{}}}],ct={entity:"Any game sensor for the team",title:"Title (optional)"},q=class extends m{constructor(){super(...arguments);this._helper=t=>t.name==="entity"?"Other sensors are filled in automatically. Set them individually in YAML if needed.":void 0;this._label=t=>ct[t.name]??t.name}setConfig(t){this._config=t}set hass(t){this._hass=t}_changed(t){let s=t.detail?.value??{},n=typeof s.entity=="string"?s.entity:"",r=typeof s.title=="string"&&s.title!==""?s.title:void 0,o=De(n,r,this._config?.type,this._config);this._config=o,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:o},bubbles:!0,composed:!0}))}render(){if(!this._config)return;let t={entity:this._config.next||this._config.current||this._config.previous?.[0]||"",title:this._config.title??""};return p`<ha-form
      .hass=${this._hass}
      .data=${t}
      .schema=${at}
      .computeLabel=${this._label}
      .computeHelper=${this._helper}
      @value-changed=${this._changed}
    ></ha-form>`}};q.properties={_config:{state:!0},_hass:{state:!0}};customElements.get("rugbypass-team-card-editor")||customElements.define("rugbypass-team-card-editor",q);function K(i,e){i.customCards=i.customCards||[],i.customCards.some(t=>t.type===e.type)||i.customCards.push(e)}function ze(i){return p`<div class="team">
    ${i.logo?p`<img class="logo" src=${i.logo} alt="" />`:p`<div class="logo"></div>`}
    <div class="name">${i.name}</div>
  </div>`}function J(i){return i.mode==="empty"?p`<div class="empty">${i.headline}</div>`:p`<div class="game ${i.mode}">
    <div class="row">
      ${ze(i.home)}
      <div class="centre">
        ${i.dateLine?p`<div class="dateline">${i.dateLine}</div>`:l}
        <div class="headline">${i.headline}</div>
        ${i.badge?p`<div class="badge">${i.badge}</div>`:l}
      </div>
      ${ze(i.away)}
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
    .game.upcoming .headline {
      font-size: 1.15em;
      white-space: nowrap;
    }
    .dateline {
      font-size: 0.85em;
      color: var(--secondary-text-color);
      white-space: nowrap;
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
`;var O=class extends m{static getConfigElement(){return document.createElement("rugbypass-team-card-editor")}static getStubConfig(e){return Ve(e?.states)}shouldUpdate(e){let t=e.get("_hass");return Oe(this._config,e.has("_config"),e.has("_hass"),t?.states,this._hass?.states)}setConfig(e){this._config=Ne(e)}set hass(e){this._hass=e}getCardSize(){return Le(this._view()?.previous.length??0)}_view(){if(!this._config)return;let e=this._hass;return Me(e?.states??{},this._config,e?.locale?.language??"en",e?.config?.time_zone??"UTC")}render(){let e=this._view();return e?p`<ha-card>
      ${e.heading?p`<div class="heading">${e.heading}</div>`:l}
      ${J(e.top)}
      <hr class="divider" />
      ${e.previous.length===0?p`<div class="none">No previous games</div>`:p`<ul class="previous">
            ${e.previous.map(t=>p`<li class="prev-row">
                <span class="date">${t.date}</span>
                <span class="opp"
                  >${t.opposition}${t.location?p` <span class="loc">(${t.location})</span>`:l}</span
                >
                <span class="score ${t.outcome}">${t.score}</span>
              </li>`)}
          </ul>`}
    </ha-card>`:l}};O.properties={_config:{state:!0},_hass:{state:!0}},O.styles=[X,T`
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
      .loc {
        color: var(--secondary-text-color);
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
    `];customElements.get("rugbypass-team-card")||customElements.define("rugbypass-team-card",O);K(window,{type:"rugbypass-team-card",name:"RugbyPass Team Card",description:"Current or next game plus the previous five results for one team"});var L=class extends m{static getConfigElement(){return document.createElement("rugbypass-game-card-editor")}static getStubConfig(e){return{type:"custom:rugbypass-game-card",entity:F(e?.states)}}shouldUpdate(e){if(!this._config||e.has("_config"))return!0;if(e.has("_hass")){let t=e.get("_hass");return ke(t?.states,this._hass?.states,this._config.entity)}return!0}setConfig(e){if(!e||typeof e.entity!="string"||!e.entity)throw new Error("rugbypass-game-card: 'entity' is required");this._config=e}set hass(e){this._hass=e}getCardSize(){return 2}_view(){let e=this._hass,t=e&&this._config?e.states[this._config.entity]:void 0;return E(t,e?.locale?.language??"en",e?.config?.time_zone??"UTC")}render(){return this._config?p`<ha-card>${J(this._view())}</ha-card>`:l}};L.properties={_config:{state:!0},_hass:{state:!0}},L.styles=X;customElements.get("rugbypass-game-card")||customElements.define("rugbypass-game-card",L);K(window,{type:"rugbypass-game-card",name:"RugbyPass Game Card",description:"Shows a RugbyPass game: kick-off, live score or final result."});export{L as RugbyPassGameCard};
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
