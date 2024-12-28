const OpenAIClient = require('./OpenAIClient');
const { sanitizeAndConvertToJSON } = require('../../utils/textUtils');

class EditorInChief extends OpenAIClient {
    constructor() {
        super();
    }
    async run(headlines) {
        const systemPrompt = {
            role: 'system',
            content: `You are an editor-in-chief for a news organization.
            You will be given a list of headlines and you need to determine which ones are the most important and which ones are the least important.
            You need to return a list of the most important headlines, in order of importance.
            You should prioritize headlines that would be most interesting to the average reader.
            Your response should only be in JSON similarly to how you received the headlines.`
        };
        const response = await this.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                systemPrompt,
                {role: 'user', content: JSON.stringify(headlines)}
            ],
            temperature: 0,
        });
        return sanitizeAndConvertToJSON(response.choices[0].message.content);
    }
}

module.exports = EditorInChief;