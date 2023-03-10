import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import { useFormik } from 'formik';
import Axios from '../../utils/axiosUrl';
import PropTypes from 'prop-types';
import CommonFormFields from './CommonFormFields';
import * as Yup from 'yup';
import AdministratorFieldForm from './AdministratorFieldForm';
import PasswordFieldForm from './PasswordFieldForm';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

function NewAdministratorForm({ open, onClose }) {
    const { user } = useAuth();
    const ApiToken = user.token;

    const admnistratorInitialValues = {
        first_name: '',
        last_name: '',
        password: '',
        password_confirmation: '',
        email: '',
        superAdmin: '',
    };

    const validationSchemaNewAdmin = Yup.object({
        first_name: Yup.string().required('Requis'),
        last_name: Yup.string().required('Requis'),
        email: Yup.string().email('Email invalide').required('Requis'),
        password: Yup.string()
            .required('Requis')
            .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
        password_confirmation: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Les mots de passe doivent correspondre')
            .required('Veuillez confirmer votre mot de passe'),
        superAdmin: Yup.boolean().required('Requis'),
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

    const errorUniqueEmailToast = () => {
        toast.error("L'adresse email saisie n'est pas disponible");
    };

    async function handleSubmit(values) {
        console.log(values);
        try {
            await Axios.api.post('/register/admin', values, {
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

    const formik = useFormik({
        initialValues: admnistratorInitialValues,
        enableReinitialize: true,
        validationSchema: validationSchemaNewAdmin,
        onSubmit: (values) => handleSubmit(values),
    });

    return (
        <div>
            <Toaster />
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Ajouter un administrateur</DialogTitle>
                <DialogContent>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <CommonFormFields formik={formik} />
                            <PasswordFieldForm formik={formik} />
                            <AdministratorFieldForm formik={formik} />
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={formik.handleSubmit}>Valider</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

NewAdministratorForm.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default NewAdministratorForm;
