import FormField from './FormField';
import PropTypes from 'prop-types';

function PasswordFieldForm({ formik }) {
    return (
        <>
            <FormField
                gridItem={6}
                id="password"
                type="password"
                name="password"
                label="Mot de passe"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                mb={2}
            />
            <FormField
                gridItem={6}
                id="password_confirmation"
                type="password"
                name="password_confirmation"
                label="Confirmer le mot de passe"
                value={formik.values.password_confirmation}
                onChange={formik.handleChange}
                error={
                    formik.touched.password_confirmation &&
                    Boolean(formik.errors.password_confirmation)
                }
                helperText={
                    formik.touched.password_confirmation && formik.errors.password_confirmation
                }
                mb={2}
            />
        </>
    );
}

PasswordFieldForm.propTypes = {
    formik: PropTypes.object.isRequired,
};

export default PasswordFieldForm;
