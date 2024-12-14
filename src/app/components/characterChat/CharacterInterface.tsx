'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ChatInterface() {
  const [messages, setMessages] = useState<string[]>([])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, input])
      setInput('')
    }
  }

  return (
    <div className="bg-white p-4 shadow-lg">
      <div className="mb-4 h-40 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className="mb-2">
            <span className="bg-blue-100 px-2 py-1 rounded-lg">{message}</span>
          </div>
        ))}
      </div>
      <div className="flex">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="メッセージを入力..."
          className="flex-grow mr-2"
        />
        <Button onClick={handleSend}>送信</Button>
      </div>
    </div>
  )
}
