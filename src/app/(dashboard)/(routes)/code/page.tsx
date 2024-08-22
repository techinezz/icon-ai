'use client'
import { Box, Button, Stack, TextField } from '@mui/material'
import { useState, useRef, useEffect, ChangeEvent } from 'react'
import Navbar from '@/components/navbar'; // Import your Navbar component
import AnimatedGridPattern from '@/components/magicui/animated-grid-pattern'; // Import the Animated Grid Pattern component
import { cn } from "@/lib/utils"; // Utility function for combining class names
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import { ChevronRight } from "lucide-react";
import ReactMarkdown from 'react-markdown';

// Define the shape of the message object
interface Message {
  role: 'assistant' | 'user'
  content: string
}

export default function CodePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello I am Icon AI. Ask me any coding question?",
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
      const response = await fetch('/api/code', {
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

        {/* Header Section */}
        <Box
          width="80%" // Adjust width to match chat container width
          maxWidth="1300px" // Ensure it doesn't get too large
          display="flex"
          flexDirection="column"
          alignItems="center"
          mt={25} // Margin from the top
          mb={4} // Margin from the bottom before the chat container
        >
          <Box
            component="h1"
            sx={{
              color: '#FFFFFF', // White text color
              fontSize: '3rem', // Large font size for the main header
              fontWeight: 'bold',
              textAlign: 'center',
              mt: -10, // Remove default margin top
            }}
          >
            Code Genation
          </Box>
          <Box
            component="h2"
            sx={{
              color: '#FFFFFF', // White text color
              fontSize: '1.5rem', // Smaller font size for the subtitle
              fontWeight: 'normal',
              textAlign: 'center',
              mt: 2, // Margin top for some space between header and subtitle
            }}
          >
            Code with Icon AI
          </Box>
          <Box
            component="h2"
            sx={{
              color: '#FFFFFF', // White text color
              fontSize: '1.5rem', // Smaller font size for the subtitle
              fontWeight: 'normal',
              textAlign: 'center',
              mt: 2, // Margin top for some space between header and subtitle
            }}
          >
            Chat with Icon AI
          </Box>
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
                <ReactMarkdown
                components={{
                  pre: ({ node, ...props }) => (
                    <div className='overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg'>
                      <pre {...props} />
                    </div>
                  ),
                  code: ({ node, ...props}) => (
                    <code className='font-mono bg-black/20 rounded p-1' {...props} />
                  )
                }}
                className="text-sm overflow-hidden leading-7"
                >{message.content || ""}</ReactMarkdown>
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
  InputLabelProps={{
    shrink: true, // Ensures the label is above the input when focused or contains value
  }}
  sx={{
    input: {
      color: 'white', // White text for input
    },
    label: {
      color: '#FFFFFF', // White text for the label
      transform: 'translate(14px, -6px) scale(0.75)', // Position label above the field
      backgroundColor: '#000', // Optional: add background color to the label
      padding: '0 4px', // Optional: add padding to the label
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#FFFFFF', // Keep the label white when focused
    },
    '& .MuiOutlinedInput-root': {
      position: 'relative',
      '& fieldset': {
        borderColor: 'transparent', // Make the original border transparent
      },
      '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        borderRadius: 'inherit', // Match the border radius
        padding: '2px', // Creates the gradient border effect
        background: 'linear-gradient(90deg, #ffaa40, #9c40ff, #ffaa40)', // The gradient border
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'destination-out',
        maskComposite: 'exclude',
      },
      '&:hover::before': {
        background: 'linear-gradient(90deg, #ffaa40, #9c40ff, #ffaa40)', // Gradient on hover
      },
      '&.Mui-focused::before': {
        background: 'linear-gradient(90deg, #ffaa40, #9c40ff, #ffaa40)', // Gradient when focused
      },
      '&.Mui-focused fieldset': {
        borderColor: 'transparent', // Ensure the original border doesn't appear on focus
      },
      '& .MuiInputLabel-root': {
        transform: 'translate(14px, -6px) scale(0.75)', // Position label above the field
      },
    },
  }}
/>

<Button
  onClick={sendMessage}
  sx={{
    position: 'relative',
    backgroundColor: '#FFFFFF', // White background
    borderRadius: '20px',
    padding: '12px 24px',
    border: 'none', // Ensure no border is applied directly
    overflow: 'hidden', // Ensures that pseudo-elements don't affect button content
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: -1,
      background: 'linear-gradient(90deg, #ffaa40, #9c40ff, #ffaa40)', // Gradient effect
      borderRadius: 'inherit',
      padding: '2px', // This padding will create the border-like effect
      boxSizing: 'border-box',
    },
    '&:after': {
      content: '""',
      position: 'absolute',
      top: '2px',
      right: '2px',
      bottom: '2px',
      left: '2px',
      background: '#FFFFFF', // White background inside the gradient border
      borderRadius: 'inherit',
      zIndex: -1,
    },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textTransform: 'uppercase',
  }}
  disabled={isLoading}
>
  <AnimatedGradientText>
    <span
      className={cn(
        `inline bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-black`,
      )}
    >
      Send
    </span>
    <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
  </AnimatedGradientText>
</Button>
        </Stack>
      </Box>
    </Box>
  )
}
