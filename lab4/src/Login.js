import React, { useState } from 'react';
import { auth, db } from './firebase'; 
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDocs, collection, query, where } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim();
    const cleanUsername = username.trim();

    try {
      if (isRegistering) {
        // 1. ПЕРЕВІРКА В КОЛЕКЦІЇ КОРИСТУВАЧІВ
        const qUsers = query(collection(db, "users"), where("username", "==", cleanUsername));
        const usersSnapshot = await getDocs(qUsers);
        
        // 2. ПЕРЕВІРКА В КОЛЕКЦІЇ РЕЙТИНГУ (щоб не можна було взяти ніки лідерів рейтингу)
        const qRatings = query(collection(db, "ratings"), where("username", "==", cleanUsername));
        const ratingsSnapshot = await getDocs(qRatings);
        
        if (!usersSnapshot.empty || !ratingsSnapshot.empty) {
          alert("Цей нікнейм вже зайнятий! Виберіть інший.");
          return;
        }

        // 3. РЕЄСТРАЦІЯ
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        const user = userCredential.user;

        // 4. ЗАПИС У FIRESTORE
        await setDoc(doc(db, "users", user.uid), {
          username: cleanUsername,
          email: cleanEmail,
          wins: 0,
          points: 0
        });

      } else {
        // ВХІД
        await signInWithEmailAndPassword(auth, cleanEmail, password);
      }
      navigate('/'); 
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert("Ця електронна пошта вже використовується.");
      } else if (error.code === 'auth/invalid-credential') {
        alert("Неправильна пошта або пароль. Перевірте дані та спробуйте ще раз.");
      } else {
        // Якщо сталася якась інша помилка, виводжу загальний текст
        alert("Сталася помилка: " + error.message);
      }
    }
  };

  return (
    <div className="auth-container" style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      padding: '30px', 
      backgroundColor: '#1a1a2e', 
      borderRadius: '10px', 
      color: 'white',
      textAlign: 'center'
    }}>
      
      <h2 style={{ color: 'white', margin: '0 0 10px 0', fontSize: '24px', display: 'block' }}>
        {isRegistering ? 'Реєстрація' : 'Вхід'}
      </h2>

      <div style={{ 
        height: '3px', 
        backgroundColor: '#e94560', 
        width: '60px', 
        margin: '0 auto 25px auto',
        borderRadius: '2px'
      }}></div>

      <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

        <input 
          type="email" 
          placeholder="Електронна пошта" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: '12px', borderRadius: '5px', border: 'none', fontSize: '16px' }}
        />
        <input 
          type="password" 
          placeholder="Пароль" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '12px', borderRadius: '5px', border: 'none', fontSize: '16px' }}
        />
        
        {isRegistering && (
          <input 
            type="text" 
            placeholder="Нікнейм" 
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
            required 
            style={{ padding: '12px', borderRadius: '5px', border: 'none', fontSize: '16px' }}
          />
        )}
        
        <button type="submit" className="btn-primary" style={{ padding: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
          {isRegistering ? 'Зареєструватися' : 'Увійти'}
        </button>
      </form>

      <p 
        onClick={() => {
            setIsRegistering(!isRegistering);
            setUsername(''); 
            setEmail('');    
            setPassword('');
        }} 
        style={{ 
          marginTop: '20px', 
          cursor: 'pointer', 
          color: '#e94560', 
          fontWeight: '500',
          fontSize: '14px'
        }}
      >
        {isRegistering ? 'Вже є акаунт? Увійдіть' : 'Ще не маєте акаунта? Зареєструйтесь'}
      </p>
    </div>
  );
}

export default Login;