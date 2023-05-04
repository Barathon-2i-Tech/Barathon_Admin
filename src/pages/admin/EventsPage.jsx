import Paper from '@mui/material/Paper';
import EventDatagrid from '../../components/Event/EventDatagrid';
import Copyright from '../../components/Copyright';

export const EventsPage = () => {
    return (
        <Paper
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                padding: '1rem',
            }}
        >
            <EventDatagrid />
            <Copyright sx={{ pt: 15 }} />
        </Paper>
    );
};
