import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { checkApiLimit, incrementApiLimit } from '@/lib/api-limit'; // Import the API limit functions

// POST function to handle incoming requests
export async function POST(req: Request): Promise<NextResponse> {
  // Check if the user is within the API limit
  const isWithinLimit = await checkApiLimit();

  if (!isWithinLimit) {
    return NextResponse.json({ error: 'API limit exceeded' }, { status: 429 }); // Return 429 status if limit is exceeded
  }

  const openai = new OpenAI(); // Create a new instance of the OpenAI client
  const data = await req.json(); // Parse the JSON body of the incoming request

  // Extract the user's message from the data (the last item in the array)
  const userMessage = data[data.length - 1].content;

  try {
    // Create an image generation request to the OpenAI API
    const response = await openai.images.generate({
      prompt: userMessage, // Use the user's message as the image prompt
      n: 1, // Generate 1 image
      size: '1024x1024', // Specify the size of the image
    });

    const imageUrl = response.data[0].url; // Get the URL of the generated image

    // Increment the API limit after a successful operation
    await incrementApiLimit();

    return NextResponse.json({ imageUrl }); // Respond with the image URL
  } catch (err) {
    return new NextResponse(`Error: ${(err as Error).message}`, { status: 500 });
  }
}
