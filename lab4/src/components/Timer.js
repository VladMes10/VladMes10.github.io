import React, { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(3600 * 5); // 5 годин

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div id="timer-banner" style={{
      background: '#1a1a2e', color: '#fff', padding: '20px',
      textAlign: 'center', borderRadius: '8px', marginTop: '25px',
      border: '2px solid #e94560'
    }}>
      <h3 style={{ margin: '0 0 10px 0' }}>До завершення прийому заявок залишилось:</h3>
      <span style={{ color: '#e94560', fontWeight: 'bold', fontSize: '2em', fontFamily: 'monospace' }}>
        {seconds > 0 ? formatTime(seconds) : "ЧАС ВИЧЕРПАНО"}
      </span>
    </div>
  );
}

export default Timer;