export async function hcChatCompletion({
    model = "openai/gpt-5.1",
    messages, 
} : {
    model?: string;
    messages: {role: "system" | "user" | "assistant"; content: string}[];
}) {
    const response = await fetch("https://ai.hackclub.com/proxy/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_HC_API_KEY}`,
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
    return data.choices[0].message.content;
}
