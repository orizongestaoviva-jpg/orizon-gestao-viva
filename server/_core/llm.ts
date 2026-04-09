import { ENV } from "./env";

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMOptions {
  messages: Message[];
  temperature?: number;
  maxTokens?: number;
}

export async function invokeLLM(options: LLMOptions) {
  try {
    const response = await fetch(`${ENV.builtInForgeApiUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.builtInForgeApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: options.messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      choices: [
        {
          message: {
            content: data.choices[0]?.message?.content || "Sem resposta",
          },
        },
      ],
    };
  } catch (error) {
    console.error("[LLM] Error:", error);
    return {
      choices: [
        {
          message: {
            content: "Desculpe, houve um erro ao processar sua solicitação.",
          },
        },
      ],
    };
  }
}
