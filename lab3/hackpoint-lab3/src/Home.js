import React, { useState } from 'react';
import HackathonCard from './components/HackathonCard';

const hackathonsData = [
  { 
    id: 1, 
    title: "AI Innovation 2026", 
    category: "Штучний інтелект", 
    theme: "Штучний інтелект у медицині.",
    rules: "Команди до 4 осіб, використання відкритих API.",
    deadline: "15.04.2026",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400"
  },
  { 
    id: 2, 
    title: "Algorithm Masters", 
    category: "Програмування", 
    theme: "Оптимізація складних структур даних.",
    rules: "Індивідуальна участь, 5 задач на час.",
    deadline: "01.05.2026",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400"
  },
  { 
    id: 3, 
    title: "Web Masters", 
    category: "Веб-розробка", 
    theme: "Еко-рішення для міської інфраструктури.",
    rules: "Тільки чистий HTML/CSS та JS, оцінка за UI/UX.",
    deadline: "20.05.2026",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400"
  }
];

function Home({ seconds, appliedIds, onApply }) {
  const [category, setCategory] = useState('Всі');

  // Функція форматування часу (залишається тут для відображення)
  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const filteredItems = category === 'Всі' 
    ? hackathonsData 
    : hackathonsData.filter(h => h.category === category);

  return (
    <>
      {/* Таймер у реальному часі (отримує значення з App.js) */}
      <div id="timer-banner" style={{ background: '#1a1a2e', color: '#fff', padding: '20px', textAlign: 'center', borderRadius: '8px', marginTop: '25px', border: '2px solid #e94560' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>До завершення прийому заявок залишилось:</h3>
        <span id="countdown" style={{ color: seconds > 0 ? '#e94560' : '#555', fontWeight: 'bold', fontSize: '2em', fontFamily: 'monospace' }}>
          {seconds > 0 ? formatTime(seconds) : "ЧАС ВИЧЕРПАНО"}
        </span>
      </div>

      {/* Секція активних змагань */}
      <section id="competitions">
        <h2>Активні змагання</h2>
        <div className="filters" style={{ marginBottom: '25px', display: 'flex', gap: '10px' }}>
          {['Всі', 'Штучний інтелект', 'Програмування', 'Веб-розробка'].map(cat => (
            <button 
              key={cat} 
              onClick={() => setCategory(cat)} 
              className="btn-create" 
              style={{ 
                background: category === cat ? '#e94560' : '#34495e', 
                width: 'auto', 
                padding: '10px 20px' 
              }}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="grid-container" style={{ alignItems: 'start' }}>
          {filteredItems.map(item => (
            <HackathonCard 
              key={item.id} 
              {...item} 
              isApplied={appliedIds.includes(item.id)} 
              onToggle={() => onApply(item.id)} 
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;