import { useEffect, useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InfinityLoader from '../InfinityLoader';
import Axios from '../../utils/axiosUrl';
import { useAuth } from '../../hooks/useAuth';
import PropTypes from 'prop-types';

import ValidationField from './ValidationField';

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
        }
    }

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
                            <div>
                                Données utilisateur :
                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                    <ValidationField
                                        gridItem={6}
                                        label="Nom"
                                        value={selectedOwner.last_name}
                                    />
                                    <ValidationField
                                        gridItem={6}
                                        label="Prenom"
                                        value={selectedOwner.first_name}
                                    />
                                    <ValidationField
                                        gridItem={6}
                                        label="Siren"
                                        value={selectedOwner.siren}
                                    />
                                </Grid>
                            </div>
                            <div>
                                {/* Données provenant de l`&apos;`API SIRENE: */}
                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                    <ValidationField
                                        gridItem={6}
                                        label="Nom unité legale"
                                        value={
                                            dataFromApi.periodesUniteLegale[0]
                                                .denominationUniteLegale
                                        }
                                    />
                                    <ValidationField
                                        gridItem={6}
                                        label="Siren"
                                        value={dataFromApi.siren}
                                    />
                                </Grid>
                            </div>
                        </DialogContentText>
                    </DialogContent>
                )}
                <DialogActions>
                    <Button onClick={onClose}>Annuler</Button>
                    <Button onClick={() => handleValidate()}>Supprimer</Button>
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
