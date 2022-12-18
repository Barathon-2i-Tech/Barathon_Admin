import { BasicPage } from '../../components/BasicPage';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import EmailIcon from '@mui/icons-material/Email';

export const MessagingPage = () => {
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
                <BasicPage title="Messaging Page" icon={<EmailIcon />} />
            </Paper>
        </Container>
    );
};
