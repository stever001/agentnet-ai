export default function Footer(){
  return (
    <footer className="w-full border-t border-white/10 mt-8">
      <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-muted flex items-center justify-between">
        <span>© {new Date().getFullYear()} AgentNet.ai</span>
        <span>Machine-first web • JSON-LD native</span>
      </div>
    </footer>
  )
}
