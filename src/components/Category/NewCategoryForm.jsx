import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import Axios from '../../utils/axiosUrl';
import CategoryFieldForm from './CategoryFieldForm';

function NewCategoryForm({ open, onClose }) {
    const { user } = useAuth();
    const ApiToken = user.token;

    const categoryInitialValues = {
        sub_category: '',
        label: '',
        icon: '',
    };

    const validationSchemaCategory = Yup.object({
        label: Yup.string().required('Le nom de la catégorie est obligatoire'),
        sub_category: Yup.string().required('Requis'),
        icon: Yup.string(),
    });

    const successToast = () => {
        toast.success('Administrateur créé avec succès', {
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

    async function handleSubmit(values) {
        console.log(values);
        try {
            const data = JSON.stringify({
                category_details: {
                    sub_category: values.sub_category,
                    label: values.label,
                    icon: values.icon,
                },
            });
            await Axios.api.post('/category/create', data, {
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

    const formik = useFormik({
        initialValues: categoryInitialValues,
        enableReinitialize: true,
        validationSchema: validationSchemaCategory,
        onSubmit: (values) => handleSubmit(values),
    });

    return (
        <div>
            <Toaster />
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Ajouter une categorie</DialogTitle>
                <DialogContent>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <CategoryFieldForm formik={formik} />
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} variant="contained" color="error">
                        Annuler
                    </Button>
                    <Button onClick={formik.handleSubmit} variant="contained" color="success">
                        Créer
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

NewCategoryForm.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default NewCategoryForm;
