import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material';
import Axios from '../../utils/axiosUrl';
import PropTypes from 'prop-types';
import { useAuth } from '../../hooks/useAuth';

function ModalDeleteRestore({
    onClose,
    establishment,
    selectedEstablishmentId,
    deleteUrl,
    restoreUrl,
}) {
    const { user } = useAuth();
    const ApiToken = user.token;

    async function handleDelete() {
        try {
            await Axios.api.delete(`${deleteUrl}`, {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${ApiToken}`,
                },
            });
            onClose();
        } catch (error) {
            console.log(error);
        }
    }

    async function handleRestore() {
        try {
            await Axios.api.get(`${restoreUrl}`, {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${ApiToken}`,
                },
            });
            onClose();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <DialogTitle id="alert-dialog-title">{'Confirmation'}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {`Êtes-vous sûr de vouloir ${
                        selectedEstablishmentId !== null &&
                        establishment.find(
                            (establishment) =>
                                establishment.establishment_id === selectedEstablishmentId,
                        )?.deleted_at === null
                            ? 'supprimer'
                            : 'restaurer'
                    } cet établissement ?`}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Annuler</Button>
                {selectedEstablishmentId !== null &&
                establishment.find(
                    (establishment) => establishment.establishment_id === selectedEstablishmentId,
                )?.deleted_at === null ? (
                    <Button onClick={() => handleDelete()}>Supprimer</Button>
                ) : (
                    <Button onClick={() => handleRestore()}>Restaurer</Button>
                )}
            </DialogActions>
        </>
    );
}

ModalDeleteRestore.propTypes = {
    onClose: PropTypes.func.isRequired,
    establishment: PropTypes.array.isRequired,
    selectedEstablishmentId: PropTypes.number,
    deleteUrl: PropTypes.string.isRequired,
    restoreUrl: PropTypes.string.isRequired,
};
export default ModalDeleteRestore;
