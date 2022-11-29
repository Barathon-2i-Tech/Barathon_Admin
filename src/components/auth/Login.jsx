import { Formik } from 'formik';
import * as yup from 'yup';
import { Box, Button, TextField } from '@mui/material';
import { useAxios } from '../../hooks/useAxios';

const initialValues = {
    email: '',
    password: '',
};

const loginSchema = yup.object({
    email: yup
        .string('Entrer votre email')
        .email('Entrer un email valide ')
        .required("L'email est requis"),
    password: yup.string('Entrer votre mot de passe').required('Le mot de passe est requis'),
});

export default function login() {
    const handleFormSubmit = (values) => {
        console.log(values);

        const { response } = useAxios({
            method: 'POST',
            url: '/login',
            headers: {
                accept: 'application/vnd.api+json',
            },
            body: {
                email: values.email,
                password: values.password,
            },
        });
        console.log({ response });
    };

    return (
        <div>
            login
            <Formik
                initialValues={initialValues}
                onSubmit={handleFormSubmit}
                validationSchema={loginSchema}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Box
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(2, minmax(0,1 fr))"
                        >
                            <TextField
                                fullWidth
                                variant="filled"
                                type="email"
                                label="Email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.email}
                                name="email"
                                //convert to boolean using !! operator
                                error={!!touched.email && !!errors.email}
                                helperText={touched.email && errors.email}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                type="password"
                                label="Mot de passe"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.password}
                                name="password"
                                //convert to boolean using !! operator
                                error={!!touched.password && !!errors.password}
                                helperText={touched.password && errors.password}
                            />
                        </Box>
                        <Box display="flex" justifyContent="center" mt="20px">
                            <Button type="submit" variant="contained" color="secondary">
                                Se connecter
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </div>
    );
}
