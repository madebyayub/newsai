const { OpenAI } = require('openai');

class OpenAIClient {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }
}

module.exports = OpenAIClient;