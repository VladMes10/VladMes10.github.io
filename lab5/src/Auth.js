import React, { useState } from 'react';
import { auth } from './firebase'; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Акаунт створено!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Ви увійшли!");
      }
    } catch (error) {
      alert("Помилка: " + error.message);
    }
  };

  return (
    <div className="auth-form" style={{maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ccc'}}>
      <h2>{isRegistering ? 'Реєстрація' : 'Вхід'}</h2>
      <form onSubmit={handleAuth} style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Пароль" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">{isRegistering ? 'Зареєструватися' : 'Увійти'}</button>
      </form>
      <button onClick={() => setIsRegistering(!isRegistering)} style={{marginTop: '10px', background: 'none', border: 'none', color: 'blue', cursor: 'pointer'}}>
        {isRegistering ? 'Вже є акаунт? Увійти' : 'Немає акаунту? Реєстрація'}
      </button>
    </div>
  );
}

export default Auth;