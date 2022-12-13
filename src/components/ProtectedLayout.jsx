import { Navigate, useOutlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AppBar } from './AppBar';

export const ProtectedLayout = () => {
    const { user } = useAuth();
    const outlet = useOutlet();

    if (!user) {
        return <Navigate to="/" />;
    }

    return (
        <div>
            <AppBar
                pages={[
                    { label: 'Dashboard', path: 'dashboard' },
                    { label: 'Utilisateurs', path: 'utilisateurs' },
                    { label: 'Etablissements', path: 'etablissements' },
                    { label: 'Evenements', path: 'evenements' },
                    { label: 'Tags', path: 'tags' },
                    { label: 'Profile', path: 'profile' },
                ]}
            />
            {outlet}
        </div>
    );
};
