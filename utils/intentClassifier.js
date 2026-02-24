export function classifyIntent(message) {
  const text = message.trim().toLowerCase();

  if (text.length < 2 || text.length > 500) {
    return "clarification";
  }

  if (/^(.)\1{5,}$/.test(text)) return "clarification";
  if (!/[aeiou]/.test(text) && text.length > 8) return "clarification";

  if (/\b(hi|hello|hey|namaste|hola|good morning|sup)\b/.test(text)) {
    return "greeting";
  }

  if (/\b(chatbot|bot|virtual assistant)\b/.test(text)) {
    return "bot_capability";
  }

  if (/\b(job|career|opening|vacancy|hiring|recruitment)\b/.test(text)) {
    return "careers";
  }

  if (/\b(who are you|what are you|are you ai|how old are you|your age|openai|groq|language model)\b/.test(text)) {
    return "meta_block";
  }

  if (/\b(how are you|kaise ho|whats up)\b/.test(text)) {
    return "smalltalk";
  }

  if (/\b(thank|thanks|dhanyavaad|shukriya)\b/.test(text)) {
    return "gratitude";
  }

  if (/\b(bye|goodbye|see you)\b/.test(text)) {
    return "farewell";
  }

  if (/\b(about your company|company details|about us|what is your company)\b/.test(text)) {
    return "company_info";
  }

  if (/\b(phone|email|address|contact|website|office|number)\b/.test(text)) {
    return "contact_info";
  }

  if (/\b(price|pricing|cost|charges|fees|plan|subscription|payment)\b/.test(text)) {
    return "pricing";
  }

  if (/\b(refund|return|cancel|money back|policy)\b/.test(text)) {
    return "refund_policy";
  }

  if (/\b(order|delivery|shipping|service|warranty|product|support|issue|help)\b/.test(text)) {
    return "company_query";
  }

  return "unknown";
}