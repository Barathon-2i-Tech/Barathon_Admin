import { Typography } from '@mui/material';
import PropTypes from 'prop-types';

function HeaderDatagrid({ title }) {
    return (
        <>
            <Typography
                variant="h5"
                sx={{
                    bgcolor: 'grey.200',
                    p: 2,
                    mb: 2,
                    borderRadius: 1,
                    border: '1px solid grey.400',
                }}
            >
                {title}
            </Typography>
        </>
    );
}

HeaderDatagrid.propTypes = {
    title: PropTypes.string.isRequired,
};
export default HeaderDatagrid;
