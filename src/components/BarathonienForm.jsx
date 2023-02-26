import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import PropTypes from 'prop-types';
import Axios from '../utils/axiosUrl';
import { Button, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function BarathonienForm({ userId, open, handleClose }) {
    const { user } = useAuth();
    const ApiToken = user.token;
    const [loading, setLoading] = useState(true);

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
        console.log('modification du barathonien ID n° ' + values.user_id);
        try {
            await Axios.api.post(`/barathonien/update/${userId}`, values, {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${ApiToken}`,
                },
            });
        } catch (error) {
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
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title">
                <DialogTitle id="alert-dialog-title">{"Modification de l'utilisateur"}</DialogTitle>
                {loading ? (
                    <DialogContent>{'chargement en cours'}</DialogContent>
                ) : (
                    <DialogContent>
                        <form onSubmit={formik.handleSubmit}>
                            <TextField
                                fullWidth
                                id="first_name"
                                name="first_name"
                                label="Prénom"
                                value={formik.values.first_name}
                                onChange={formik.handleChange}
                                error={
                                    formik.touched.first_name && Boolean(formik.errors.first_name)
                                }
                                helperText={formik.touched.first_name && formik.errors.first_name}
                            />
                            <TextField
                                fullWidth
                                id="last_name"
                                name="last_name"
                                label="Nom"
                                value={formik.values.last_name}
                                onChange={formik.handleChange}
                                error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                                helperText={formik.touched.last_name && formik.errors.last_name}
                            />
                            <TextField
                                fullWidth
                                id="email"
                                name="email"
                                label="Email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                            <TextField
                                fullWidth
                                id="address"
                                name="address"
                                label="Adresse"
                                value={formik.values.address}
                                onChange={formik.handleChange}
                                error={formik.touched.address && Boolean(formik.errors.address)}
                                helperText={formik.touched.address && formik.errors.address}
                            />
                            <TextField
                                fullWidth
                                id="postal_code"
                                name="postal_code"
                                label="Code postal"
                                value={formik.values.postal_code}
                                onChange={formik.handleChange}
                                error={
                                    formik.touched.postal_code && Boolean(formik.errors.postal_code)
                                }
                                helperText={formik.touched.postal_code && formik.errors.postal_code}
                            />
                            <TextField
                                fullWidth
                                id="city"
                                name="city"
                                label="Ville"
                                value={formik.values.city}
                                onChange={formik.handleChange}
                                error={formik.touched.city && Boolean(formik.errors.city)}
                                helperText={formik.touched.city && formik.errors.city}
                            />
                        </form>
                    </DialogContent>
                )}
                <DialogActions>
                    <Button onClick={handleClose}>Annuler</Button>
                    <Button type="submit" onClick={formik.handleSubmit}>
                        Submit
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
