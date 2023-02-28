import Paper from '@mui/material/Paper';
import Copyright from '../../components/Copyright';
import UserDatagrid from '../../components/UserDatagrid';
import ModalContextProvider from '../../components/contexts/ModalContextProvider';

export const UsersPage = () => {
    return (
        <>
            <ModalContextProvider>
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
            </ModalContextProvider>
        </>
    );
};
