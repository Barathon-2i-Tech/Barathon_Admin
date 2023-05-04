import Paper from '@mui/material/Paper';
import Copyright from '../../components/Copyright';
import CategoryDatagrid from '../../components/Category/CategoryDatagrid';

export const TagsPage = () => {
    return (
        <Paper
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                padding: '1rem',
            }}
        >
            <CategoryDatagrid />
            <Copyright sx={{ pt: 15 }} />
        </Paper>
    );
};
