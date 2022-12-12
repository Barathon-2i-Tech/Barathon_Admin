import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import Axios from '../../utils/axiosUrl';

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

export const LoginPage = () => {
    const { login } = useAuth();

    // from the example
    /* const handleSubmit = (event) => {
        //event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({ data });
        login({
            email: data.get('email'),
            password: data.get('password'),
        });
    }; */

    const handleFormSubmit = async (values) => {
        console.log(values);
        Axios.api
            .post('/login', {
                
                    email: values.email,
                    password: values.password,
                },
                {
                headers: {
                    'accept': 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                },
            },
            )
            .then((response) => {
                console.log(response);
                if (response.data.data.user.administrator_id != null) {
                    console.log(response.data.data);
                    login(response.data.data);
                } else {
                    alert("Vous n'etes pas autorisé à accéder à l'administration");
                }
            })
            .catch((e) => {
                console.error(e);
                alert('Une erreur est survenue. Merci de réessayer');
            });
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Log In
                </Typography>
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
                {/* <Grid container>
            <Grid item>
              <RouterLink to="/register">
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </RouterLink>
            </Grid>
          </Grid> */}
            </Box>
        </Container>
    );
};
