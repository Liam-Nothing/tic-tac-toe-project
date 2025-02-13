import Link from 'next/link';

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-8">Bienvenue sur Tic Tac Toe</h1>
            <div className="space-x-4">
                <Link href="/login" className="btn btn-primary">
                    Connexion
                </Link>
                <Link href="/register" className="btn btn-secondary">
                    Inscription
                </Link>
            </div>
        </div>
    );
}
