import { BasicPage } from '../../components/BasicPage';
import Person from '@mui/icons-material/Person';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
export const DashboardPage = () => {

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
                <BasicPage title="Dashboard Page" icon={<Person />} />
            </Paper>
        </Container>
    );
};
