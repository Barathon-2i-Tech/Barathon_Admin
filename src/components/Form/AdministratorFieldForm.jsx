import PropTypes from 'prop-types';
import FormSelect from './FormSelect';

function AdministratorFieldForm({ formik }) {
    return (
        <>
            <FormSelect
                gridItem={12}
                labelId="superAdmin"
                id="superAdmin"
                name="superAdmin"
                label="Super administrateur"
                value={formik.values.superAdmin}
                onChange={formik.handleChange}
                error={formik.touched.superAdmin && Boolean(formik.errors.superAdmin)}
            />
        </>
    );
}
AdministratorFieldForm.propTypes = {
    formik: PropTypes.object.isRequired,
};
export default AdministratorFieldForm;
