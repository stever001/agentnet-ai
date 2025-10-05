import ReactMarkdown from 'react-markdown'

export default function MarkdownRenderer({ markdown }){
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown>{markdown || ''}</ReactMarkdown>
    </div>
  )
}
