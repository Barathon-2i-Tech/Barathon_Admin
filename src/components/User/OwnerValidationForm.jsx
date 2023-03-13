import { useEffect, useState } from 'react';
import Axios from '../../utils/axiosUrl';
import { useAuth } from '../../hooks/useAuth';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import InfinityLoader from '../InfinityLoader';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListValidationField from '../Form/ListValidationField';
import toast, { Toaster } from 'react-hot-toast';
import PropTypes from 'prop-types';

function OwnerValidationForm({ open, selectedOwner, onClose }) {
    const { user } = useAuth();
    const ApiToken = user.token;
    const [loading, setLoading] = useState(true);
    const [dataFromApi, setDataFromApi] = useState({});
    const [statusFromApi, setStatusFromApi] = useState({});

    const errorToast = () => {
        toast.error("Le statut n'a pas été modifié.\n Il doit etre different du statut actuel", {
            duration: 8000,
        });
    };

    async function getDataFromSirenApi() {
        try {
            const response = await Axios.api.get(`/check-siren/${selectedOwner.siren}`, {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${ApiToken}`,
                },
            });
            getValidationStatus();
            setDataFromApi(response.data.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    async function getValidationStatus() {
        try {
            const response = await Axios.api.get('/owner-status', {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${ApiToken}`,
                },
            });
            setStatusFromApi(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleValidate(validationStatus) {
        try {
            await Axios.api.put(
                `/pro/${selectedOwner.owner_id}/validation/${validationStatus}`,
                null,
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${ApiToken}`,
                    },
                },
            );

            onClose();
        } catch (error) {
            console.log(error);
            errorToast();
            onClose();
        }
    }

    function usualDenomination() {
        const { periodesUniteLegale } = dataFromApi;
        const {
            denominationUsuelle1UniteLegale,
            denominationUsuelleEtablissement,
            denominationUsuelle2UniteLegale,
            denominationUsuelle3UniteLegale,
        } = periodesUniteLegale[0];

        if (!denominationUsuelle1UniteLegale && !denominationUsuelleEtablissement) {
            return null;
        }

        return (
            <>
                {denominationUsuelleEtablissement && (
                    <ListValidationField
                        label="Nom commercial"
                        value={`${denominationUsuelleEtablissement}`}
                    />
                )}
                {denominationUsuelle1UniteLegale && (
                    <ListValidationField
                        label="Nom commercial"
                        value={`${denominationUsuelle1UniteLegale}`}
                    />
                )}
                {denominationUsuelle2UniteLegale && (
                    <ListValidationField
                        label="Nom commercial (2eme ligne)"
                        value={`${denominationUsuelle2UniteLegale}`}
                    />
                )}
                {denominationUsuelle3UniteLegale && (
                    <ListValidationField
                        label="Nom commercial (3eme ligne)"
                        value={`${denominationUsuelle3UniteLegale}`}
                    />
                )}
            </>
        );
    }

    function dataToDisplay() {
        if (dataFromApi.periodesUniteLegale[0].etatAdministratifUniteLegale === 'C') {
            return (
                <Typography variant="overline" color="error">
                    Entreprise administrativement fermée
                </Typography>
            );
        }

        // personne morale
        if (dataFromApi.periodesUniteLegale[0].denominationUniteLegale !== null) {
            return (
                <>
                    <Typography variant="overline" sx={{ color: 'green' }}>
                        Personne morale trouvée
                    </Typography>
                    <ListValidationField label="Siren" value={`${dataFromApi.siren}`} />
                    <ListValidationField
                        label="Raison sociale"
                        value={`${dataFromApi.periodesUniteLegale[0].denominationUniteLegale}`}
                    />
                    {usualDenomination()}
                    <ListValidationField
                        label="Sigle"
                        value={`${dataFromApi.periodesUniteLegale[0].denominationUniteLegale}`}
                    />
                </>
            );
        }
        //personne physique
        return (
            <>
                <Typography variant="overline" sx={{ color: 'green' }}>
                    Personne physique trouvée
                </Typography>
                <ListValidationField label="Siren" value={`${dataFromApi.siren}`} />
                {usualDenomination()}
                <ListValidationField
                    label="Nom"
                    value={`${dataFromApi.periodesUniteLegale[0].nomUniteLegale}`}
                />
                <ListValidationField
                    label="Prénom"
                    value={`${dataFromApi.prenomUsuelUniteLegale}`}
                />
            </>
        );
    }

    const handleSearch = (event) => {
        event.preventDefault();
        const searchUrl = `https://www.societe.com/cgi-bin/search?champs=${selectedOwner.siren}`;
        window.open(searchUrl, '_blank');
    };

    useEffect(() => {
        if (open) {
            getDataFromSirenApi();
        }
    }, [open]);

    return (
        <>
            <Toaster />
            <Dialog open={open} onClose={onClose} aria-labelledby="alert-dialog-title">
                <DialogTitle id="alert-dialog-title">{'Verification de la conformité'}</DialogTitle>
                {loading ? (
                    <DialogContent>
                        <InfinityLoader />
                    </DialogContent>
                ) : (
                    <DialogContent>
                        <List
                            sx={{ width: '100%', maxWidth: 800 }}
                            component="div"
                            aria-labelledby="nested-list-subheader"
                            subheader={
                                <ListSubheader
                                    component="div"
                                    id="nested-list-subheader"
                                    color="primary"
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    Données saisie par l&apos;utilisateur
                                </ListSubheader>
                            }
                        >
                            <ListValidationField label="Nom" value={selectedOwner.last_name} />
                            <ListValidationField label="Prénom" value={selectedOwner.first_name} />
                            <ListValidationField label="Siren" value={selectedOwner.siren} />
                            {selectedOwner.company_name !== null && (
                                <ListValidationField
                                    label="Raison sociale"
                                    value={selectedOwner.company_name}
                                />
                            )}
                        </List>

                        {loading === false && Object.keys(dataFromApi).length !== 0 ? (
                            <div>
                                <List
                                    sx={{
                                        width: '100%',
                                        maxWidth: 800,
                                    }}
                                    component="div"
                                    aria-labelledby="nested-list-subheader"
                                    subheader={
                                        <ListSubheader
                                            component="div"
                                            id="nested-list-subheader"
                                            color="primary"
                                            sx={{ fontWeight: 'bold' }}
                                        >
                                            Données provenant de l&apos;INSEE
                                        </ListSubheader>
                                    }
                                >
                                    {dataToDisplay()}
                                </List>
                            </div>
                        ) : (
                            <Typography variant="overline" color="error">
                                Siren non trouvé
                            </Typography>
                        )}
                        <Button variant="contained" onClick={handleSearch}>
                            Plus d&lsquo;informations sur Societe.com
                        </Button>
                    </DialogContent>
                )}
                <DialogActions>
                    <Button onClick={onClose}>Annuler</Button>

                    <ButtonGroup variant="contained">
                        <Button
                            color="error"
                            disabled={Object.keys(dataFromApi).length === 0}
                            onClick={() => handleValidate(statusFromApi[1].status_id)}
                        >
                            Refusé
                        </Button>
                        <Button
                            color="warning"
                            disabled={Object.keys(dataFromApi).length === 0}
                            onClick={() => handleValidate(statusFromApi[2].status_id)}
                        >
                            En attente
                        </Button>
                        <Button
                            color="success"
                            disabled={Object.keys(dataFromApi).length === 0}
                            onClick={() => handleValidate(statusFromApi[0].status_id)}
                        >
                            Valider
                        </Button>
                    </ButtonGroup>
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
