import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material';
import Axios from '../../src/utils/axiosUrl';
import PropTypes from 'prop-types';
import { useAuth } from '../hooks/useAuth';
import { useContext } from 'react';
import ModalContext from '../components/contexts/ModalContextProvider';

function ModalUpdateUser({ onClose, users, selectedUserId, deleteUrl, restoreUrl }) {
    const { user } = useAuth();
    const ApiToken = user.token;
    const { handleCloseModal } = useContext(ModalContext);

    async function handleDelete() {
        try {
            await Axios.api.delete(`${deleteUrl}`, {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${ApiToken}`,
                },
            });
            handleCloseModal();
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
            handleCloseModal();
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
                        selectedUserId !== null &&
                        users.find((user) => user.user_id === selectedUserId)?.deleted_at === null
                            ? 'supprimer'
                            : 'restaurer'
                    } cet utilisateur ?`}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Annuler</Button>
                {selectedUserId !== null &&
                users.find((user) => user.user_id === selectedUserId)?.deleted_at === null ? (
                    <Button onClick={() => handleDelete()}>Supprimer</Button>
                ) : (
                    <Button onClick={() => handleRestore()}>Restaurer</Button>
                )}
            </DialogActions>
        </>
    );
}

ModalUpdateUser.propTypes = {
    onClose: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
    selectedUserId: PropTypes.number,
    deleteUrl: PropTypes.string.isRequired,
    restoreUrl: PropTypes.string.isRequired,
};
export default ModalUpdateUser;
