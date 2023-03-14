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

function EstablishmentValidationForm({ open, selectedEstablishment, onClose }) {
    const { user } = useAuth();
    const ApiToken = user.token;
    const [loading, setLoading] = useState(true);
    const [siretData, setSiretData] = useState({});
    const [statusFromApi, setStatusFromApi] = useState({});

    const errorToast = () => {
        toast.error("Le statut n'a pas été modifié.\n Il doit etre different du statut actuel", {
            duration: 8000,
        });
    };

    async function getDataFromSiretApi() {
        try {
            const response = await Axios.api.get(`/check-siret/${selectedEstablishment.siret}`, {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${ApiToken}`,
                },
            });
            getEstablishmentValidationStatus();
            setSiretData(response.data.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            getEstablishmentValidationStatus();
            if (error.response) {
                switch (error.response.status) {
                    case 404:
                        setSiretData({
                            siret: 'notfound',
                        });
                        break;
                    case 429:
                        setSiretData({
                            siret: 'tooManyRequests',
                        });
                        break;
                    default:
                        setSiretData({
                            siret: 'error',
                        });
                        break;
                }
            }

            setLoading(false);
        }
    }

    async function getEstablishmentValidationStatus() {
        try {
            const response = await Axios.api.get('/establishment-status', {
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
                `/establishment/${selectedEstablishment.id}/validation/${validationStatus}`,
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
        const { periodesEtablissement } = siretData;
        const {
            denominationUsuelleEtablissement,
            enseigne1Etablissement,
            enseigne2Etablissement,
            enseigne3Etablissement,
        } = periodesEtablissement[0];

        if (!enseigne1Etablissement && !denominationUsuelleEtablissement) {
            return null;
        }

        return (
            <>
                {denominationUsuelleEtablissement && (
                    <ListValidationField
                        label="Raison sociale"
                        value={`${denominationUsuelleEtablissement}`}
                    />
                )}
                {enseigne1Etablissement && (
                    <ListValidationField
                        label="Raison sociale"
                        value={`${enseigne1Etablissement}`}
                    />
                )}
                {enseigne2Etablissement && (
                    <ListValidationField
                        label="Raison sociale (2eme ligne)"
                        value={`${enseigne2Etablissement}`}
                    />
                )}
                {enseigne3Etablissement && (
                    <ListValidationField
                        label="Raison sociale (3eme ligne)"
                        value={`${enseigne3Etablissement}`}
                    />
                )}
            </>
        );
    }

    function establishmentAddress() {
        const { adresseEtablissement } = siretData;
        return (
            <>
                <ListValidationField
                    label="Adresse"
                    value={`${adresseEtablissement.numeroVoieEtablissement} ${adresseEtablissement.typeVoieEtablissement} ${adresseEtablissement.libelleVoieEtablissement}`}
                />
                <ListValidationField
                    label="Code postal"
                    value={`${adresseEtablissement.codePostalEtablissement}`}
                />
                <ListValidationField
                    label="Ville"
                    value={`${adresseEtablissement.libelleCommuneEtablissement}`}
                />
            </>
        );
    }

    function dataToDisplay() {
        switch (siretData.siret) {
            case 'notfound':
                return (
                    <Typography variant="overline" color="error">
                        Etablissement non trouvé
                    </Typography>
                );
            case 'tooManyRequests':
                return (
                    <Typography variant="overline" color="error">
                        Trop de requêtes. Merci de patienter et de réessayer
                    </Typography>
                );
            case 'error':
                return (
                    <Typography variant="overline" color="error">
                        Une erreur est survenue
                    </Typography>
                );
            default:
                if (
                    siretData.periodesEtablissement[0].etatAdministratifEtablissement === 'F' ||
                    siretData.uniteLegale.etatAdministratifUniteLegale === 'C'
                ) {
                    return (
                        <Typography variant="overline" color="error">
                            Etablissement administrativement fermé
                        </Typography>
                    );
                }

                if (siretData.etablissementSiege === true) {
                    return (
                        <>
                            <ListValidationField label="Siret" value={`${siretData.siret}`} />
                            <ListValidationField
                                label="Raison sociale"
                                value={`${siretData.uniteLegale.denominationUniteLegale}`}
                            />
                            {establishmentAddress()}
                        </>
                    );
                } else {
                    return (
                        <>
                            <ListValidationField label="Siret" value={`${siretData.siret}`} />
                            {usualDenomination()}
                            {establishmentAddress()}
                        </>
                    );
                }
        }
    }

    const handleSearch = (event) => {
        event.preventDefault();
        const searchUrl = `https://www.societe.com/cgi-bin/search?champs=${selectedEstablishment.siret}`;
        window.open(searchUrl, '_blank');
    };

    useEffect(() => {
        if (open) {
            getDataFromSiretApi();
        }
    }, [open]);

    return (
        <>
            <Toaster />
            <Dialog open={open} onClose={onClose} aria-labelledby="alert-dialog-title">
                <DialogTitle id="alert-dialog-title">{'Verification de la conformité'}</DialogTitle>
                {loading ? (
                    <DialogContent
                        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
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
                            <ListValidationField
                                label="Nom commercial"
                                value={selectedEstablishment.trade_name}
                            />
                            <ListValidationField
                                label="Siret"
                                value={selectedEstablishment.siret}
                            />
                            <ListValidationField
                                label="Adresse"
                                value={selectedEstablishment.address}
                            />
                            <ListValidationField
                                label="Code postal"
                                value={selectedEstablishment.postal_code}
                            />
                            <ListValidationField label="Ville" value={selectedEstablishment.city} />
                        </List>

                        {loading === false && (
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
                            onClick={() => handleValidate(statusFromApi[1].status_id)}
                        >
                            Refusé
                        </Button>
                        <Button
                            color="warning"
                            disabled={Object.keys(siretData).length === 0}
                            onClick={() => handleValidate(statusFromApi[2].status_id)}
                        >
                            En attente
                        </Button>
                        <Button
                            color="success"
                            disabled={
                                Object.keys(siretData).length === 0 ||
                                siretData.siret === 'notfound' ||
                                siretData.siret === 'tooManyRequests'
                            }
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

EstablishmentValidationForm.propTypes = {
    open: PropTypes.bool.isRequired,
    selectedEstablishment: PropTypes.object,
    onClose: PropTypes.func.isRequired,
};

export default EstablishmentValidationForm;
