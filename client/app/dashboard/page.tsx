'use client';

import Link from 'next/link';

export default function Dashboard() {
    // Vous pouvez récupérer les infos utilisateur depuis un contexte d'authentification
    const username = 'John Doe'; // Exemple statique

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* En-tête */}
            <header className="p-4 bg-white dark:bg-gray-800 shadow-md flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <div className="space-x-2">
                    <Link href="/game" className="btn btn-primary">
                        Nouvelle Partie
                    </Link>
                    <Link href="/join" className="btn btn-secondary">
                        Rejoindre Partie
                    </Link>
                </div>
            </header>

            {/* Contenu principal */}
            <main className="p-8">
                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Bienvenue, {username}</h2>
                    <p className="text-gray-700 dark:text-gray-300">Choisissez une option ci-dessus pour démarrer une nouvelle partie ou rejoindre une partie existante.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Historique des parties</h2>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                        {/* Ici, vous afficherez dynamiquement l'historique et le tableau des scores */}
                        <p className="text-gray-700 dark:text-gray-300">Aucune partie terminée pour le moment.</p>
                    </div>
                </section>
            </main>
        </div>
    );
}
