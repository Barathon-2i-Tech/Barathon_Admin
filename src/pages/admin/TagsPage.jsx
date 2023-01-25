import TagIcon from '@mui/icons-material/Tag';
import Paper from '@mui/material/Paper';
import { BasicPage } from '../../components/BasicPage';

export const TagsPage = () => {
    return (
        <Paper
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '80vh',
                width: '100%',
            }}
        >
            <BasicPage title="Tags Page" icon={<TagIcon />} />
        </Paper>
    );
};
