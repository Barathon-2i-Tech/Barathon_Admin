import { useEffect, useState, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import PropTypes from 'prop-types';
import Axios from '../utils/axiosUrl';
import { Button } from '@mui/material';
import { useFormik } from 'formik';
import Grid from '@mui/material/Grid';
import toast, { Toaster } from 'react-hot-toast';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InfinityLoader from './InfinityLoader';
import BarathonienFieldForm from './Form/BarathonienFieldForm';
import { ModalContext } from './contexts/ModalContextProvider';
import OwnerFieldForm from './Form/OwnerFieldForm';

function ModifyUserForm({ open, validationSchema, updateUserUrl, getUserByIdUrl, initialValues }) {
    const { user } = useAuth();
    const ApiToken = user.token;
    const [loading, setLoading] = useState(true);

    const { handleCloseModal } = useContext(ModalContext);

    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema,
        onSubmit: (values) => handleModify(values),
    });

    const successToast = () => {
        toast.success('Mise à jour réussie', {
            position: 'top-center',
            style: {
                padding: '16px',
            },
            icon: '👏',
        });
    };

    const errorToast = () => {
        toast.error('Nous avons rencontré un problème');
    };

    const errorUniqueEmailToast = () => {
        toast.error("L'adresse email saisie n'est pas disponible");
    };

    async function getUserById() {
        try {
            const response = await Axios.api.get(`${getUserByIdUrl}`, {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${ApiToken}`,
                },
            });
            formik.setValues(response.data.data[0]);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }
    async function handleModify(values) {
        try {
            await Axios.api.post(`${updateUserUrl}`, values, {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${ApiToken}`,
                },
            });
            successToast();
            handleCloseModal();
        } catch (error) {
            if (error.response.data.message === 'validation.unique') {
                errorUniqueEmailToast();
            } else {
                errorToast();
                console.log(error);
            }
        }
    }

    useEffect(() => {
        if (open) {
            getUserById();
        }
    }, [open]);

    const content =
        formik.values.barathonien_id !== null ? (
            <BarathonienFieldForm formik={formik} />
        ) : (
            <OwnerFieldForm formik={formik} />
        );

    return (
        <>
            <Toaster />
            <Dialog open={open} onClose={handleCloseModal} aria-labelledby="alert-dialog-title">
                <DialogTitle id="alert-dialog-title">{"Modification de l'utilisateur"}</DialogTitle>
                {loading ? (
                    <DialogContent>
                        <InfinityLoader />
                    </DialogContent>
                ) : (
                    <DialogContent>
                        <form onSubmit={formik.handleSubmit}>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                {content}
                            </Grid>
                        </form>
                    </DialogContent>
                )}
                <DialogActions>
                    <Button onClick={handleCloseModal} variant="contained" color="error">
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        onClick={formik.handleSubmit}
                        variant="contained"
                        color="success"
                    >
                        Modifier
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

ModifyUserForm.propTypes = {
    userId: PropTypes.number,
    open: PropTypes.bool.isRequired,
    validationSchema: PropTypes.object.isRequired,
    getUserByIdUrl: PropTypes.string.isRequired,
    updateUserUrl: PropTypes.string.isRequired,
    initialValues: PropTypes.object.isRequired,
};

export default ModifyUserForm;
