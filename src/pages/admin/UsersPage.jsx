//import GroupIcon from '@mui/icons-material/Group';
import Paper from '@mui/material/Paper';
//import { BasicPage } from '../../components/BasicPage';
import BarathonienDatagrid from '../../components/BarathonienDatagrid';

export const UsersPage = () => {
    return (
        <Paper
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '80vh',
                width: '100%',
            }}
        >
            {/*  <BasicPage title="Users Page" icon={<GroupIcon />} /> */}
            <BarathonienDatagrid />
        </Paper>
    );
};
