import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.password) {
            setError('Tous les champs sont requis.');
            return;
        }
        // Appel API de connexion ici (simulé)
        setUser({ username: formData.username });
        navigate('/dashboard');
    };

    return (
        <div className="max-w-md mx-auto mt-8">
            <h1 className="text-xl font-bold mb-4">Connexion</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="username" className="block mb-1">
                    Username
                </label>
                <input type="text" name="username" id="username" className="w-full border p-2 mb-4" value={formData.username} onChange={handleChange} />
                <label htmlFor="password" className="block mb-1">
                    Mot de passe
                </label>
                <input type="password" name="password" id="password" className="w-full border p-2 mb-4" value={formData.password} onChange={handleChange} />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Se connecter
                </button>
            </form>
        </div>
    );
};

export default Login;
