import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import PropTypes from 'prop-types';
import Axios from '../../utils/axiosUrl';
import { Button } from '@mui/material';
import { useFormik } from 'formik';
import Grid from '@mui/material/Grid';
import toast, { Toaster } from 'react-hot-toast';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InfinityLoader from '../InfinityLoader';
import BarathonienFieldForm from './BarathonienFieldForm';
import OwnerFieldForm from './OwnerFieldForm';
import CommonFormFields from './CommonFormFields';
import AdministratorFieldForm from './AdministratorFieldForm';

function ModifyUserForm({
    open,
    onClose,
    validationSchema,
    updateUserUrl,
    getUserByIdUrl,
    initialValues,
}) {
    const { user } = useAuth();
    const ApiToken = user.token;
    const [loading, setLoading] = useState(true);

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
            await Axios.api.put(`${updateUserUrl}`, values, {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${ApiToken}`,
                },
            });
            successToast();
            onClose();
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

    function formToDisplay() {
        if (formik.values.barathonien_id) {
            return <BarathonienFieldForm formik={formik} />;
        }

        if (formik.values.owner_id) {
            return <OwnerFieldForm formik={formik} />;
        }

        if (formik.values.administrator_id) {
            return <AdministratorFieldForm formik={formik} />;
        }
    }

    return (
        <>
            <Toaster />
            <Dialog open={open} onClose={onClose} aria-labelledby="alert-dialog-title">
                <DialogTitle id="alert-dialog-title">{"Modification de l'utilisateur"}</DialogTitle>
                {loading ? (
                    <DialogContent
                        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                        <InfinityLoader />
                    </DialogContent>
                ) : (
                    <DialogContent>
                        <form onSubmit={formik.handleSubmit}>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <CommonFormFields formik={formik} />
                                {formToDisplay()}
                            </Grid>
                        </form>
                    </DialogContent>
                )}
                <DialogActions>
                    <Button onClick={onClose} variant="contained" color="error">
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
    onClose: PropTypes.func,
    validationSchema: PropTypes.object.isRequired,
    getUserByIdUrl: PropTypes.string.isRequired,
    updateUserUrl: PropTypes.string.isRequired,
    initialValues: PropTypes.object.isRequired,
};

export default ModifyUserForm;
