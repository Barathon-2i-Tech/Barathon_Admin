import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/authentification/LoginPage';
import { ProfilePage } from './pages/admin/ProfilePage';
import { ProtectedLayout } from './components/ProtectedLayout';
import { HomeLayout } from './components/HomeLayout';
import './App.css';
import { DashboardPage } from './pages/admin/DashboardPage';
import { UsersPage } from './pages/admin/UsersPage';
import { EstablishmentsPage } from './pages/admin/EstablishmentsPage';
import { EventsPage } from './pages/admin/EventsPage';
import { TagsPage } from './pages/admin/TagsPage';
import { MessagingPage } from './pages/admin/MessagingPage';
import NotFoundPage from './components/NotFoundPage';

export default function App() {
    return (
        <Routes>
            <Route element={<HomeLayout />}>
                <Route path="/" element={<LoginPage />} />
            </Route>

            <Route path="/admin" element={<ProtectedLayout />}>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="utilisateurs" element={<UsersPage />} />
                <Route path="etablissements" element={<EstablishmentsPage />} />
                <Route path="evenements" element={<EventsPage />} />
                <Route path="tags" element={<TagsPage />} />
                <Route path="messagerie" element={<MessagingPage />} />
                <Route path="profile" element={<ProfilePage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}
