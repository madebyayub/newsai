const HtmlScraper = require('../scrapers/htmlScraper');
const OpenAIClient = require('./OpenAIClient');

class BaseParser extends OpenAIClient {
    constructor() {
        super();
        this.chunkSize = 10000;
        this.htmlScraper = new HtmlScraper();
    }

    async getPage(url) {
        const html = await this.htmlScraper.getPage(url);
        return html;
    }

    splitIntoChunks(text) {
        const chunks = [];
        for (let i = 0; i < text.length; i += this.chunkSize) {
          chunks.push(text.slice(i, i + this.chunkSize));
        }
        return chunks;
    }

    combineResults(results) {
        try {
            const combinedResults = [];
            results.forEach(chunk => {
                // Split the content into individual JSON objects
                const jsonStrings = chunk.content
                    .replace(/```json\n|```/g, '') // Remove markdown code blocks
                    .split('}\n{')  // Split between JSON objects
                    .map((str, index, array) => {
                        // Add back the curly braces except for first and last items
                        if (index === 0) return str + '}';
                        if (index === array.length - 1) return '{' + str;
                        return '{' + str + '}';
                    });

                // Parse each JSON object individually
                jsonStrings.forEach(jsonStr => {
                    try {
                        const parsed = JSON.parse(jsonStr);
                        combinedResults.push(parsed);
                    } catch (error) {
                        console.error('Error parsing individual JSON:', error);
                        throw error;
                    }
                });
            });

            return combinedResults;
        } catch (error) {
            console.error('Error combining results:', error);
            return [];
        }
    }
}

module.exports = BaseParser;