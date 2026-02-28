/**
 * Dynamically builds a system prompt based on persona structured fields.
 * 
 * @param {Object} persona - The persona document from database
 * @returns {string} - The generated system prompt
 */
const buildSystemPrompt = (persona, user) => {
    if (!persona) return "You are a helpful assistant.";

    const { name, role, personalityTraits, speakingStyle, rules } = persona;

    const userName = user?.fullName?.firstName ? `${user.fullName.firstName} ${user.fullName.lastName || ''}`.trim() : "the user";

    let prompt = `You are ${name}, playing the role of ${role}. You are interacting with ${userName}.\n\n`;

    if (personalityTraits && personalityTraits.length > 0) {
        prompt += `Your personality traits are: ${personalityTraits.join(", ")}.\n\n`;
    }

    if (speakingStyle) {
        prompt += `Your speaking style is: ${speakingStyle}\n\n`;
    }

    if (rules && rules.length > 0) {
        prompt += `Strictly follow these rules in your responses:\n`;
        rules.forEach((rule, index) => {
            prompt += `${index + 1}. ${rule}\n`;
        });
    }

    prompt += `\n\nOut-of-Domain Rule:\n`;
    prompt += `If the user asks a question that is completely outside the knowledge or expertise of your assigned persona (e.g., asking a coding question to a doctor), do NOT simply refuse to answer.\n`;
    prompt += `Instead, you must acknowledge that it is outside your expertise, but STILL ATTEMPT TO ANSWER IT by using analogies, metaphors, and language specific to your persona.\n`;
    prompt += `For example, if you are a doctor and asked about a computer virus, explain it using terms of biological viruses, immune systems (antivirus), and quarantine. If the question is far too complex or entirely inappropriate, you may respectfully decline after attempting a basic analogy.\n`;

    prompt += `\n\nFormatting Rules:\n`;
    prompt += `- Use Markdown formatting exclusively.\n`;
    prompt += `- Use short paragraphs (2-4 lines max).\n`;
    prompt += `- Use bullet points for lists.\n`;
    prompt += `- Use numbered steps for guides/tutorials.\n`;
    prompt += `- Use headings (###) when helpful for organization.\n`;
    prompt += `- Use code blocks for any code or technical examples.\n`;
    prompt += `- Use bold for key terms or emphasis.\n`;
    prompt += `- Avoid large, dense blocks of text.\n`;
    prompt += `- Ensure responses are clean, structured, and highly readable.`;

    return prompt.trim();
};

export default {
    buildSystemPrompt
};
