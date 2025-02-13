'use client';

import { useState } from 'react';

export default function Game() {
    // Initialisation d'un plateau 3x3 vide
    const [board, setBoard] = useState<string[][]>([
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
    ]);
    const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');

    const handleCellClick = (row: number, col: number) => {
        if (board[row][col]) return; // La case est déjà remplie
        const newBoard = board.map((r, rowIndex) => r.map((cell, colIndex) => (rowIndex === row && colIndex === col ? currentPlayer : cell)));
        setBoard(newBoard);
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Tic Tac Toe</h1>
            <div className="grid grid-cols-3 gap-2">
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <button
                            key={`${rowIndex}-${colIndex}`}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                            className="w-20 h-20 bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-600 flex items-center justify-center text-3xl font-bold transition-colors duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                            {cell}
                        </button>
                    ))
                )}
            </div>
            <p className="mt-4 text-gray-700 dark:text-gray-300">Joueur actuel : {currentPlayer}</p>
        </div>
    );
}
