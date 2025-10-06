// src/pages/Home.jsx
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="font-sans text-slate-800 bg-white">

      {/* HERO */}
      <section
        className="relative w-full h-[80vh] flex flex-col justify-center px-10 md:px-24 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-placeholder.jpg')" }}
      >
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]" />
        <div className="relative z-10 max-w-6xl">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            AgentNet: Machines Only
          </h1>
          <p className="text-xl md:text-2xl text-slate-700 max-w-3xl mb-6">
            Internet is for humans. AgentNet is for machines.
          </p>
          <p className="text-lg text-slate-600 max-w-3xl">
            A standards-based network where structured data lives natively—ready for AI and
            autonomous agents to read, reason, and act without human-oriented HTML.
          </p>
        </div>
      </section>

      {/* WHAT IS AGENTNET */}
      <section className="py-24 px-10 md:px-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-semibold text-slate-900 mb-12">
            What Is AgentNet?
          </h2>

          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="space-y-8 text-lg leading-relaxed">
              <div>
                <p className="text-xl font-semibold mb-2 text-slate-900">
                  What is it?
                </p>
                <p className="text-slate-700">
                  It’s where data lives for machines—a global network of structured
                  <strong> capsules </strong> that intelligent agents can read, reason over,
                  and act upon instantly.
                </p>
              </div>

              <div>
                <p className="text-xl font-semibold mb-2 text-slate-900">
                  How does it work?
                </p>
                <p className="text-slate-700">
                  By replacing human-formatted web pages with standardized
                  <strong> JSON-LD capsules </strong> hosted at registered
                  <strong> Nodes </strong>. Data is optimized for direct machine consumption,
                  with integrity and verifiable discovery.
                </p>
              </div>
            </div>

            {/* Placeholder for conceptual image */}
            <div className="w-full h-72 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 text-lg">
              [ Concept Diagram Placeholder ]
            </div>
          </div>
        </div>
      </section>

      {/* MACHINES VS HUMANS */}
      <section className="py-24 px-10 md:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-semibold mb-12 text-slate-900">
            The Analogy: Machines vs. Humans
          </h2>

          <div className="overflow-x-auto rounded-xl shadow-sm">
            <table className="w-full border-collapse text-left text-base md:text-lg bg-white">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="p-4 md:p-5 font-semibold w-1/2">For Humans</th>
                  <th className="p-4 md:p-5 font-semibold w-1/2">For Machines</th>
                </tr>
              </thead>
              <tbody>
                <tr className="even:bg-slate-50">
                  <td className="p-4 md:p-5">
                    <strong>The Internet</strong> — built for browsers, clicks, and people.
                  </td>
                  <td className="p-4 md:p-5">
                    <strong>AgentNet</strong> — built for agents, queries, and actions.
                  </td>
                </tr>
                <tr className="even:bg-slate-50">
                  <td className="p-4 md:p-5">HTML pages, visual markup, and SEO</td>
                  <td className="p-4 md:p-5">JSON-LD capsules, semantic schemas, and resolver IDs</td>
                </tr>
                <tr className="even:bg-slate-50">
                  <td className="p-4 md:p-5">Search engines interpret meaning</td>
                  <td className="p-4 md:p-5">Agents understand meaning natively</td>
                </tr>
                <tr className="even:bg-slate-50">
                  <td className="p-4 md:p-5">Human attention is the currency</td>
                  <td className="p-4 md:p-5">Machine relevance is the new currency</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-center text-slate-600 mt-10 italic text-lg">
            If the Internet connects people to content, AgentNet connects agents to knowledge.
          </p>
        </div>
      </section>

      {/* WHY IT MATTERS */}
      <section className="py-24 px-10 md:px-24 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-semibold mb-14 text-slate-900">Why It Matters</h2>

          <div className="grid md:grid-cols-3 gap-10">
            <article className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition">
              <h3 className="text-2xl font-semibold mb-3 text-blue-800">For Developers</h3>
              <p className="text-slate-700 mb-4">
                Open standards and capsule schemas make your data natively readable by any AI or autonomous system.
              </p>
              <Link to="/docs/developers" className="text-blue-700 hover:underline font-medium">
                Learn more →
              </Link>
            </article>

            <article className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition">
              <h3 className="text-2xl font-semibold mb-3 text-blue-800">For Businesses</h3>
              <p className="text-slate-700 mb-4">
                Publish your offerings directly into the machine economy—no search ads, no intermediaries, pure discoverability.
              </p>
              <Link to="/docs/business" className="text-blue-700 hover:underline font-medium">
                Learn more →
              </Link>
            </article>

            <article className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition">
              <h3 className="text-2xl font-semibold mb-3 text-blue-800">For Agents</h3>
              <p className="text-slate-700 mb-4">
                Consume verified, structured data directly from registered nodes—faster, cheaper, and more reliable than parsing HTML.
              </p>
              <Link to="/docs/agents" className="text-blue-700 hover:underline font-medium">
                Learn more →
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* IMPACT POINTS */}
      <section className="py-24 px-10 md:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-semibold mb-12 text-slate-900">Key Impact Points</h2>

          {/* Placeholder for infographic or diagram */}
          <div className="w-full h-64 bg-slate-100 rounded-xl mb-12 flex items-center justify-center text-slate-500">
            [ Infographic Placeholder ]
          </div>

          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-lg leading-relaxed text-slate-700">
            <li><strong>Speed:</strong> Agents read structured data up to 100× faster than HTML.</li>
            <li><strong>Efficiency:</strong> One query, one result—no crawl waste.</li>
            <li><strong>Interoperability:</strong> JSON-LD capsules unify AI ecosystems.</li>
            <li><strong>Trust:</strong> Node registration ensures verified data sources.</li>
            <li><strong>Scalability:</strong> Billions of capsules federated by Node registrars.</li>
            <li><strong>Governance:</strong> Open, standards-driven, globally extensible.</li>
          </ul>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-20 px-10 md:px-24 bg-gradient-to-b from-slate-50 to-white text-center">
        <h2 className="text-3xl font-semibold text-slate-900 mb-6">
          Join the Transition from the Human Web to the Machine Web
        </h2>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Developers, node registrars, and AI system builders are defining the next era of data—structured,
          verified, and machine-ready by default.
        </p>
      </section>
    </main>
  );
}
