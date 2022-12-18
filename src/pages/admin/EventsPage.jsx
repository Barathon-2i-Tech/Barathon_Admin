import { BasicPage } from '../../components/BasicPage';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

export const EventsPage = () => {
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
                <BasicPage title="Event Page" icon={<ConfirmationNumberIcon />} />
            </Paper>
        </Container>
    );
};
