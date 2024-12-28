const { JSDOM, VirtualConsole } = require('jsdom');

/**
 * Checks if text is likely boilerplate content
 */
function isBoilerplate(text) {
  const boilerplatePatterns = [
    /subscribe|sign up|newsletter/i,
    /cookie|privacy|terms/i,
    /advertisement/i,
    /share this|follow us/i,
    /all rights reserved/i,
    /related articles/i
  ];

  return boilerplatePatterns.some(pattern => pattern.test(text));
}

/**
 * Cleans and formats text content
 */
function cleanText(text) {
  return text
    .replace(/\s+/g, ' ')           // Replace multiple spaces with single space
    .replace(/\n\s*\n/g, '\n\n')    // Normalize line breaks
    .replace(/[^\S\n]+/g, ' ')      // Replace multiple spaces (except newlines) with single space
    .trim();
}

/**
 * Fallback function to strip HTML tags
 */
function stripHTML(html) {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Converts strings to a JSON objects by sanitizing the string and splitting them into individual JSON objects.
 * @param {string} string - The string to convert to JSON
 * @returns {object[]} The JSON objects
 */
exports.sanitizeAndConvertToJSON = (string) => {
    console.log('Converting string to JSON objects:', string);
    try {
        const sanitizedString = string
            .replace(/```json\n|```/g, '') // Remove markdown code blocks
        const result = JSON.parse(sanitizedString); 
        return result;
    } catch (error) {
        return ["Failed to sanitize and convert to JSON"];
    }
}

/**
 * Processes HTML content and extracts meaningful text while removing boilerplate
 * @param {string} html - Raw HTML content
 * @returns {string} Cleaned and processed text content
 */
exports.filterHTMLForArticleContent = (html) => {
    try {
      // Create a virtual console that suppresses all output
      const virtualConsole = new VirtualConsole();
      virtualConsole.on("error", () => { /* suppress errors */ });
      virtualConsole.on("warn", () => { /* suppress warnings */ });
      virtualConsole.on("info", () => { /* suppress info */ });
      virtualConsole.on("dir", () => { /* suppress dir */ });
  
      // Create DOM from HTML with silent console
      const dom = new JSDOM(html, {
        virtualConsole,
        runScripts: "outside-only",
        pretendToBeVisual: true
      });
  
      const document = dom.window.document;
  
      // 1. Remove unwanted elements entirely
      const removeElements = [
        'script',
        'style',
        'noscript',
        'iframe',
        'nav',
        'footer',
        'header',
        'aside',
        '[aria-hidden="true"]',
        '[role="complementary"]',
        '.ad',
        '.ads',
        '.advertisement',
        '.social-share',
        '.newsletter',
        '.subscription',
        '.cookie',
        '.popup',
        '.modal',
        '#comments',
        '.comments'
      ];
  
      removeElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => el.remove());
      });
  
      // 2. Find main content area
      const mainSelectors = [
        'article',
        '[role="main"]',
        'main',
        '.article-content',
        '.post-content',
        '.entry-content',
        '.story-content',
        '.main-content',
        '#main-content'
      ];
  
      let mainContent = null;
      for (const selector of mainSelectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent.trim().length > 200) {
          mainContent = element;
          break;
        }
      }
  
      // 3. If no main content found, collect all paragraphs
      if (!mainContent) {
        const paragraphs = Array.from(document.querySelectorAll('p'))
          .filter(p => {
            const text = p.textContent.trim();
            return text.length > 30 && !isBoilerplate(text);
          })
          .map(p => p.textContent.trim());
  
        return paragraphs.join('\n\n');
      }
  
      // 4. Clean and format the text
      let text = mainContent.textContent;
      text = cleanText(text);
  
      return text;
  
    } catch (error) {
      console.error('Error processing HTML:', error);
      // Fallback to basic HTML stripping
      return stripHTML(html);
    }
  };

/**
 * Processes HTML content and extracts headline-related elements
 * @param {string} html - Raw HTML content
 * @returns {string} HTML content filtered for headlines
 */
exports.filterHTMLForHeadlinesContent = (html) => {
    try {
      // Create a virtual console that suppresses all output
      const virtualConsole = new VirtualConsole();
      virtualConsole.on("error", () => { /* suppress errors */ });
      virtualConsole.on("warn", () => { /* suppress warnings */ });
      virtualConsole.on("info", () => { /* suppress info */ });
      virtualConsole.on("dir", () => { /* suppress dir */ });
  
      // Create DOM from HTML with silent console
      const dom = new JSDOM(html, {
        virtualConsole,
        runScripts: "outside-only",
        pretendToBeVisual: true
      });
  
      const document = dom.window.document;
  
      // 1. Remove unwanted elements entirely
      const removeElements = [
        'script',
        'style',
        'noscript',
        'iframe',
        'form',
        'input',
        'button',
        '.ad',
        '.ads',
        '.advertisement',
        '.social-share',
        '.newsletter',
        '.subscription',
        '.cookie',
        '.popup',
        '.modal',
        '#comments',
        '.comments',
        'svg'
      ];
  
      removeElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => el.remove());
      });
  
      // 2. Keep only elements likely to contain headlines
      const headlineContainers = [
        'a',
      ];
  
      // Create a new document fragment to store headline content
      const fragment = document.createDocumentFragment();
      
      // Copy headline elements to the fragment
      headlineContainers.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          // Only keep if it contains an anchor tag or has substantial text
          if (el.querySelector('a') || el.textContent.trim().length > 20) {
            const clone = el.cloneNode(true);
            // Preserve href attributes in anchors
            clone.querySelectorAll('a').forEach(a => {
              if (a.getAttribute('href')) {
                a.setAttribute('data-href', a.getAttribute('href'));
              }
            });
            fragment.appendChild(clone);
          }
        });
      });
  
      // Replace document body with only the headline content
      document.body.innerHTML = '';
      document.body.appendChild(fragment);
  
      // 3. Clean and format the content
      const cleanedHTML = document.body.innerHTML
        .replace(/\s+/g, ' ')           // Replace multiple spaces with single space
        .replace(/>\s+</g, '><')        // Remove spaces between tags
        .trim();
  
      return cleanedHTML;
  
    } catch (error) {
      console.error('Error filtering HTML for headlines:', error);
      return html; // Return original HTML if processing fails
    }
  };