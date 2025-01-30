import { X } from 'lucide-react';
import { useState } from 'react';
import styles from './gameSettings.module.css';
import { BoardCell } from '../../types';
import { createBoard } from '../../utils.ts';

interface Props {
  setBoard: (board: BoardCell[][]) => void;
  setShowSettings: (isShow: boolean) => void;
}

const GAME_MODES = {
  beginner: { height: 9, width: 9, mines: 10 },
  intermediate: { height: 16, width: 16, mines: 40 },
  expert: { height: 16, width: 30, mines: 99 },
};

export const GameSettings: React.FC<Props> = ({
  setBoard,
  setShowSettings,
}) => {
  const [value, setValue] = useState('beginner');
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [mines, setMines] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const handleNewGameStart = () => {
    if (value === 'custom') {
      setBoard(createBoard(+height, +width, +mines));
    } else {
      const { height, width, mines } =
        GAME_MODES[value as keyof typeof GAME_MODES];
      setBoard(createBoard(height, width, mines));
    }
    setShowSettings(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.popupHeader}>
        Game
        <button
          className={styles.closeButton}
          onClick={() => setShowSettings(false)}
        >
          <X />
        </button>
      </div>
      <div className={styles.controlsHeader}>
        <span>Height</span>
        <span>Width</span>
        <span>Mines</span>
      </div>
      <div className={styles.controlsWrapper}>
        <div className={styles.optionWrapper}>
          <div className={styles.optionName}>
            <input
              id="beginner"
              type="radio"
              value="beginner"
              checked={value === 'beginner'}
              onChange={handleChange}
            />
            <label htmlFor="beginner">Beginner</label>
          </div>
          <div className={styles.numbers}>
            <span>9</span>
            <span>9</span>
            <span>10</span>
          </div>
        </div>

        <div className={styles.optionWrapper}>
          <div className={styles.optionName}>
            <input
              id="intermediate"
              type="radio"
              value="intermediate"
              checked={value === 'intermediate'}
              onChange={handleChange}
            />
            <label htmlFor="intermediate">Intermediate</label>
          </div>
          <div className={styles.numbers}>
            <span>16</span>
            <span>16</span>
            <span>40</span>
          </div>
        </div>

        <div className={styles.optionWrapper}>
          <div className={styles.optionName}>
            <input
              id="expert"
              type="radio"
              value="expert"
              checked={value === 'expert'}
              onChange={handleChange}
            />
            <label htmlFor="expert">Expert</label>
          </div>
          <div className={styles.numbers}>
            <span>16</span>
            <span>30</span>
            <span>99</span>
          </div>
        </div>

        <div className={styles.optionWrapper}>
          <div className={styles.optionName}>
            <input
              id="custom"
              type="radio"
              value="custom"
              checked={value === 'custom'}
              onChange={handleChange}
            />
            <label htmlFor="custom">Custom</label>
          </div>
          <div className={styles.inputs}>
            <input
              type="number"
              min={0}
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
            <input
              type="number"
              min={0}
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
            <input
              type="number"
              min={0}
              value={mines}
              onChange={(e) => setMines(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className={styles.settingsFooter}>
        <button className={styles.newGameBtn} onClick={handleNewGameStart}>
          New game
        </button>
      </div>
    </div>
  );
};
