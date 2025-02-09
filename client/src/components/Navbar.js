import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, setUser } = useContext(AuthContext);

    const handleLogout = () => setUser(null);

    return (
        <nav className="bg-gray-800 p-4 text-white flex justify-between">
            <div>
                <Link to="/" className="mr-4">
                    Accueil
                </Link>
                {user && (
                    <Link to="/dashboard" className="mr-4">
                        Dashboard
                    </Link>
                )}
                {user && (
                    <Link to="/game" className="mr-4">
                        Partie
                    </Link>
                )}
            </div>
            <div>
                {user ? (
                    <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
                        Déconnexion
                    </button>
                ) : (
                    <>
                        <Link to="/login" className="mr-4">
                            Connexion
                        </Link>
                        <Link to="/register">Inscription</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
