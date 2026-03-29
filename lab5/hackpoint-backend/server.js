const express = require('express');
const path = require('path');
const cors = require('cors');

// Підключення Firebase Admin SDK
const admin = require("firebase-admin"); 
const serviceAccount = process.env.FIREBASE_CONFIG 
    ? JSON.parse(process.env.FIREBASE_CONFIG) 
    : require("./serviceAccountKey.json");

// Ініціалізація бази даних
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore(); // база даних доступна через змінну db

const app = express();
const PORT = process.env.PORT || 5000;

// Дозволяю крос-доменні запити
app.use(cors());
// Дозволяю серверу приймати дані у форматі JSON
app.use(express.json());

// --- Завдання 1: Хостинг статичних файлів ---
// Усі файли в папці 'public' доступні для всіх
app.use(express.static(path.join(__dirname, 'public')));

// Тестовий маршрут, щоб перевірити, чи працює сервер
app.get('/api/message', (req, res) => {
    res.json({ message: "Сервер HackPoint успішно запущено!" });
});

// --- Завдання 4: Збереження інформації про проєкт (POST) ---
app.post("/api/projects", async (req, res) => {
    try {
        const projectData = req.body; // Отримую JSON від користувача

        // Додаю серверний час створення для надійності
        const dataToSave = {
            ...projectData,
            createdAt: new Date().toISOString()
        };

        // Зберігаю у колекцію "user_projects" через Admin SDK
        const docRef = await db.collection("user_projects").add(dataToSave);

        res.status(201).json({ 
            id: docRef.id, 
            message: "Проєкт успішно збережено через сервер!" 
        });
    } catch (error) {
        console.error("Помилка збереження проєкту:", error);
        res.status(500).json({ error: "Не вдалося зберегти проєкт на сервері" });
    }
});

// Запуск прослуховування запитів
app.listen(PORT, () => {
    console.log(`Сервер працює на http://localhost:${PORT}`);
});

// Маршрут для отримання заявок, відсортованих за датою створення
app.get("/api/applications", async (req, res) => {
    try {
        // Використовую .orderBy для сортування за часом (від новіших до старіших)
        const snapshot = await db.collection("registrations")
            .orderBy("registeredAt", "desc") 
            .get();
        const applications = [];
        
        snapshot.forEach(doc => {
            applications.push({ id: doc.id, ...doc.data() });
        });
        
        res.json(applications);
    } catch (error) {
        console.error("Помилка при отриманні даних:", error);
        res.status(500).json({ error: "Не вдалося отримати заявки" });
    }
});