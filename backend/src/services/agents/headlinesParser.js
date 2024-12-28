const BaseParser = require('./baseParser');

const { filterHTMLForHeadlinesContent } = require('../../utils/textUtils');

class HeadlinesParser extends BaseParser {
  constructor() {
    super();
  }

  async run(url) {
    try {
      console.log('\t\tStart running HeadlinesParser\n');
      const html = await this.getPage(url);
      console.log('\t\tHTML length:', html.length);
      const processedHTML = filterHTMLForHeadlinesContent(html);
      console.log('\t\tProcessed HTML length:', processedHTML.length);
      
      // Split into manageable chunks
      const chunks = this.splitIntoChunks(processedHTML);
      console.log('\t\tNumber of chunks:', chunks.length);
      
      // Process each chunk to find headlines
      const chunkResults = await Promise.all(
        chunks.map((chunk, index) => 
          this.parseChunk(chunk, index + 1, chunks.length)
        )
      );
      // Combine and format results into a json array
      const headlines = this.combineResults(chunkResults);
      console.log('\t\tSuccessfully ran HeadlinesParser\n');
      return headlines;
    } catch (error) {
      console.error('\t\tError parsing headlines:', error);
      throw error;
    }
  }

  async parseChunk(chunk, chunkNumber, totalChunks) {
    console.log(`\t\tParsing chunk ${chunkNumber} of ${totalChunks}`);
    
    const systemPrompt = `You are an expert at analyzing news website content.
    You will be provided part ${chunkNumber} of ${totalChunks} of a news website's HTML content.
    Extract all headlines and their corresponding article links.
    
    Format each headline as json without any new line or special characters:
    {
      "title": [The headline text],
      "link": [The article URL if available],
      "category": [News category if identifiable]
    }
    
    Only include actual news headlines, ignore advertisements, navigation links, or other non-news content.`;

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
}

module.exports = HeadlinesParser;
