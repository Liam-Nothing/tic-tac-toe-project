'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
    const router = useRouter();
    const [finishedGames, setFinishedGames] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Récupérer l'historique des parties terminées depuis l'API
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/game/history');
                const data = await response.json();
                if (response.ok) {
                    setFinishedGames(data.finishedGames);
                } else {
                    setError(data.msg || 'Erreur lors de la récupération des parties terminées.');
                }
            } catch (err) {
                console.error(err);
                setError('Erreur serveur lors de la récupération des parties.');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

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
                // Rediriger vers la page de jeu avec l'UUID de la partie (ex: /game?uuid=...)
                router.push(`/game?uuid=${data.game.uuid}`);
            } else {
                setError(data.msg || 'Erreur lors de la création de la partie.');
            }
        } catch (err) {
            console.error(err);
            setError('Erreur serveur lors de la création de la partie.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* En-tête du Dashboard */}
            <header className="p-4 bg-white dark:bg-gray-800 shadow-md flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <div className="space-x-2">
                    <button onClick={createGame} className="btn btn-primary">
                        Créer une partie
                    </button>
                    <Link href="/join" className="btn btn-secondary">
                        Rejoindre une partie
                    </Link>
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
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
                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Historique des parties terminées</h2>
                    {loading ? (
                        <p>Chargement...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : finishedGames.length > 0 ? (
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
                                    {finishedGames.map((game) => (
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
