import { createContext, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from './useLocalStorage';
import Axios from '../utils/axiosUrl';

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage('user', null);
    const navigate = useNavigate();

    const login = async (data) => {
        setUser(data);
        navigate('/admin/dashboard', { replace: true });
    };

    const logout = () => {
        const token = user.token;
        Axios.api
            .post(
                '/logout',
                {},
                {
                    headers: {
                        accept: 'application/vnd.api+json',
                        'Content-Type': 'application/vnd.api+json',
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
            .then(() => {
                setUser(null);
                navigate('/', { replace: true });
            })
            .catch((error) => {
                console.error(error);
                alert('Une erreur est survenue a la deconnexion. Merci de réessayer');
            });
    };

    const value = useMemo(
        () => ({
            user,
            login,
            logout,
        }),
        [user],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
