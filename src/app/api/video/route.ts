import { NextResponse } from 'next/server';
import Replicate from 'replicate';

// POST function to handle incoming requests
export async function POST(req: Request): Promise<NextResponse> {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN, // Ensure your environment variable is set
  });

  const data = await req.json(); // Parse the JSON body of the incoming request
  const userMessage = data[data.length - 1].content; // Extract the user's message from the data

  try {
    // Run the Zeroscope model on Replicate
    const output: any = await replicate.run(
      "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351", // Zeroscope model
      {
        input: {
          prompt: userMessage, // Use the user's message as the video generation prompt
          fps: 24,
          width: 1024,
          height: 576,
          guidance_scale: 17.5,
          negative_prompt: "very blue, dust, noisy, washed out, ugly, distorted, broken"
        },
      }
    );

    const videoUrl = output[0]; // Get the URL of the generated video (assuming output is an array with the URL as the first element)

    return NextResponse.json({ videoUrl }); // Respond with the video URL
  } catch (err) {
    return new NextResponse(`Error: ${(err as Error).message}`, { status: 500 });
  }
}
