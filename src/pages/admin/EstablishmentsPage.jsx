import { BasicPage } from '../../components/BasicPage';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import HomeWorkIcon from '@mui/icons-material/HomeWork';

export const EstablishmentsPage = () => {
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
                <BasicPage title="Establishment Page" icon={<HomeWorkIcon />} />
            </Paper>
        </Container>
    );
};
