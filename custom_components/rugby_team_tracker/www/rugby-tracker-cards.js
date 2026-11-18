var B=globalThis,I=B.ShadowRoot&&(B.ShadyCSS===void 0||B.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Z=Symbol(),pe=new WeakMap,T=class{constructor(e,n,s){if(this._$cssResult$=!0,s!==Z)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=n}get styleSheet(){let e=this.o,n=this.t;if(I&&e===void 0){let s=n!==void 0&&n.length===1;s&&(e=pe.get(n)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&pe.set(n,e))}return e}toString(){return this.cssText}},me=t=>new T(typeof t=="string"?t:t+"",void 0,Z),U=(t,...e)=>{let n=t.length===1?t[0]:e.reduce((s,r,i)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+t[i+1],t[0]);return new T(n,t,Z)},fe=(t,e)=>{if(I)t.adoptedStyleSheets=e.map(n=>n instanceof CSSStyleSheet?n:n.styleSheet);else for(let n of e){let s=document.createElement("style"),r=B.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=n.cssText,t.appendChild(s)}},ee=I?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let n="";for(let s of e.cssRules)n+=s.cssText;return me(n)})(t):t;var{is:Ge,defineProperty:Qe,getOwnPropertyDescriptor:Ze,getOwnPropertyNames:et,getOwnPropertySymbols:tt,getPrototypeOf:nt}=Object,F=globalThis,ge=F.trustedTypes,st=ge?ge.emptyScript:"",rt=F.reactiveElementPolyfillSupport,P=(t,e)=>t,te={toAttribute(t,e){switch(e){case Boolean:t=t?st:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let n=t;switch(e){case Boolean:n=t!==null;break;case Number:n=t===null?null:Number(t);break;case Object:case Array:try{n=JSON.parse(t)}catch{n=null}}return n}},_e=(t,e)=>!Ge(t,e),ye={attribute:!0,type:String,converter:te,reflect:!1,useDefault:!1,hasChanged:_e};Symbol.metadata??=Symbol("metadata"),F.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,n=ye){if(n.state&&(n.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((n=Object.create(n)).wrapped=!0),this.elementProperties.set(e,n),!n.noAccessor){let s=Symbol(),r=this.getPropertyDescriptor(e,s,n);r!==void 0&&Qe(this.prototype,e,r)}}static getPropertyDescriptor(e,n,s){let{get:r,set:i}=Ze(this.prototype,e)??{get(){return this[n]},set(o){this[n]=o}};return{get:r,set(o){let c=r?.call(this);i?.call(this,o),this.requestUpdate(e,c,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ye}static _$Ei(){if(this.hasOwnProperty(P("elementProperties")))return;let e=nt(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(P("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(P("properties"))){let n=this.properties,s=[...et(n),...tt(n)];for(let r of s)this.createProperty(r,n[r])}let e=this[Symbol.metadata];if(e!==null){let n=litPropertyMetadata.get(e);if(n!==void 0)for(let[s,r]of n)this.elementProperties.set(s,r)}this._$Eh=new Map;for(let[n,s]of this.elementProperties){let r=this._$Eu(n,s);r!==void 0&&this._$Eh.set(r,n)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let n=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let r of s)n.unshift(ee(r))}else e!==void 0&&n.push(ee(e));return n}static _$Eu(e,n){let s=n.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,n=this.constructor.elementProperties;for(let s of n.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return fe(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,n,s){this._$AK(e,s)}_$ET(e,n){let s=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,s);if(r!==void 0&&s.reflect===!0){let i=(s.converter?.toAttribute!==void 0?s.converter:te).toAttribute(n,s.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,n){let s=this.constructor,r=s._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let i=s.getPropertyOptions(r),o=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:te;this._$Em=r;let c=o.fromAttribute(n,i.type);this[r]=c??this._$Ej?.get(r)??c,this._$Em=null}}requestUpdate(e,n,s,r=!1,i){if(e!==void 0){let o=this.constructor;if(r===!1&&(i=this[e]),s??=o.getPropertyOptions(e),!((s.hasChanged??_e)(i,n)||s.useDefault&&s.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,s))))return;this.C(e,n,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,n,{useDefault:s,reflect:r,wrapped:i},o){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??n??this[e]),i!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(n=void 0),this._$AL.set(e,n)),r===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(n){Promise.reject(n)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,i]of this._$Ep)this[r]=i;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[r,i]of s){let{wrapped:o}=i,c=this[r];o!==!0||this._$AL.has(r)||c===void 0||this.C(r,void 0,i,c)}}let e=!1,n=this._$AL;try{e=this.shouldUpdate(n),e?(this.willUpdate(n),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(n)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(n)}willUpdate(e){}_$AE(e){this._$EO?.forEach(n=>n.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(n=>this._$ET(n,this[n])),this._$EM()}updated(e){}firstUpdated(e){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[P("elementProperties")]=new Map,y[P("finalized")]=new Map,rt?.({ReactiveElement:y}),(F.reactiveElementVersions??=[]).push("2.1.2");var ce=globalThis,$e=t=>t,W=ce.trustedTypes,ve=W?W.createPolicy("lit-html",{createHTML:t=>t}):void 0,ke="$lit$",_=`lit$${Math.random().toFixed(9).slice(2)}$`,Ee="?"+_,it=`<${Ee}>`,b=document,L=()=>b.createComment(""),R=t=>t===null||typeof t!="object"&&typeof t!="function",le=Array.isArray,ot=t=>le(t)||typeof t?.[Symbol.iterator]=="function",ne=`[ 	
\f\r]`,H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,we=/-->/g,be=/>/g,v=RegExp(`>|${ne}(?:([^\\s"'>=/]+)(${ne}*=${ne}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),xe=/'/g,Ae=/"/g,Se=/^(?:script|style|textarea|title)$/i,de=t=>(e,...n)=>({_$litType$:t,strings:e,values:n}),l=de(1),Pt=de(2),Ht=de(3),x=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),Ce=new WeakMap,w=b.createTreeWalker(b,129);function Te(t,e){if(!le(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return ve!==void 0?ve.createHTML(e):e}var at=(t,e)=>{let n=t.length-1,s=[],r,i=e===2?"<svg>":e===3?"<math>":"",o=H;for(let c=0;c<n;c++){let a=t[c],p,u,d=-1,f=0;for(;f<a.length&&(o.lastIndex=f,u=o.exec(a),u!==null);)f=o.lastIndex,o===H?u[1]==="!--"?o=we:u[1]!==void 0?o=be:u[2]!==void 0?(Se.test(u[2])&&(r=RegExp("</"+u[2],"g")),o=v):u[3]!==void 0&&(o=v):o===v?u[0]===">"?(o=r??H,d=-1):u[1]===void 0?d=-2:(d=o.lastIndex-u[2].length,p=u[1],o=u[3]===void 0?v:u[3]==='"'?Ae:xe):o===Ae||o===xe?o=v:o===we||o===be?o=H:(o=v,r=void 0);let g=o===v&&t[c+1].startsWith("/>")?" ":"";i+=o===H?a+it:d>=0?(s.push(p),a.slice(0,d)+ke+a.slice(d)+_+g):a+_+(d===-2?c:g)}return[Te(t,i+(t[n]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},O=class t{constructor({strings:e,_$litType$:n},s){let r;this.parts=[];let i=0,o=0,c=e.length-1,a=this.parts,[p,u]=at(e,n);if(this.el=t.createElement(p,s),w.currentNode=this.el.content,n===2||n===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=w.nextNode())!==null&&a.length<c;){if(r.nodeType===1){if(r.hasAttributes())for(let d of r.getAttributeNames())if(d.endsWith(ke)){let f=u[o++],g=r.getAttribute(d).split(_),j=/([.?@])?(.*)/.exec(f);a.push({type:1,index:i,name:j[2],strings:g,ctor:j[1]==="."?re:j[1]==="?"?ie:j[1]==="@"?oe:C}),r.removeAttribute(d)}else d.startsWith(_)&&(a.push({type:6,index:i}),r.removeAttribute(d));if(Se.test(r.tagName)){let d=r.textContent.split(_),f=d.length-1;if(f>0){r.textContent=W?W.emptyScript:"";for(let g=0;g<f;g++)r.append(d[g],L()),w.nextNode(),a.push({type:2,index:++i});r.append(d[f],L())}}}else if(r.nodeType===8)if(r.data===Ee)a.push({type:2,index:i});else{let d=-1;for(;(d=r.data.indexOf(_,d+1))!==-1;)a.push({type:7,index:i}),d+=_.length-1}i++}}static createElement(e,n){let s=b.createElement("template");return s.innerHTML=e,s}};function A(t,e,n=t,s){if(e===x)return e;let r=s!==void 0?n._$Co?.[s]:n._$Cl,i=R(e)?void 0:e._$litDirective$;return r?.constructor!==i&&(r?._$AO?.(!1),i===void 0?r=void 0:(r=new i(t),r._$AT(t,n,s)),s!==void 0?(n._$Co??=[])[s]=r:n._$Cl=r),r!==void 0&&(e=A(t,r._$AS(t,e.values),r,s)),e}var se=class{constructor(e,n){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=n}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:n},parts:s}=this._$AD,r=(e?.creationScope??b).importNode(n,!0);w.currentNode=r;let i=w.nextNode(),o=0,c=0,a=s[0];for(;a!==void 0;){if(o===a.index){let p;a.type===2?p=new M(i,i.nextSibling,this,e):a.type===1?p=new a.ctor(i,a.name,a.strings,this,e):a.type===6&&(p=new ae(i,this,e)),this._$AV.push(p),a=s[++c]}o!==a?.index&&(i=w.nextNode(),o++)}return w.currentNode=b,r}p(e){let n=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,n),n+=s.strings.length-2):s._$AI(e[n])),n++}},M=class t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,n,s,r){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=e,this._$AB=n,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,n=this._$AM;return n!==void 0&&e?.nodeType===11&&(e=n.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,n=this){e=A(this,e,n),R(e)?e===h||e==null||e===""?(this._$AH!==h&&this._$AR(),this._$AH=h):e!==this._$AH&&e!==x&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):ot(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==h&&R(this._$AH)?this._$AA.nextSibling.data=e:this.T(b.createTextNode(e)),this._$AH=e}$(e){let{values:n,_$litType$:s}=e,r=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=O.createElement(Te(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(n);else{let i=new se(r,this),o=i.u(this.options);i.p(n),this.T(o),this._$AH=i}}_$AC(e){let n=Ce.get(e.strings);return n===void 0&&Ce.set(e.strings,n=new O(e)),n}k(e){le(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,s,r=0;for(let i of e)r===n.length?n.push(s=new t(this.O(L()),this.O(L()),this,this.options)):s=n[r],s._$AI(i),r++;r<n.length&&(this._$AR(s&&s._$AB.nextSibling,r),n.length=r)}_$AR(e=this._$AA.nextSibling,n){for(this._$AP?.(!1,!0,n);e!==this._$AB;){let s=$e(e).nextSibling;$e(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},C=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,n,s,r,i){this.type=1,this._$AH=h,this._$AN=void 0,this.element=e,this.name=n,this._$AM=r,this.options=i,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=h}_$AI(e,n=this,s,r){let i=this.strings,o=!1;if(i===void 0)e=A(this,e,n,0),o=!R(e)||e!==this._$AH&&e!==x,o&&(this._$AH=e);else{let c=e,a,p;for(e=i[0],a=0;a<i.length-1;a++)p=A(this,c[s+a],n,a),p===x&&(p=this._$AH[a]),o||=!R(p)||p!==this._$AH[a],p===h?e=h:e!==h&&(e+=(p??"")+i[a+1]),this._$AH[a]=p}o&&!r&&this.j(e)}j(e){e===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},re=class extends C{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===h?void 0:e}},ie=class extends C{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==h)}},oe=class extends C{constructor(e,n,s,r,i){super(e,n,s,r,i),this.type=5}_$AI(e,n=this){if((e=A(this,e,n,0)??h)===x)return;let s=this._$AH,r=e===h&&s!==h||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,i=e!==h&&(s===h||r);r&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},ae=class{constructor(e,n,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=n,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){A(this,e)}};var ct=ce.litHtmlPolyfillSupport;ct?.(O,M),(ce.litHtmlVersions??=[]).push("3.3.3");var Ue=(t,e,n)=>{let s=n?.renderBefore??e,r=s._$litPart$;if(r===void 0){let i=n?.renderBefore??null;s._$litPart$=r=new M(e.insertBefore(L(),i),i,void 0,n??{})}return r._$AI(t),r};var he=globalThis,m=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let n=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ue(n,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return x}};m._$litElement$=!0,m.finalized=!0,he.litElementHydrateSupport?.({LitElement:m});var lt=he.litElementPolyfillSupport;lt?.({LitElement:m});(he.litElementVersions??=[]).push("4.2.2");var dt=[{name:"entity",selector:{entity:{domain:"sensor",integration:"rugby_team_tracker"}}}],q=class extends m{constructor(){super(...arguments);this._label=n=>n.name==="entity"?"Game entity":n.name}setConfig(n){this._config=n}set hass(n){this._hass=n}_changed(n){let s={...this._config,...n.detail.value};this._config=s,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:s},bubbles:!0,composed:!0}))}render(){if(this._config)return l`<ha-form
      .hass=${this._hass}
      .data=${this._config}
      .schema=${dt}
      .computeLabel=${this._label}
      @value-changed=${this._changed}
    ></ha-form>`}};q.properties={_config:{state:!0},_hass:{state:!0}};customElements.get("rugby-tracker-game-card-editor")||customElements.define("rugby-tracker-game-card-editor",q);var ht=/^sensor\..*(current|next|previous)_game/;function K(t){return t?Object.keys(t).find(e=>ht.test(e))??"":""}function Pe(t,e,n){return!t||!e?!0:t[n]!==e[n]}function He(t,e,n){return!t||!e?!0:n.some(s=>t[s]!==e[s])}var ut={mode:"empty",home:{name:""},away:{name:""},headline:"No game"},N=()=>({...ut,home:{name:""},away:{name:""}}),k=t=>typeof t=="string"&&t!==""?t:void 0,ue=t=>typeof t=="number"&&Number.isFinite(t)?t:void 0,pt=new Set(["www.rugbypass.com","rugbypass.com"]);function $(t){if(!(typeof t!="string"||t.trim()===""))try{let e=new URL(t);return e.protocol!=="https:"||!pt.has(e.hostname)||e.username!==""||e.password!==""||e.port!==""?void 0:e.href}catch{return}}var Le=$;function Me(t,e){return`Open the match on the website: ${t} v ${e}`}var Ne=t=>`Open ${t} on the website`,Ve=()=>"Open the match on the website",Re=t=>typeof t=="string"&&t.trim()!==""?t.trim():void 0,mt={one:"st",two:"nd",few:"rd",other:"th"},ft=t=>typeof t=="number"&&Number.isInteger(t)&&t>0?t:void 0;function gt(t,e){if(typeof e!="string"||!/^en(?:$|[-_])/i.test(e))return`#${t}`;let n;try{n=new Intl.PluralRules(e,{type:"ordinal"})}catch{n=new Intl.PluralRules("en",{type:"ordinal"})}return`${t}${mt[n.select(t)]??"th"}`}function X(t,e){let n=ft(t);return n===void 0?{}:{rank:n,rankLabel:gt(n,e)}}function Oe(t,e,n){let s=k(t);if(!s)return{headline:"TBC"};let r=new Date(s);if(Number.isNaN(r.getTime()))return{headline:s};try{return{dateLine:new Intl.DateTimeFormat(e,{weekday:"short",day:"numeric",month:"short",timeZone:n}).format(r),headline:new Intl.DateTimeFormat(e,{hour:"2-digit",minute:"2-digit",timeZone:n}).format(r)}}catch{return{headline:s}}}function E(t,e,n){try{if(!t||t.state==="unavailable"||t.state==="unknown")return N();let s=t.attributes;if(!s||typeof s!="object")return N();let r=k(s.period),i=k(s.home_team),o=k(s.away_team);if(!r||!i||!o)return N();let c=s.logos&&typeof s.logos=="object"?s.logos:{},a=ue(s.home_score),p=ue(s.away_score),u={name:i,logo:k(c.home),score:a,...X(s.home_rank,e),url:Le(s.home_team_url)},d={name:o,logo:k(c.away),score:p,...X(s.away_rank,e),url:Le(s.away_team_url)},f=`${a??"-"} \u2013 ${p??"-"}`;switch(r){case"Kick off":return{mode:"upcoming",home:u,away:d,...Oe(s.kickoff,e,n),venue:Re(s.venue),matchUrl:$(s.match_url)};case"Postponed":case"Cancelled":return{mode:"upcoming",home:u,away:d,...Oe(s.kickoff,e,n),badge:r,venue:Re(s.venue),matchUrl:$(s.match_url)};case"First Half":case"Second Half":{let g=ue(s.minute);return{mode:"live",home:u,away:d,headline:f,badge:g===void 0?r:`${r} ${g}'`,matchUrl:$(s.match_url)}}case"Half Time":return{mode:"live",home:u,away:d,headline:f,badge:r,matchUrl:$(s.match_url)};case"Result":return{mode:"final",home:u,away:d,headline:f,badge:"Full time",matchUrl:$(s.match_url)};default:return N()}}catch{return N()}}var ze=t=>`Open the match against ${t} on the website`,V=5,De=/_(?:current_game|next_game|previous_game_[1-5])$/,yt=/^([WLD]) \d+–\d+$/,S=t=>typeof t=="string"&&t!==""?t:void 0;function je(t){if(typeof t!="string"||!De.test(t))return;let e=t.replace(De,"");return{current:`${e}_current_game`,next:`${e}_next_game`,previous:[1,2,3,4,5].map(n=>`${e}_previous_game_${n}`)}}function Be(t){let e=Array.isArray(t?.previous)?t.previous.filter(r=>typeof r=="string"&&r!==""):[];if(!(!!t&&typeof t=="object"&&(typeof t.current=="string"||typeof t.next=="string"||Array.isArray(t.previous))))throw new Error("rugby-tracker-team-card: configure at least 'next', 'current' or 'previous'");let s={...t,previous:e.slice(0,V)};return typeof s.title!="string"&&delete s.title,typeof s.show_header!="boolean"&&delete s.show_header,s}var _t=/(?:^|\s+)(?:current game|next game|previous game [1-5])\s*$/i;function $t(t){if(!t||typeof t!="object")return[];let e=Array.isArray(t.previous)?t.previous.slice(0,V):[];return[t.next,t.current,...e].filter(n=>typeof n=="string"&&n!=="")}function vt(t,e){try{let n=$t(e),s=r=>t&&typeof t=="object"?t[r]:void 0;for(let r of n){let i=s(r)?.attributes;if(!i||typeof i!="object")continue;let o=i.home_away==="home"?S(i.home_team):i.home_away==="away"?S(i.away_team):void 0;if(o)return o}for(let r of n){let i=s(r)?.attributes,o=i&&typeof i=="object"?S(i.friendly_name):void 0;if(!o)continue;let c=o.replace(_t,"").trim();return c!==""?c:void 0}}catch{}}function wt(t){return[t.current,t.next,...(t.previous??[]).slice(0,V)].filter(e=>typeof e=="string"&&e!=="")}function bt(t,e,n){let s=S(t);if(!s)return"\u2013";let r=new Date(s);if(Number.isNaN(r.getTime()))return s;try{return new Intl.DateTimeFormat(e,{day:"numeric",month:"short",timeZone:n}).format(r)}catch{return s}}function xt(t,e,n){try{if(!t||t.state==="unknown"||t.state==="unavailable")return;let s=t.attributes;if(!s||typeof s!="object")return;let r=S(s.opposition);if(!r)return;let i=typeof t.state=="string"?t.state:"",o=yt.exec(i),c=o?{W:"win",L:"loss",D:"draw"}[o[1]]:"unknown";return{date:bt(s.kickoff,e,n),opposition:r,location:typeof s.venue=="string"&&s.venue.trim()!==""?s.venue.trim():void 0,...X(s.home_away==="home"?s.away_rank:s.home_away==="away"?s.home_rank:void 0,e),matchUrl:$(s.match_url),score:i||"Result unavailable",outcome:c}}catch{return}}function Ie(t,e,n,s){let r=u=>u?t[u]:void 0,i=E(r(e.current),n,s),o=E(r(e.next),n,s),c=i.mode==="live"?i:o.mode==="upcoming"?o:E(void 0,n,s),a=(e.previous??[]).slice(0,V).map(u=>xt(r(u),n,s)).filter(u=>u!==void 0),p=e.show_header===!1?void 0:S(e.title)??vt(t,e);return{top:c,previous:a,heading:p}}function Fe(t,e,n,s,r){return!t||e?!0:n?He(s,r,wt(t)):!0}function We(t){return 2+Math.min(V,t)}function qe(t){let e=je(K(t));return e?{type:"custom:rugby-tracker-team-card",...e}:{type:"custom:rugby-tracker-team-card",next:""}}function Ke(t,e,n,s,r){let i={type:n??"custom:rugby-tracker-team-card"};e&&(i.title=e),r===!1&&(i.show_header=!1);let o=t?je(t):void 0;return o?(i.current=o.current,i.next=o.next,i.previous=[...o.previous]):i.next=t??"",i}var At=[{name:"entity",selector:{entity:{domain:"sensor",integration:"rugby_team_tracker"}}},{name:"title",selector:{text:{}}},{name:"show_header",selector:{boolean:{}}}],Ct={entity:"Any game sensor for the team",title:"Header title (optional, defaults to the team name)",show_header:"Show header"},J=class extends m{constructor(){super(...arguments);this._helper=n=>n.name==="entity"?"Other sensors are filled in automatically. Set them individually in YAML if needed.":n.name==="show_header"?"Show the followed team's name (or your title) at the top of the card.":void 0;this._label=n=>Ct[n.name]??n.name}setConfig(n){this._config=n}set hass(n){this._hass=n}_changed(n){let s=n.detail?.value??{},r=typeof s.entity=="string"?s.entity:"",i=typeof s.title=="string"&&s.title!==""?s.title:void 0,o=s.show_header===!1?!1:void 0,c=Ke(r,i,this._config?.type,this._config,o);this._config=c,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:c},bubbles:!0,composed:!0}))}render(){if(!this._config)return;let n={entity:this._config.next||this._config.current||this._config.previous?.[0]||"",title:this._config.title??"",show_header:this._config.show_header!==!1};return l`<ha-form
      .hass=${this._hass}
      .data=${n}
      .schema=${At}
      .computeLabel=${this._label}
      .computeHelper=${this._helper}
      @value-changed=${this._changed}
    ></ha-form>`}};J.properties={_config:{state:!0},_hass:{state:!0}};customElements.get("rugby-tracker-team-card-editor")||customElements.define("rugby-tracker-team-card-editor",J);function Y(t,e){t.customCards=t.customCards||[],t.customCards.some(n=>n.type===e.type)||t.customCards.push(e)}function Xe(t){return l`${t.logo?l`<img class="logo" src=${t.logo} alt="" />`:l`<div class="logo"></div>`}
    <div class="name">
      ${t.name}${t.rankLabel?l` <span class="rank">${t.rankLabel}</span>`:h}
    </div>`}function Je(t,e){return e&&t.url?l`<a
      class="team team-link"
      href=${t.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label=${Ne(t.name)}
      >${Xe(t)}</a
    >`:l`<div class="team">${Xe(t)}</div>`}function Ye(t){return l`${t.dateLine?l`<div class="dateline">${t.dateLine}</div>`:h}
    <div class="headline">${t.headline}</div>
    ${t.venue?l`<div class="venue">${t.venue}</div>`:h}
    ${t.badge?l`<div class="badge">${t.badge}</div>`:h}`}function kt(t,e){return e&&t.matchUrl?l`<a
      class="centre centre-link"
      href=${t.matchUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label=${Ve()}
      >${Ye(t)}</a
    >`:l`<div class="centre">${Ye(t)}</div>`}function G(t,e={}){if(t.mode==="empty")return l`<div class="empty">${t.headline}</div>`;let n=e.linkMode==="parts",s=l`<div class="game ${t.mode}">
    <div class="row">
      ${Je(t.home,n)} ${kt(t,n)} ${Je(t.away,n)}
    </div>
  </div>`;return n||!t.matchUrl||t.mode!=="live"&&t.mode!=="final"?s:l`<a
    class="game-link"
    href=${t.matchUrl}
    target="_blank"
    rel="noopener noreferrer"
    aria-label=${Me(t.home.name,t.away.name)}
    >${s}</a
  >`}var Q=U`
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
    a.team-link,
    a.centre-link {
      color: inherit;
      text-decoration: none;
      cursor: pointer;
      border-radius: 8px;
    }
    a.centre-link {
      display: block;
    }
    a.team-link:hover,
    a.centre-link:hover,
    a.team-link:focus-visible,
    a.centre-link:focus-visible {
      background: var(--secondary-background-color);
    }
    a.team-link:focus-visible,
    a.centre-link:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
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
`;var D=class extends m{static getConfigElement(){return document.createElement("rugby-tracker-team-card-editor")}static getStubConfig(e){return qe(e?.states)}shouldUpdate(e){let n=e.get("_hass");return Fe(this._config,e.has("_config"),e.has("_hass"),n?.states,this._hass?.states)}setConfig(e){this._config=Be(e)}set hass(e){this._hass=e}getCardSize(){return We(this._view()?.previous.length??0)}_view(){if(!this._config)return;let e=this._hass;return Ie(e?.states??{},this._config,e?.locale?.language??"en",e?.config?.time_zone??"UTC")}render(){let e=this._view();return e?l`<ha-card>
      ${e.heading?l`<div class="heading">${e.heading}</div>`:h}
      ${G(e.top,{linkMode:"parts"})}
      <hr class="divider" />
      ${e.previous.length===0?l`<div class="none">No previous games</div>`:l`<ul class="previous">
            ${e.previous.map(n=>{let s=l`<span class="date">${n.date}</span>
                <span class="opp"
                  >${n.opposition}${n.rankLabel?l` <span class="rank">${n.rankLabel}</span>`:h}${n.location?l` <span class="loc">(${n.location})</span>`:h}</span
                >
                <span class="score ${n.outcome}">${n.score}</span>`;return l`<li class="prev-row">
                ${n.matchUrl?l`<a
                      class="prev-link"
                      href=${n.matchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label=${ze(n.opposition)}
                      >${s}</a
                    >`:s}
              </li>`})}
          </ul>`}
    </ha-card>`:h}};D.properties={_config:{state:!0},_hass:{state:!0}},D.styles=[Q,U`
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
    `];customElements.get("rugby-tracker-team-card")||customElements.define("rugby-tracker-team-card",D);Y(window,{type:"rugby-tracker-team-card",name:"Rugby Tracker Team Card",description:"Current or next game plus the previous five results for one team"});var z=class extends m{static getConfigElement(){return document.createElement("rugby-tracker-game-card-editor")}static getStubConfig(e){return{type:"custom:rugby-tracker-game-card",entity:K(e?.states)}}shouldUpdate(e){if(!this._config||e.has("_config"))return!0;if(e.has("_hass")){let n=e.get("_hass");return Pe(n?.states,this._hass?.states,this._config.entity)}return!0}setConfig(e){if(!e||typeof e.entity!="string"||!e.entity)throw new Error("rugby-tracker-game-card: 'entity' is required");this._config=e}set hass(e){this._hass=e}getCardSize(){return 2}_view(){let e=this._hass,n=e&&this._config?e.states[this._config.entity]:void 0;return E(n,e?.locale?.language??"en",e?.config?.time_zone??"UTC")}render(){return this._config?l`<ha-card>${G(this._view())}</ha-card>`:h}};z.properties={_config:{state:!0},_hass:{state:!0}},z.styles=Q;customElements.get("rugby-tracker-game-card")||customElements.define("rugby-tracker-game-card",z);Y(window,{type:"rugby-tracker-game-card",name:"Rugby Tracker Game Card",description:"Shows a rugby game: kick-off, live score or final result."});export{z as RugbyTrackerGameCard};
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
