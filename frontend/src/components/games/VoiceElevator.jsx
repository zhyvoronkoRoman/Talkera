import React, { useState, useEffect, useRef } from 'react';
import './VoiceElevator.css'; // Імпорт стилів

const GameVoiceElevator = () => {
  const [isListening, setIsListening] = useState(false);
  const [ballHeight, setBallHeight] = useState(0); // Висота у відсотках (0-100)
  const [sensitivity, setSensitivity] = useState(1.0); // Коефіцієнт чутливості
  
  const audioContextRef = useRef(null);
  const analyzerRef = useRef(null);
  const animationIdRef = useRef(null);
  const streamRef = useRef(null);

  // Ініціалізація мікрофона
  const startMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      
      source.connect(analyser);
      analyser.fftSize = 256; // Менший розмір для швидшої реакції
      analyser.smoothingTimeConstant = 0.8; // Згладжування ривків
      
      audioContextRef.current = audioCtx;
      analyzerRef.current = analyser;
      setIsListening(true);
      
      visualize();
    } catch (error) {
      console.error('Помилка доступу до мікрофона:', error);
      alert('Будь ласка, надайте доступ до мікрофона для гри.');
    }
  };

  const stopMicrophone = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    cancelAnimationFrame(animationIdRef.current);
    setIsListening(false);
    setBallHeight(0);
  };

  const visualize = () => {
    if (!analyzerRef.current) return;

    const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
    analyzerRef.current.getByteFrequencyData(dataArray);

    // Рахуємо середню гучність
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const average = sum / dataArray.length;

    // Конвертуємо у відсотки (0-100%) з урахуванням чутливості
    // Базовий поріг шуму ~5-10, тому віднімаємо трохи
    let newHeight = (average * sensitivity); 
    
    // Обмежуємо значення від 0 до 100
    if (newHeight > 100) newHeight = 100;
    if (newHeight < 0) newHeight = 0;

    setBallHeight(newHeight);
    
    animationIdRef.current = requestAnimationFrame(visualize);
  };

  // Очищення при виході зі сторінки
  useEffect(() => {
    return () => {
      stopMicrophone();
    };
  }, []);

  // Керування чутливістю
  const adjustSensitivity = (amount) => {
    setSensitivity(prev => {
      const newVal = prev + amount;
      if (newVal < 0.5) return 0.5;
      if (newVal > 10) return 10;
      return parseFloat(newVal.toFixed(1));
    });
  };

  return (
    <div className="elevator-page">
      <div className="elevator-header">
        <h2>Голосовий ліфт</h2>
        <p>Керуйте висотою ліфта гучністю свого голосу</p>
      </div>

      <div className="elevator-container">
        {/* Шахта ліфта */}
        <div className="elevator-shaft">
          {/* Поверхи (розмітка) */}
          <div className="floor-marker" style={{ bottom: '90%' }}><span>Гучно </span></div>
          <div className="floor-marker" style={{ bottom: '50%' }}><span>Середньо </span></div>
          <div className="floor-marker" style={{ bottom: '10%' }}><span>Тихо </span></div>

          {/* Кабіна ліфта (м'ячик) */}
          <div 
            className="elevator-cabin"
            style={{ bottom: `${ballHeight}%` }}
          >
            <div className="cabin-window"></div>
          </div>
          
          {/* Індикатор рівня (заповнення шахти кольором - опціонально) */}
          <div 
            className="shaft-fill" 
            style={{ height: `${ballHeight}%` }}
          ></div>
        </div>
      </div>

      <div className="elevator-controls">
        
        {/* Налаштування чутливості */}
        <div className="sensitivity-control">
          <p className="control-label">Чутливість мікрофона:</p>
          <div className="sensitivity-input-group">
            <button className="control-btn-small" onClick={() => adjustSensitivity(-0.5)}>−</button>
            <span className="sensitivity-value">{sensitivity}x</span>
            <button className="control-btn-small" onClick={() => adjustSensitivity(0.5)}>+</button>
          </div>
        </div>

        {/* Головна кнопка */}
        {!isListening ? (
          <button 
            onClick={startMicrophone}
            className="elevator-btn btn-start"
          >
            Увімкнути мікрофон
          </button>
        ) : (
          <button 
            onClick={stopMicrophone}
            className="elevator-btn btn-stop"
          >
            Зупинити
          </button>
        )}
      </div>
    </div>
  );
};

export default GameVoiceElevator;