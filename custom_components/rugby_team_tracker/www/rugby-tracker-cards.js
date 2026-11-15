var D=globalThis,z=D.ShadowRoot&&(D.ShadyCSS===void 0||D.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,G=Symbol(),pe=new WeakMap,S=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==G)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(z&&e===void 0){let n=t!==void 0&&t.length===1;n&&(e=pe.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&pe.set(t,e))}return e}toString(){return this.cssText}},me=s=>new S(typeof s=="string"?s:s+"",void 0,G),k=(s,...e)=>{let t=s.length===1?s[0]:e.reduce((n,i,r)=>n+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[r+1],s[0]);return new S(t,s,G)},fe=(s,e)=>{if(z)s.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let n=document.createElement("style"),i=D.litNonce;i!==void 0&&n.setAttribute("nonce",i),n.textContent=t.cssText,s.appendChild(n)}},Z=z?s=>s:s=>s instanceof CSSStyleSheet?(e=>{let t="";for(let n of e.cssRules)t+=n.cssText;return me(t)})(s):s;var{is:qe,defineProperty:Ke,getOwnPropertyDescriptor:Xe,getOwnPropertyNames:Je,getOwnPropertySymbols:Ye,getPrototypeOf:Qe}=Object,j=globalThis,ge=j.trustedTypes,Ge=ge?ge.emptyScript:"",Ze=j.reactiveElementPolyfillSupport,T=(s,e)=>s,ee={toAttribute(s,e){switch(e){case Boolean:s=s?Ge:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,e){let t=s;switch(e){case Boolean:t=s!==null;break;case Number:t=s===null?null:Number(s);break;case Object:case Array:try{t=JSON.parse(s)}catch{t=null}}return t}},_e=(s,e)=>!qe(s,e),ye={attribute:!0,type:String,converter:ee,reflect:!1,useDefault:!1,hasChanged:_e};Symbol.metadata??=Symbol("metadata"),j.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ye){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),i=this.getPropertyDescriptor(e,n,t);i!==void 0&&Ke(this.prototype,e,i)}}static getPropertyDescriptor(e,t,n){let{get:i,set:r}=Xe(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:i,set(o){let u=i?.call(this);r?.call(this,o),this.requestUpdate(e,u,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ye}static _$Ei(){if(this.hasOwnProperty(T("elementProperties")))return;let e=Qe(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(T("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(T("properties"))){let t=this.properties,n=[...Je(t),...Ye(t)];for(let i of n)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[n,i]of t)this.elementProperties.set(n,i)}this._$Eh=new Map;for(let[t,n]of this.elementProperties){let i=this._$Eu(t,n);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let i of n)t.unshift(Z(i))}else e!==void 0&&t.push(Z(e));return t}static _$Eu(e,t){let n=t.attribute;return n===!1?void 0:typeof n=="string"?n:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return fe(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,n);if(i!==void 0&&n.reflect===!0){let r=(n.converter?.toAttribute!==void 0?n.converter:ee).toAttribute(t,n.type);this._$Em=e,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(e,t){let n=this.constructor,i=n._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let r=n.getPropertyOptions(i),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:ee;this._$Em=i;let u=o.fromAttribute(t,r.type);this[i]=u??this._$Ej?.get(i)??u,this._$Em=null}}requestUpdate(e,t,n,i=!1,r){if(e!==void 0){let o=this.constructor;if(i===!1&&(r=this[e]),n??=o.getPropertyOptions(e),!((n.hasChanged??_e)(r,t)||n.useDefault&&n.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,n))))return;this.C(e,t,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:i,wrapped:r},o){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),r!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[i,r]of n){let{wrapped:o}=r,u=this[i];o!==!0||this._$AL.has(i)||u===void 0||this.C(i,void 0,r,u)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(t)):this._$EM()}catch(n){throw e=!1,this._$EM(),n}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[T("elementProperties")]=new Map,y[T("finalized")]=new Map,Ze?.({ReactiveElement:y}),(j.reactiveElementVersions??=[]).push("2.1.2");var ae=globalThis,$e=s=>s,B=ae.trustedTypes,ve=B?B.createPolicy("lit-html",{createHTML:s=>s}):void 0,Ee="$lit$",_=`lit$${Math.random().toFixed(9).slice(2)}$`,Se="?"+_,et=`<${Se}>`,w=document,U=()=>w.createComment(""),H=s=>s===null||typeof s!="object"&&typeof s!="function",ce=Array.isArray,tt=s=>ce(s)||typeof s?.[Symbol.iterator]=="function",te=`[ 	
\f\r]`,P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,we=/-->/g,be=/>/g,$=RegExp(`>|${te}(?:([^\\s"'>=/]+)(${te}*=${te}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),xe=/'/g,Ae=/"/g,ke=/^(?:script|style|textarea|title)$/i,le=s=>(e,...t)=>({_$litType$:s,strings:e,values:t}),h=le(1),bt=le(2),xt=le(3),b=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),Ce=new WeakMap,v=w.createTreeWalker(w,129);function Te(s,e){if(!ce(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return ve!==void 0?ve.createHTML(e):e}var st=(s,e)=>{let t=s.length-1,n=[],i,r=e===2?"<svg>":e===3?"<math>":"",o=P;for(let u=0;u<t;u++){let a=s[u],d,p,l=-1,f=0;for(;f<a.length&&(o.lastIndex=f,p=o.exec(a),p!==null);)f=o.lastIndex,o===P?p[1]==="!--"?o=we:p[1]!==void 0?o=be:p[2]!==void 0?(ke.test(p[2])&&(i=RegExp("</"+p[2],"g")),o=$):p[3]!==void 0&&(o=$):o===$?p[0]===">"?(o=i??P,l=-1):p[1]===void 0?l=-2:(l=o.lastIndex-p[2].length,d=p[1],o=p[3]===void 0?$:p[3]==='"'?Ae:xe):o===Ae||o===xe?o=$:o===we||o===be?o=P:(o=$,i=void 0);let g=o===$&&s[u+1].startsWith("/>")?" ":"";r+=o===P?a+et:l>=0?(n.push(d),a.slice(0,l)+Ee+a.slice(l)+_+g):a+_+(l===-2?u:g)}return[Te(s,r+(s[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),n]},R=class s{constructor({strings:e,_$litType$:t},n){let i;this.parts=[];let r=0,o=0,u=e.length-1,a=this.parts,[d,p]=st(e,t);if(this.el=s.createElement(d,n),v.currentNode=this.el.content,t===2||t===3){let l=this.el.content.firstChild;l.replaceWith(...l.childNodes)}for(;(i=v.nextNode())!==null&&a.length<u;){if(i.nodeType===1){if(i.hasAttributes())for(let l of i.getAttributeNames())if(l.endsWith(Ee)){let f=p[o++],g=i.getAttribute(l).split(_),V=/([.?@])?(.*)/.exec(f);a.push({type:1,index:r,name:V[2],strings:g,ctor:V[1]==="."?ne:V[1]==="?"?ie:V[1]==="@"?re:A}),i.removeAttribute(l)}else l.startsWith(_)&&(a.push({type:6,index:r}),i.removeAttribute(l));if(ke.test(i.tagName)){let l=i.textContent.split(_),f=l.length-1;if(f>0){i.textContent=B?B.emptyScript:"";for(let g=0;g<f;g++)i.append(l[g],U()),v.nextNode(),a.push({type:2,index:++r});i.append(l[f],U())}}}else if(i.nodeType===8)if(i.data===Se)a.push({type:2,index:r});else{let l=-1;for(;(l=i.data.indexOf(_,l+1))!==-1;)a.push({type:7,index:r}),l+=_.length-1}r++}}static createElement(e,t){let n=w.createElement("template");return n.innerHTML=e,n}};function x(s,e,t=s,n){if(e===b)return e;let i=n!==void 0?t._$Co?.[n]:t._$Cl,r=H(e)?void 0:e._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(s),i._$AT(s,t,n)),n!==void 0?(t._$Co??=[])[n]=i:t._$Cl=i),i!==void 0&&(e=x(s,i._$AS(s,e.values),i,n)),e}var se=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,i=(e?.creationScope??w).importNode(t,!0);v.currentNode=i;let r=v.nextNode(),o=0,u=0,a=n[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new L(r,r.nextSibling,this,e):a.type===1?d=new a.ctor(r,a.name,a.strings,this,e):a.type===6&&(d=new oe(r,this,e)),this._$AV.push(d),a=n[++u]}o!==a?.index&&(r=v.nextNode(),o++)}return v.currentNode=w,i}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(e,n,t),t+=n.strings.length-2):n._$AI(e[t])),t++}},L=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,i){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=x(this,e,t),H(e)?e===c||e==null||e===""?(this._$AH!==c&&this._$AR(),this._$AH=c):e!==this._$AH&&e!==b&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):tt(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==c&&H(this._$AH)?this._$AA.nextSibling.data=e:this.T(w.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,i=typeof n=="number"?this._$AC(e):(n.el===void 0&&(n.el=R.createElement(Te(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===i)this._$AH.p(t);else{let r=new se(i,this),o=r.u(this.options);r.p(t),this.T(o),this._$AH=r}}_$AC(e){let t=Ce.get(e.strings);return t===void 0&&Ce.set(e.strings,t=new R(e)),t}k(e){ce(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,n,i=0;for(let r of e)i===t.length?t.push(n=new s(this.O(U()),this.O(U()),this,this.options)):n=t[i],n._$AI(r),i++;i<t.length&&(this._$AR(n&&n._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let n=$e(e).nextSibling;$e(e).remove(),e=n}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},A=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,i,r){this.type=1,this._$AH=c,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=r,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=c}_$AI(e,t=this,n,i){let r=this.strings,o=!1;if(r===void 0)e=x(this,e,t,0),o=!H(e)||e!==this._$AH&&e!==b,o&&(this._$AH=e);else{let u=e,a,d;for(e=r[0],a=0;a<r.length-1;a++)d=x(this,u[n+a],t,a),d===b&&(d=this._$AH[a]),o||=!H(d)||d!==this._$AH[a],d===c?e=c:e!==c&&(e+=(d??"")+r[a+1]),this._$AH[a]=d}o&&!i&&this.j(e)}j(e){e===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},ne=class extends A{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===c?void 0:e}},ie=class extends A{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==c)}},re=class extends A{constructor(e,t,n,i,r){super(e,t,n,i,r),this.type=5}_$AI(e,t=this){if((e=x(this,e,t,0)??c)===b)return;let n=this._$AH,i=e===c&&n!==c||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,r=e!==c&&(n===c||i);i&&this.element.removeEventListener(this.name,this,n),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},oe=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){x(this,e)}};var nt=ae.litHtmlPolyfillSupport;nt?.(R,L),(ae.litHtmlVersions??=[]).push("3.3.3");var Pe=(s,e,t)=>{let n=t?.renderBefore??e,i=n._$litPart$;if(i===void 0){let r=t?.renderBefore??null;n._$litPart$=i=new L(e.insertBefore(U(),r),r,void 0,t??{})}return i._$AI(s),i};var de=globalThis,m=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Pe(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return b}};m._$litElement$=!0,m.finalized=!0,de.litElementHydrateSupport?.({LitElement:m});var it=de.litElementPolyfillSupport;it?.({LitElement:m});(de.litElementVersions??=[]).push("4.2.2");var rt=[{name:"entity",selector:{entity:{domain:"sensor",integration:"rugby_team_tracker"}}}],I=class extends m{constructor(){super(...arguments);this._label=t=>t.name==="entity"?"Game entity":t.name}setConfig(t){this._config=t}set hass(t){this._hass=t}_changed(t){let n={...this._config,...t.detail.value};this._config=n,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:n},bubbles:!0,composed:!0}))}render(){if(this._config)return h`<ha-form
      .hass=${this._hass}
      .data=${this._config}
      .schema=${rt}
      .computeLabel=${this._label}
      @value-changed=${this._changed}
    ></ha-form>`}};I.properties={_config:{state:!0},_hass:{state:!0}};customElements.get("rugby-tracker-game-card-editor")||customElements.define("rugby-tracker-game-card-editor",I);var ot=/^sensor\..*(current|next|previous)_game/;function F(s){return s?Object.keys(s).find(e=>ot.test(e))??"":""}function Ue(s,e,t){return!s||!e?!0:s[t]!==e[t]}function He(s,e,t){return!s||!e?!0:t.some(n=>s[n]!==e[n])}var at={mode:"empty",home:{name:""},away:{name:""},headline:"No game"},N=()=>({...at,home:{name:""},away:{name:""}}),C=s=>typeof s=="string"&&s!==""?s:void 0,he=s=>typeof s=="number"&&Number.isFinite(s)?s:void 0,ct=new Set(["www.rugbypass.com","rugbypass.com"]);function W(s){if(!(typeof s!="string"||s.trim()===""))try{let e=new URL(s);return e.protocol!=="https:"||!ct.has(e.hostname)||e.username!==""||e.password!==""||e.port!==""?void 0:e.href}catch{return}}function Ne(s,e){return`Open the match on the website: ${s} v ${e}`}var Re=s=>typeof s=="string"&&s.trim()!==""?s.trim():void 0,lt={one:"st",two:"nd",few:"rd",other:"th"},dt=s=>typeof s=="number"&&Number.isInteger(s)&&s>0?s:void 0;function ht(s,e){if(typeof e!="string"||!/^en(?:$|[-_])/i.test(e))return`#${s}`;let t;try{t=new Intl.PluralRules(e,{type:"ordinal"})}catch{t=new Intl.PluralRules("en",{type:"ordinal"})}return`${s}${lt[t.select(s)]??"th"}`}function q(s,e){let t=dt(s);return t===void 0?{}:{rank:t,rankLabel:ht(t,e)}}function Le(s,e,t){let n=C(s);if(!n)return{headline:"TBC"};let i=new Date(n);if(Number.isNaN(i.getTime()))return{headline:n};try{return{dateLine:new Intl.DateTimeFormat(e,{weekday:"short",day:"numeric",month:"short",timeZone:t}).format(i),headline:new Intl.DateTimeFormat(e,{hour:"2-digit",minute:"2-digit",timeZone:t}).format(i)}}catch{return{headline:n}}}function E(s,e,t){try{if(!s||s.state==="unavailable"||s.state==="unknown")return N();let n=s.attributes;if(!n||typeof n!="object")return N();let i=C(n.period),r=C(n.home_team),o=C(n.away_team);if(!i||!r||!o)return N();let u=n.logos&&typeof n.logos=="object"?n.logos:{},a=he(n.home_score),d=he(n.away_score),p={name:r,logo:C(u.home),score:a,...q(n.home_rank,e)},l={name:o,logo:C(u.away),score:d,...q(n.away_rank,e)},f=`${a??"-"} \u2013 ${d??"-"}`;switch(i){case"Kick off":return{mode:"upcoming",home:p,away:l,...Le(n.kickoff,e,t),venue:Re(n.venue)};case"Postponed":case"Cancelled":return{mode:"upcoming",home:p,away:l,...Le(n.kickoff,e,t),badge:i,venue:Re(n.venue)};case"First Half":case"Second Half":{let g=he(n.minute);return{mode:"live",home:p,away:l,headline:f,badge:g===void 0?i:`${i} ${g}'`,matchUrl:W(n.match_url)}}case"Result":return{mode:"final",home:p,away:l,headline:f,badge:"Full time",matchUrl:W(n.match_url)};default:return N()}}catch{return N()}}var Me=s=>`Open the match against ${s} on the website`,K=5,Oe=/_(?:current_game|next_game|previous_game_[1-5])$/,ut=/^([WLD]) \d+–\d+$/,ue=s=>typeof s=="string"&&s!==""?s:void 0;function Ve(s){if(typeof s!="string"||!Oe.test(s))return;let e=s.replace(Oe,"");return{current:`${e}_current_game`,next:`${e}_next_game`,previous:[1,2,3,4,5].map(t=>`${e}_previous_game_${t}`)}}function De(s){let e=Array.isArray(s?.previous)?s.previous.filter(n=>typeof n=="string"&&n!==""):[];if(!(!!s&&typeof s=="object"&&(typeof s.current=="string"||typeof s.next=="string"||Array.isArray(s.previous))))throw new Error("rugby-tracker-team-card: configure at least 'next', 'current' or 'previous'");return{...s,previous:e.slice(0,K)}}function pt(s){return[s.current,s.next,...(s.previous??[]).slice(0,K)].filter(e=>typeof e=="string"&&e!=="")}function mt(s,e,t){let n=ue(s);if(!n)return"\u2013";let i=new Date(n);if(Number.isNaN(i.getTime()))return n;try{return new Intl.DateTimeFormat(e,{day:"numeric",month:"short",timeZone:t}).format(i)}catch{return n}}function ft(s,e,t){try{if(!s||s.state==="unknown"||s.state==="unavailable")return;let n=s.attributes;if(!n||typeof n!="object")return;let i=ue(n.opposition);if(!i)return;let r=typeof s.state=="string"?s.state:"",o=ut.exec(r),u=o?{W:"win",L:"loss",D:"draw"}[o[1]]:"unknown";return{date:mt(n.kickoff,e,t),opposition:i,location:typeof n.venue=="string"&&n.venue.trim()!==""?n.venue.trim():void 0,...q(n.home_away==="home"?n.away_rank:n.home_away==="away"?n.home_rank:void 0,e),matchUrl:W(n.match_url),score:r||"Result unavailable",outcome:u}}catch{return}}function ze(s,e,t,n){let i=d=>d?s[d]:void 0,r=E(i(e.current),t,n),o=E(i(e.next),t,n),u=r.mode==="live"?r:o.mode==="upcoming"?o:E(void 0,t,n),a=(e.previous??[]).slice(0,K).map(d=>ft(i(d),t,n)).filter(d=>d!==void 0);return{top:u,previous:a,heading:ue(e.title)}}function je(s,e,t,n,i){return!s||e?!0:t?He(n,i,pt(s)):!0}function Be(s){return 2+Math.min(K,s)}function Ie(s){let e=Ve(F(s));return e?{type:"custom:rugby-tracker-team-card",...e}:{type:"custom:rugby-tracker-team-card",next:""}}function Fe(s,e,t,n){let i={type:t??"custom:rugby-tracker-team-card"};e&&(i.title=e);let r=s?Ve(s):void 0;return r?(i.current=r.current,i.next=r.next,i.previous=[...r.previous]):i.next=s??"",i}var gt=[{name:"entity",selector:{entity:{domain:"sensor",integration:"rugby_team_tracker"}}},{name:"title",selector:{text:{}}}],yt={entity:"Any game sensor for the team",title:"Title (optional)"},X=class extends m{constructor(){super(...arguments);this._helper=t=>t.name==="entity"?"Other sensors are filled in automatically. Set them individually in YAML if needed.":void 0;this._label=t=>yt[t.name]??t.name}setConfig(t){this._config=t}set hass(t){this._hass=t}_changed(t){let n=t.detail?.value??{},i=typeof n.entity=="string"?n.entity:"",r=typeof n.title=="string"&&n.title!==""?n.title:void 0,o=Fe(i,r,this._config?.type,this._config);this._config=o,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:o},bubbles:!0,composed:!0}))}render(){if(!this._config)return;let t={entity:this._config.next||this._config.current||this._config.previous?.[0]||"",title:this._config.title??""};return h`<ha-form
      .hass=${this._hass}
      .data=${t}
      .schema=${gt}
      .computeLabel=${this._label}
      .computeHelper=${this._helper}
      @value-changed=${this._changed}
    ></ha-form>`}};X.properties={_config:{state:!0},_hass:{state:!0}};customElements.get("rugby-tracker-team-card-editor")||customElements.define("rugby-tracker-team-card-editor",X);function J(s,e){s.customCards=s.customCards||[],s.customCards.some(t=>t.type===e.type)||s.customCards.push(e)}function We(s){return h`<div class="team">
    ${s.logo?h`<img class="logo" src=${s.logo} alt="" />`:h`<div class="logo"></div>`}
    <div class="name">
      ${s.name}${s.rankLabel?h` <span class="rank">${s.rankLabel}</span>`:c}
    </div>
  </div>`}function Y(s){if(s.mode==="empty")return h`<div class="empty">${s.headline}</div>`;let e=h`<div class="game ${s.mode}">
    <div class="row">
      ${We(s.home)}
      <div class="centre">
        ${s.dateLine?h`<div class="dateline">${s.dateLine}</div>`:c}
        <div class="headline">${s.headline}</div>
        ${s.venue?h`<div class="venue">${s.venue}</div>`:c}
        ${s.badge?h`<div class="badge">${s.badge}</div>`:c}
      </div>
      ${We(s.away)}
    </div>
  </div>`;return s.matchUrl?h`<a
    class="game-link"
    href=${s.matchUrl}
    target="_blank"
    rel="noopener noreferrer"
    aria-label=${Ne(s.home.name,s.away.name)}
    >${e}</a
  >`:e}var Q=k`
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
      max-width: 100%;
      overflow-wrap: anywhere;
    }
    .rank {
      font-size: 0.8em;
      font-weight: 400;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .centre {
      flex: 1;
      min-width: 0;
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
    .venue {
      min-width: 0;
      max-width: 100%;
      font-size: 0.85em;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .game-link,
    .prev-row a.prev-link {
      color: inherit;
      text-decoration: none;
      cursor: pointer;
      border-radius: 8px;
    }
    .game-link {
      display: block;
    }
    .game-link:hover,
    .game-link:focus-visible,
    .prev-row a.prev-link:hover,
    .prev-row a.prev-link:focus-visible {
      background: var(--secondary-background-color);
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
`;var O=class extends m{static getConfigElement(){return document.createElement("rugby-tracker-team-card-editor")}static getStubConfig(e){return Ie(e?.states)}shouldUpdate(e){let t=e.get("_hass");return je(this._config,e.has("_config"),e.has("_hass"),t?.states,this._hass?.states)}setConfig(e){this._config=De(e)}set hass(e){this._hass=e}getCardSize(){return Be(this._view()?.previous.length??0)}_view(){if(!this._config)return;let e=this._hass;return ze(e?.states??{},this._config,e?.locale?.language??"en",e?.config?.time_zone??"UTC")}render(){let e=this._view();return e?h`<ha-card>
      ${e.heading?h`<div class="heading">${e.heading}</div>`:c}
      ${Y(e.top)}
      <hr class="divider" />
      ${e.previous.length===0?h`<div class="none">No previous games</div>`:h`<ul class="previous">
            ${e.previous.map(t=>{let n=h`<span class="date">${t.date}</span>
                <span class="opp"
                  >${t.opposition}${t.rankLabel?h` <span class="rank">${t.rankLabel}</span>`:c}${t.location?h` <span class="loc">(${t.location})</span>`:c}</span
                >
                <span class="score ${t.outcome}">${t.score}</span>`;return h`<li class="prev-row">
                ${t.matchUrl?h`<a
                      class="prev-link"
                      href=${t.matchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label=${Me(t.opposition)}
                      >${n}</a
                    >`:n}
              </li>`})}
          </ul>`}
    </ha-card>`:c}};O.properties={_config:{state:!0},_hass:{state:!0}},O.styles=[Q,k`
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
      .prev-row a.prev-link {
        display: flex;
        flex: 1;
        min-width: 0;
        gap: 8px;
        align-items: baseline;
        margin: -3px -4px;
        padding: 3px 4px;
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
      .loc,
      .prev-row .rank {
        color: var(--secondary-text-color);
      }
      .prev-row .rank {
        font-size: inherit;
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
    `];customElements.get("rugby-tracker-team-card")||customElements.define("rugby-tracker-team-card",O);J(window,{type:"rugby-tracker-team-card",name:"Rugby Tracker Team Card",description:"Current or next game plus the previous five results for one team"});var M=class extends m{static getConfigElement(){return document.createElement("rugby-tracker-game-card-editor")}static getStubConfig(e){return{type:"custom:rugby-tracker-game-card",entity:F(e?.states)}}shouldUpdate(e){if(!this._config||e.has("_config"))return!0;if(e.has("_hass")){let t=e.get("_hass");return Ue(t?.states,this._hass?.states,this._config.entity)}return!0}setConfig(e){if(!e||typeof e.entity!="string"||!e.entity)throw new Error("rugby-tracker-game-card: 'entity' is required");this._config=e}set hass(e){this._hass=e}getCardSize(){return 2}_view(){let e=this._hass,t=e&&this._config?e.states[this._config.entity]:void 0;return E(t,e?.locale?.language??"en",e?.config?.time_zone??"UTC")}render(){return this._config?h`<ha-card>${Y(this._view())}</ha-card>`:c}};M.properties={_config:{state:!0},_hass:{state:!0}},M.styles=Q;customElements.get("rugby-tracker-game-card")||customElements.define("rugby-tracker-game-card",M);J(window,{type:"rugby-tracker-game-card",name:"Rugby Tracker Game Card",description:"Shows a rugby game: kick-off, live score or final result."});export{M as RugbyTrackerGameCard};
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
