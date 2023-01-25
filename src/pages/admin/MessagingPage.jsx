import EmailIcon from '@mui/icons-material/Email';
import Paper from '@mui/material/Paper';
import { BasicPage } from '../../components/BasicPage';

export const MessagingPage = () => {
    return (
        <Paper
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '80vh',
                width: '100%',
            }}
        >
            <BasicPage title="Messaging Page" icon={<EmailIcon />} />
        </Paper>
    );
};
