import { useEffect, useState } from 'react';
import Axios from '../../utils/axiosUrl';
import { useAuth } from '../../hooks/useAuth';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { Toaster } from 'react-hot-toast';
import PropTypes from 'prop-types';
import { errorStatusToast, errorToast, validationToast } from '../ToastsUtils';
import ListValidationField from '../Form/ListValidationField';

function EventValidationForm({ open, selectedEvent, onClose }) {
    const { user } = useAuth();
    const ApiToken = user.token;
    const [eventStatusFromApi, setEventStatusFromApi] = useState({});

    function EventInformationFromDatabase({ selectedEvent }) {
        const {
            establishment_trade_name,
            event_name,
            description,
            start_event,
            end_event,
            price,
            capacity,
            poster,
        } = selectedEvent;
        return (
            <>
                <img src={poster} alt="image de l'événement" style={{ width: '100%' }} />
                <ListValidationField
                    label="Etablissement organisateur"
                    value={establishment_trade_name}
                />
                <ListValidationField label="Nom de l'événement" value={event_name} />
                <ListValidationField label="Description" value={description} />
                <ListValidationField label="Début de l'évenement" value={start_event} />
                <ListValidationField label="Fin de l'évenement" value={end_event} />
                <ListValidationField
                    label="Prix"
                    value={price === null || price == 0.0 ? 'gratuit' : price + ' €'}
                />
                <ListValidationField label="Nombre de place" value={capacity || 'illimité'} />
            </>
        );
    }

    useEffect(() => {
        if (open) {
            getValidationStatus();
        }
    }, [open]);

    async function getValidationStatus() {
        try {
            const response = await Axios.api.get('/events-status', {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${ApiToken}`,
                },
            });
            setEventStatusFromApi(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleValidate(validationStatus) {
        const status = parseInt(validationStatus);
        try {
            await Axios.api.put(`/event/${selectedEvent.id}/validation/${status}`, null, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${ApiToken}`,
                },
            });
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

    return (
        <>
            <Toaster />
            <Dialog open={open} onClose={onClose} aria-labelledby="alert-dialog-title">
                <DialogTitle id="alert-dialog-title">{`Validation de l'évènement`}</DialogTitle>
                <DialogContent>
                    {selectedEvent && (
                        <EventInformationFromDatabase selectedEvent={selectedEvent} />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Annuler</Button>

                    <ButtonGroup variant="contained">
                        <Button
                            color="error"
                            onClick={() => handleValidate(eventStatusFromApi[1].status_id)}
                        >
                            Refusé
                        </Button>
                        <Button
                            color="success"
                            onClick={() => handleValidate(eventStatusFromApi[0].status_id)}
                        >
                            Valider
                        </Button>
                    </ButtonGroup>
                </DialogActions>
            </Dialog>
        </>
    );
}

EventValidationForm.propTypes = {
    open: PropTypes.bool.isRequired,
    selectedEvent: PropTypes.object,
    onClose: PropTypes.func.isRequired,
};

export default EventValidationForm;
