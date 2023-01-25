import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import Paper from '@mui/material/Paper';
import { BasicPage } from '../../components/BasicPage';

export const EventsPage = () => {
    return (
        <Paper
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '80vh',
                width: '100%',
            }}
        >
            <BasicPage title="Event Page" icon={<ConfirmationNumberIcon />} />
        </Paper>
    );
};
