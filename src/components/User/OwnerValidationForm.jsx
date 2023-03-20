import { useEffect, useState } from 'react';
import Axios from '../../utils/axiosUrl';
import { useAuth } from '../../hooks/useAuth';
import Typography from '@mui/material/Typography';
import ListValidationField from '../Form/ListValidationField';
import { Toaster } from 'react-hot-toast';
import PropTypes from 'prop-types';
import ValidationForm from '../Form/ValidationForm';
import { errorStatusToast, validationToast } from '../ToastsUtils';

function UserInformationFromDatabase({ selectedOwner }) {
    return (
        <>
            <ListValidationField label="Nom" value={selectedOwner.last_name} />
            <ListValidationField label="Prénom" value={selectedOwner.first_name} />
            <ListValidationField label="Siren" value={selectedOwner.siren} />
            {selectedOwner.company_name !== null && (
                <ListValidationField label="Raison sociale" value={selectedOwner.company_name} />
            )}
        </>
    );
}

UserInformationFromDatabase.propTypes = {
    selectedOwner: PropTypes.object,
};

function OwnerValidationForm({ open, selectedOwner, onClose }) {
    const { user } = useAuth();
    const ApiToken = user.token;
    const [loading, setLoading] = useState(true);
    const [sirenData, setSirenData] = useState({});
    const [statusFromApi, setStatusFromApi] = useState({});

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
            setSirenData(response.data.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            getValidationStatus();
            if (error.response) {
                switch (error.response.status) {
                    case 404:
                        setSirenData({
                            siren: 'notfound',
                        });
                        break;
                    case 429:
                        setSirenData({
                            siren: 'tooManyRequests',
                        });
                        break;
                    default:
                        setSirenData({
                            siren: 'error',
                        });
                        break;
                }
            }
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
            validationToast();
            onClose();
        } catch (error) {
            console.log(error);
            errorStatusToast();
            onClose();
        }
    }

    function usualDenomination() {
        const { periodesUniteLegale } = sirenData;
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
                        label="Raison sociale"
                        value={`${denominationUsuelleEtablissement}`}
                    />
                )}
                {denominationUsuelle1UniteLegale && (
                    <ListValidationField
                        label="Raison sociale"
                        value={`${denominationUsuelle1UniteLegale}`}
                    />
                )}
                {denominationUsuelle2UniteLegale && (
                    <ListValidationField
                        label="Raison sociale (2eme ligne)"
                        value={`${denominationUsuelle2UniteLegale}`}
                    />
                )}
                {denominationUsuelle3UniteLegale && (
                    <ListValidationField
                        label="Raison sociale (3eme ligne)"
                        value={`${denominationUsuelle3UniteLegale}`}
                    />
                )}
            </>
        );
    }

    function dataToDisplay() {
        switch (sirenData.siren) {
            case 'notfound':
                return (
                    <Typography variant="overline" color="error">
                        Entreprise non trouvée
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
                        Une erreur est survenue. Merci de réessayer
                    </Typography>
                );
            default:
                if (sirenData.periodesUniteLegale[0].etatAdministratifUniteLegale === 'C') {
                    return (
                        <Typography variant="overline" color="error">
                            Entreprise administrativement fermée <br />
                        </Typography>
                    );
                }

                // personne morale
                if (sirenData.periodesUniteLegale[0].denominationUniteLegale !== null) {
                    return (
                        <>
                            <Typography variant="overline" sx={{ color: 'green' }}>
                                Personne morale trouvée
                            </Typography>
                            <ListValidationField label="Siren" value={`${sirenData.siren}`} />
                            <ListValidationField
                                label="Raison sociale"
                                value={`${sirenData.periodesUniteLegale[0].denominationUniteLegale}`}
                            />
                            {usualDenomination()}
                            <ListValidationField
                                label="Sigle"
                                value={`${sirenData.periodesUniteLegale[0].denominationUniteLegale}`}
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
                        <ListValidationField label="Siren" value={`${sirenData.siren}`} />
                        {usualDenomination()}
                        <ListValidationField
                            label="Nom"
                            value={`${sirenData.periodesUniteLegale[0].nomUniteLegale}`}
                        />
                        <ListValidationField
                            label="Prénom"
                            value={`${sirenData.prenomUsuelUniteLegale}`}
                        />
                    </>
                );
        }
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
            <ValidationForm
                open={open}
                onClose={onClose}
                dataFromDatabase={<UserInformationFromDatabase selectedOwner={selectedOwner} />}
                loading={loading}
                dataToDisplay={dataToDisplay}
                handleSearch={handleSearch}
                onClickReject={() => handleValidate(statusFromApi[1].status_id)}
                onClickPending={() => handleValidate(statusFromApi[2].status_id)}
                onClickValidate={() => handleValidate(statusFromApi[0].status_id)}
                disableButton={
                    sirenData.siren === 'notfound' ||
                    sirenData.siren === 'tooManyRequests' ||
                    sirenData.siren === 'error'
                }
            />
        </>
    );
}
OwnerValidationForm.propTypes = {
    open: PropTypes.bool.isRequired,
    selectedOwner: PropTypes.object,
    onClose: PropTypes.func.isRequired,
};
export default OwnerValidationForm;
