import { useEffect, useState } from 'react';
import socket from '../utils/socket';

const Game = () => {
    const [gameData, setGameData] = useState(null);

    useEffect(() => {
        socket.on('gameUpdate', (data) => {
            setGameData(data);
            console.log('Mise à jour reçue:', data);
        });
        return () => {
            socket.off('gameUpdate');
        };
    }, []);

    return (
        <div>
            <h1>Partie</h1>
            {gameData && <pre>{JSON.stringify(gameData, null, 2)}</pre>}
        </div>
    );
};

export default Game;
