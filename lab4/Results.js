import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase'; 
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";

function Results({ appliedCount }) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserNickname, setCurrentUserNickname] = useState("Ви (новий)");

  useEffect(() => {
    const fetchRatingsAndUser = async () => {
      try {
        // 1. Завантаження загального рейтингу з колекції 'ratings'
        const q = query(collection(db, "ratings"), orderBy("place", "asc"));
        const querySnapshot = await getDocs(q);
        const ratingsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setParticipants(ratingsData);

        // 2. Завантаження нікнейму поточного користувача з колекції 'users'
        if (auth.currentUser) {
          const userDocRef = doc(db, "users", auth.currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setCurrentUserNickname(userDocSnap.data().username);
          }
        }

        setLoading(false);
      } catch (e) {
        console.error("Помилка завантаження даних:", e);
        setLoading(false);
      }
    };

    fetchRatingsAndUser();
  }, [appliedCount]); // Перезавантажую, якщо кількість заявок змінилась

  if (loading) {
    return (
      <section id="rating">
        <div className="container">
          <h2>Завантаження рейтингу...</h2>
        </div>
      </section>
    );
  }

  return (
    <section id="rating">
      <div className="container">
        <h2>Рейтинг учасників</h2>
        
        <div className="table-wrapper">
          <table className="rating-table">
            <thead>
              <tr>
                <th>Місце</th>
                <th>Учасник</th>
                <th>Перемоги</th>
                <th>Бали</th>
              </tr>
            </thead>
            <tbody>
              {/* Список лідерів з бази */}
              {participants.map((user) => (
                <tr 
                  key={user.id} 
                  className={user.place === 1 ? "my-row" : ""}
                >
                  <td>{user.place}</td>
                  <td>{user.username}</td>
                  <td>{user.wins}</td>
                  <td>{user.points}</td>
                </tr>
              ))}

              {/* Відображення поточного користувача, якщо він подав заявку */}
              {appliedCount > 0 && (
                <tr>
                  <td>?</td>
                  <td>{currentUserNickname}</td> {/* Нікнейм користувача */}
                  <td>0</td>
                  <td>0</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Results;