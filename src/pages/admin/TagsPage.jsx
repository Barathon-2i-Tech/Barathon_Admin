import { BasicPage } from '../../components/BasicPage';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import TagIcon from '@mui/icons-material/Tag';

export const TagsPage = () => {
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
                <BasicPage title="Tags Page" icon={<TagIcon />} />
            </Paper>
        </Container>
    );
};
