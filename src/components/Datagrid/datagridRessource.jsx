import { Box } from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { green, red } from '@mui/material/colors';

export const rowCommonDeletedAt = {
    field: 'deleted_at',
    headerName: 'Actif',
    flex: 0.2,
    headerAlign: 'center',
    align: 'center',
    renderCell: ({ row: { deleted_at } }) => {
        return (
            <Box
                width="100%"
                m="0 auto"
                p="5px"
                display="flex"
                justifyContent="center"
                backgroundColor={deleted_at === null ? green[400] : red[400]}
                borderRadius="5px"
            >
                {deleted_at === null && <HowToRegIcon />}
                {deleted_at !== null && <PersonRemoveIcon />}
            </Box>
        );
    },
};
