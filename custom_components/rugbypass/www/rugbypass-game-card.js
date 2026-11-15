var D=globalThis,z=D.ShadowRoot&&(D.ShadyCSS===void 0||D.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Q=Symbol(),ue=new WeakMap,S=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==Q)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(z&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=ue.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&ue.set(t,e))}return e}toString(){return this.cssText}},pe=n=>new S(typeof n=="string"?n:n+"",void 0,Q),k=(n,...e)=>{let t=n.length===1?n[0]:e.reduce((s,i,r)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[r+1],n[0]);return new S(t,n,Q)},me=(n,e)=>{if(z)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=D.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,n.appendChild(s)}},G=z?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return pe(t)})(n):n;var{is:Be,defineProperty:Ie,getOwnPropertyDescriptor:Fe,getOwnPropertyNames:We,getOwnPropertySymbols:qe,getPrototypeOf:Ke}=Object,j=globalThis,ge=j.trustedTypes,Xe=ge?ge.emptyScript:"",Je=j.reactiveElementPolyfillSupport,T=(n,e)=>n,Z={toAttribute(n,e){switch(e){case Boolean:n=n?Xe:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},ye=(n,e)=>!Be(n,e),fe={attribute:!0,type:String,converter:Z,reflect:!1,useDefault:!1,hasChanged:ye};Symbol.metadata??=Symbol("metadata"),j.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=fe){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&Ie(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:r}=Fe(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:i,set(o){let h=i?.call(this);r?.call(this,o),this.requestUpdate(e,h,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??fe}static _$Ei(){if(this.hasOwnProperty(T("elementProperties")))return;let e=Ke(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(T("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(T("properties"))){let t=this.properties,s=[...We(t),...qe(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(G(i))}else e!==void 0&&t.push(G(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return me(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let r=(s.converter?.toAttribute!==void 0?s.converter:Z).toAttribute(t,s.type);this._$Em=e,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let r=s.getPropertyOptions(i),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:Z;this._$Em=i;let h=o.fromAttribute(t,r.type);this[i]=h??this._$Ej?.get(i)??h,this._$Em=null}}requestUpdate(e,t,s,i=!1,r){if(e!==void 0){let o=this.constructor;if(i===!1&&(r=this[e]),s??=o.getPropertyOptions(e),!((s.hasChanged??ye)(r,t)||s.useDefault&&s.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:r},o){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),r!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,r]of s){let{wrapped:o}=r,h=this[i];o!==!0||this._$AL.has(i)||h===void 0||this.C(i,void 0,r,h)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[T("elementProperties")]=new Map,y[T("finalized")]=new Map,Je?.({ReactiveElement:y}),(j.reactiveElementVersions??=[]).push("2.1.2");var oe=globalThis,_e=n=>n,B=oe.trustedTypes,$e=B?B.createPolicy("lit-html",{createHTML:n=>n}):void 0,Ce="$lit$",_=`lit$${Math.random().toFixed(9).slice(2)}$`,Ee="?"+_,Ye=`<${Ee}>`,w=document,P=()=>w.createComment(""),R=n=>n===null||typeof n!="object"&&typeof n!="function",ae=Array.isArray,Qe=n=>ae(n)||typeof n?.[Symbol.iterator]=="function",ee=`[ 	
\f\r]`,H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ve=/-->/g,we=/>/g,$=RegExp(`>|${ee}(?:([^\\s"'>=/]+)(${ee}*=${ee}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),be=/'/g,Ae=/"/g,Se=/^(?:script|style|textarea|title)$/i,ce=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),u=ce(1),yt=ce(2),_t=ce(3),b=Symbol.for("lit-noChange"),l=Symbol.for("lit-nothing"),xe=new WeakMap,v=w.createTreeWalker(w,129);function ke(n,e){if(!ae(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return $e!==void 0?$e.createHTML(e):e}var Ge=(n,e)=>{let t=n.length-1,s=[],i,r=e===2?"<svg>":e===3?"<math>":"",o=H;for(let h=0;h<t;h++){let a=n[h],d,p,c=-1,g=0;for(;g<a.length&&(o.lastIndex=g,p=o.exec(a),p!==null);)g=o.lastIndex,o===H?p[1]==="!--"?o=ve:p[1]!==void 0?o=we:p[2]!==void 0?(Se.test(p[2])&&(i=RegExp("</"+p[2],"g")),o=$):p[3]!==void 0&&(o=$):o===$?p[0]===">"?(o=i??H,c=-1):p[1]===void 0?c=-2:(c=o.lastIndex-p[2].length,d=p[1],o=p[3]===void 0?$:p[3]==='"'?Ae:be):o===Ae||o===be?o=$:o===ve||o===we?o=H:(o=$,i=void 0);let f=o===$&&n[h+1].startsWith("/>")?" ":"";r+=o===H?a+Ye:c>=0?(s.push(d),a.slice(0,c)+Ce+a.slice(c)+_+f):a+_+(c===-2?h:f)}return[ke(n,r+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},U=class n{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let r=0,o=0,h=e.length-1,a=this.parts,[d,p]=Ge(e,t);if(this.el=n.createElement(d,s),v.currentNode=this.el.content,t===2||t===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(i=v.nextNode())!==null&&a.length<h;){if(i.nodeType===1){if(i.hasAttributes())for(let c of i.getAttributeNames())if(c.endsWith(Ce)){let g=p[o++],f=i.getAttribute(c).split(_),V=/([.?@])?(.*)/.exec(g);a.push({type:1,index:r,name:V[2],strings:f,ctor:V[1]==="."?se:V[1]==="?"?ne:V[1]==="@"?ie:x}),i.removeAttribute(c)}else c.startsWith(_)&&(a.push({type:6,index:r}),i.removeAttribute(c));if(Se.test(i.tagName)){let c=i.textContent.split(_),g=c.length-1;if(g>0){i.textContent=B?B.emptyScript:"";for(let f=0;f<g;f++)i.append(c[f],P()),v.nextNode(),a.push({type:2,index:++r});i.append(c[g],P())}}}else if(i.nodeType===8)if(i.data===Ee)a.push({type:2,index:r});else{let c=-1;for(;(c=i.data.indexOf(_,c+1))!==-1;)a.push({type:7,index:r}),c+=_.length-1}r++}}static createElement(e,t){let s=w.createElement("template");return s.innerHTML=e,s}};function A(n,e,t=n,s){if(e===b)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,r=R(e)?void 0:e._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(n),i._$AT(n,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=A(n,i._$AS(n,e.values),i,s)),e}var te=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??w).importNode(t,!0);v.currentNode=i;let r=v.nextNode(),o=0,h=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new L(r,r.nextSibling,this,e):a.type===1?d=new a.ctor(r,a.name,a.strings,this,e):a.type===6&&(d=new re(r,this,e)),this._$AV.push(d),a=s[++h]}o!==a?.index&&(r=v.nextNode(),o++)}return v.currentNode=w,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},L=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=l,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=A(this,e,t),R(e)?e===l||e==null||e===""?(this._$AH!==l&&this._$AR(),this._$AH=l):e!==this._$AH&&e!==b&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Qe(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==l&&R(this._$AH)?this._$AA.nextSibling.data=e:this.T(w.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=U.createElement(ke(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let r=new te(i,this),o=r.u(this.options);r.p(t),this.T(o),this._$AH=r}}_$AC(e){let t=xe.get(e.strings);return t===void 0&&xe.set(e.strings,t=new U(e)),t}k(e){ae(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let r of e)i===t.length?t.push(s=new n(this.O(P()),this.O(P()),this,this.options)):s=t[i],s._$AI(r),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=_e(e).nextSibling;_e(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},x=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,r){this.type=1,this._$AH=l,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=l}_$AI(e,t=this,s,i){let r=this.strings,o=!1;if(r===void 0)e=A(this,e,t,0),o=!R(e)||e!==this._$AH&&e!==b,o&&(this._$AH=e);else{let h=e,a,d;for(e=r[0],a=0;a<r.length-1;a++)d=A(this,h[s+a],t,a),d===b&&(d=this._$AH[a]),o||=!R(d)||d!==this._$AH[a],d===l?e=l:e!==l&&(e+=(d??"")+r[a+1]),this._$AH[a]=d}o&&!i&&this.j(e)}j(e){e===l?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},se=class extends x{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===l?void 0:e}},ne=class extends x{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==l)}},ie=class extends x{constructor(e,t,s,i,r){super(e,t,s,i,r),this.type=5}_$AI(e,t=this){if((e=A(this,e,t,0)??l)===b)return;let s=this._$AH,i=e===l&&s!==l||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,r=e!==l&&(s===l||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},re=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){A(this,e)}};var Ze=oe.litHtmlPolyfillSupport;Ze?.(U,L),(oe.litHtmlVersions??=[]).push("3.3.3");var Te=(n,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let r=t?.renderBefore??null;s._$litPart$=i=new L(e.insertBefore(P(),r),r,void 0,t??{})}return i._$AI(n),i};var le=globalThis,m=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Te(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return b}};m._$litElement$=!0,m.finalized=!0,le.litElementHydrateSupport?.({LitElement:m});var et=le.litElementPolyfillSupport;et?.({LitElement:m});(le.litElementVersions??=[]).push("4.2.2");var tt=[{name:"entity",selector:{entity:{domain:"sensor",integration:"rugbypass"}}}],I=class extends m{constructor(){super(...arguments);this._label=t=>t.name==="entity"?"Game entity":t.name}setConfig(t){this._config=t}set hass(t){this._hass=t}_changed(t){let s={...this._config,...t.detail.value};this._config=s,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:s},bubbles:!0,composed:!0}))}render(){if(this._config)return u`<ha-form
      .hass=${this._hass}
      .data=${this._config}
      .schema=${tt}
      .computeLabel=${this._label}
      @value-changed=${this._changed}
    ></ha-form>`}};I.properties={_config:{state:!0},_hass:{state:!0}};customElements.get("rugbypass-game-card-editor")||customElements.define("rugbypass-game-card-editor",I);var st=/^sensor\..*(current|next|previous)_game/;function F(n){return n?Object.keys(n).find(e=>st.test(e))??"":""}function He(n,e,t){return!n||!e?!0:n[t]!==e[t]}function Pe(n,e,t){return!n||!e?!0:t.some(s=>n[s]!==e[s])}var nt={mode:"empty",home:{name:""},away:{name:""},headline:"No game"},N=()=>({...nt,home:{name:""},away:{name:""}}),C=n=>typeof n=="string"&&n!==""?n:void 0,de=n=>typeof n=="number"&&Number.isFinite(n)?n:void 0,it={one:"st",two:"nd",few:"rd",other:"th"},rt=n=>typeof n=="number"&&Number.isInteger(n)&&n>0?n:void 0;function ot(n,e){if(typeof e!="string"||!/^en(?:$|[-_])/i.test(e))return`#${n}`;let t;try{t=new Intl.PluralRules(e,{type:"ordinal"})}catch{t=new Intl.PluralRules("en",{type:"ordinal"})}return`${n}${it[t.select(n)]??"th"}`}function W(n,e){let t=rt(n);return t===void 0?{}:{rank:t,rankLabel:ot(t,e)}}function Re(n,e,t){let s=C(n);if(!s)return{headline:"TBC"};let i=new Date(s);if(Number.isNaN(i.getTime()))return{headline:s};try{return{dateLine:new Intl.DateTimeFormat(e,{weekday:"short",day:"numeric",month:"short",timeZone:t}).format(i),headline:new Intl.DateTimeFormat(e,{hour:"2-digit",minute:"2-digit",timeZone:t}).format(i)}}catch{return{headline:s}}}function E(n,e,t){try{if(!n||n.state==="unavailable"||n.state==="unknown")return N();let s=n.attributes;if(!s||typeof s!="object")return N();let i=C(s.period),r=C(s.home_team),o=C(s.away_team);if(!i||!r||!o)return N();let h=s.logos&&typeof s.logos=="object"?s.logos:{},a=de(s.home_score),d=de(s.away_score),p={name:r,logo:C(h.home),score:a,...W(s.home_rank,e)},c={name:o,logo:C(h.away),score:d,...W(s.away_rank,e)},g=`${a??"-"} \u2013 ${d??"-"}`;switch(i){case"Kick off":return{mode:"upcoming",home:p,away:c,...Re(s.kickoff,e,t)};case"Postponed":case"Cancelled":return{mode:"upcoming",home:p,away:c,...Re(s.kickoff,e,t),badge:i};case"First Half":case"Second Half":{let f=de(s.minute);return{mode:"live",home:p,away:c,headline:g,badge:f===void 0?i:`${i} ${f}'`}}case"Result":return{mode:"final",home:p,away:c,headline:g,badge:"Full time"};default:return N()}}catch{return N()}}var q=5,Ue=/_(?:current_game|next_game|previous_game_[1-5])$/,at=/^([WLD]) \d+–\d+$/,he=n=>typeof n=="string"&&n!==""?n:void 0;function Le(n){if(typeof n!="string"||!Ue.test(n))return;let e=n.replace(Ue,"");return{current:`${e}_current_game`,next:`${e}_next_game`,previous:[1,2,3,4,5].map(t=>`${e}_previous_game_${t}`)}}function Ne(n){let e=Array.isArray(n?.previous)?n.previous.filter(s=>typeof s=="string"&&s!==""):[];if(!(!!n&&typeof n=="object"&&(typeof n.current=="string"||typeof n.next=="string"||Array.isArray(n.previous))))throw new Error("rugbypass-team-card: configure at least 'next', 'current' or 'previous'");return{...n,previous:e.slice(0,q)}}function ct(n){return[n.current,n.next,...(n.previous??[]).slice(0,q)].filter(e=>typeof e=="string"&&e!=="")}function lt(n,e,t){let s=he(n);if(!s)return"\u2013";let i=new Date(s);if(Number.isNaN(i.getTime()))return s;try{return new Intl.DateTimeFormat(e,{day:"numeric",month:"short",timeZone:t}).format(i)}catch{return s}}function dt(n,e,t){try{if(!n||n.state==="unknown"||n.state==="unavailable")return;let s=n.attributes;if(!s||typeof s!="object")return;let i=he(s.opposition);if(!i)return;let r=typeof n.state=="string"?n.state:"",o=at.exec(r),h=o?{W:"win",L:"loss",D:"draw"}[o[1]]:"unknown";return{date:lt(s.kickoff,e,t),opposition:i,location:typeof s.venue=="string"&&s.venue.trim()!==""?s.venue.trim():void 0,...W(s.home_away==="home"?s.away_rank:s.home_away==="away"?s.home_rank:void 0,e),score:r||"Result unavailable",outcome:h}}catch{return}}function Me(n,e,t,s){let i=d=>d?n[d]:void 0,r=E(i(e.current),t,s),o=E(i(e.next),t,s),h=r.mode==="live"?r:o.mode==="upcoming"?o:E(void 0,t,s),a=(e.previous??[]).slice(0,q).map(d=>dt(i(d),t,s)).filter(d=>d!==void 0);return{top:h,previous:a,heading:he(e.title)}}function Oe(n,e,t,s,i){return!n||e?!0:t?Pe(s,i,ct(n)):!0}function Ve(n){return 2+Math.min(q,n)}function De(n){let e=Le(F(n));return e?{type:"custom:rugbypass-team-card",...e}:{type:"custom:rugbypass-team-card",next:""}}function ze(n,e,t,s){let i={type:t??"custom:rugbypass-team-card"};e&&(i.title=e);let r=n?Le(n):void 0;return r?(i.current=r.current,i.next=r.next,i.previous=[...r.previous]):i.next=n??"",i}var ht=[{name:"entity",selector:{entity:{domain:"sensor",integration:"rugbypass"}}},{name:"title",selector:{text:{}}}],ut={entity:"Any game sensor for the team",title:"Title (optional)"},K=class extends m{constructor(){super(...arguments);this._helper=t=>t.name==="entity"?"Other sensors are filled in automatically. Set them individually in YAML if needed.":void 0;this._label=t=>ut[t.name]??t.name}setConfig(t){this._config=t}set hass(t){this._hass=t}_changed(t){let s=t.detail?.value??{},i=typeof s.entity=="string"?s.entity:"",r=typeof s.title=="string"&&s.title!==""?s.title:void 0,o=ze(i,r,this._config?.type,this._config);this._config=o,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:o},bubbles:!0,composed:!0}))}render(){if(!this._config)return;let t={entity:this._config.next||this._config.current||this._config.previous?.[0]||"",title:this._config.title??""};return u`<ha-form
      .hass=${this._hass}
      .data=${t}
      .schema=${ht}
      .computeLabel=${this._label}
      .computeHelper=${this._helper}
      @value-changed=${this._changed}
    ></ha-form>`}};K.properties={_config:{state:!0},_hass:{state:!0}};customElements.get("rugbypass-team-card-editor")||customElements.define("rugbypass-team-card-editor",K);function X(n,e){n.customCards=n.customCards||[],n.customCards.some(t=>t.type===e.type)||n.customCards.push(e)}function je(n){return u`<div class="team">
    ${n.logo?u`<img class="logo" src=${n.logo} alt="" />`:u`<div class="logo"></div>`}
    <div class="name">
      ${n.name}${n.rankLabel?u` <span class="rank">${n.rankLabel}</span>`:l}
    </div>
  </div>`}function J(n){return n.mode==="empty"?u`<div class="empty">${n.headline}</div>`:u`<div class="game ${n.mode}">
    <div class="row">
      ${je(n.home)}
      <div class="centre">
        ${n.dateLine?u`<div class="dateline">${n.dateLine}</div>`:l}
        <div class="headline">${n.headline}</div>
        ${n.badge?u`<div class="badge">${n.badge}</div>`:l}
      </div>
      ${je(n.away)}
    </div>
  </div>`}var Y=k`
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
`;var M=class extends m{static getConfigElement(){return document.createElement("rugbypass-team-card-editor")}static getStubConfig(e){return De(e?.states)}shouldUpdate(e){let t=e.get("_hass");return Oe(this._config,e.has("_config"),e.has("_hass"),t?.states,this._hass?.states)}setConfig(e){this._config=Ne(e)}set hass(e){this._hass=e}getCardSize(){return Ve(this._view()?.previous.length??0)}_view(){if(!this._config)return;let e=this._hass;return Me(e?.states??{},this._config,e?.locale?.language??"en",e?.config?.time_zone??"UTC")}render(){let e=this._view();return e?u`<ha-card>
      ${e.heading?u`<div class="heading">${e.heading}</div>`:l}
      ${J(e.top)}
      <hr class="divider" />
      ${e.previous.length===0?u`<div class="none">No previous games</div>`:u`<ul class="previous">
            ${e.previous.map(t=>u`<li class="prev-row">
                <span class="date">${t.date}</span>
                <span class="opp"
                  >${t.opposition}${t.rankLabel?u` <span class="rank">${t.rankLabel}</span>`:l}${t.location?u` <span class="loc">(${t.location})</span>`:l}</span
                >
                <span class="score ${t.outcome}">${t.score}</span>
              </li>`)}
          </ul>`}
    </ha-card>`:l}};M.properties={_config:{state:!0},_hass:{state:!0}},M.styles=[Y,k`
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
    `];customElements.get("rugbypass-team-card")||customElements.define("rugbypass-team-card",M);X(window,{type:"rugbypass-team-card",name:"RugbyPass Team Card",description:"Current or next game plus the previous five results for one team"});var O=class extends m{static getConfigElement(){return document.createElement("rugbypass-game-card-editor")}static getStubConfig(e){return{type:"custom:rugbypass-game-card",entity:F(e?.states)}}shouldUpdate(e){if(!this._config||e.has("_config"))return!0;if(e.has("_hass")){let t=e.get("_hass");return He(t?.states,this._hass?.states,this._config.entity)}return!0}setConfig(e){if(!e||typeof e.entity!="string"||!e.entity)throw new Error("rugbypass-game-card: 'entity' is required");this._config=e}set hass(e){this._hass=e}getCardSize(){return 2}_view(){let e=this._hass,t=e&&this._config?e.states[this._config.entity]:void 0;return E(t,e?.locale?.language??"en",e?.config?.time_zone??"UTC")}render(){return this._config?u`<ha-card>${J(this._view())}</ha-card>`:l}};O.properties={_config:{state:!0},_hass:{state:!0}},O.styles=Y;customElements.get("rugbypass-game-card")||customElements.define("rugbypass-game-card",O);X(window,{type:"rugbypass-game-card",name:"RugbyPass Game Card",description:"Shows a RugbyPass game: kick-off, live score or final result."});export{O as RugbyPassGameCard};
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
