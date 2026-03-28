import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { auth, db } from './firebase'; // Мій конфіг + db
import { onAuthStateChanged, signOut } from "firebase/auth"; // Функції Firebase
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from "firebase/firestore"; // Firestore функції
import Home from './Home';
import Results from './Results';
import MyProjects from './MyProjects';
import Login from './Login';
import './App.css';

function App() {
  const [user, setUser] = useState(null); // Стан автентифікації
  // 1. Глобальний стан для заявок
  const [appliedIds, setAppliedIds] = useState([]);

  // 2. Глобальний стан для таймера
  const [seconds, setSeconds] = useState(3600 * 5); // 5 годин

  // Логіка відліку таймера на рівні App, щоб він не зникав при зміні сторінок
  useEffect(() => {
    // Відстежую зміни стану входу
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      // Якщо користувач увійшов, підтягую його реєстрації з бази
      if (currentUser) {
        const q = query(collection(db, "registrations"), where("userId", "==", currentUser.uid));
        const snap = await getDocs(q);
        const ids = snap.docs.map(doc => doc.data().competitionId);
        setAppliedIds(ids);
      } else {
        setAppliedIds([]);
      }
    });

    const timerInterval = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    // Очищення інтервалу (захист від витоку пам'яті)
    return () => {
      unsubscribe();
      clearInterval(timerInterval);
    };
  }, []);

  const handleLogout = () => signOut(auth); // Функція виходу

  // Функція для подачі/скасування заявки через Firebase
  const toggleApply = async (hackathonTitle, hackathonId) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    try {
      // Перевіряю, чи є вже така реєстрація в базі
      const q = query(
        collection(db, "registrations"), 
        where("userId", "==", user.uid), 
        where("competitionId", "==", hackathonId)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Якщо реєстрація вже є — видаляю її
        querySnapshot.forEach(async (document) => {
          await deleteDoc(doc(db, "registrations", document.id));
        });
        setAppliedIds(prev => prev.filter(id => id !== hackathonId));
      } else {
        // Якщо немає — додаю новий документ у колекцію registrations
        await addDoc(collection(db, "registrations"), {
          userId: user.uid,
          competitionId: hackathonId,
          competitionTitle: hackathonTitle, // Зберігаю назву для MyProjects.js
          registeredAt: new Date().toISOString()
        });
        setAppliedIds(prev => [...prev, hackathonId]);
      }
    } catch (error) {
      console.error("Помилка реєстрації:", error);
    }
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
                
                {/* Показую "Мої проєкти" тільки якщо user увійшов */}
                {user && <li><Link to="/my-projects">Мої проєкти</Link></li>}
                
                <li><Link to="/results">Рейтинг</Link></li>
                
                {/* Динамічна кнопка: Вхід або Вихід */}
                <li>
                  {user ? (
                    <button onClick={handleLogout} className="btn-logout">Вийти</button>
                  ) : (
                    <Link to="/login" className="btn-auth" style={{ textDecoration: 'none' }}>Увійти</Link>
                  )}
                </li>
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
            
            {/* Маршрут для сторінки входу з перевіркою автентифікації */}
            <Route 
            path="/login" 
            element={user ? <Navigate to="/" /> : <Login />} 
          />

            {/*Додаю захист для Мої проєкти */}
            <Route 
              path="/my-projects" 
              element={user ? <MyProjects /> : <Navigate to="/login" />} 
            />
            
            {/* Передача кількості обраних хакатонів через props для відображення користувача в таблиці рейтингу. */}
            <Route 
              path="/results" 
              element={<Results appliedCount={appliedIds.length} />} 
            />
            {/* Обробка неіснуючих сторінок */}
            <Route path="*" element={<Navigate to="/" replace />} />
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