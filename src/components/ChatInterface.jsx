import { useState, useRef, useEffect } from 'react'

export default function ChatInterface({ messages, onSendMessage, isLoading, placeholder = "Ask a question..." }) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input)
      setInput('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-ocean-800 to-ocean-900 rounded-xl border border-cyan-300 border-opacity-20 overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-ocean-300 text-lg">Start a conversation</p>
              <p className="text-ocean-400 text-sm mt-2">Your message history will appear here</p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
            >
              <div
                className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-cyan-300 to-teal-400 text-ocean-950 rounded-br-none font-medium'
                    : 'bg-ocean-700 text-ocean-100 border border-cyan-300 border-opacity-30 rounded-bl-none'
                }`}
              >
                <p className="text-sm sm:text-base whitespace-pre-wrap break-words">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-ocean-700 border border-cyan-300 border-opacity-30 text-ocean-100 px-4 py-2 rounded-lg rounded-bl-none">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-cyan-300 border-opacity-20 p-4 sm:p-6 bg-ocean-900">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 bg-ocean-800 border border-cyan-300 border-opacity-30 rounded-lg px-4 py-2 text-ocean-100 placeholder-ocean-400 focus:outline-none focus:border-cyan-300 focus:border-opacity-100 focus:shadow-glow transition-all disabled:opacity-50 resize-none max-h-24 text-sm sm:text-base"
            rows="2"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-cyan-300 to-teal-500 hover:from-cyan-400 hover:to-teal-600 text-ocean-950 font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-fit text-sm sm:text-base"
          >
            {isLoading ? '...' : '↑'}
          </button>
        </div>
      </div>
    </div>
  )
}
