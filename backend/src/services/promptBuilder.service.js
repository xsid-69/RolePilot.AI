/**
 * Dynamically builds a system prompt based on persona structured fields.
 * 
 * @param {Object} persona - The persona document from database
 * @returns {string} - The generated system prompt
 */
const buildSystemPrompt = (persona) => {
    if (!persona) return "You are a helpful assistant.";

    const { name, role, personalityTraits, speakingStyle, rules } = persona;

    let prompt = `You are ${name}, playing the role of ${role}.\n\n`;

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

    return prompt.trim();
};

export default {
    buildSystemPrompt
};
