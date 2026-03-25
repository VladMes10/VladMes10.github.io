import React, { useState, useEffect } from 'react';
import HackathonCard from './components/HackathonCard';
import { db } from './firebase'; 
import { collection, getDocs } from "firebase/firestore";

function Home({ seconds, appliedIds, onApply }) {
  const [hackathons, setHackathons] = useState([]);
  const [category, setCategory] = useState('Всі');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "competitions"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Функція для перетворення рядка "дд.мм.рррр" у об'єкт дати для порівняння
        const parseDate = (dateStr) => {
          const [day, month, year] = dateStr.split('.').map(Number);
          return new Date(year, month - 1, day);
        };

        // Сортую: спочатку ті каркти змагань, у кого дедлайн ближче
        data.sort((a, b) => parseDate(a.deadline) - parseDate(b.deadline));

        setHackathons(data);
        setLoading(false);
      } catch (error) {
        console.error("Помилка: ", error);
        setLoading(false);
      }
    };
    fetchCompetitions();
  }, []);

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const filteredItems = category === 'Всі' 
    ? hackathons 
    : hackathons.filter(h => h.category === category);

  if (loading) return <div className="container"><h2>Завантаження змагань...</h2></div>;

  return (
    <div className="container">
      <div id="timer-banner" style={{ background: '#1a1a2e', color: '#fff', padding: '20px', textAlign: 'center', borderRadius: '8px', marginTop: '25px', border: '2px solid #e94560' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>До завершення прийому заявок залишилось:</h3>
        <span id="countdown" style={{ color: seconds > 0 ? '#e94560' : '#555', fontWeight: 'bold', fontSize: '2em', fontFamily: 'monospace' }}>
          {seconds > 0 ? formatTime(seconds) : "ЧАС ВИЧЕРПАНО"}
        </span>
      </div>

      <section id="competitions" style={{ marginTop: '40px' }}>
        <h2>Активні змагання</h2>
        
        <div className="filters" style={{ marginBottom: '25px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {['Всі', 'Штучний інтелект', 'Програмування', 'Веб-розробка'].map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} className="btn-create" style={{ background: category === cat ? '#e94560' : '#34495e', padding: '10px 20px' }}>
              {cat}
            </button>
          ))}
        </div>
        
        <div className="grid-container" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '20px',
          alignItems: 'start',
          justifyContent: 'start'
        }}>
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
    </div>
  );
}

export default Home;