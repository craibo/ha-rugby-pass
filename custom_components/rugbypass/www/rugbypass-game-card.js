var O=globalThis,V=O.ShadowRoot&&(O.ShadyCSS===void 0||O.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,z=Symbol(),it=new WeakMap,C=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==z)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(V&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=it.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&it.set(e,t))}return t}toString(){return this.cssText}},nt=n=>new C(typeof n=="string"?n:n+"",void 0,z),B=(n,...t)=>{let e=n.length===1?n[0]:t.reduce((s,i,r)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[r+1],n[0]);return new C(e,n,z)},rt=(n,t)=>{if(V)n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=O.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,n.appendChild(s)}},I=V?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return nt(e)})(n):n;var{is:St,defineProperty:Ct,getOwnPropertyDescriptor:xt,getOwnPropertyNames:Pt,getOwnPropertySymbols:Tt,getPrototypeOf:Ht}=Object,L=globalThis,ot=L.trustedTypes,Ut=ot?ot.emptyScript:"",kt=L.reactiveElementPolyfillSupport,x=(n,t)=>n,q={toAttribute(n,t){switch(t){case Boolean:n=n?Ut:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},ht=(n,t)=>!St(n,t),at={attribute:!0,type:String,converter:q,reflect:!1,useDefault:!1,hasChanged:ht};Symbol.metadata??=Symbol("metadata"),L.litPropertyMetadata??=new WeakMap;var g=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=at){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Ct(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:r}=xt(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){let c=i?.call(this);r?.call(this,o),this.requestUpdate(t,c,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??at}static _$Ei(){if(this.hasOwnProperty(x("elementProperties")))return;let t=Ht(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(x("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(x("properties"))){let e=this.properties,s=[...Pt(e),...Tt(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(I(i))}else t!==void 0&&e.push(I(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return rt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let r=(s.converter?.toAttribute!==void 0?s.converter:q).toAttribute(e,s.type);this._$Em=t,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let r=s.getPropertyOptions(i),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:q;this._$Em=i;let c=o.fromAttribute(e,r.type);this[i]=c??this._$Ej?.get(i)??c,this._$Em=null}}requestUpdate(t,e,s,i=!1,r){if(t!==void 0){let o=this.constructor;if(i===!1&&(r=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??ht)(r,e)||s.useDefault&&s.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:r},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),r!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,r]of s){let{wrapped:o}=r,c=this[i];o!==!0||this._$AL.has(i)||c===void 0||this.C(i,void 0,r,c)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};g.elementStyles=[],g.shadowRootOptions={mode:"open"},g[x("elementProperties")]=new Map,g[x("finalized")]=new Map,kt?.({ReactiveElement:g}),(L.reactiveElementVersions??=[]).push("2.1.2");var X=globalThis,ct=n=>n,j=X.trustedTypes,lt=j?j.createPolicy("lit-html",{createHTML:n=>n}):void 0,gt="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,_t="?"+$,Nt=`<${_t}>`,v=document,T=()=>v.createComment(""),H=n=>n===null||typeof n!="object"&&typeof n!="function",Z=Array.isArray,Rt=n=>Z(n)||typeof n?.[Symbol.iterator]=="function",W=`[ 	
\f\r]`,P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,dt=/-->/g,pt=/>/g,y=RegExp(`>|${W}(?:([^\\s"'>=/]+)(${W}*=${W}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ut=/'/g,mt=/"/g,$t=/^(?:script|style|textarea|title)$/i,G=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),_=G(1),Wt=G(2),Ft=G(3),b=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),ft=new WeakMap,A=v.createTreeWalker(v,129);function yt(n,t){if(!Z(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return lt!==void 0?lt.createHTML(t):t}var Mt=(n,t)=>{let e=n.length-1,s=[],i,r=t===2?"<svg>":t===3?"<math>":"",o=P;for(let c=0;c<e;c++){let a=n[c],l,d,h=-1,u=0;for(;u<a.length&&(o.lastIndex=u,d=o.exec(a),d!==null);)u=o.lastIndex,o===P?d[1]==="!--"?o=dt:d[1]!==void 0?o=pt:d[2]!==void 0?($t.test(d[2])&&(i=RegExp("</"+d[2],"g")),o=y):d[3]!==void 0&&(o=y):o===y?d[0]===">"?(o=i??P,h=-1):d[1]===void 0?h=-2:(h=o.lastIndex-d[2].length,l=d[1],o=d[3]===void 0?y:d[3]==='"'?mt:ut):o===mt||o===ut?o=y:o===dt||o===pt?o=P:(o=y,i=void 0);let m=o===y&&n[c+1].startsWith("/>")?" ":"";r+=o===P?a+Nt:h>=0?(s.push(l),a.slice(0,h)+gt+a.slice(h)+$+m):a+$+(h===-2?c:m)}return[yt(n,r+(n[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},U=class n{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,o=0,c=t.length-1,a=this.parts,[l,d]=Mt(t,e);if(this.el=n.createElement(l,s),A.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=A.nextNode())!==null&&a.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(let h of i.getAttributeNames())if(h.endsWith(gt)){let u=d[o++],m=i.getAttribute(h).split($),M=/([.?@])?(.*)/.exec(u);a.push({type:1,index:r,name:M[2],strings:m,ctor:M[1]==="."?K:M[1]==="?"?J:M[1]==="@"?Y:w}),i.removeAttribute(h)}else h.startsWith($)&&(a.push({type:6,index:r}),i.removeAttribute(h));if($t.test(i.tagName)){let h=i.textContent.split($),u=h.length-1;if(u>0){i.textContent=j?j.emptyScript:"";for(let m=0;m<u;m++)i.append(h[m],T()),A.nextNode(),a.push({type:2,index:++r});i.append(h[u],T())}}}else if(i.nodeType===8)if(i.data===_t)a.push({type:2,index:r});else{let h=-1;for(;(h=i.data.indexOf($,h+1))!==-1;)a.push({type:7,index:r}),h+=$.length-1}r++}}static createElement(t,e){let s=v.createElement("template");return s.innerHTML=t,s}};function E(n,t,e=n,s){if(t===b)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,r=H(t)?void 0:t._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(n),i._$AT(n,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=E(n,i._$AS(n,t.values),i,s)),t}var F=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??v).importNode(e,!0);A.currentNode=i;let r=A.nextNode(),o=0,c=0,a=s[0];for(;a!==void 0;){if(o===a.index){let l;a.type===2?l=new k(r,r.nextSibling,this,t):a.type===1?l=new a.ctor(r,a.name,a.strings,this,t):a.type===6&&(l=new Q(r,this,t)),this._$AV.push(l),a=s[++c]}o!==a?.index&&(r=A.nextNode(),o++)}return A.currentNode=v,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},k=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=E(this,t,e),H(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==b&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Rt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==p&&H(this._$AH)?this._$AA.nextSibling.data=t:this.T(v.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=U.createElement(yt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let r=new F(i,this),o=r.u(this.options);r.p(e),this.T(o),this._$AH=r}}_$AC(t){let e=ft.get(t.strings);return e===void 0&&ft.set(t.strings,e=new U(t)),e}k(t){Z(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let r of t)i===e.length?e.push(s=new n(this.O(T()),this.O(T()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=ct(t).nextSibling;ct(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},w=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=p}_$AI(t,e=this,s,i){let r=this.strings,o=!1;if(r===void 0)t=E(this,t,e,0),o=!H(t)||t!==this._$AH&&t!==b,o&&(this._$AH=t);else{let c=t,a,l;for(t=r[0],a=0;a<r.length-1;a++)l=E(this,c[s+a],e,a),l===b&&(l=this._$AH[a]),o||=!H(l)||l!==this._$AH[a],l===p?t=p:t!==p&&(t+=(l??"")+r[a+1]),this._$AH[a]=l}o&&!i&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},K=class extends w{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}},J=class extends w{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==p)}},Y=class extends w{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=E(this,t,e,0)??p)===b)return;let s=this._$AH,i=t===p&&s!==p||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==p&&(s===p||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Q=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){E(this,t)}};var Ot=X.litHtmlPolyfillSupport;Ot?.(U,k),(X.litHtmlVersions??=[]).push("3.3.3");var At=(n,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let r=e?.renderBefore??null;s._$litPart$=i=new k(t.insertBefore(T(),r),r,void 0,e??{})}return i._$AI(n),i};var tt=globalThis,f=class extends g{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=At(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return b}};f._$litElement$=!0,f.finalized=!0,tt.litElementHydrateSupport?.({LitElement:f});var Vt=tt.litElementPolyfillSupport;Vt?.({LitElement:f});(tt.litElementVersions??=[]).push("4.2.2");var Lt=[{name:"entity",selector:{entity:{domain:"sensor",integration:"rugbypass"}}}],D=class extends f{constructor(){super(...arguments);this._label=e=>e.name==="entity"?"Game entity":e.name}setConfig(e){this._config=e}set hass(e){this._hass=e}_changed(e){let s={...this._config,...e.detail.value};this._config=s,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:s},bubbles:!0,composed:!0}))}render(){if(this._config)return _`<ha-form
      .hass=${this._hass}
      .data=${this._config}
      .schema=${Lt}
      .computeLabel=${this._label}
      @value-changed=${this._changed}
    ></ha-form>`}};D.properties={_config:{state:!0},_hass:{state:!0}};customElements.get("rugbypass-game-card-editor")||customElements.define("rugbypass-game-card-editor",D);var jt=/^sensor\..*(current|next|previous)_game/;function vt(n){return n?Object.keys(n).find(t=>jt.test(t))??"":""}function bt(n,t,e){return!n||!t?!0:n[e]!==t[e]}var Dt={mode:"empty",home:{name:""},away:{name:""},headline:"No game"},N=()=>({...Dt,home:{name:""},away:{name:""}}),S=n=>typeof n=="string"&&n!==""?n:void 0,et=n=>typeof n=="number"&&Number.isFinite(n)?n:void 0;function Et(n,t,e){let s=S(n);if(!s)return"TBC";let i=new Date(s);if(Number.isNaN(i.getTime()))return s;try{return new Intl.DateTimeFormat(t,{weekday:"short",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit",timeZone:e}).format(i)}catch{return s}}function wt(n,t,e){try{if(!n||n.state==="unavailable"||n.state==="unknown")return N();let s=n.attributes;if(!s||typeof s!="object")return N();let i=S(s.period),r=S(s.home_team),o=S(s.away_team);if(!i||!r||!o)return N();let c=s.logos&&typeof s.logos=="object"?s.logos:{},a=et(s.home_score),l=et(s.away_score),d={name:r,logo:S(c.home),score:a},h={name:o,logo:S(c.away),score:l},u=`${a??"-"} \u2013 ${l??"-"}`;switch(i){case"Kick off":return{mode:"upcoming",home:d,away:h,headline:Et(s.kickoff,t,e)};case"Postponed":case"Cancelled":return{mode:"upcoming",home:d,away:h,headline:Et(s.kickoff,t,e),badge:i};case"First Half":case"Second Half":{let m=et(s.minute);return{mode:"live",home:d,away:h,headline:u,badge:m===void 0?i:`${i} ${m}'`}}case"Result":return{mode:"final",home:d,away:h,headline:u,badge:"Full time"};default:return N()}}catch{return N()}}var R=class extends f{static getConfigElement(){return document.createElement("rugbypass-game-card-editor")}static getStubConfig(t){return{type:"custom:rugbypass-game-card",entity:vt(t?.states)}}shouldUpdate(t){if(!this._config||t.has("_config"))return!0;if(t.has("_hass")){let e=t.get("_hass");return bt(e?.states,this._hass?.states,this._config.entity)}return!0}setConfig(t){if(!t||typeof t.entity!="string"||!t.entity)throw new Error("rugbypass-game-card: 'entity' is required");this._config=t}set hass(t){this._hass=t}getCardSize(){return 2}_view(){let t=this._hass,e=t&&this._config?t.states[this._config.entity]:void 0;return wt(e,t?.locale?.language??"en",t?.config?.time_zone??"UTC")}_team(t){return _`<div class="team">
      ${t.logo?_`<img class="logo" src=${t.logo} alt="" />`:_`<div class="logo"></div>`}
      <div class="name">${t.name}</div>
    </div>`}render(){if(!this._config)return p;let t=this._view();return t.mode==="empty"?_`<ha-card><div class="empty">${t.headline}</div></ha-card>`:_`<ha-card class=${t.mode}>
      <div class="row">
        ${this._team(t.home)}
        <div class="centre">
          <div class="headline">${t.headline}</div>
          ${t.badge?_`<div class="badge">${t.badge}</div>`:p}
        </div>
        ${this._team(t.away)}
      </div>
    </ha-card>`}};R.properties={_config:{state:!0},_hass:{state:!0}},R.styles=B`
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
    ha-card.live .badge {
      background: var(--error-color, #db4437);
      color: var(--text-primary-color, #fff);
    }
    ha-card.live .headline {
      color: var(--primary-color);
    }
    .empty {
      text-align: center;
      color: var(--secondary-text-color);
      padding: 8px;
    }
  `;customElements.get("rugbypass-game-card")||customElements.define("rugbypass-game-card",R);var st=window;st.customCards=st.customCards||[];st.customCards.push({type:"rugbypass-game-card",name:"RugbyPass Game Card",description:"Shows a RugbyPass game: kick-off, live score or final result."});export{R as RugbyPassGameCard};
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
