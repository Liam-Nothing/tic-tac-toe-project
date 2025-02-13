'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Vérification de l'existence du token dans le localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            // Rediriger vers /login si aucun token n'est trouvé
            router.push('/login');
        } else {
            setLoading(false);
        }
    }, [router]);

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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        router.push('/login');
                    }}
                    className="btn btn-error"
                >
                    Déconnexion
                </button>
            </header>

            {/* Contenu principal du Dashboard */}
            <main className="p-8">
                <p className="text-gray-700 dark:text-gray-300">Bienvenue sur votre Dashboard !</p>
                {/* Ajoutez ici d'autres composants, liens pour créer/rejoindre une partie, historique, etc. */}
            </main>
        </div>
    );
}
