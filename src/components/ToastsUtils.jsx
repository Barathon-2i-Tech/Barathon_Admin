import toast from 'react-hot-toast';

export const errorStatusToast = () => {
    toast.error("Le statut n'a pas été modifié.\n Il doit etre different du statut actuel", {
        duration: 8000,
    });
};
