import Paper from '@mui/material/Paper';
import Copyright from '../../components/Copyright';
import EstablishmentDatagrid from '../../components/Establishment/EstablishmentDatagrid';

export const EstablishmentsPage = () => {
    return (
        <Paper
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                padding: '1rem',
            }}
        >
            <EstablishmentDatagrid />
            <Copyright sx={{ pt: 15 }} />
        </Paper>
    );
};
