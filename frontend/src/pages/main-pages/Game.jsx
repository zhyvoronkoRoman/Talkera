import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Game.css'; // Імпортуємо стилі

const Game = () => {
  const navigate = useNavigate();

  // Функція для навігації, щоб не дублювати код
  const handleGameClick = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <div className="games-page">
      <div className="games-header">
        <h1>Найкращі ігри для розвитку мовлення</h1>
        <p>Оберіть тренажер для покращення плавності мови</p>
      </div>

      <div className="games-grid">
        {/* Картка 1: Метроном */}
        <div 
          onClick={() => handleGameClick('/metronome')} 
          className="game-card"
        >
          <div className="game-card__image-wrapper">
             <img src="/src/assets/games/metronome.png" alt="Метроном" className="game-card__img" />
          </div>
          <div className="game-card__content">
            <h3>Метроном</h3>
            <p className="game-card__desc">Тренування темпу мовлення</p>
          </div>
        </div>

        {/* Картка 2: Лінійна подорож */}
        <div 
          onClick={() => handleGameClick('/line-ball')}
          className="game-card"
        >
          <div className="game-card__image-wrapper">
            <img src="/src/assets/games/vydyh.png" alt="Лінія видиху" className="game-card__img" />
          </div>
          <div className="game-card__content">
            <h3>Лінія видиху</h3>
            <p className="game-card__desc">Вправа на плавність видиху</p>
          </div>
        </div>

        {/* Картка 3: Голосовий ліфт */}
        <div 
          onClick={() => handleGameClick('/volume-ball')}
          className="game-card"
        >
          <div className="game-card__image-wrapper">
             <img src="/src/assets/games/line.png" alt="Голосовий ліфт" className="game-card__img" />
          </div>
          <div className="game-card__content">
            <h3>Голосовий ліфт</h3>
            <p className="game-card__desc">Керування гучністю голосу</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Game;