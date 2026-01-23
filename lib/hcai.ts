export async function hcChatCompletion({
    model = "openai/gpt-4o-mini",
    messages, 
} : {
    model?: string;
    messages: {role: "system" | "user" | "assistant"; content: string}[];
}) {
    const apiKey = process.env.HACKCLUB_API_KEY;

    if (!apiKey) {
        console.error("Missing API Key in server env!")
        throw new Error("Missing API key");
    }

    const response = await fetch("https://ai.hackclub.com/proxy/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model,
            messages,
        }),
    });

    if (!response.ok) {
        console.error("AI failing to respond", await response.text());
        throw new Error("AI req failed");
    }

    const data = await response.json();

    const content =
        data?.choices?.[0]?.message?.content ??
        data?.choices?.[0]?.delta?.content ??
        null;

    if (!content) {
        console.error("Unexpected AI output", data)
        throw new Error("Empty AI response");
    }
    return data.choices[0].message.content;
}
