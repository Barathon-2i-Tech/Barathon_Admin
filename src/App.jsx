import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/authentification/LoginPage';
import { HomePage } from './pages/home/HomePage';
import { ProfilePage } from './pages/admin/ProfilePage';
import { SettingsPage } from './pages/admin/SettingsPage';
import { ProtectedLayout } from './components/ProtectedLayout';
import { HomeLayout } from './components/HomeLayout';
import './App.css';

export default function App() {
    return (
        <Routes>
            <Route element={<HomeLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
            </Route>

            <Route path="/dashboard" element={<ProtectedLayout />}>
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
            </Route>
        </Routes>
    );
}
