const BaseParser = require('./baseParser');
const { filterHTMLForArticleContent } = require('../../utils/textUtils');

class ArticleParser extends BaseParser {
  constructor() {
    super();
  }

  async run(html) {
    try {
      console.log('Running ArticleParser');
      console.log('HTML length:', html.length);
      const processedHTML = filterHTMLForArticleContent(html);
      console.log('Processed HTML length:', processedHTML.length);
      // Split into chunks
      const chunks = this.splitIntoChunks(processedHTML);
      console.log('Number of chunks:', chunks.length);
      // Process each chunk
      const chunkResults = await Promise.all(
        chunks.map((chunk, index) => 
          this.parseChunk(chunk, index + 1, chunks.length)
        )
      );
      console.log('ArticleParser finished');
      const finalSummary = await this.createReport(this.combineResults(chunkResults));
      console.log('ArticleParser finished');
      return finalSummary;

    } catch (error) {
      console.error('Error parsing content:', error);
      throw error;
    }
  }

  async parseChunk(chunk, chunkNumber, totalChunks) {
    console.log('Parsing chunk:', chunkNumber);
    const systemPrompt = `You are an expert at analyzing HTML web content. 
    You will be provided part ${chunkNumber} of ${totalChunks} of an HTML webpage 
    for a news article. Given the following webpage content in HTML, 
    your objective is to extract important information about the article
    in bullet point form`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: chunk }
      ],
      temperature: 0,
    });

    return {
      chunkNumber,
      content: response.choices[0].message.content
    };
  }

  async createReport(text) {
    console.log('Creating final report');
    const systemPrompt = {
      role: "system",
      content: `You are an excellent news researcher.
      The following is chunks of summaries of individual
      sections of a singular news article. Conduct a thorough analysis of the 
      different chunks of the news article and provide the necessary 
      information in a report that would be useful for a news reporter.`
    };

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        systemPrompt,
        { role: "user", content: text }
      ],
      temperature: 0,
    });

    return response.choices[0].message.content;
  }
}

module.exports = ArticleParser; 