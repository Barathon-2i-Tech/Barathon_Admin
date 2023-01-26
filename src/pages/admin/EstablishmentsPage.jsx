import HomeWorkIcon from '@mui/icons-material/HomeWork';
import Paper from '@mui/material/Paper';
import { BasicPage } from '../../components/BasicPage';

export const EstablishmentsPage = () => {
    return (
        <Paper
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '80vh',
                width: '100%',
            }}
        >
            <BasicPage title="Establishment Page" icon={<HomeWorkIcon />} />
        </Paper>
    );
};
