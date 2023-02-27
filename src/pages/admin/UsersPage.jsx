import Paper from '@mui/material/Paper';
import BarathoniensDatagrid from '../../components/BarathoniensDatagrid';
import Copyright from '../../components/Copyright';
import OwnersDatagrid from '../../components/OwnersDatagrid';

export const UsersPage = () => {
    return (
        <>
            <Paper
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    padding: '1rem',
                }}
            >
                <BarathoniensDatagrid />
                <OwnersDatagrid />
                <Copyright sx={{ pt: 15 }} />
            </Paper>
        </>
    );
};
