"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Minimize2,
  Maximize2,
  AlertCircle,
  Sparkles,
  Mic,
  Paperclip,
} from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function EnhancedChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Bonjour ! Je suis votre Assistant STRUGAL ✨ Comment puis-je vous aider avec la gestion de votre inventaire aujourd'hui ?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const toggleChat = () => {
    setIsOpen(!isOpen)
    setIsMinimized(false)
    setError(null)
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setIsTyping(true)
    setError(null)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || "Échec de la réponse")
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("Pas de corps de réponse")
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)

      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() || ""

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.content) {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessage.id ? { ...msg, content: msg.content + data.content } : msg,
                  ),
                )
              }
            } catch (e) {
              console.error("Error parsing streaming data:", e)
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error)
      setError(error.message || "Échec de l'envoi du message")
      setMessages((prev) => prev.filter((msg) => msg.role !== "assistant" || msg.content !== ""))
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  const quickActions = [
    "Comment ajouter un nouvel article ?",
    "Voir les statistiques d'inventaire",
    "Aide sur l'aluminium",
    "Support technique",
  ]

  return (
    <>
      {/* Enhanced Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative">
              <Button
                onClick={toggleChat}
                className="h-16 w-16 rounded-full bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 pulse-glow"
              >
                <MessageCircle className="h-7 w-7" />
              </Button>

              {/* Notification Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 h-6 w-6 bg-primary-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg"
              >
                1
              </motion.div>

              {/* Floating Sparkles */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Sparkles className="absolute -top-1 -left-1 h-4 w-4 text-primary-400" />
                <Sparkles className="absolute -bottom-1 -right-1 h-3 w-3 text-primary-300" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Card
              className={`w-96 shadow-2xl border-0 glass-effect ${isMinimized ? "h-20" : "h-[32rem]"} transition-all duration-500 overflow-hidden`}
            >
              {/* Enhanced Header */}
              <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-pulse"></div>

                <div className="flex items-center gap-3 relative z-10">
                  <motion.div
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Bot className="h-5 w-5" />
                  </motion.div>
                  <div>
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      Assistant STRUGAL
                      <Sparkles className="h-4 w-4 text-primary-200" />
                    </CardTitle>
                    <motion.p
                      className="text-xs opacity-90"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      {error ? "Erreur" : isTyping ? "Écrit..." : isLoading ? "Réflexion..." : "En ligne"}
                    </motion.p>
                  </div>
                </div>

                <div className="flex items-center gap-1 relative z-10">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleMinimize}
                      className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-lg"
                    >
                      {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleChat}
                      className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-lg"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </CardHeader>

              {!isMinimized && (
                <CardContent className="p-0 flex flex-col h-[28rem]">
                  {/* Enhanced Messages */}
                  <ScrollArea className="flex-1 p-4 scrollbar-hide">
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {message.role === "assistant" && (
                            <motion.div
                              className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
                              whileHover={{ scale: 1.1, rotate: 360 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Bot className="h-4 w-4 text-white" />
                            </motion.div>
                          )}

                          <motion.div
                            className={`max-w-[75%] p-4 rounded-2xl text-sm shadow-lg ${
                              message.role === "user"
                                ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white"
                                : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-900 dark:text-gray-100"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            layout
                          >
                            <div className="whitespace-pre-wrap">{message.content}</div>
                            <div
                              className={`text-xs mt-2 opacity-70 ${
                                message.role === "user" ? "text-white/70" : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              {message.timestamp.toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </motion.div>

                          {message.role === "user" && (
                            <motion.div
                              className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
                              whileHover={{ scale: 1.1 }}
                            >
                              <User className="h-4 w-4 text-white" />
                            </motion.div>
                          )}
                        </motion.div>
                      ))}

                      {/* Enhanced Error Message */}
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex gap-3 justify-start"
                        >
                          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center shadow-lg">
                            <AlertCircle className="h-4 w-4 text-white" />
                          </div>
                          <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border border-primary-200 dark:border-primary-800 p-4 rounded-2xl text-sm text-primary-700 dark:text-primary-300 shadow-lg">
                            {error}
                          </div>
                        </motion.div>
                      )}

                      {/* Enhanced Typing Animation */}
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-3 justify-start"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                          <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 p-4 rounded-2xl shadow-lg">
                            <div className="flex space-x-1">
                              {[0, 1, 2].map((i) => (
                                <motion.div
                                  key={i}
                                  className="w-2 h-2 bg-primary-500 rounded-full"
                                  animate={{ y: [0, -8, 0] }}
                                  transition={{
                                    duration: 0.6,
                                    repeat: Number.POSITIVE_INFINITY,
                                    delay: i * 0.2,
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Quick Actions */}
                  {messages.length === 1 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-4 pb-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Actions rapides :</div>
                      <div className="flex flex-wrap gap-2">
                        {quickActions.map((action, index) => (
                          <motion.button
                            key={action}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setInput(action)}
                            className="text-xs px-3 py-1.5 bg-gradient-to-r from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 text-primary-700 dark:text-primary-300 rounded-full hover:from-primary-200 hover:to-primary-300 transition-all duration-200 shadow-sm"
                          >
                            {action}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Enhanced Input */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                    <form onSubmit={sendMessage} className="flex gap-2">
                      <div className="flex gap-1">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-10 w-10 p-0 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-xl"
                          >
                            <Paperclip className="h-4 w-4" />
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-10 w-10 p-0 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-xl"
                          >
                            <Mic className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      </div>

                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Posez-moi une question..."
                        className="flex-1 h-10 text-sm border-0 bg-white dark:bg-gray-800 shadow-sm focus:shadow-md transition-shadow rounded-xl"
                        disabled={isLoading}
                      />

                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          type="submit"
                          size="sm"
                          disabled={isLoading || !input.trim()}
                          className="h-10 w-10 p-0 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-xl shadow-lg"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </form>

                    {error && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-500 mt-2">
                        Échec de l'envoi du message. Veuillez réessayer.
                      </motion.p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
