'use client'
import { Box, Button, Stack, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, LinearProgress, Typography } from '@mui/material'
import { useState, useRef, useEffect, ChangeEvent } from 'react'
import Navbar from '@/components/navbar'; // Import your Navbar component
import AnimatedGridPattern from '@/components/magicui/animated-grid-pattern'; // Import the Animated Grid Pattern component
import { cn } from "@/lib/utils"; // Utility function for combining class names
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import { ChevronRight } from "lucide-react";
import ReactMarkdown from 'react-markdown';

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
  const [isApiLimitExceeded, setIsApiLimitExceeded] = useState<boolean>(false); // State for API limit pop-up
  const [apiUsage, setApiUsage] = useState<number>(0); // Track the number of API calls used
  const maxApiUsage = 5; // Define the maximum number of free API calls

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const fetchApiUsage = async () => {
      try {
        const response = await fetch('/api/getApiUsage');
        if (response.ok) {
          const data = await response.json();
          setApiUsage(data.usage);
        } else {
          console.error('Failed to fetch API usage');
        }
      } catch (error) {
        console.error('Error fetching API usage:', error);
      }
    };

    fetchApiUsage();
    scrollToBottom();
  }, []);

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
      });
      if (response.status === 429) { // Check if the API limit has been exceeded
        setIsApiLimitExceeded(true); // Trigger the pop-up
        return; // Exit early if API limit is exceeded
      }
      // Increment API usage count if the call was successful
      setApiUsage(prevUsage => Math.min(prevUsage + 1, maxApiUsage)); // Ensure it doesn't exceed maxApiUsage

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
      justifyContent="center"
      bgcolor="#000000"
    >
      {/* Include Navbar at the very top, aligned to the top */}
      <Box width="100%" sx={{ position: 'absolute', top: 0 }}>
        <Navbar />
      </Box>

      {/* Header Section */}
      <Box
        width="80%"
        maxWidth="1300px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        mt={25}
        mb={4}
      >
        <Box
          component="h1"
          sx={{
            color: '#FFFFFF',
            fontSize: '3rem',
            fontWeight: 'bold',
            textAlign: 'center',
            mt: -10,
          }}
        >
          Code Generation
        </Box>
        <Box
          component="h2"
          sx={{
            color: '#FFFFFF',
            fontSize: '1.5rem',
            fontWeight: 'normal',
            textAlign: 'center',
            mt: 2,
          }}
        >
          Code with Icon AI
        </Box>

        {/* API Usage Progression Line */}
        <Box width="100%" maxWidth="600px" mt={2}>
          <Typography variant="body1" color="white" align="center">
            {apiUsage}/{maxApiUsage} free uses
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(apiUsage / maxApiUsage) * 100}
            sx={{
              height: 10,
              borderRadius: 5,
              mt: 1,
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'red',
              },
              backgroundColor: '#444', // Background color of the progress line
            }}
          />
        </Box>
      </Box>

      {/* Main chat container */}
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
        {/* Animated Grid Pattern Background */}
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

        {/* Messages Stack */}
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
                >
                  {message.content || ""}
                </ReactMarkdown>
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
                Send
              </span>
              <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </AnimatedGradientText>
          </Button>
        </Stack>
      </Box>

      {/* API Limit Exceeded Pop-Up */}
      <Dialog
        open={isApiLimitExceeded}
        onClose={() => setIsApiLimitExceeded(false)}
      >
        <DialogTitle sx={{ textAlign: 'center' }}>API Limit Exceeded</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: 'center' }}>
            You have reached the maximum number of API requests allowed. Please subscribe to the pro version to continue using Icon AI.
          </DialogContentText>
          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setIsApiLimitExceeded(false);
                // Handle the "Go Pro" button click event here
              }}
            >
              Go Pro
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsApiLimitExceeded(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
