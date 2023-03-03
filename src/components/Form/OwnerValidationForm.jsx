import { useEffect, useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import InfinityLoader from '../InfinityLoader';
import Axios from '../../utils/axiosUrl';
import { useAuth } from '../../hooks/useAuth';
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListSubheader from '@mui/material/ListSubheader';

function OwnerValidationForm({ open, selectedOwner, onClose }) {
    console.log(selectedOwner);
    const { user } = useAuth();
    const ApiToken = user.token;
    const [loading, setLoading] = useState(true);
    const [dataFromApi, setDataFromApi] = useState({});

    async function getDataFromSirenApi() {
        try {
            const response = await Axios.api.get(`/check-siren/${selectedOwner.siren}`, {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${ApiToken}`,
                },
            });
            console.log(response.data.data);
            setDataFromApi(response.data.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    const handleSearch = (event) => {
        event.preventDefault();
        const searchUrl = `https://www.societe.com/cgi-bin/search?champs=${selectedOwner.siren}`;
        window.open(searchUrl, '_blank');
    };

    function handleValidate() {
        console.log('validate');
    }

    useEffect(() => {
        if (open) {
            getDataFromSirenApi();
        }
    }, [open]);
    return (
        <>
            <Dialog open={open} onClose={onClose} aria-labelledby="alert-dialog-title">
                <DialogTitle id="alert-dialog-title">{'Verification de la conformité'}</DialogTitle>
                {loading ? (
                    <DialogContent>
                        <InfinityLoader />
                    </DialogContent>
                ) : (
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <List
                                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                                component="nav"
                                aria-labelledby="nested-list-subheader"
                                subheader={
                                    <ListSubheader component="div" id="nested-list-subheader">
                                        Données saisie par l&apos;utilisateur
                                    </ListSubheader>
                                }
                            >
                                <ListItem disablePadding>
                                    <ListItemIcon>
                                        <ChevronRightIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={`Nom : ${selectedOwner.last_name}`} />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon>
                                        <ChevronRightIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={`Prénom : ${selectedOwner.first_name}`}
                                    />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon>
                                        <ChevronRightIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={`Siren: : ${selectedOwner.siren}`} />
                                </ListItem>
                            </List>

                            {loading === false && Object.keys(dataFromApi).length === 0 ? (
                                <Typography variant="overline" color="error">
                                    Siren non trouvé
                                </Typography>
                            ) : (
                                <>
                                    <List
                                        sx={{
                                            width: '100%',
                                            maxWidth: 360,
                                            bgcolor: 'background.paper',
                                        }}
                                        component="nav"
                                        aria-labelledby="nested-list-subheader"
                                        subheader={
                                            <ListSubheader
                                                component="div"
                                                id="nested-list-subheader"
                                            >
                                                Données provenant de l&apos;INSEE
                                            </ListSubheader>
                                        }
                                    >
                                        <ListItem disablePadding>
                                            <ListItemIcon>
                                                <ChevronRightIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={`Nom : ${dataFromApi.periodesUniteLegale[0].denominationUniteLegale}`}
                                            />
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemIcon>
                                                <ChevronRightIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={`Siren : ${dataFromApi.siren}`}
                                            />
                                        </ListItem>
                                    </List>
                                </>
                            )}
                            <Divider sx={{ mt: 2 }} />
                            <Button variant="contained" onClick={handleSearch}>
                                Rechercher le siren {selectedOwner.siren} sur Societe.com
                            </Button>
                        </DialogContentText>
                    </DialogContent>
                )}
                <DialogActions>
                    <Button onClick={onClose}>Annuler</Button>
                    <Button
                        disabled={Object.keys(dataFromApi).length === 0}
                        onClick={() => handleValidate()}
                    >
                        Valider
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
OwnerValidationForm.propTypes = {
    open: PropTypes.bool.isRequired,
    selectedOwner: PropTypes.object,
    onClose: PropTypes.func.isRequired,
};
export default OwnerValidationForm;
