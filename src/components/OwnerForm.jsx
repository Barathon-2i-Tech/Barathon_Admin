import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import PropTypes from 'prop-types';
import Axios from '../utils/axiosUrl';
import { Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import toast, { Toaster } from 'react-hot-toast';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InfinityLoader from './InfinityLoader';

function OwnerForm({ userId, open, handleClose }) {
    const { user } = useAuth();
    const ApiToken = user.token;
    const [loading, setLoading] = useState(true);

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

    const validationSchema = Yup.object({
        first_name: Yup.string().required('Requis'),
        last_name: Yup.string().required('Requis'),
        email: Yup.string().email('Email invalide').required('Requis'),
        phone: Yup.string().max(13, 'Le numéro saisie est invalide').nullable(),
    });

    const formik = useFormik({
        initialValues: {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: (values) => handleModify(values),
    });

    async function handleModify(values) {
        try {
            await Axios.api.post(`/pro/update/${userId}`, values, {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${ApiToken}`,
                },
            });
            successToast();
            handleClose();
        } catch (error) {
            if (error.response.data.message === 'validation.unique') {
                errorUniqueEmailToast();
            } else {
                errorToast();
                console.log(error);
            }
        }
    }

    async function getOwnerById(userId) {
        try {
            console.log(userId);
            const response = await Axios.api.get(`/pro/${userId}`, {
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
    useEffect(() => {
        if (open) {
            getOwnerById(userId);
        }
    }, [open]);
    return (
        <>
            <Toaster />
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title">
                <DialogTitle id="alert-dialog-title">{"Modification de l'utilisateur"}</DialogTitle>
                {loading ? (
                    <DialogContent>
                        <InfinityLoader />
                    </DialogContent>
                ) : (
                    <DialogContent>
                        <form onSubmit={formik.handleSubmit}>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        id="first_name"
                                        name="first_name"
                                        label="Prénom"
                                        value={formik.values.first_name}
                                        onChange={formik.handleChange}
                                        error={
                                            formik.touched.first_name &&
                                            Boolean(formik.errors.first_name)
                                        }
                                        helperText={
                                            formik.touched.first_name && formik.errors.first_name
                                        }
                                        mb={2}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        id="last_name"
                                        name="last_name"
                                        label="Nom"
                                        value={formik.values.last_name}
                                        onChange={formik.handleChange}
                                        error={
                                            formik.touched.last_name &&
                                            Boolean(formik.errors.last_name)
                                        }
                                        helperText={
                                            formik.touched.last_name && formik.errors.last_name
                                        }
                                        mb={2}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        id="email"
                                        name="email"
                                        label="Email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        error={formik.touched.email && Boolean(formik.errors.email)}
                                        helperText={formik.touched.email && formik.errors.email}
                                        mb={2}
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        id="phone"
                                        name="phone"
                                        label="Téléphone"
                                        value={formik.values.phone}
                                        onChange={formik.handleChange}
                                        error={formik.touched.phone && Boolean(formik.errors.phone)}
                                        helperText={formik.touched.phone && formik.errors.phone}
                                        mb={2}
                                    />
                                </Grid>
                            </Grid>
                        </form>
                    </DialogContent>
                )}
                <DialogActions>
                    <Button onClick={handleClose} variant="contained" color="error">
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

OwnerForm.propTypes = {
    userId: PropTypes.number,
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
};

export default OwnerForm;
