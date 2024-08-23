import { NextResponse } from 'next/server'; // Import NextResponse from Next.js for handling responses
import OpenAI from 'openai'; // Import OpenAI library for interacting with the OpenAI API
import { checkApiLimit, incrementApiLimit } from '@/lib/api-limit'; // Import the API limit functions

// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt = "you are Icon AI. A very powerful AI, you help users with their questions";

// Define the expected structure of the request body
interface ChatCompletionMessageParam {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// POST function to handle incoming requests
export async function POST(req: Request): Promise<NextResponse> {
  // Check if the user is within the API limit
  const isWithinLimit = await checkApiLimit();

  if (!isWithinLimit) {
    return NextResponse.json({ error: 'API limit exceeded' }, { status: 429 }); // Return 429 status if limit is exceeded
  }

  const openai = new OpenAI(); // Create a new instance of the OpenAI client
  const data: ChatCompletionMessageParam[] = await req.json(); // Parse the JSON body of the incoming request

  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'system', content: systemPrompt }, ...data], // Include the system prompt and user messages
    model: 'gpt-3.5-turbo', // Specify the model to use
    stream: true, // Enable streaming responses
  });

  // Create a TransformStream to handle the streaming response
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content; // Extract the content from the chunk
          if (content) {
            const text = encoder.encode(content); // Encode the content to Uint8Array
            controller.enqueue(text); // Enqueue the encoded text to the stream
          }
        }
      } catch (err) {
        controller.error(err); // Handle any errors that occur during streaming
      } finally {
        controller.close(); // Close the stream when done
      }
    },
  });

  // Increment the API limit after a successful operation
  await incrementApiLimit();

  return new NextResponse(stream as unknown as BodyInit); // Cast stream to BodyInit type
}

