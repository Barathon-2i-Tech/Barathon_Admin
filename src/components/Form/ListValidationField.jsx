import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PropTypes from 'prop-types';

function ListValidationField({ label, value }) {
    return (
        <div>
            <ListItem disablePadding>
                <ListItemIcon>
                    <ChevronRightIcon />
                </ListItemIcon>
                <ListItemText primary={`${label} : ${value}`} />
            </ListItem>
        </div>
    );
}

ListValidationField.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
};

export default ListValidationField;
