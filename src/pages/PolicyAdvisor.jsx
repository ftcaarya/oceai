import { useState } from 'react'
import ChatInterface from '../components/ChatInterface'
import SectionHeader from '../components/SectionHeader'

export default function PolicyAdvisor() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (message) => {
    setMessages(prev => [...prev, { role: 'user', content: message }])
    setIsLoading(true)

    setTimeout(() => {
      const responses = [
        "Ocean policy is evolving rapidly. Here are the key considerations for your question...",
        "According to recent marine conservation guidelines, the recommended approach is...",
        "Based on international ocean treaties and sustainability goals, I recommend...",
        "The latest research suggests these policy frameworks could address your concern...",
      ]
      const response = responses[Math.floor(Math.random() * responses.length)]
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: response }
      ])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        <SectionHeader title="Ocean Policy Advisor" subtitle="Draft and analyze marine policies with AI" />
        
        <div className="h-[700px]">
          <ChatInterface messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} placeholder="Ask about ocean policies..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-ocean-800 rounded-xl p-6 border border-cyan-300 border-opacity-20">
            <h4 className="text-cyan-300 font-bold mb-2">Policy Topics</h4>
            <p className="text-ocean-200 text-sm">Marine conservation, fisheries, climate impact</p>
          </div>
          <div className="bg-ocean-800 rounded-xl p-6 border border-cyan-300 border-opacity-20">
            <h4 className="text-cyan-300 font-bold mb-2">AI-Powered</h4>
            <p className="text-ocean-200 text-sm">Get expert insights on policy development</p>
          </div>
        </div>
      </div>
    </div>
  )
}
