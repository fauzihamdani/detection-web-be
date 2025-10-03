import { Request, Response } from "express";
import z from "zod";
import { v4 as uuidv4 } from "uuid";

type GetWebuiResponse = z.infer<any>;

export const getModels = async (req: Request, res: Response) => {
  res.json({ data: [{ id: "llama.3.2:latest", obejct: "model" }] });
};

export const getFromWebui = async (req: Request, res: Response) => {
  try {
    const { model = "llama3.1", messages = [] } = req.body;

    // Forward to Ollama (non-streaming)
    const r = await fetch(
      process.env.OLLAMA_URL || "http://localhost:11434/api/chat",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, messages, stream: false }),
      }
    );
    const data = await r.json();
    const content = data?.message?.content || "";

    res.json({
      id: "chatcmpl-" + uuidv4(),
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model,
      choices: [
        {
          index: 0,
          message: { role: "assistant", content },
          finish_reason: "stop",
        },
      ],
    });
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: "register failed", error: error });
  }
};
