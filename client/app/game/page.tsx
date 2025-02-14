'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

// Types pour les données du jeu
interface Player {
    _id: string;
    username: string;
}

interface GameDetails {
    uuid: string;
    players: Player[];
    board: string[][]; // 3x3 tableau de chaînes ("", "X", ou "O")
    currentTurn: string; // id du joueur dont c'est le tour (par exemple)
}

export default function Game() {
    const searchParams = useSearchParams();
    const uuid = searchParams.get('uuid');
    const [game, setGame] = useState<GameDetails | null>(null);
    const [error, setError] = useState('');
    // On utilise un état local pour gérer le plateau de jeu (initialisé à partir de l'API)
    const [localBoard, setLocalBoard] = useState<string[][]>([
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
    ]);
    // Pour la démonstration, on utilise un état local pour le joueur dont c'est le tour
    const [currentSymbol, setCurrentSymbol] = useState<'X' | 'O'>('X');
    const [winner, setWinner] = useState<string | null>(null);

    useEffect(() => {
        if (!uuid) {
            setError('UUID manquant.');
            return;
        }
        const fetchGameDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`http://localhost:5000/api/game/details?uuid=${uuid}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                if (res.ok) {
                    setGame(data.game);
                    // On initialise le plateau local avec celui fourni par l'API
                    setLocalBoard(data.game.board);
                    // On initialise le tour à partir du jeu (si défini) sinon par défaut "X"
                    setCurrentSymbol(data.game.currentTurn === 'O' ? 'O' : 'X');
                } else {
                    setError(data.msg || 'Erreur lors de la récupération de la partie.');
                }
            } catch (err) {
                console.error(err);
                setError('Erreur serveur.');
            }
        };

        fetchGameDetails();
    }, [uuid]);

    // Fonction pour vérifier s'il y a un gagnant
    const checkWinner = (board: string[][]): 'X' | 'O' | null => {
        // Vérifier les lignes et colonnes
        for (let i = 0; i < 3; i++) {
            if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
                return board[i][0] as 'X' | 'O';
            }
            if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
                return board[0][i] as 'X' | 'O';
            }
        }
        // Vérifier les diagonales
        if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
            return board[0][0] as 'X' | 'O';
        }
        if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
            return board[0][2] as 'X' | 'O';
        }
        return null;
    };

    const handleCellClick = (rowIndex: number, colIndex: number) => {
        if (winner) return; // La partie est déjà terminée
        // Si la cellule est déjà occupée, ne rien faire
        if (localBoard[rowIndex][colIndex] !== '') return;

        // Mettre à jour le plateau local
        const updatedBoard = localBoard.map((row, rIdx) => row.map((cell, cIdx) => (rIdx === rowIndex && cIdx === colIndex ? currentSymbol : cell)));
        setLocalBoard(updatedBoard);

        // Vérifier s'il y a un gagnant
        const result = checkWinner(updatedBoard);
        if (result) {
            setWinner(result);
            // Ici, vous pourriez appeler l'API pour finaliser la partie, par exemple :
            // finishGame(uuid, result);
        } else {
            // Alterner le symbole pour le tour suivant
            setCurrentSymbol(currentSymbol === 'X' ? 'O' : 'X');
        }
    };

    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
    }

    if (!game) {
        return <div className="min-h-screen flex items-center justify-center text-gray-700">Chargement...</div>;
    }

    // Déterminer l'utilisateur courant et son symbole
    // Pour la démo, supposons que si l'utilisateur connecté est "test1", alors son symbole est "X"
    // Vous pouvez adapter cette logique selon votre système d'authentification
    const mySymbol = game.players[0].username === 'test1' ? 'X' : 'O';

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 flex flex-col items-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Tic Tac Toe</h1>
            <div className="mb-4">
                <p className="text-xl text-gray-700 dark:text-gray-300">
                    Vous (symbol: {mySymbol}) : {game.players[0].username}
                </p>
                {game.players[1] ? (
                    <p className="text-xl text-gray-700 dark:text-gray-300">Adversaire : {game.players[1].username}</p>
                ) : (
                    <p className="text-xl text-gray-700 dark:text-gray-300">En attente d'un adversaire...</p>
                )}
            </div>

            <div className="grid grid-cols-3 gap-2">
                {localBoard.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <button
                            key={`${rowIndex}-${colIndex}`}
                            className="w-20 h-20 bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-600 flex items-center justify-center text-3xl font-bold transition-all duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700"
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                        >
                            {cell}
                        </button>
                    ))
                )}
            </div>

            <p className="mt-4 text-gray-700 dark:text-gray-300">Tour actuel : {currentSymbol}</p>

            {winner && <div className="mt-4 p-4 bg-green-200 text-green-800 rounded">Gagnant : {winner}</div>}
        </div>
    );
}
