import{A as o,E as d,L as u,F as c,H as x,N as h,b as a,D as p,a as i,u as b}from"./Navigation-DhQka-37.js";import{u as m,a as g}from"./index-DiEJ5ono.js";const v={CHILD:2},f=r=>(...t)=>({_$litDirective$:r,values:t});class ${constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}class l extends ${constructor(t){if(super(t),this.it=o,t.type!==v.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===o||t==null)return this._t=void 0,this.it=t;if(t===d)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const e=[t];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}}l.directiveName="unsafeHTML",l.resultType=1;const k=f(l);function y(){const r=m(),{getPostBySlug:t}=g(),e=r.currentRoute.value.path.split("/")[2],s=t(e);return s?(b(s.title),a`
    <article class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header class="mb-10 border-b border-slate-200 dark:border-slate-800 pb-8">
        <h1 class="text-4xl font-bold mb-4 text-slate-900 dark:text-slate-100">${s.title}</h1>
        <div class="flex items-center justify-between text-slate-600 dark:text-slate-400">
          <time class="text-sm">${new Date(s.date).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}</time>
          ${s.tags&&s.tags.length>0?a`
                <div class="flex flex-wrap gap-2">
                  ${s.tags.map(n=>a`<span class="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full"
                        >${n}</span
                      >`)}
                </div>
              `:""}
        </div>
      </header>

      <div class="prose prose-slate dark:prose-invert max-w-none mb-12">
        ${k(s.content)}
      </div>

      <div class="border-t border-slate-200 dark:border-slate-800 pt-8">
        ${i({href:"/blog",children:"← Back to Blog",class:"text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"})}
      </div>
    </article>
  `):a`
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 class="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">Post not found</h2>
        <p class="text-slate-600 dark:text-slate-400">
          ${i({href:"/blog",children:"Back to blog",class:"text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"})}
        </p>
      </div>
    `}function A(r){const t=u({header:a`${x()} ${h()}`,footer:c(),children:y()});return p(t,r),()=>{}}export{A as render_page};
