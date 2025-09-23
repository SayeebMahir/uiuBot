import { useEffect, useRef, useState } from 'react'
import Button from '../components/Button.jsx'
import Input from '../components/Input.jsx'
import { getHistory, sendMessage } from '../api'

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const boxRef = useRef(null)

  useEffect(() => {
    (async () => {
      try { const data = await getHistory('default'); setMessages(data) } catch { }
    })()
  }, [])

  useEffect(() => { if (boxRef.current) { boxRef.current.scrollTop = boxRef.current.scrollHeight } }, [messages])

  async function onSend(e) {
    e.preventDefault()
    if (!text.trim()) return
    const mine = { role: 'user', content: text }
    setMessages(prev => [...prev, mine])
    setText('')
    setLoading(true)
    // Show immediate thank you message
    setMessages(prev => [...prev, { role: 'assistant', content: 'Thank you, response coming soon...' }])
    try {
      const res = await sendMessage({ content: mine.content, threadId: 'default' })
      // Replace the "thank you" message with the actual response
      setMessages(prev => prev.slice(0, -1).concat({ role: 'assistant', content: res.message }))
    } catch (err) {
      // Keep the thank you message instead of showing an error
      setMessages(prev => prev.slice(0, -1).concat({ role: 'assistant', content: 'Thank you for your message! We appreciate your patience while we work on a response.' }))
    } finally { setLoading(false) }
  }

  return (
    <div className="card chat-wrap">
      <h2 className="heading">Chat with uiuBot</h2>
      <div className="chat-box" ref={boxRef}>
        {messages.map((m, i) => (
          <div key={i} className={`message-row ${m.role}`}>
            {m.role === 'assistant' && (
              <div className="avatar bot-avatar">
                <img src="/bot-avatar.png" alt="Bot" onError={(e) => e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2NjY2NjYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSIzIiB5PSIxMSIgd2lkdGg9IjE4IiBoZWlnaHQ9IjExIiByeD0iMiIgcnk9IjIiPjwvcmVjdD48cGF0aCBkPSJNNyA3VjRhMiAyIDAgMCAxIDItMmg2YTIgMiAwIDAgMSAyIDJ2M00yIDE1aDIwTTEyIDdWM20wIDE4di00Ii8+PC9zdmc+'} />
              </div>
            )}
            <div className={`bubble ${m.role}`}>
              {m.content.includes('[View Academic Calendar]') ? (
                <div>
                  Here's the Academic Calendar for your reference.{' '}
                  <a
                    href={'http://localhost:5000/static/documents/academic-calendar.pdf'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pdf-link"
                    style={{ color: '#ff6a00', textDecoration: 'underline' }}
                  >
                    Click here to view/download PDF
                  </a>
                </div>
              ) : (
                m.content
              )}
            </div>
            {m.role === 'user' && (
              <div className="avatar user-avatar">
                <img src="/user-avatar.png" alt="User" onError={(e) => e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2NjY2NjYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAgMjF2LTJhNCA0IDAgMCAwLTQtNEg4YTQgNCAwIDAgMC00IDR2MiI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCI+PC9jaXJjbGU+PC9zdmc+'} />
              </div>
            )}
          </div>
        ))}
      </div>
      <form className="footer" onSubmit={onSend}>
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask about scholarships, deadlines, rooms..." />
        <Button disabled={loading || !text.trim()}>{loading ? 'Sending...' : 'Send'}</Button>
      </form>
    </div>
  )
}

