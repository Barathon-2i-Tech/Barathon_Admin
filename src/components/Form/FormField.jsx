import { Grid, TextField } from '@mui/material';
import PropTypes from 'prop-types';

export default function FormField({
    gridItem,
    id,
    name,
    label,
    value,
    onChange,
    error,
    helperText,
}) {
    return (
        <Grid item xs={gridItem}>
            <TextField
                fullWidth
                id={id}
                name={name}
                label={label}
                value={value}
                onChange={onChange}
                error={error}
                helperText={helperText}
                mb={2}
            />
        </Grid>
    );
}

FormField.propTypes = {
    gridItem: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.bool,
    helperText: PropTypes.string,
};
