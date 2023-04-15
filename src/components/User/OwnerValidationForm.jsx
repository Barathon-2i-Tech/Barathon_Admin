import { useEffect, useState } from 'react';
import Axios from '../../utils/axiosUrl';
import { useAuth } from '../../hooks/useAuth';
import Typography from '@mui/material/Typography';
import ListValidationField from '../Form/ListValidationField';
import { Toaster } from 'react-hot-toast';
import PropTypes from 'prop-types';
import ValidationForm from '../Form/ValidationForm';
import { errorStatusToast, errorToast, validationToast } from '../ToastsUtils';

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

    useEffect(() => {
        if (open) {
            getDataFromSirenApi();
            getValidationStatus();
        }
    }, [open]);

    async function getDataFromSirenApi() {
        try {
            const response = await Axios.api.get(`/check-siren/${selectedOwner.siren}`, {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${ApiToken}`,
                },
            });
            setSirenData(response.data.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            setSirenData(handleSirenDataError(error));
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
            if (error.response.status === 409) {
                errorStatusToast();
            } else {
                errorToast();
            }
            onClose();
        }
    }

    const handleSirenDataError = (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 404:
                    return { siren: 'notfound' };
                case 429:
                    return { siren: 'tooManyRequests' };
                default:
                    return { siren: 'error' };
            }
        }
    };

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

    const dataToDisplay = () => {
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
                return sirenData.periodesUniteLegale[0].etatAdministratifUniteLegale === 'C'
                    ? renderClosedCompanyInfo()
                    : renderOpenCompanyInfo();
        }
    };

    const renderClosedCompanyInfo = () => (
        <Typography variant="overline" color="error">
            Entreprise administrativement fermée <br />
        </Typography>
    );

    const renderOpenCompanyInfo = () => {
        if (sirenData.periodesUniteLegale[0].denominationUniteLegale !== null) {
            return renderLegalPersonInfo();
        }
        return renderPhysicalPersonInfo();
    };

    const renderLegalPersonInfo = () => (
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

    const renderPhysicalPersonInfo = () => (
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
            <ListValidationField label="Prénom" value={`${sirenData.prenomUsuelUniteLegale}`} />
        </>
    );

    const handleSearch = (event) => {
        event.preventDefault();
        const searchUrl = `https://www.societe.com/cgi-bin/search?champs=${selectedOwner.siren}`;
        window.open(searchUrl, '_blank');
    };

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
