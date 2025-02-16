import { useState } from 'react';
import { CardBoard } from './components/cardBoard/CardBoard.tsx';
import { GameSettings } from './components/gameSettings/GameSettings.tsx';
import { createBoard } from './utils/createBoard.ts';

function App() {
  const [board, setBoard] = useState(() => createBoard(9, 9, 10));
  const [showSettings, setShowSettings] = useState(false);
  return (
    <>
      <div style={{ position: 'relative' }}>
        <button
          className="settingsBtn"
          style={{
            backgroundColor: '#BDBDBD',
            padding: '2px',
            marginBottom: '2px',
          }}
          onClick={() => setShowSettings(!showSettings)}
        >
          Settings
        </button>
        {showSettings && (
          <GameSettings setBoard={setBoard} setShowSettings={setShowSettings} />
        )}
      </div>
      <CardBoard board={board} setBoard={setBoard} />
    </>
  );
}

export default App;
