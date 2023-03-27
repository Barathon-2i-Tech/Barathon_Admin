import { Grid, TextField } from '@mui/material';
import PropTypes from 'prop-types';

function ValidationField({ gridItem, label, value }) {
    return (
        <>
            <Grid item xs={gridItem}>
                <TextField disabled label={label} defaultValue={value} />
            </Grid>
        </>
    );
}

ValidationField.propTypes = {
    gridItem: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
};

export default ValidationField;
