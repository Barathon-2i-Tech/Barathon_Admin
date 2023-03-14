import Axios from '../utils/axiosUrl';
import PropTypes from 'prop-types';
import { useAuth } from '../hooks/useAuth';
import ConfirmationDialog from './ConfirmationDialog';

function ModalDeleteRestore({ onClose, title, deleteUrl, restoreUrl, content, action }) {
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
            <ConfirmationDialog
                title={title}
                content={content}
                onClose={onClose}
                action={action}
                onDelete={() => handleDelete()}
                onRestore={() => handleRestore()}
            />
        </>
    );
}

ModalDeleteRestore.propTypes = {
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    deleteUrl: PropTypes.string.isRequired,
    restoreUrl: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
};
export default ModalDeleteRestore;
