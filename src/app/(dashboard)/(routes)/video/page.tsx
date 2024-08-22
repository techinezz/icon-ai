'use client'
import { Box, Button, Stack, TextField } from '@mui/material'
import { useState, useRef, useEffect, ChangeEvent } from 'react'
import Navbar from '@/components/navbar';
import AnimatedGridPattern from '@/components/magicui/animated-grid-pattern';
import { cn } from "@/lib/utils";
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import { ChevronRight } from "lucide-react";

interface Message {
  role: 'assistant' | 'user';
  content: string;
  videoUrl?: string; // Optional video URL
}

export default function VideoPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello I am Icon AI. Let's create some videos!",
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
      const response = await fetch('/api/video', {
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

      const { videoUrl } = await response.json(); // Extract the video URL from the response

      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: 'Here is your video:', videoUrl },
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
      justifyContent="center"
      bgcolor="#000000"
    >
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
            Video Generation
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
            Make Videos with Icon AI
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
            Video may take up to 4 minutes to generate
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

      <Box
        width="80%"
        maxWidth="1300px"
        height="70vh"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="center"
        p={2}
        sx={{
          backgroundColor: 'transparent',
          borderRadius: '16px',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="relative flex w-full items-center overflow-hidden"
      >
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={2.1}
          duration={3}
          repeatDelay={1}
          className={cn(
            "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
            "absolute inset-x-0 top-0 h-full",
          )}
        />

        <Stack
          direction={'column'}
          spacing={2}
          width="100%"
          height="calc(100% - 60px)"
          overflow="auto"
          sx={{
            position: 'relative',
            zIndex: 1,
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
                  bgcolor: message.role === 'assistant' ? '#0A3D62' : '#1F1F1F',
                  color: message.role === 'assistant' ? '#EAEAEA' : '#FFFFFF',
                  borderRadius: '20px',
                  p: 4,
                  maxWidth: '75%',
                  boxShadow: 3,
                }}
              >
                {message.content}
                {message.videoUrl && (
                  <video controls style={{ marginTop: '10px', width: '100%' }}>
                    <source src={message.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>

        <Stack
          direction={'row'}
          spacing={2}
          sx={{ zIndex: 1, position: 'relative', width: '100%', marginTop: 'auto' }}
        >
          <TextField
            label="Describe the video..."
            fullWidth
            value={message}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              input: {
                color: 'white',
              },
              label: {
                color: '#FFFFFF',
                transform: 'translate(14px, -6px) scale(0.75)',
                backgroundColor: '#000',
                padding: '0 4px',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#FFFFFF',
              },
              '& .MuiOutlinedInput-root': {
                position: 'relative',
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: -1,
                  borderRadius: 'inherit',
                  padding: '2px',
                  background: 'linear-gradient(90deg, #ffaa40, #9c40ff, #ffaa40)',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'destination-out',
                  maskComposite: 'exclude',
                },
                '&:hover::before': {
                  background: 'linear-gradient(90deg, #ffaa40, #9c40ff, #ffaa40)',
                },
                '&.Mui-focused::before': {
                  background: 'linear-gradient(90deg, #ffaa40, #9c40ff, #ffaa40)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'transparent',
                },
                '& .MuiInputLabel-root': {
                  transform: 'translate(14px, -6px) scale(0.75)',
                },
              },
            }}
          />

          <Button
            onClick={sendMessage}
            sx={{
              position: 'relative',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '12px 24px',
              border: 'none',
              overflow: 'hidden',
              '&:before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                zIndex: -1,
                background: 'linear-gradient(90deg, #ffaa40, #9c40ff, #ffaa40)',
                borderRadius: 'inherit',
                padding: '2px',
                boxSizing: 'border-box',
              },
              '&:after': {
                content: '""',
                position: 'absolute',
                top: '2px',
                right: '2px',
                bottom: '2px',
                left: '2px',
                background: '#FFFFFF',
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
                Generate
              </span>
              <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </AnimatedGradientText>
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}
