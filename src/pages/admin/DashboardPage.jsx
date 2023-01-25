import Person from '@mui/icons-material/Person';
import Paper from '@mui/material/Paper';
import { BasicPage } from '../../components/BasicPage';
export const DashboardPage = () => {
    return (
        <Paper
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '80vh',
                width: '100%',
            }}
        >
            <BasicPage title="Dashboard Page" icon={<Person />} />
        </Paper>
    );
};
