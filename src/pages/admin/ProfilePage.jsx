import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import Paper from '@mui/material/Paper';
import { BasicPage } from '../../components/BasicPage';

export const ProfilePage = () => {
    return (
        <Paper
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '80vh',
                width: '100%',
            }}
        >
            <BasicPage title="Profile Page" icon={<PermContactCalendarIcon />} />
        </Paper>
    );
};
