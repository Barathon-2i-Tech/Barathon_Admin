import { createContext, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useSessionStorage } from './useSessionStorage';
import Axios from '../utils/axiosUrl';

const AuthContext = createContext();

const LogoutError = () => {
    toast.error("Une Erreur s'est produite, veuillez réessayer plus tard", {
        position: 'top-center',
        style: {
            border: '2px solid #d32f2f',
            padding: '16px',
        },
        duration: 6000,
    });
};

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    <Toaster />;
    const [user, setUser] = useSessionStorage('user', null);
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
                LogoutError();
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
