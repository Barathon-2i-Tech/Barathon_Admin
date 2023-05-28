import { Typography } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

function ListValidationField({ label, value }) {
    const theme = useTheme();
    return (
        <div>
            <ListItem disablePadding>
                <ListItemText
                    primary={
                        <Typography variant="body1">
                            <span style={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                                {label}:{' '}
                            </span>
                            {value}
                        </Typography>
                    }
                />
            </ListItem>
        </div>
    );
}

ListValidationField.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default ListValidationField;
