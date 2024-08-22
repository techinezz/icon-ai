import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// POST function to handle incoming requests
export async function POST(req: Request): Promise<NextResponse> {
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

    return NextResponse.json({ imageUrl }); // Respond with the image URL
  } catch (err) {
    return new NextResponse(`Error: ${(err as Error).message}`, { status: 500 });
  }
}
