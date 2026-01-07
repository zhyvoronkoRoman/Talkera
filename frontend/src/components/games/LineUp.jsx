import React, { useRef, useState, useEffect } from 'react';
import './LineUp.css';

const GameLinearJourney = () => {
  const canvasRef = useRef(null);
  const [path, setPath] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Початкова швидкість (умовні одиниці)
  const [speed, setSpeed] = useState(20); 
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(null);
  const [animationId, setAnimationId] = useState(null);

  const LINE_COLOR = '#0288d1';
  const BALL_COLOR = '#4caf50';

  // --- Логіка зміни швидкості ---
  const handleSpeedChange = (e) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) val = 1;
    if (val < 1) val = 1;
    if (val > 100) val = 100; // Обмежимо максимум, щоб кулька не телепортувалась
    setSpeed(val);
  };

  const adjustSpeed = (amount) => {
    setSpeed(prev => {
      const newVal = prev + amount;
      if (newVal < 1) return 1;
      if (newVal > 100) return 100;
      return newVal;
    });
  };
  // -----------------------------

  const startDrawing = (e) => {
    if (animationId) cancelAnimationFrame(animationId);
    const { offsetX, offsetY } = e.nativeEvent;
    setIsDrawing(true);
    setPath([{ x: offsetX, y: offsetY }]);
    setProgress(null);
    setIsPaused(false);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    setPath(prevPath => [...prevPath, { x: offsetX, y: offsetY }]);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    setPath([]);
    setProgress(null);
    setIsPaused(false);
    if (animationId) cancelAnimationFrame(animationId);
  };

  const restartJourney = () => {
    if (path.length > 1) {
      setProgress(0);
      setIsPaused(false);
    }
  };

  // Рух кульки
  useEffect(() => {
    if (progress === null || isPaused || path.length < 2) return;

    const moveBall = () => {
      setProgress(prevProgress => {
        // Формула: speed * коефіцієнт плавності
        // Чим більше число speed, тим більший крок за один кадр
        let nextProgress = prevProgress + (speed * 0.05);
        
        if (nextProgress >= path.length - 1) {
          return null; 
        }
        return nextProgress;
      });
    };

    const id = requestAnimationFrame(moveBall);
    setAnimationId(id);
    return () => cancelAnimationFrame(id);
  }, [progress, isPaused, speed, path]);

  // Малювання (без змін)
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (path.length > 0) {
      context.beginPath();
      context.moveTo(path[0].x, path[0].y);
      path.forEach(point => context.lineTo(point.x, point.y));
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = LINE_COLOR;
      context.lineWidth = 5;
      context.stroke();
    }

    if (progress !== null && path.length > 1) {
      const index = Math.floor(progress);
      const t = progress - index;

      if (index < path.length - 1) {
        const { x: x1, y: y1 } = path[index];
        const { x: x2, y: y2 } = path[index + 1];
        const x = x1 + (x2 - x1) * t;
        const y = y1 + (y2 - y1) * t;

        context.beginPath();
        context.arc(x, y, 10, 0, 2 * Math.PI);
        context.fillStyle = BALL_COLOR;
        context.fill();
        
        context.beginPath();
        context.arc(x - 3, y - 3, 3, 0, 2 * Math.PI);
        context.fillStyle = 'rgba(255,255,255,0.6)';
        context.fill();
      }
    }
  }, [path, progress]);

  return (
    <div className="linear-journey-page">
      <div className="journey-header">
        <h2>Лінія видиху</h2>
        <p>Намалюйте маршрут і ведіть голос разом з кулькою</p>
      </div>

      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="journey-canvas"
        />
        {path.length === 0 && (
          <div className="canvas-placeholder">
            <span>🖌️ Натисніть і малюйте лінію тут</span>
          </div>
        )}
      </div>

      {/* Панель керування */}
      <div className="journey-controls">
        
        {/* Контроль швидкості (Input замість Slider) */}
        <div className="speed-control-group">
          <button className="speed-btn-adjust" onClick={() => adjustSpeed(-5)}>−</button>
          
          <div className="speed-input-wrapper">
            <input 
              type="number" 
              value={speed} 
              onChange={handleSpeedChange}
              className="speed-input"
            />
            <span className="speed-label">Швидкість</span>
          </div>

          <button className="speed-btn-adjust" onClick={() => adjustSpeed(5)}>+</button>
        </div>

        {/* Кнопки дій */}
        <div className="buttons-group">
          <button 
            onClick={restartJourney} 
            disabled={path.length < 2}
            className="journey-btn btn-primary"
          >
            Запустити
          </button>

          <button
            onClick={() => setIsPaused(!isPaused)}
            disabled={progress === null}
            className={`journey-btn ${isPaused ? 'btn-resume' : 'btn-pause'}`}
          >
            {isPaused ? 'Продовжити' : 'Пауза'}
          </button>

          <button 
            onClick={clearCanvas} 
            className="journey-btn btn-danger"
          >
            Очистити
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameLinearJourney;