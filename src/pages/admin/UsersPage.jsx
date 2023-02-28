import Paper from '@mui/material/Paper';
import Copyright from '../../components/Copyright';
import UserDatagrid from '../../components/UserDatagrid';

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
                <UserDatagrid />
                <Copyright sx={{ pt: 15 }} />
            </Paper>
        </>
    );
};
