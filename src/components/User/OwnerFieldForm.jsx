import FormField from '../Form/FormField';
import PropTypes from 'prop-types';

function OwnerFieldForm({ formik }) {
    return (
        <>
            <FormField
                gridItem={6}
                id="company_name"
                name="company_name"
                label="Raison sociale"
                value={formik.values.company_name ? formik.values.company_name : ''}
                onChange={formik.handleChange}
                error={formik.touched.company_name && Boolean(formik.errors.company_name)}
                helperText={formik.touched.company_name && formik.errors.company_name}
                mb={2}
            />
            <FormField
                gridItem={6}
                id="phone"
                name="phone"
                label="Téléphone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
                mb={2}
            />
        </>
    );
}

OwnerFieldForm.propTypes = {
    formik: PropTypes.object.isRequired,
};

export default OwnerFieldForm;
