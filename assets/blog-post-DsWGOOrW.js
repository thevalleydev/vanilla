import{A as i,E as h,L as g,F as m,H as b,N as f,b as o,D as v,a as n}from"./Navigation-DdNyBFt5.js";import{u as c,a as u}from"./index-DimeXeVl.js";import{c as $,u as d}from"./useHead-BdQ1YFeC.js";const y={CHILD:2},k=a=>(...t)=>({_$litDirective$:a,values:t});class _{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,r){this._$Ct=t,this._$AM=e,this._$Ci=r}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}class l extends _{constructor(t){if(super(t),this.it=i,t.type!==y.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===i||t==null)return this._t=void 0,this.it=t;if(t===h)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const e=[t];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}}l.directiveName="unsafeHTML",l.resultType=1;const w=k(l);function B(){const a=c(),{getPostBySlug:t}=u(),e=a.currentRoute.value.path.split("/")[2],r=t(e);return r?o`
    <article class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header class="mb-10 border-b border-slate-200 dark:border-slate-800 pb-8">
        <h1 class="text-4xl font-bold mb-4 text-slate-900 dark:text-slate-100">${r.title}</h1>
        <div class="flex items-center justify-between text-slate-600 dark:text-slate-400">
          <time class="text-sm">${new Date(r.date).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}</time>
          ${r.tags&&r.tags.length>0?o`
                <div class="flex flex-wrap gap-2">
                  ${r.tags.map(s=>o`<span class="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full"
                        >${s}</span
                      >`)}
                </div>
              `:""}
        </div>
      </header>

      <div class="prose prose-slate dark:prose-invert max-w-none mb-12">
        ${w(r.content)}
      </div>

      <div class="border-t border-slate-200 dark:border-slate-800 pt-8">
        ${n({href:"/blog",children:"← Back to Blog",class:"text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"})}
      </div>
    </article>
  `:o`
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 class="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">Post not found</h2>
        <p class="text-slate-600 dark:text-slate-400">
          ${n({href:"/blog",children:"Back to blog",class:"text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"})}
        </p>
      </div>
    `}function D(a){const t=c(),{getPostBySlug:e}=u(),r=t.currentRoute.value.path.split("/")[2],s=e(r);if(s){const x=$("BlogPosting").addArticle(s.title,s.excerpt||"").addDates(s.date).add("author",{"@type":"Person",name:"Your Blog"});d({title:`${s.title} - My Blog`,description:s.excerpt||s.title,ogTitle:s.title,ogDescription:s.excerpt||s.title,ogType:"article",twitterCard:"summary",jsonLd:x})}else d({title:"404 - Page Not Found",description:"The page you are looking for does not exist"});const p=g({header:o`${b()} ${f()}`,footer:m(),children:B()});return v(p,a),()=>{}}export{D as render_page};
