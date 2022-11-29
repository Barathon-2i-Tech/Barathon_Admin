import { Routes, Route } from 'react-router-dom';
import Login from '../src/components/auth/Login';
import './App.css';
import Dashboard from './pages/dashboard/Dashboard';

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </div>
    );
}

export default App;
