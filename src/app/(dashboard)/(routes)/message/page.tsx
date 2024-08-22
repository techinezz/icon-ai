'use client'
import { Box, Button, Stack, TextField } from '@mui/material'
import { useState, useRef, useEffect, ChangeEvent } from 'react'
import Navbar from '@/components/navbar'; // Import your Navbar component
import AnimatedGridPattern from '@/components/magicui/animated-grid-pattern'; // Import the Animated Grid Pattern component
import { cn } from "@/lib/utils"; // Utility function for combining class names

// Define the shape of the message object
interface Message {
  role: 'assistant' | 'user'
  content: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello I am Icon AI. How can I help you today?",
    },
  ])
  const [message, setMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return
    setIsLoading(true)

    const userMessage = message
    setMessage('')
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: userMessage },
    ])

    try {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: userMessage }]),
      })

      if (!response.ok) {
        const errorMessage = await response.text()
        throw new Error(`Network response was not ok: ${errorMessage}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No readable stream found in response')
      }

      const decoder = new TextDecoder()
      let assistantMessage = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        assistantMessage += decoder.decode(value, { stream: true })
      }

      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: assistantMessage },
      ])
    } catch (error) {
      console.error('Error:', error)
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center" // Center content vertically
      bgcolor="#000000" // Set the background to black
    >
      {/* Include Navbar at the very top, aligned to the top */}
      <Box width="100%" sx={{ position: 'absolute', top: 0 }}>
        <Navbar />
      </Box>

      {/* Main chat container */}
      <Box
        width="80%" // Adjust width to your preference, e.g., 80% of the screen width
        maxWidth="1300px" // Max width to ensure it doesn't get too large
        height="70vh" // Set a fixed height for the chat container
        display="flex"
        flexDirection="column"
        justifyContent="flex-start" // Start content at the top
        alignItems="center"
        p={2}
        sx={{
          backgroundColor: 'transparent', // Make background transparent so the grid pattern is visible
          borderRadius: '16px',
          position: 'relative', // Ensure correct stacking order
          overflow: 'hidden', // Hide any overflow from the grid
        }}
        className="relative flex w-full items-center overflow-hidden"
      >
        {/* Animated Grid Pattern Background */}
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={2.1}
          duration={3}
          repeatDelay={1}
          className={cn(
            "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
            "absolute inset-x-0 top-0 h-full", // Adjusted position and height to cover the entire container
          )}
        />

        {/* Messages Stack */}
        <Stack
          direction={'column'}
          spacing={2}
          width="100%"
          height="calc(100% - 60px)" // Leave room for the input field
          overflow="auto" // Allow the messages stack to scroll
          sx={{
            position: 'relative', // Ensure it stacks on top of the background
            zIndex: 1, // Ensure content is above the background
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                sx={{
                  bgcolor: message.role === 'assistant' ? '#0A3D62' : '#1F1F1F', // AI: Midnight Blue, User: Charcoal Gray
                  color: message.role === 'assistant' ? '#EAEAEA' : '#FFFFFF',  // Text colors
                  borderRadius: '20px',
                  p: 4,
                  maxWidth: '75%',
                  boxShadow: 3, // Add some shadow for a pop effect
                }}
              >
                {message.content}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>

        {/* Input Section */}
        <Stack
          direction={'row'}
          spacing={2}
          sx={{ zIndex: 1, position: 'relative', width: '100%', marginTop: 'auto' }}
        >
          <TextField
            label="Type a message..."
            fullWidth
            value={message}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
            sx={{
              input: {
                color: 'white', // White text for input
              },
              label: {
                color: '#777777', // Grey label color
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#555555', // Grey border for input
                },
                '&:hover fieldset': {
                  borderColor: 'linear-gradient(90deg, #00aaff, #00ffcc, #ff88ff)', // Lighter grey on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'linear-gradient(90deg, #00aaff, #00ffcc, #ff88ff)', // Green border when focused
                },
              },
            }}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            sx={{
              bgcolor: 'linear-gradient(90deg, #00aaff, #00ffcc, #ff88ff)', // Green button
              '&:hover': {
                bgcolor: '#ff88ff', // Darker green on hover
              },
            }}
            disabled={isLoading} // Disable the button when loading
          >
            Send
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}
