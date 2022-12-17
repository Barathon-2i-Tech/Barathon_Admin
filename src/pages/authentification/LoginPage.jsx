import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import Axios from '../../utils/axiosUrl';
import { ReactComponent as BarathonLogo } from '../../assets/barathon_logo.svg';
import Copyright from '../../components/Copyright';

const loginSchema = yup.object({
    email: yup
        .string('Entrer votre email')
        .email('Entrer un email valide ')
        .required("L'email est requis"),
    password: yup.string('Entrer votre mot de passe').required('Le mot de passe est requis'),
});
export const LoginPage = () => {
    const { login } = useAuth();

    const handleFormSubmit = async (values) => {
        Axios.api
            .post(
                '/login',
                {
                    email: values.email,
                    password: values.password,
                },
                {
                    headers: {
                        accept: 'application/vnd.api+json',
                        'Content-Type': 'application/vnd.api+json',
                    },
                },
            )
            .then((response) => {
                if (response.data.data.user.administrator_id != null) {
                    login(response.data.data);
                } else {
                    BadCredential();
                }
            })
            .catch((e) => {
                console.error(e);
                LoginError();
            });
    };
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: loginSchema,
        onSubmit: handleFormSubmit,
    });

    const BadCredential = () => {
        toast.error("Vous n'êtes pas autorisé à accéder à l'administration ", {
            position: 'top-center',
            style: {
                border: '2px solid #d32f2f',
                padding: '16px',
            },
            duration: 6000,
        });
    };

    const LoginError = () => {
        toast.error("Une Erreur s'est produite, veuillez réessayer plus tard", {
            position: 'top-center',
            style: {
                border: '2px solid #d32f2f',
                padding: '16px',
            },
            duration: 6000,
        });
    };

    return (
        <Container component="main" maxWidth="xs">
            <Toaster />
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <BarathonLogo style={{ maxWidth: '200px' }} />
                <Typography component="h1" variant="h5">
                    Connexion
                </Typography>

                <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        fullWidth
                        type="email"
                        label="Email"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        name="email"
                        //convert to boolean using !! operator
                        error={!!formik.touched.email && !!formik.errors.email}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        type="password"
                        label="Mot de passe"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        name="password"
                        error={!!formik.touched.password && !!formik.errors.password}
                        helperText={formik.touched.password && formik.errors.password}
                        autoComplete="current-password"
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Connexion
                    </Button>
                </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    );
};
