import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';

function ConfirmationDialog({ title, content, onClose, onDelete, onRestore, action }) {
    return (
        <>
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Annuler</Button>
                {action === 'delete' && <Button onClick={onDelete}>Supprimer</Button>}
                {action === 'restore' && <Button onClick={onRestore}>Restaurer</Button>}
            </DialogActions>
        </>
    );
}

ConfirmationDialog.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    onRestore: PropTypes.func,
    action: PropTypes.string.isRequired,
};

export default ConfirmationDialog;
