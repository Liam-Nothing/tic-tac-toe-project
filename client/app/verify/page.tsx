'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function VerifyPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();
    const [message, setMessage] = useState('Vérification en cours...');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            setError('Token manquant.');
            setMessage('');
            return;
        }

        const verifyEmail = async () => {
            try {
                // Appel vers l'API sur localhost:5000
                const res = await fetch(`http://localhost:5000/api/auth/verify/${token}`);
                const data = await res.json();
                if (res.ok) {
                    setMessage(data.msg || 'Votre compte a été vérifié avec succès.');
                    // Rediriger vers la page de connexion après quelques secondes
                    setTimeout(() => {
                        router.push('/login');
                    }, 3000);
                } else {
                    setError(data.msg || 'Erreur lors de la vérification.');
                    setMessage('');
                }
            } catch (err) {
                console.error(err);
                setError('Erreur serveur.');
                setMessage('');
            }
        };

        verifyEmail();
    }, [token, router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            {message && (
                <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Vérification d'Email</h1>
                    <p className="text-gray-700 dark:text-gray-300">{message}</p>
                    <p className="mt-4 text-sm text-gray-500">Redirection vers la page de connexion...</p>
                </div>
            )}
            {error && (
                <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Erreur de vérification</h1>
                    <p className="text-red-500">{error}</p>
                </div>
            )}
        </div>
    );
}
