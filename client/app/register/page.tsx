'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Vérifier que tous les champs sont remplis
        if (Object.values(formData).some((value) => value.trim() === '')) {
            setError('Tous les champs sont requis.');
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (res.ok) {
                setSuccess(data.msg || 'Inscription réussie. Vérifiez votre email pour activer votre compte.');
                // Rediriger vers la page de connexion après 3 secondes
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } else {
                setError(data.msg || "Erreur lors de l'inscription.");
            }
        } catch (err) {
            console.error(err);
            setError('Erreur serveur.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Inscription</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-500 mb-4">{success}</p>}
                <form onSubmit={handleSubmit}>
                    {/* Prénom */}
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Prénom</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Votre prénom" className="w-full px-3 py-2 border rounded" />
                    </div>

                    {/* Nom */}
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Nom</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Votre nom" className="w-full px-3 py-2 border rounded" />
                    </div>

                    {/* Nom d'utilisateur */}
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Nom d'utilisateur</label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Votre nom d'utilisateur" className="w-full px-3 py-2 border rounded" />
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Votre email" className="w-full px-3 py-2 border rounded" />
                    </div>

                    {/* Mot de passe */}
                    <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Mot de passe</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Votre mot de passe" className="w-full px-3 py-2 border rounded" />
                    </div>

                    {/* Boutons */}
                    <div className="flex items-center justify-between">
                        <button type="submit" className="btn btn-primary">
                            S'inscrire
                        </button>
                        <Link href="/login" className="text-blue-500 hover:text-blue-700 text-sm">
                            Déjà inscrit ?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
