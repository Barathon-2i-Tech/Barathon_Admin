import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

function ListValidationField({ label, value }) {
    const theme = useTheme();
    return (
        <div>
            <ListItem disablePadding>
                <ListItemIcon>{<ChevronRightIcon />}</ListItemIcon>
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
