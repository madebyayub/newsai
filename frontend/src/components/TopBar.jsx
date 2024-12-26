import { useState, useEffect } from 'react';
import '../styles/TopBar.css';
import logo from '../assets/logo.png';

const TopBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const topics = ['World', 'Business', 'Tech', 'Science', 'Health', 'Entertainment', 'Sports', 'Politics', 'Climate'];

  return (
    <div className={`topbar ${isScrolled ? 'scrolled' : ''}`}>
      <img src={logo} alt="News.AI Logo" className="logo" />
      <div className="topics">
        {topics.map((topic, index) => (
          <button key={index} className="topic-button">
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopBar; 