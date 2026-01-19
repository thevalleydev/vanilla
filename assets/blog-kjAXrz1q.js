import{u as r,L as o,F as d,H as x,N as n,b as t,D as c,a as i}from"./Navigation-RxjrHXmL.js";import{a as l}from"./index-DsRL4NZR.js";function b(){const{sortedPosts:a}=l();return t`
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 class="text-4xl font-bold mb-10 text-slate-900 dark:text-slate-100">Blog</h2>

      ${a.value.length===0?t`<p class="text-slate-600 dark:text-slate-400">No posts yet.</p>`:t`
            <div class="space-y-12">
              ${a.value.map(e=>t`
                    <article class="border-b border-slate-200 dark:border-slate-800 pb-10 last:border-b-0">
                      <h3 class="text-2xl font-bold mb-3">
                        ${i({href:`/blog/${e.slug}`,children:e.title,class:"text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"})}
                      </h3>
                      <time class="text-slate-500 dark:text-slate-400 text-sm block mb-3"
                        >${new Date(e.date).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}</time
                      >
                      ${e.excerpt?t`<p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">${e.excerpt}</p>`:""}
                      ${e.tags&&e.tags.length>0?t`
                            <div class="flex flex-wrap gap-2">
                              ${e.tags.map(s=>t`<span class="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full"
                                    >${s}</span
                                  >`)}
                            </div>
                          `:""}
                    </article>
                  `)}
            </div>
          `}
    </div>
  `}function u(a){r("Blog");const{loadPosts:e}=l();return e().then(()=>{const s=o({header:t`${x()} ${n()}`,footer:d(),children:b()});c(s,a)}),()=>{}}export{u as render_page};
