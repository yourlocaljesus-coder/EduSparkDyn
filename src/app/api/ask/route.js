import { InferenceClient } from "@huggingface/inference";


export const dynamic = 'force-dynamic'; 

export async function POST(req) {
  const client = new InferenceClient(process.env.HF_TOKEN);

  const body = await req.json();
  const { topic, notes } = body;

  if (!topic || !notes) {
    return Response.json({ error: 'Missing topic or notes' }, { status: 400 });
  }

  const prompt = `Summarize and explain the following notes on "${topic}" like I’m five:\n\n${notes}`;

  try {
    const chatCompletion = await client.chatCompletion({
      model: "mistralai/Mistral-7B-Instruct-v0.3",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const reply = chatCompletion?.choices?.[0]?.message?.content || 'AI returned no output.';
    return Response.json({ reply });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Failed to connect to Hugging Face API' }, { status: 500 });
  }
}
