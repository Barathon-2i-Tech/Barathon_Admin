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

function BarathonienForm({ userId, open, handleClose }) {
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

    const validationSchema = Yup.object({
        first_name: Yup.string().required('Requis'),
        last_name: Yup.string().required('Requis'),
        email: Yup.string().email('Email invalide').required('Requis'),
        address: Yup.string().required('Required').min(5, "L'adresse est invalide"),
        postal_code: Yup.string().required('Required').min(5, 'Le code postal est invalide'),
        city: Yup.string().required('Required'),
    });

    const formik = useFormik({
        initialValues: {
            first_name: '',
            last_name: '',
            email: '',
            address: '',
            postal_code: '',
            city: '',
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: (values) => handleModify(values),
    });

    async function handleModify(values) {
        try {
            await Axios.api.post(`/barathonien/update/${userId}`, values, {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${ApiToken}`,
                },
            });
            successToast();
        } catch (error) {
            errorToast();
            console.log(error);
        }
        handleClose();
    }

    async function getBarathonienById(userId) {
        try {
            const response = await Axios.api.get(`/barathonien/${userId}`, {
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
            getBarathonienById(userId);
        }
    }, [open]);

    return (
        <>
            <Toaster />
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title">
                <DialogTitle id="alert-dialog-title">{"Modification de l'utilisateur"}</DialogTitle>
                {loading ? (
                    <DialogContent>{'chargement en cours'}</DialogContent>
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
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        id="address"
                                        name="address"
                                        label="Adresse"
                                        value={formik.values.address}
                                        onChange={formik.handleChange}
                                        error={
                                            formik.touched.address && Boolean(formik.errors.address)
                                        }
                                        helperText={formik.touched.address && formik.errors.address}
                                        mb={2}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        id="postal_code"
                                        name="postal_code"
                                        label="Code postal"
                                        value={formik.values.postal_code}
                                        onChange={formik.handleChange}
                                        error={
                                            formik.touched.postal_code &&
                                            Boolean(formik.errors.postal_code)
                                        }
                                        helperText={
                                            formik.touched.postal_code && formik.errors.postal_code
                                        }
                                        mb={2}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        id="city"
                                        name="city"
                                        label="Ville"
                                        value={formik.values.city}
                                        onChange={formik.handleChange}
                                        error={formik.touched.city && Boolean(formik.errors.city)}
                                        helperText={formik.touched.city && formik.errors.city}
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

BarathonienForm.propTypes = {
    userId: PropTypes.number,
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
};

export default BarathonienForm;
