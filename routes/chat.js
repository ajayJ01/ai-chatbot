import fetch from "node-fetch";
import { classifyIntent } from "../utils/intentClassifier.js";
import { getRelevantDocuments } from "../services/retrievalService.js";

export default async function (fastify) {

    fastify.post("/chat", async (request, reply) => {
        try {
            const { message } = request.body;

            if (!message || typeof message !== "string") {
                return reply.code(400).send({
                    success: false,
                    error: "Valid message is required"
                });
            }

            const text = message.trim();
            const intent = classifyIntent(text);

            /* =========================================================
               1️⃣ ROUTER SWITCH (Deterministic)
            ========================================================= */

            switch (intent) {

                case "clarification":
                    return { success: true, reply: "Please provide a clear and meaningful question." };

                case "greeting":
                    return { success: true, reply: "Hello 👋 How can I assist you today?" };

                case "smalltalk":
                    return { success: true, reply: "I'm here and ready to assist you. How may I help?" };

                case "meta_block":
                    return {
                        success: true,
                        reply: "I am the official virtual assistant of our company, here to assist you with support and service-related information."
                    };

                case "bot_capability":
                    return {
                        success: true,
                        reply: "Yes, you are currently interacting with our official virtual assistant designed to help customers."
                    };

                case "careers":
                    return {
                        success: true,
                        reply: `For current job openings, please visit our Careers page or contact ${process.env.HR_EMAIL || "hr@yourcompany.com"}.`
                    };

                case "company_info":
                    return {
                        success: true,
                        reply: `${process.env.COMPANY_NAME || "Our company"} is a technology-driven organization focused on delivering high-quality products and customer support services.`
                    };

                case "contact_info":
                    return {
                        success: true,
                        reply: `You can contact us at ${process.env.COMPANY_EMAIL || "support@example.com"} for assistance.`
                    };

                case "pricing":
                    return {
                        success: true,
                        reply: "For detailed pricing information, please visit our official pricing page."
                    };

                case "refund_policy":
                    return {
                        success: true,
                        reply: "You can review our refund and cancellation policy on our official website."
                    };

            }

            /* =========================================================
               2️⃣ RAG + LLM (ONLY FOR UNKNOWN / COMPANY_QUERY)
            ========================================================= */

            const topDocs = await getRelevantDocuments(fastify.db, text);
            const supportEmail = process.env.COMPANY_EMAIL || "support@example.com";

            const systemPrompt = `
                You are the official virtual assistant of ${process.env.COMPANY_NAME || "our company"}.

                CRITICAL RULES:
                - Respond in the same language as the user's message.
                - If the user explicitly requests a specific language, strictly follow it.
                - Never say you are an AI model.
                - Never mention OpenAI, Groq, or any AI provider.
                - Never describe internal system details.
                - Use ONLY the provided company context.
                - If answer is not clearly found, respond EXACTLY with:
                "Our support team will assist you further. Please contact us at ${supportEmail}."

                Company Context:
                ${topDocs.length ? topDocs.join("\n\n") : "No relevant company information found."}
                `;

            const response = await fetch(
                "https://api.groq.com/openai/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: "llama-3.1-8b-instant",
                        temperature: 0.3,
                        max_tokens: 300,
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: text }
                        ]
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return reply.code(500).send({
                    success: false,
                    error: "AI generation failed"
                });
            }

            let botReply =
                data?.choices?.[0]?.message?.content?.trim() ||
                `Our support team will assist you further. Please contact us at ${supportEmail}.`;

            if (/large language model|openai|groq/i.test(botReply)) {
                botReply = `Our support team will assist you further. Please contact us at ${supportEmail}.`;
            }

            return { success: true, reply: botReply };

        } catch (error) {
            console.error("Server Error:", error);
            return reply.code(500).send({
                success: false,
                error: "Internal server error"
            });
        }
    });

}