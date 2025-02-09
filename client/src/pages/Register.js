import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Vérification de champs vides
        if (Object.values(formData).some((field) => !field)) {
            setError('Tous les champs sont requis.');
            return;
        }
        // Appel API d'inscription ici (simulé)
        setUser({ username: formData.username, email: formData.email });
        navigate('/dashboard');
    };

    return (
        <div className="max-w-md mx-auto mt-8">
            <h1 className="text-xl font-bold mb-4">Inscription</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="firstName" className="block mb-1">
                    Prénom
                </label>
                <input type="text" name="firstName" id="firstName" className="w-full border p-2 mb-4" value={formData.firstName} onChange={handleChange} />

                <label htmlFor="lastName" className="block mb-1">
                    Nom
                </label>
                <input type="text" name="lastName" id="lastName" className="w-full border p-2 mb-4" value={formData.lastName} onChange={handleChange} />

                <label htmlFor="username" className="block mb-1">
                    Username
                </label>
                <input type="text" name="username" id="username" className="w-full border p-2 mb-4" value={formData.username} onChange={handleChange} />

                <label htmlFor="email" className="block mb-1">
                    Email
                </label>
                <input type="email" name="email" id="email" className="w-full border p-2 mb-4" value={formData.email} onChange={handleChange} />

                <label htmlFor="password" className="block mb-1">
                    Mot de passe
                </label>
                <input type="password" name="password" id="password" className="w-full border p-2 mb-4" value={formData.password} onChange={handleChange} />

                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    S'inscrire
                </button>
            </form>
        </div>
    );
};

export default Register;
