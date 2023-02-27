import Paper from '@mui/material/Paper';
import BarathoniensDatagrid from '../../components/BarathoniensDatagrid';
import OwnersDatagrid from '../../components/OwnersDatagrid';

export const UsersPage = () => {
    return (
        <>
            <Paper
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    //height: '80vh',
                    width: '100%',
                    padding: '1rem',
                }}
            >
                <BarathoniensDatagrid />
                <OwnersDatagrid />
            </Paper>
        </>
    );
};
