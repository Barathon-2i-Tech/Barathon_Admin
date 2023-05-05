import { useEffect, useState /* useContext */ } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Axios from '../../utils/axiosUrl';
import { Box, Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import DoneIcon from '@mui/icons-material/Done';
import { getStatusBackgroundColor } from '../Datagrid/datagridUtils';
import HeaderDatagrid from '../HeaderDatagrid';
import ModalDeleteRestore from '../ModalDeleteRestore';
import EventValidationForm from './EventValidationForm';

function EventDatagrid() {
    const { user } = useAuth();
    const ApiToken = user.token;
    const [allEvents, setAllEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [openEvent, setOpenEvent] = useState(false);
    const [openEventFormValidation, setOpenEventValidationForm] = useState(false);

    function handleClose() {
        setOpenEvent(false);
        setOpenEventValidationForm(false);
    }

    async function getEvents() {
        try {
            const response = await Axios.api.get('/events/list', {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${ApiToken}`,
                },
            });
            setAllEvents(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleClickOpenEvent = (id) => {
        setSelectedEventId(id);
        setOpenEvent(true);
    };

    const handleClickOpenEventValidation = (data) => {
        setSelectedEvent(data);
        setOpenEventValidationForm(true);
    };

    function getStatus(params) {
        switch (params.row.status.code) {
            case 'EVENT_VALID':
                return 'Validé';

            case 'EVENT_REFUSE':
                return 'Refusé';

            case 'EVENT_PENDING':
                return 'En attente';

            default:
                return 'Erreur';
        }
    }

    const eventRows = allEvents.map((event) => ({
        key: event.event_id,
        id: event.event_id,
        event_name: event.event_name,
        description: event.description,
        start_event: event.start_event,
        end_event: event.end_event,
        poster: event.poster,
        price: event.price,
        capacity: event.capacity,
        establishment_trade_name: event.trade_name,
        status: JSON.parse(event.comment),
        deleted_at: event.deleted_at,
    }));

    const eventColumns = [
        { field: 'id', headerName: 'ID', flex: 0.1, headerAlign: 'center', align: 'center' },
        {
            field: 'poster',
            headerName: 'Affiche',
            flex: 0.3,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => {
                return (
                    <img
                        src={params.value}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                );
            },
        },
        {
            field: 'establishment_trade_name',
            headerName: 'Organisateur',
            flex: 0.3,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'event_name',
            headerName: "Nom de l'événement",
            flex: 0.3,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'start_event',
            headerName: 'Début',
            flex: 0.3,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => {
                const date = new Date(params.row.start_event);
                return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                })}`;
            },
        },
        {
            field: 'end_event',
            headerName: 'Fin',
            flex: 0.3,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => {
                const date = new Date(params.row.end_event);
                return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                })}`;
            },
        },
        {
            field: 'price',
            headerName: 'Prix',
            flex: 0.2,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => {
                if (params.row.price === null || params.row.price == 0.0) {
                    return 'Gratuit';
                }
                return `${params.row.price} `;
            },
            renderCell: ({ value }) => {
                if (value === 'Gratuit') {
                    return <strong>{value}</strong>;
                }
                return `${value} €`;
            },
        },
        {
            field: 'capacity',
            headerName: 'Capacité',
            flex: 0.2,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => (params.row.capacity ? `${params.row.capacity} ` : 'Illimité'),
            renderCell: ({ value }) => {
                if (value === 'Illimité') {
                    return <strong>{value}</strong>;
                }
                return `${value}`;
            },
        },
        {
            field: 'status',
            headerName: 'Statut',
            flex: 0.4,
            headerAlign: 'center',
            align: 'center',
            valueGetter: getStatus,
            renderCell: ({ row: { status } }) => {
                const backgroundColor = getStatusBackgroundColor(status, 'EVENT');
                return (
                    <Box
                        width="100%"
                        m="0 auto"
                        p="5px"
                        display="flex"
                        justifyContent="center"
                        backgroundColor={backgroundColor}
                        borderRadius="5px"
                    >
                        {getStatus({ row: { status } })}
                    </Box>
                );
            },
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 0.7,
            disableClickEventBubbling: true,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <>
                    <Button
                        sx={{ marginRight: '10px', px: '30px' }}
                        variant="contained"
                        color="info"
                        size="small"
                        onClick={() => {
                            handleClickOpenEventValidation(params.row);
                        }}
                        startIcon={<DoneIcon />}
                        disabled={
                            params.row.deleted_at !== null ||
                            params.row.status.code === 'EVENT_VALID'
                        }
                    >
                        Valider
                    </Button>
                    <Button
                        sx={{ px: '20px' }}
                        variant="contained"
                        color={params.row.deleted_at === null ? 'error' : 'warning'}
                        size="small"
                        onClick={() => {
                            handleClickOpenEvent(params.row.id);
                        }}
                        startIcon={
                            params.row.deleted_at === null ? (
                                <DeleteIcon />
                            ) : (
                                <RestoreFromTrashIcon />
                            )
                        }
                    >
                        {params.row.deleted_at === null ? 'Supprimer' : 'Restaurer'}
                    </Button>
                </>
            ),
        },
    ];

    useEffect(() => {
        getEvents();
    }, [openEvent, openEventFormValidation]);

    return (
        <div>
            <Box sx={{ height: '70vh', width: '100%' }}>
                <HeaderDatagrid title="Evénements" />
                <DataGrid
                    rows={eventRows}
                    columns={eventColumns}
                    components={{ Toolbar: GridToolbar }}
                />
            </Box>
            <Dialog
                open={openEvent}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <ModalDeleteRestore
                    title="Suppression d'un établissement"
                    content={`Êtes-vous sûr de vouloir ${
                        selectedEventId !== null &&
                        allEvents.find((event) => event.event_id === selectedEventId)
                            ?.deleted_at === null
                            ? 'supprimer'
                            : 'restaurer'
                    } cet événement ?`}
                    onClose={handleClose}
                    deleteUrl={`/pro/event/${selectedEventId}`}
                    restoreUrl={`/pro/event/${selectedEventId}/restore`}
                    action={
                        selectedEventId !== null &&
                        allEvents.find((event) => event.event_id === selectedEventId)
                            ?.deleted_at === null
                            ? 'delete'
                            : 'restore'
                    }
                />
            </Dialog>
            <EventValidationForm
                open={openEventFormValidation}
                selectedEvent={selectedEvent}
                onClose={handleClose}
            />
        </div>
    );
}

export default EventDatagrid;
