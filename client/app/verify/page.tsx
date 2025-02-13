'use client';

export default function Verify() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Vérification d'Email</h1>
                <p className="text-gray-700 dark:text-gray-300">Votre compte a été vérifié avec succès. Vous pouvez maintenant vous connecter.</p>
            </div>
        </div>
    );
}
