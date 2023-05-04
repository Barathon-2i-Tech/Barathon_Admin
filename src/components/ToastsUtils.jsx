import toast from 'react-hot-toast';

export const errorStatusToast = () => {
    toast.error("Le statut n'a pas été modifié.\n Il doit etre different du statut actuel", {
        duration: 8000,
        icon: '⚠️',
    });
};

export const errorToast = () => {
    toast.error('Une erreur est survenue.', {
        duration: 8000,
        icon: '❌',
    });
};

export const validationToast = () => {
    toast.success('Statut mis à jour avec succès', {
        position: 'top-center',
        style: {
            padding: '16px',
        },
        icon: '👏',
    });
};
