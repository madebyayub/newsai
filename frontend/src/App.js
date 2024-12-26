import React from 'react';
import TopBar from './components/TopBar';
import NewsGrid from './components/NewsGrid';
import './styles/globals.css';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <TopBar />
      <NewsGrid />
    </div>
  );
}

export default App;
