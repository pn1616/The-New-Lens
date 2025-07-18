import React, { useState } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import DashboardPage from './pages/DashboardPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handlePageChange} />;
      case 'upload':
        return <UploadPage onNavigate={handlePageChange} />;
      case 'dashboard':
        return <DashboardPage onNavigate={handlePageChange} />;
      default:
        return <HomePage onNavigate={handlePageChange} />;
    }
  };

  return (
    <div className="App">
      <Header currentPage={currentPage} onPageChange={handlePageChange} />
      <main>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
