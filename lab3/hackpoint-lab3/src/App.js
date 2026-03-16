import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Results from './Results';
import MyProjects from './MyProjects';
import './App.css';

function App() {
  // 1. Глобальний стан для заявок
  const [appliedIds, setAppliedIds] = useState([]);

  // 2. Глобальний стан для таймера (Варіант 18)
  const [seconds, setSeconds] = useState(3600 * 5); // 5 годин

  // Логіка відліку таймера на рівні App, щоб він не зникав при зміні сторінок
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    // Очищення інтервалу при розмонтуванні (захист від витоку пам'яті)
    return () => clearInterval(timerInterval);
  }, []);

  // Функція для подачі/скасування заявки
  const toggleApply = (id) => {
    setAppliedIds(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  return (
    <Router>
      <div className="App">
        <header>
          <div className="container">
            <h1>HackPoint</h1>
            <nav>
              <ul id="main-nav">
                <li><Link to="/">Змагання</Link></li>
                <li><Link to="/my-projects">Мої проєкти</Link></li>
                <li><Link to="/results">Рейтинг</Link></li>
              </ul>
            </nav>
          </div>
        </header>

        <main className="container">
          <Routes>
            {/* Передаю значення seconds та стан заявок у Home */}
            <Route 
              path="/" 
              element={
                <Home 
                  seconds={seconds} 
                  appliedIds={appliedIds} 
                  onApply={toggleApply} 
                />
              } 
            />
            
            <Route path="/my-projects" element={<MyProjects />} />
            
            {/* Передаю кількість заявок у Results для відображення рядка "Ви (новий)" */}
            <Route 
              path="/results" 
              element={<Results appliedCount={appliedIds.length} />} 
            />
          </Routes>
        </main>

        <footer>
          <div className="container">
            <p>Контакти: support@hackpoint.ua | +380 32 123 25 77</p>
            <p>Адреса: м. Львів, вул. С. Бандери, 12</p>
            <p>&copy; HackPoint. Усі права захищені.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;