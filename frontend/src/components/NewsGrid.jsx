import '../styles/NewsGrid.css';

const NewsGrid = () => {
  const newsItems = [
    {
      title: "Major Technology Breakthrough Announced",
      description: "Scientists unveil revolutionary quantum computing breakthrough that could transform data processing and cybersecurity across global industries.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60",
      trendingScore: 98,
    },
    {
      title: "Global Economy Shows Signs of Recovery",
      description: "Markets rally as international trade volumes surge and inflation rates stabilize across major economies, signaling potential end to downturn.",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=60",
      trendingScore: 85,
    },
    {
      title: "New Climate Policy Implemented Worldwide",
      description: "World leaders agree on ambitious carbon reduction targets, introducing strict measures to combat climate change with immediate effect.",
      image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&auto=format&fit=crop&q=60",
      trendingScore: 75,
    },
    {
      title: "Sports Team Wins Championship",
      description: "Underdog team makes history with stunning victory in championship final, marking their first title in over two decades.",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=60",
      trendingScore: 82,
    },
    {
      title: "Medical Research Makes Breakthrough",
      description: "Research team develops promising new treatment for chronic diseases, showing remarkable results in early clinical trials.",
      image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&auto=format&fit=crop&q=60",
      trendingScore: 90,
    },
    {
      title: "Tech Company Launches New Product",
      description: "Leading tech giant unveils next-generation device, promising to revolutionize how we interact with digital technology.",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop&q=60",
      trendingScore: 70,
    },
    {
      title: "Entertainment Industry Sets New Record",
      description: "Streaming platforms report unprecedented growth as digital entertainment consumption reaches all-time high.",
      image: "https://images.unsplash.com/photo-1603190287605-e6ade32fa852?w=800&auto=format&fit=crop&q=60",
      trendingScore: 65,
    },
    {
      title: "New Space Discovery Announced",
      description: "Astronomers detect potential signs of life on distant exoplanet, marking significant milestone in space exploration.",
      image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&auto=format&fit=crop&q=60",
      trendingScore: 88,
    }
  ];

  // Sort by trending score
  const sortedNews = [...newsItems].sort((a, b) => b.trendingScore - a.trendingScore);
  
  const headlineStory = sortedNews[0];
  const sideStories = sortedNews.slice(1, 5);
  const secondaryStories = sortedNews.slice(5);
  
  const getSize = (score) => {
    if (score >= 85) return 'large';
    if (score >= 75) return 'medium';
    return 'small';
  };

  return (
    <div className="news-container">
      <div className="news-grid">
        <div className="main-story">
          <div className="headline-story">
            <div className="headline-text">
              <h2>{headlineStory.title}</h2>
            </div>
            <img src={headlineStory.image} alt={headlineStory.title} />
            <p className="headline-description">{headlineStory.description}</p>
          </div>
          <div className="secondary-stories">
            {secondaryStories.map((news, index) => (
              <div key={index} className={`news-item ${getSize(news.trendingScore)}`}>
                <img src={news.image} alt={news.title} />
                <div className="news-item-text">
                  <p className="news-description">{news.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="side-stories">
          {sideStories.map((news, index) => (
            <div key={index} className={`news-item ${getSize(news.trendingScore)}`}>
              <img src={news.image} alt={news.title} />
              <div className="news-item-text">
                <p className="news-description">{news.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NewsGrid; 