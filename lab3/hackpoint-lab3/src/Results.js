import React from 'react';

function Results({ appliedCount }) {
  // Дані для таблиці (Варіант 18)
  const participants = [
    { rank: 1, name: "vlad_khmara", wins: 5, points: 1250 },
    { rank: 2, name: "it_wizard", wins: 4, points: 1100 },
    { rank: 3, name: "code_master", wins: 3, points: 980 },
    { rank: 4, name: "cyber_expert", wins: 2, points: 800 }
  ];

  return (
    <section id="rating">
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
            {/* Рендерю основний список */}
            {participants.map((user, index) => (
              <tr 
                key={index} 
                // клас my-row (підсвічування) буде тільки там, де 1-ше місце
                className={user.rank === 1 ? "my-row" : ""}
              >
                <td>{user.rank}</td>
                <td>{user.name}</td>
                <td>{user.wins}</td>
                <td>{user.points}</td>
              </tr>
            ))}

            {appliedCount > 0 && (
              <tr>
                <td>?</td>
                <td>Ви (новий)</td>
                <td>0</td>
                <td>0</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Results;