'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
    const router = useRouter();
    const [finishedGames, setFinishedGames] = useState<any[]>([]);
    const [ongoingGames, setOngoingGames] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');

    // Récupérer le pseudo depuis le localStorage
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    // Fonction pour récupérer l'historique des parties terminées
    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/game/history', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setFinishedGames(data.finishedGames);
            } else {
                setError(data.msg || "Erreur lors de la récupération de l'historique.");
            }
        } catch (err) {
            console.error(err);
            setError("Erreur serveur lors de la récupération de l'historique.");
        }
    };

    // Fonction pour récupérer les parties en cours
    const fetchOngoing = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/game/ongoing', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setOngoingGames(data.ongoingGames);
            } else {
                setError(data.msg || 'Erreur lors de la récupération des parties en cours.');
            }
        } catch (err) {
            console.error(err);
            setError('Erreur serveur lors de la récupération des parties en cours.');
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        Promise.all([fetchOngoing(), fetchHistory()]).finally(() => setLoading(false));
    }, [router]);

    // Fonction pour créer une nouvelle partie
    const createGame = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/game/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                // Rediriger vers la page de jeu avec l'UUID de la partie
                router.push(`/game?uuid=${data.game.uuid}`);
            } else {
                setError(data.msg || 'Erreur lors de la création de la partie.');
            }
        } catch (err) {
            console.error(err);
            setError('Erreur serveur lors de la création de la partie.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <p className="text-xl text-gray-700 dark:text-gray-300">Chargement...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* En-tête du Dashboard */}
            <header className="p-4 bg-white dark:bg-gray-800 shadow-md flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    {username && <p className="text-gray-700 dark:text-gray-300">Bonjour, {username} !</p>}
                </div>
                <div className="space-x-2">
                    <button onClick={createGame} className="btn btn-primary">
                        Créer une partie
                    </button>
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('username');
                            router.push('/login');
                        }}
                        className="btn btn-error"
                    >
                        Déconnexion
                    </button>
                </div>
            </header>

            {/* Contenu principal */}
            <main className="p-8">
                {error && <p className="mb-4 text-red-500">{error}</p>}

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Parties en cours</h2>
                    {ongoingGames.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white dark:bg-gray-800">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b">UUID</th>
                                        <th className="py-2 px-4 border-b">Joueurs</th>
                                        <th className="py-2 px-4 border-b">Statut</th>
                                        <th className="py-2 px-4 border-b">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ongoingGames.map((game: any) => (
                                        <tr key={game._id}>
                                            <td className="py-2 px-4 border-b">{game.uuid}</td>
                                            <td className="py-2 px-4 border-b">{game.players.map((p: any) => p.username).join(', ')}</td>
                                            <td className="py-2 px-4 border-b">{game.status}</td>
                                            <td className="py-2 px-4 border-b">
                                                <button onClick={() => router.push(`/game?uuid=${game.uuid}`)} className="btn btn-sm btn-primary">
                                                    Rejoindre
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>Aucune partie en cours.</p>
                    )}
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Historique des parties terminées</h2>
                    {finishedGames.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white dark:bg-gray-800">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b">UUID</th>
                                        <th className="py-2 px-4 border-b">Vainqueur</th>
                                        <th className="py-2 px-4 border-b">Statut</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {finishedGames.map((game: any) => (
                                        <tr key={game._id}>
                                            <td className="py-2 px-4 border-b">{game.uuid}</td>
                                            <td className="py-2 px-4 border-b">{game.winner ? game.winner.username : 'Égalité'}</td>
                                            <td className="py-2 px-4 border-b">{game.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>Aucune partie terminée pour le moment.</p>
                    )}
                </section>
            </main>
        </div>
    );
}
