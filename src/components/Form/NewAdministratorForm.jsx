import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import CommonFormFields from './CommonFormFields';
import * as Yup from 'yup';

function NewAdministratorForm({ open, onClose }) {
    const admnistratorInitialValues = {
        first_name: '',
        last_name: '',
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
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Les mots de passe doivent correspondre')
            .required('Veuillez confirmer votre mot de passe'),
        superAdmin: Yup.boolean().required('Requis'),
    });

    function handleSubmit(values) {
        console.log(values);
    }

    const formik = useFormik({
        initialValues: admnistratorInitialValues,
        enableReinitialize: true,
        validationSchema: validationSchemaNewAdmin,
        onSubmit: (values) => handleSubmit(values),
    });

    return (
        <div>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Ajouter un administrateur</DialogTitle>
                <DialogContent>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <CommonFormFields formik={formik} />
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={onClose}>Valider</Button>
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
