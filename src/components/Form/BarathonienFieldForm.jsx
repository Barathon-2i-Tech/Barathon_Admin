import FormField from './FormField';
import PropTypes from 'prop-types';

function BarathonienFieldForm({ formik }) {
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
            <FormField
                gridItem={12}
                id="address"
                name="address"
                label="Adresse"
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
                mb={2}
            />
            <FormField
                gridItem={6}
                id="postal_code"
                name="postal_code"
                label="Code postal"
                value={formik.values.postal_code}
                onChange={formik.handleChange}
                error={formik.touched.postal_code && Boolean(formik.errors.postal_code)}
                helperText={formik.touched.postal_code && formik.errors.postal_code}
                mb={2}
            />
            <FormField
                gridItem={6}
                id="city"
                name="city"
                label="Ville"
                value={formik.values.city}
                onChange={formik.handleChange}
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={formik.touched.city && formik.errors.city}
                mb={2}
            />
        </>
    );
}

BarathonienFieldForm.propTypes = {
    formik: PropTypes.object.isRequired,
};
export default BarathonienFieldForm;
