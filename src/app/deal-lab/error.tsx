"use client";
export default function Error({reset}:{reset:()=>void}){return <section className="deal-state"><span className="eyebrow">Workspace error</span><h1>Deal Lab could not load.</h1><p>Please retry the educational analysis workspace.</p><button className="button" onClick={reset}>Try again</button></section>}
