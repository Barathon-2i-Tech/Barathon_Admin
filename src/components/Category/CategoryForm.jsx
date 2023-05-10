import { useFormik } from 'formik';
import { useAuth } from '../../hooks/useAuth';
import PropTypes from 'prop-types';
import { Toaster, toast } from 'react-hot-toast';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InfinityLoader from '../InfinityLoader';
import { Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useState, useEffect } from 'react';
import Axios from '../../utils/axiosUrl';
import CategoryFieldForm from './CategoryFieldForm';

function CategoryForm({
    open,
    onClose,
    validationSchema,
    getCategoryrByIdUrl,
    initialValues,
    updateCategoryUrl,
}) {
    const { user } = useAuth();
    const ApiToken = user.token;
    const [loading, setLoading] = useState(true);

    const formik = useFormik({
        initialValues: {
            ...initialValues,
            sub_category: '',
            label: '',
            icon: '',
        },
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

    async function getCategoryById() {
        try {
            const response = await Axios.api.get(`${getCategoryrByIdUrl}`, {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${ApiToken}`,
                },
            });
            const { sub_category, label, icon } = JSON.parse(response.data.data.category_details);
            formik.setValues({
                ...response.data.data,
                sub_category,
                label,
                icon,
            });
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleModify(values) {
        try {
            const data = JSON.stringify({
                category_details: {
                    sub_category: values.sub_category,
                    label: values.label,
                    icon: values.icon,
                },
            });
            await Axios.api.put(`${updateCategoryUrl}`, data, {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${ApiToken}`,
                },
            });
            successToast();
            onClose();
        } catch (error) {
            errorToast();
            console.log(error);
        }
    }

    useEffect(() => {
        if (open) {
            getCategoryById();
        }
    }, [open]);

    return (
        <>
            <Toaster />
            <Dialog open={open} onClose={onClose} aria-labelledby="alert-dialog-title">
                <DialogTitle id="alert-dialog-title">{'Modification de la catégorie'}</DialogTitle>
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
                                <CategoryFieldForm formik={formik} />
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

CategoryForm.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    validationSchema: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
    getCategoryrByIdUrl: PropTypes.string.isRequired,
    updateCategoryUrl: PropTypes.string.isRequired,
};

export default CategoryForm;
