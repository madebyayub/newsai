const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const Sources = require('./config/sources.json');
const HtmlScraper = require('./src/services/scrapers/htmlScraper');
const ArticlesParser = require('./src/services/agents/articlesParser');
const HeadlinesParser = require('./src/services/agents/headlinesParser');
const { generateNewsArticles } = require('./src/routes/generateNewsArticles');

dotenv.config({ path: './.env' });

const app = express();
const port = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

app.post('/generate', async (req, res) => {
  const sourceInfo = Sources.sources.find(s => s.id === req.body.sourceid);
  if (!sourceInfo) {
    return res.status(404).json({error: 'Source not found'});
  }
  const articles = await generateNewsArticles(sourceInfo);
  res.json({response: articles});
});

// Basic route
app.get('/scrape/article', async (req, res) => {
  console.log('Scraping request received');
  console.log('Scraping for url:', req.query.url);
  const url = req.query.url;
  const scraper = new HtmlScraper();
  const articlesParser = new ArticlesParser();
  const html = await scraper.getPage(url);
  const articleInfo = await articlesParser.run(html);
  res.json({response: articleInfo});
});

app.get('/scrape/headlines', async (req, res) => {
  console.log('Scraping request received');
  console.log('Scraping for url:', req.query.url);
  const url = req.query.url;
  const scraper = new HtmlScraper();
  const headlinesParser = new HeadlinesParser();
  const html = await scraper.getPage(url);
  const headlines = await headlinesParser.run(html);
  res.json({response: headlines});
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 