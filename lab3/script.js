document.addEventListener('DOMContentLoaded', () => {
    
    // Цикли та DOM
    // 1. Цикл for для зміни фону карток
    const cards = document.querySelectorAll('.card');
    for (let i = 0; i < cards.length; i++) {
        // Умовна логіка if-else
        if (i % 2 === 0) {
            cards[i].style.backgroundColor = "#f9f9f9";
        } else {
            cards[i].style.backgroundColor = "#ffffff";
        }
    }

    // forEach для генерації рейтингу
    const participants = [
        { name: "vlad_khmara", wins: 5, points: 1250 },
        { name: "it_wizard", wins: 4, points: 1100 },
        { name: "code_master", wins: 3, points: 980 },
        { name: "cyber_expert", wins: 2, points: 800 }
    ];

    const ratingList = document.getElementById('rating-list');
    participants.forEach((user, index) => {
        const row = document.createElement('tr');
        if (user.name === "vlad_khmara") row.classList.add('my-row');
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.name}</td>
            <td>${user.wins}</td>
            <td>${user.points}</td>
        `;
        ratingList.appendChild(row);
    });

    const applyButtons = document.querySelectorAll('.apply-btn');

applyButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        if (this.classList.contains('btn-applied')) return;

        // 1. Змінюю основну кнопку
        this.classList.add('btn-applied');
        this.innerText = "Заявку подано";
        
        // 2. Створюю кнопку скасування поруч
        const cancelBtn = document.createElement('button');
        cancelBtn.innerText = "Скасувати";
        cancelBtn.className = "btn-cancel"; // Клас, який я додав в CSS
        this.parentNode.appendChild(cancelBtn);

        // 3. Додаю в рейтинг
        const newRow = document.createElement('tr');
        newRow.innerHTML = `<td>?</td><td>Ви (новий)</td><td>0</td><td>0</td>`;
        document.getElementById('rating-list').appendChild(newRow);

        // 4. Логіка для кнопки скасування
        cancelBtn.addEventListener('click', () => {
            this.classList.remove('btn-applied');
            this.innerText = "Подати заявку";
            newRow.remove(); // Видаляю рядок з таблиці
            cancelBtn.remove(); // Видаляю саму кнопку скасування
        });
    });
});

    // Ефект наведення на меню
    const navLinks = document.querySelectorAll('#main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => link.classList.add('nav-hover-effect'));
        link.addEventListener('mouseleave', () => link.classList.remove('nav-hover-effect'));
    });

    //Таймер з обробкою завершення ===
    let seconds = 3600 * 5; // 5 годин
    const countdown = document.getElementById('countdown');

    const timerInterval = setInterval(() => {
        if (seconds <= 0) {
            // 1. Зупинка таймеру
            clearInterval(timerInterval); 
            
            // 2. Оновлення тексту
            countdown.innerText = "ЧАС ВИЧЕРПАНО";
            countdown.style.color = "#555";

            // 3. Блокування кнопки подавання заявки
            const allApplyBtns = document.querySelectorAll('.apply-btn');
            allApplyBtns.forEach(btn => {
                btn.disabled = true;
                btn.innerText = "Закрито";
                btn.style.backgroundColor = "#7f8c8d";
                btn.style.cursor = "not-allowed";
            });
            return;
        }

        seconds--;
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        
        countdown.innerText = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }, 1000);
});