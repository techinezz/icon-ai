import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import { checkApiLimit, incrementApiLimit } from '@/lib/api-limit'; // Import the API limit functions

// POST function to handle incoming requests
export async function POST(req: Request): Promise<NextResponse> {
  // Check if the user is within the API limit
  const isWithinLimit = await checkApiLimit();

  if (!isWithinLimit) {
    return NextResponse.json({ error: 'API limit exceeded' }, { status: 429 }); // Return 429 status if limit is exceeded
  }

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN, // Ensure your environment variable is set
  });

  const data = await req.json(); // Parse the JSON body of the incoming request
  const userMessage = data[data.length - 1].content; // Extract the user's message from the data

  try {
    // Run the Riffusion model on Replicate
    const output: any = await replicate.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      {
        input: {
          prompt_b: userMessage, // Use the user's message as the music generation prompt
        },
      }
    );
    
    const audioUrl = output.audio; // Get the URL of the generated audio

    // Increment the API limit after a successful operation
    await incrementApiLimit();

    return NextResponse.json({ audioUrl }); // Respond with the audio URL
  } catch (err) {
    return new NextResponse(`Error: ${(err as Error).message}`, { status: 500 });
  }
}
