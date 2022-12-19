import { Box, Button, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import ImageNoFound from '../assets/404.jpg';

export default function NotFoundPage() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
            }}
        >
            <Container maxWidth="md">
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="h1">OUPS</Typography>
                        <Typography variant="h6" mb="20">
                            La page recherch&eacute;e n&apos;existe pas.
                        </Typography>
                        <Button
                            variant="contained"
                            href="/"
                            sx={{
                                marginTop: 2,
                            }}
                        >
                            Retour
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <img src={ImageNoFound} alt="" width={600} height={300} />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
