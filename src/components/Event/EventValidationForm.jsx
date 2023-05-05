import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import Axios from '../../utils/axiosUrl';
import ListValidationField from '../Form/ListValidationField';
import { errorStatusToast, errorToast, validationToast } from '../ToastsUtils';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AccordionDetails, Box } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';

function EventValidationForm({ open, selectedEvent, onClose }) {
    const { user } = useAuth();
    const ApiToken = user.token;
    const [eventStatusFromApi, setEventStatusFromApi] = useState({});
    const [eventHistory, setEventHistory] = useState([]);

    function formatDate(data) {
        let dateToFormat = new Date(data);
        dateToFormat =
            dateToFormat.toLocaleDateString() +
            ' ' +
            dateToFormat.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            });
        return dateToFormat;
    }

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
                <img
                    src={poster}
                    alt="image de l'événement"
                    style={{ maxWidth: '80%', margin: 'auto', display: 'block' }}
                />
                <ListValidationField
                    label="Etablissement organisateur"
                    value={establishment_trade_name}
                />
                <ListValidationField label="Nom de l'événement" value={event_name} />
                <ListValidationField label="Description" value={description} />
                <ListValidationField label="Début de l'évenement" value={formatDate(start_event)} />
                <ListValidationField label="Fin de l'évenement" value={formatDate(end_event)} />
                <ListValidationField
                    label="Prix"
                    value={price === null || price == 0.0 ? 'gratuit' : price + ' €'}
                />
                <ListValidationField label="Nombre de place" value={capacity || 'illimité'} />
            </>
        );
    }

    function eventHistoryFromApi() {
        if (eventHistory.length <= 1) {
            return null;
        }

        return (
            <>
                <Accordion TransitionProps={{ unmountOnExit: true }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography color={'primary'}>Historique de l&apos;événement</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {eventHistory.slice(1).map((historyItem, index) => (
                            <div key={index}>
                                <Box padding={'20px'} borderBottom={'2px solid'}>
                                    <img
                                        src={historyItem.poster}
                                        alt="image de l'événement"
                                        style={{
                                            width: '50%',
                                            margin: 'auto',
                                            display: 'block',
                                            paddingBottom: '10px',
                                        }}
                                    />
                                    <ListValidationField
                                        label="Nom de l'événement"
                                        value={historyItem.event_name}
                                    />
                                    <ListValidationField
                                        label="Description"
                                        value={historyItem.description}
                                    />
                                    <ListValidationField
                                        label="Début de l'évenement"
                                        value={formatDate(historyItem.start_event)}
                                    />
                                    <ListValidationField
                                        label="Fin de l'évenement"
                                        value={formatDate(historyItem.end_event)}
                                    />
                                    <ListValidationField
                                        label="Prix"
                                        value={
                                            historyItem.price === null || historyItem.price == 0.0
                                                ? 'gratuit'
                                                : historyItem.price + ' €'
                                        }
                                    />
                                    <ListValidationField
                                        label="Nombre de place"
                                        value={historyItem.capacity || 'illimité'}
                                    />
                                </Box>
                            </div>
                        ))}
                    </AccordionDetails>
                </Accordion>
            </>
        );
    }

    useEffect(() => {
        if (open) {
            getValidationStatus();
            getEventWithHistory();
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

    async function getEventWithHistory() {
        try {
            const response = await Axios.api.get(`/admin/event/${selectedEvent.id}/history`, {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${ApiToken}`,
                },
            });
            setEventHistory(response.data.data);
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
                    {eventHistoryFromApi()}
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
