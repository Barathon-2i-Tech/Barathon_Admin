import { useEffect, useState } from 'react';
import Axios from '../../utils/axiosUrl';
import { useAuth } from '../../hooks/useAuth';
import Typography from '@mui/material/Typography';
import ListValidationField from '../Form/ListValidationField';
import ValidationForm from '../Form/ValidationForm';
import { Toaster } from 'react-hot-toast';
import PropTypes from 'prop-types';
import { errorStatusToast, errorToast, validationToast } from '../ToastsUtils';

function EstablishmentInformationFromDatabase({ selectedEstablishment }) {
    return (
        <>
            <ListValidationField label="Siret" value={selectedEstablishment.siret} />
            <ListValidationField label="Nom" value={selectedEstablishment.trade_name} />
            <ListValidationField label="Adresse" value={selectedEstablishment.address} />
            <ListValidationField label="Code postal" value={selectedEstablishment.postal_code} />
            <ListValidationField label="Ville" value={selectedEstablishment.city} />
        </>
    );
}

EstablishmentInformationFromDatabase.propTypes = {
    selectedEstablishment: PropTypes.object,
};

function EstablishmentValidationForm({ open, selectedEstablishment, onClose }) {
    const { user } = useAuth();
    const ApiToken = user.token;
    const [loading, setLoading] = useState(true);
    const [siretData, setSiretData] = useState({});
    const [statusFromApi, setStatusFromApi] = useState({});

    async function validationMail(validationCode) {
        try {
            await Axios.api.get(
                `pro/mail/valide/establishment/${selectedEstablishment.id}/${validationCode}`,
                {
                    headers: {
                        accept: 'application/vnd.api+json',
                        'Content-Type': 'application/vnd.api+json',
                        Authorization: `Bearer ${ApiToken}`,
                    },
                },
            );
        } catch (error) {
            console.log(error);
        }
    }

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

    function usualDenomination() {
        if (siretData.local) {
            const {
                denominationUsuelleEtablissement,
                enseigne1Etablissement,
                enseigne2Etablissement,
                enseigne3Etablissement,
            } = siretData.response;

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
        } else {
            const { denominationUsuelleEtablissement, enseigne1Etablissement } =
                siretData.response.periodesEtablissement[0];

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
                </>
            );
        }
    }

    function establishmentAddress() {
        const numerovoieetablissement = siretData.local
            ? siretData.response.numeroVoieEtablissement
            : siretData.response.adresseEtablissement.numeroVoieEtablissement;
        const indicerepetitionetablissement = siretData.local
            ? siretData.response.indiceRepetitionEtablissement
            : siretData.response.adresseEtablissement.indiceRepetitionEtablissement;
        const typevoieetablissement = siretData.local
            ? siretData.response.typeVoieEtablissement
            : siretData.response.adresseEtablissement.typeVoieEtablissement;
        const libellevoieetablissement = siretData.local
            ? siretData.response.libelleVoieEtablissement
            : siretData.response.adresseEtablissement.libelleVoieEtablissement;
        const distributionspecialeetablissement = siretData.local
            ? siretData.response.distributionSpecialeEtablissement
            : siretData.response.adresseEtablissement.distributionSpecialeEtablissement;
        const complementadresseetablissement = siretData.local
            ? siretData.response.complementAdresseEtablissement
            : siretData.response.adresseEtablissement.complementAdresseEtablissement;
        const codepostaletablissement = siretData.local
            ? siretData.response.codePostalEtablissement
            : siretData.response.adresseEtablissement.codePostalEtablissement;
        const libellecommuneetablissement = siretData.local
            ? siretData.response.libelleCommuneEtablissement
            : siretData.response.adresseEtablissement.libelleCommuneEtablissement;
        const libellecedexetablissement = siretData.local
            ? siretData.response.libelleCedexEtablissement
            : siretData.response.adresseEtablissement.libelleCedexEtablissement;
        const libellecommuneetrangeretablissement = siretData.local
            ? siretData.response.libelleCommuneEtrangerEtablissement
            : siretData.response.adresseEtablissement.libelleCommuneEtrangerEtablissement;
        const libellepaysetrangeretablissement = siretData.local
            ? siretData.response.libellePaysEtrangerEtablissement
            : siretData.response.adresseEtablissement.libellePaysEtrangerEtablissement;
        const codepaysetrangeretablissement = siretData.local
            ? siretData.response.codePaysEtrangerEtablissement
            : siretData.response.adresseEtablissement.codePaysEtrangerEtablissement;

        return (
            <>
                {numerovoieetablissement && (
                    <ListValidationField
                        label="Numéro"
                        value={`${numerovoieetablissement}${
                            indicerepetitionetablissement ? ` ${indicerepetitionetablissement}` : ''
                        }`}
                    />
                )}
                {libellevoieetablissement && (
                    <ListValidationField
                        label="Voie"
                        value={`${typevoieetablissement} ${libellevoieetablissement}`}
                    />
                )}
                {distributionspecialeetablissement && (
                    <ListValidationField
                        label="Distribution spéciale"
                        value={`${distributionspecialeetablissement}`}
                    />
                )}
                {complementadresseetablissement && (
                    <ListValidationField
                        label="Complément d'adresse"
                        value={`${complementadresseetablissement}`}
                    />
                )}
                {codepostaletablissement && (
                    <ListValidationField
                        label="Adresse"
                        value={`${codepostaletablissement} ${libellecommuneetablissement}`}
                    />
                )}
                {libellecedexetablissement && (
                    <ListValidationField label="Cedex" value={`${libellecedexetablissement}`} />
                )}
                {libellecommuneetrangeretablissement && (
                    <ListValidationField
                        label="Libelle commune étrangère"
                        value={`${libellecommuneetrangeretablissement}`}
                    />
                )}
                {libellepaysetrangeretablissement && (
                    <ListValidationField
                        label="Libelle pays etranger"
                        value={`${libellepaysetrangeretablissement}`}
                    />
                )}
                {codepaysetrangeretablissement && (
                    <ListValidationField
                        label="Code pays étranger"
                        value={`${codepaysetrangeretablissement}`}
                    />
                )}
            </>
        );
    }

    function dataToDisplay() {
        const responseData = siretData.local
            ? siretData.response
            : siretData.response.periodesEtablissement[0];
        const etatAdministratifEtablissement = responseData;
        const etablissementSiege = siretData.response.etablissementSiege;
        const denominationUniteLegale = siretData.local
            ? siretData.response.denominationUniteLegale
            : siretData.response.uniteLegale.denominationUniteLegale;
        const siret = siretData.response.siret;

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
                if (etatAdministratifEtablissement === 'F') {
                    return (
                        <Typography variant="overline" color="error">
                            Etablissement administrativement fermé
                        </Typography>
                    );
                }

                if (etablissementSiege === true) {
                    return (
                        <>
                            <ListValidationField label="Siret" value={`${siret}`} />
                            <ListValidationField
                                label="Raison sociale"
                                value={`${denominationUniteLegale}`}
                            />
                            {establishmentAddress()}
                        </>
                    );
                } else {
                    return (
                        <>
                            <ListValidationField label="Siret" value={`${siret}`} />
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
            <ValidationForm
                open={open}
                onClose={onClose}
                local={siretData.local}
                dataFromDatabase={
                    <EstablishmentInformationFromDatabase
                        selectedEstablishment={selectedEstablishment}
                    />
                }
                loading={loading}
                dataToDisplay={dataToDisplay}
                handleSearch={handleSearch}
                onClickReject={() => {
                    handleValidate(statusFromApi[1].status_id);
                    validationMail(1);
                }}
                onClickValidate={() => {
                    handleValidate(statusFromApi[0].status_id);
                    validationMail(0);
                }}
                disableButton={
                    siretData.siret === 'notfound' ||
                    siretData.siret === 'tooManyRequests' ||
                    siretData.siret === 'error'
                }
            />
        </>
    );
}

EstablishmentValidationForm.propTypes = {
    open: PropTypes.bool.isRequired,
    selectedEstablishment: PropTypes.object,
    onClose: PropTypes.func.isRequired,
};

export default EstablishmentValidationForm;
