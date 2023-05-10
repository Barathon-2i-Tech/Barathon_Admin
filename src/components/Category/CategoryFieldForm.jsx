import PropTypes from 'prop-types';
import FormField from '../Form/FormField';
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';

function CategoryFieldForm({ formik }) {
    return (
        <>
            <FormField
                gridItem={6}
                id="label"
                name="label"
                label="Nom de la catégorie"
                value={formik.values.label}
                onChange={formik.handleChange}
                error={formik.touched.label && Boolean(formik.errors.label)}
                helperText={formik.touched.label && formik.errors.label}
                mb={2}
            />
            <Grid item xs={6}>
                <FormControl required sx={{ width: '100%' }}>
                    <InputLabel id="sub_category">Sous-catégorie</InputLabel>
                    <Select
                        labelId="sub_category"
                        id="sub_category"
                        name="sub_category"
                        value={formik.values.sub_category}
                        label="Sous-catégorie"
                        onChange={formik.handleChange}
                    >
                        <MenuItem value={'All'}>Etablissement et événement</MenuItem>
                        <MenuItem value={'Establishment'}>Etablissement</MenuItem>
                        <MenuItem value={'Event'}>Evénement</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <FormField
                gridItem={12}
                id="icon"
                name="icon"
                label="Icone de la catégorie "
                value={formik.values.icon}
                onChange={formik.handleChange}
                error={formik.touched.icon && Boolean(formik.errors.icon)}
                helperText={formik.touched.icon && formik.errors.icon}
                mb={2}
            />
        </>
    );
}

CategoryFieldForm.propTypes = {
    formik: PropTypes.object.isRequired,
};

export default CategoryFieldForm;
