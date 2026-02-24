export function classifyIntent(message) {
    const text = message.trim().toLowerCase();

    // Validation
    if (text.length < 2 || text.length > 500) {
        return "clarification";
    }

    // Basic spam / gibberish
    if (/^(.)\1{5,}$/.test(text)) return "clarification";
    if (!/[aeiou]/.test(text) && text.length > 8) return "clarification";

    // Greeting
    if (/\b(hi|hello|hey|namaste|hola|good morning|sup)\b/.test(text)) {
        return "greeting";
    }

    // Chatbot capability
    if (/\b(chatbot|bot|virtual assistant|do you have a bot|have you a chatbot)\b/.test(text)) {
        return "bot_capability";
    }

    // Careers
    if (/\b(job|jobs|career|careers|opening|openings|vacancy|vacancies|hiring|recruitment|apply)\b/.test(text)) {
        return "careers";
    }

    // Identity / Meta
    if (/\b(who are you|what are you|tum kon ho|aap kaun ho|are you ai|are you a bot|how old are you|your age|who created you|language model|openai|groq)\b/.test(text)) {
        return "meta_block";
    }

    // Small talk
    if (/\b(how are you|kaise ho|whats up)\b/.test(text)) {
        return "smalltalk";
    }

    // Gratitude
    if (/\b(thank|thanks|dhanyavaad|shukriya|appreciate)\b/.test(text)) {
        return "gratitude";
    }

    // Farewell
    if (/\b(bye|goodbye|alvida|see you|take care)\b/.test(text)) {
        return "farewell";
    }

    // Contact
    if (/\b(phone|mobile|email|address|location|contact|website|office|number|call)\b/.test(text)) {
        return "contact_info";
    }

    // Pricing
    if (/\b(price|pricing|cost|charges|fees|plan|subscription|payment)\b/.test(text)) {
        return "pricing";
    }

    // Refund
    if (/\b(refund|return|cancel|cancellation|money back|policy)\b/.test(text)) {
        return "refund_policy";
    }

    // General company query
    if (/\b(order|delivery|shipping|service|timing|schedule|warranty|product|faq|support|issue|problem|help)\b/.test(text)) {
        return "company_query";
    }

    return "unknown";
}