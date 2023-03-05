import { useEffect, useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import InfinityLoader from '../InfinityLoader';
import Axios from '../../utils/axiosUrl';
import { useAuth } from '../../hooks/useAuth';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListValidationField from './ListValidationField';

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
            setDataFromApi(response.data.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
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
                            <ListValidationField
                                label="Raison sociale"
                                value={selectedOwner.company_name}
                            />
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
