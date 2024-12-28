const HeadlinesParser = require('../services/agents/headlinesParser');
const EditorInChief = require('../services/agents/EditorInChief');
/**
 * Generates news articles from a specified source
 * @param {string} source - The source from which to generate news articles
 * @returns {Promise<Array>} A promise that resolves to an array of generated news articles
 */
exports.generateNewsArticles = async (source) => {
    // Step 1: Get the headlines and the article links.
    console.log('Start generating news articles for source:', source);
    console.log('Gathering headlines...');
    const headlinesParser = new HeadlinesParser();
    const headlines = await headlinesParser.run(source.url);
    console.log('Headlines successfully gathered...');
    console.log('Sending headlines to EditorInChief...');
    const editorInChief = new EditorInChief();
    const importantHeadlines = await editorInChief.run(headlines);
    console.log('EditorInChief successfully processed headlines...');
    return importantHeadlines;
}