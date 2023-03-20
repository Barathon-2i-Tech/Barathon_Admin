import FormField from '../Form/FormField';
import PropTypes from 'prop-types';

function CommonFormFields({ formik }) {
    return (
        <>
            <FormField
                gridItem={6}
                id="first_name"
                name="first_name"
                label="Prénom"
                value={formik.values.first_name}
                onChange={formik.handleChange}
                error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                helperText={formik.touched.first_name && formik.errors.first_name}
                mb={2}
            />
            <FormField
                gridItem={6}
                id="last_name"
                name="last_name"
                label="Nom"
                value={formik.values.last_name}
                onChange={formik.handleChange}
                error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                helperText={formik.touched.last_name && formik.errors.last_name}
                mb={2}
            />
            <FormField
                gridItem={12}
                id="email"
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                mb={2}
            />
        </>
    );
}

CommonFormFields.propTypes = {
    formik: PropTypes.object.isRequired,
};

export default CommonFormFields;
