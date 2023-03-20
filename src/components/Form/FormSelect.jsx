import { Grid } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import PropTypes from 'prop-types';
import { useAuth } from '../../hooks/useAuth';

export default function FormSelect({ labelId, gridItem, id, name, label, value, onChange, error }) {
    const { user } = useAuth();

    return (
        <Grid item xs={gridItem}>
            <InputLabel id={id}>{label}</InputLabel>
            <Select
                labelId={labelId}
                id={id}
                name={name}
                value={value}
                label={label}
                onChange={onChange}
                disabled={user.superAdmin === true ? false : true}
                error={error}
            >
                <MenuItem value={true}>Oui</MenuItem>
                <MenuItem value={false}>Non</MenuItem>
            </Select>
        </Grid>
    );
}

FormSelect.propTypes = {
    labelId: PropTypes.string.isRequired,
    gridItem: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.bool,
    helperText: PropTypes.string,
};
