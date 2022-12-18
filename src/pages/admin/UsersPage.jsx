import { BasicPage } from '../../components/BasicPage';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import GroupIcon from '@mui/icons-material/Group';

export const UsersPage = () => {
    return (
        <Container sx={{ mt: 2, mb: 2 }}>
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '80vh',
                }}
            >
                <BasicPage title="Users Page" icon={<GroupIcon />} />
            </Paper>
        </Container>
    );
};
