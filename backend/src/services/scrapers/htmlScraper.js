const puppeteer = require('puppeteer');
const { JSDOM } = require('jsdom');
const axios = require('axios');

class HtmlScraper {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: "new",
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080'
      ]
    });
  }

  async getPage(url) {
    try {
      // Enhanced headers for more realistic browser simulation
      const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"'
      };

      // Try Puppeteer first for dynamic content
      if (!this.browser) await this.init();
      const page = await this.browser.newPage();
      
      // Set viewport and headers
      await page.setViewport({ width: 1920, height: 1080 });
      await page.setExtraHTTPHeaders(headers);
      await page.setUserAgent(headers['User-Agent']);

      // Add delay using setTimeout instead of waitForTimeout
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 1000));

      try {
        await page.goto(url, {
          waitUntil: ['networkidle0', 'domcontentloaded'],
          timeout: 30000
        });

        // Wait for content to load
        await page.waitForSelector('body');
        
        const content = await page.content();
        await page.close();
        return content;
      } catch (puppeteerError) {
        console.error('Puppeteer error:', puppeteerError);
        await page.close();
        
        // Fallback to axios if Puppeteer fails
        console.log('Trying axios as fallback...');
        const response = await axios.get(url, { headers });
        return response.data;
      }
    } catch (error) {
      console.error('Failed to fetch page:', error);
      throw error;
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

module.exports = HtmlScraper; 