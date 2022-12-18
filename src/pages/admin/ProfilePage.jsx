import { BasicPage } from '../../components/BasicPage';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';

export const ProfilePage = () => {
    return (
        <Container sx={{ mt: 2, mb: 2 }}>
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '80vh',
                }}
            >
                <BasicPage title="Profile Page" icon={<PermContactCalendarIcon />} />
            </Paper>
        </Container>
    );
};
