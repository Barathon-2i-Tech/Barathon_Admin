import Paper from '@mui/material/Paper';
import Copyright from '../../components/Copyright';
import ValidationBanner from '../../components/Dashboard/ValidationBanner';
export const DashboardPage = () => {
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
                <ValidationBanner />
                <Copyright sx={{ pt: 15 }} />
            </Paper>
        </>
    );
};
