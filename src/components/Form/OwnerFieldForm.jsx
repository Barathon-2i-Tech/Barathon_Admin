import FormField from './FormField';
import PropTypes from 'prop-types';

function OwnerFieldForm({ formik }) {
    return (
        <>
            <FormField
                gridItem={12}
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
