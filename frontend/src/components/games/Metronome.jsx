import React, { useState, useEffect, useRef } from 'react';
import bounceSound from '../../assets/bounce.mp3'; // Перевір шлях до файлу
import './Metronome.css';

const GameMetronome = () => {
  const audioRef = useRef(null);
  
  // Функція для відтворення звуку
  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.log('Помилка відтворення:', err));
    }
  };

  // Стан для BPM (стандартно 60 ударів на хвилину)
  const [bpm, setBpm] = useState(60);
  const [isPaused, setIsPaused] = useState(true); // Починаємо з паузи, щоб налаштувати
  
  const containerRef = useRef(null);
  const ballRef = useRef(null);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState(1); // 1 = вправо, -1 = вліво

  // Обробка зміни BPM
  const handleBpmChange = (e) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) val = 0;
    // Обмеження, щоб не ввели 9999
    if (val > 240) val = 240; 
    setBpm(val);
  };

  const adjustBpm = (amount) => {
    setBpm(prev => {
      const newVal = prev + amount;
      if (newVal < 10) return 10;
      if (newVal > 240) return 240;
      return newVal;
    });
  };

  useEffect(() => {
    const handle = () => {
      if (isPaused) return;

      const ball = ballRef.current;
      const container = containerRef.current;

      if (!ball || !container) return;

      const containerWidth = container.clientWidth;
      const ballWidth = ball.offsetWidth;
      const travelDistance = containerWidth - ballWidth; // Реальна дистанція, яку проходить м'яч

      // МАТЕМАТИКА:
      // BPM = ударів за хвилину.
      // 1 хвилина = 60 секунд.
      // Час на один прохід (сек) = 60 / BPM.
      // FPS = 60 кадрів на секунду.
      // Швидкість (пікселів за кадр) = (Відстань) / (Час * FPS)
      
      // Спрощена формула: (Distance * BPM) / 3600
      // 3600 береться з 60 (секунд) * 60 (FPS)
      const pixelsPerFrame = (travelDistance * bpm) / 3600;

      let newPosX = position.x + (direction * pixelsPerFrame);

      // Перевірка на зіткнення
      if (newPosX >= travelDistance) {
        newPosX = travelDistance; // Фіксуємо край
        setDirection(-1);
        playSound();
      } else if (newPosX <= 0) {
        newPosX = 0; // Фіксуємо край
        setDirection(1);
        playSound();
      }

      setPosition({ x: newPosX, y: 0 });
    };

    const interval = setInterval(handle, 1000 / 60); // 60 FPS
    return () => clearInterval(interval);
  }, [position, direction, bpm, isPaused]);

  return (
    <div className="metronome-page">
      <audio ref={audioRef} src={bounceSound} preload="auto" />
      
      {/* Заголовок (опціонально) */}
      <div className="metronome-header">
        <h2>Метроном</h2>
        <p>Налаштуйте темп та слідкуйте за ритмом</p>
      </div>

      {/* Панель керування BPM */}
      <div className="bpm-controls">
        <div className="bpm-display">
          <button className="bpm-btn-adjust" onClick={() => adjustBpm(-5)}>−</button>
          
          <div className="bpm-input-wrapper">
            <input 
              type="number" 
              value={bpm} 
              onChange={handleBpmChange}
              className="bpm-input"
            />
            <span className="bpm-label">BPM</span>
          </div>

          <button className="bpm-btn-adjust" onClick={() => adjustBpm(5)}>+</button>
        </div>

        <button
          onClick={() => setIsPaused((prev) => !prev)}
          className={`metronome-main-btn ${isPaused ? 'btn-start' : 'btn-pause'}`}
        >
          {isPaused ? 'Почати' : 'Стоп'}
        </button>
      </div>

      {/* Ігрове поле */}
      <div className="metronome-field" ref={containerRef}>
        <div
          ref={ballRef}
          className="metronome-ball"
          style={{
            transform: `translateX(${position.x}px)`,
            top: '50%',
            marginTop: '-25px'
          }}
        >
          {/* Можна додати візуальний ефект всередині м'яча */}
        </div>
        <div className="metronome-center-line"></div>
      </div>
      
    </div>
  );
};

export default GameMetronome;