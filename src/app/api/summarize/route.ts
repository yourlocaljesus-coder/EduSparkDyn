import { NextRequest, NextResponse } from "next/server";
import Typo from "typo-js";
import fs from "fs";
import path from "path";


let dictionary: Typo;

try {
  const aff = fs.readFileSync(path.resolve("./public/dictionaries/en_US/en_US.aff"), "utf-8");
  const dic = fs.readFileSync(path.resolve("./public/dictionaries/en_US/en_US.dic"), "utf-8");
  dictionary = new Typo("en_US", aff, dic, );
} catch (err) {
  console.error("❌ Failed to load Typo.js dictionary:", err);
}


function spellCorrect(text: string) {
  return text.split(/\b/).map(word => {
    if (dictionary && !dictionary.check(word) && /^[a-zA-Z]+$/.test(word)) {
      const suggestions = dictionary.suggest(word);
      return suggestions[0] || word;
    }
    return word;
  }).join("");
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    console.log("📝 Raw OCR text:", text);

    const correctedText = spellCorrect(text);
    console.log("✅ Corrected text:", correctedText);

    const hfResponse = await fetch("https://api-inference.huggingface.co/models/sshleifer/distilbart-cnn-12-6", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: correctedText }),
    });

    const rawText = await hfResponse.text();

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      console.error("❌ HuggingFace returned non-JSON:", rawText);
      return NextResponse.json({ summary: "Invalid response from HuggingFace." }, { status: 500 });
    }

    if (!hfResponse.ok) {
      console.error("❌ HuggingFace error:", data);
      return NextResponse.json({ summary: "Failed to summarize." }, { status: 500 });
    }

    const summary = Array.isArray(data)
      ? data[0]?.summary_text
      : data?.summary_text || "Failed to summarize.";

    return NextResponse.json({ summary });

  } catch (error) {
    console.error("🔥 Summarization error:", error);
    return NextResponse.json({ summary: "Failed to summarize." }, { status: 500 });
  }
}
