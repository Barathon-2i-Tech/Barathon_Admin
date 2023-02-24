import Paper from '@mui/material/Paper';
import BarathonienDatagrid from '../../components/BarathonienDatagrid';

export const UsersPage = () => {
    return (
        <Paper
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '80vh',
                width: '100%',
                padding: '1rem',
            }}
        >
            <BarathonienDatagrid />
        </Paper>
    );
};
