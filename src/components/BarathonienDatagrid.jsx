import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Axios from '../utils/axiosUrl';
import { Box, Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import EditIcon from '@mui/icons-material/Edit';
import { green, red } from '@mui/material/colors';
import BarathonienForm from './BarathonienForm';

function BarathonienDatagrid() {
    const { user } = useAuth();
    const ApiToken = user.token;

    const [allBarathoniens, setAllBarathoniens] = useState([]);
    const [open, setOpen] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [selectedBarathonienId, setSelectedBarathonienId] = useState(null);

    async function getBarathoniens() {
        try {
            const response = await Axios.api.get('/barathonien/list', {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${ApiToken}`,
                },
            });
            setAllBarathoniens(response.data.data);
            await new Promise((resolve) => setTimeout(resolve));
        } catch (error) {
            console.log(error);
        }
    }

    async function handleDelete(id) {
        try {
            await Axios.api.delete(`/barathonien/delete/${id}`, {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${ApiToken}`,
                },
            });
            await new Promise((resolve) => setTimeout(resolve));
            setOpen(false);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleRestore(id) {
        try {
            await Axios.api.get(`/barathonien/restore/${id}`, {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${ApiToken}`,
                },
            });
            await new Promise((resolve) => setTimeout(resolve));
            setOpen(false);
        } catch (error) {
            console.log(error);
        }
    }

    const handleClickOpen = (id) => {
        setSelectedBarathonienId(id);
        setOpen(true);
    };

    const handleClickOpenForm = (id) => {
        setSelectedBarathonienId(id);
        setOpenForm(true);
        console.log("id de l'open form " + id);
    };

    const handleClose = () => {
        setOpen(false);
        setOpenForm(false);
    };

    useEffect(() => {
        getBarathoniens();
    }, [open, openForm]);

    const rows = allBarathoniens.map((barathonien) => ({
        key: barathonien.user_id,
        id: barathonien.user_id,
        first_name: barathonien.first_name,
        last_name: barathonien.last_name,
        birthday: barathonien.birthday,
        barathonien_id: barathonien.barathonien_id,
        address: barathonien.address,
        postal_code: barathonien.postal_code,
        city: barathonien.city,
        deleted_at: barathonien.deleted_at,
    }));

    function getFullName(params) {
        return `${params.row.first_name || ''} ${params.row.last_name || ''}`;
    }

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.2 },
        { field: 'fullname', headerName: 'Nom complet', flex: 0.7, valueGetter: getFullName },
        { field: 'birthday', headerName: 'Date de naissance', flex: 0.5 },
        { field: 'address', headerName: 'Adresse', flex: 0.7 },
        { field: 'postal_code', headerName: 'Code postal', flex: 0.4 },
        { field: 'city', headerName: 'Ville', flex: 0.5 },
        {
            field: 'deleted_at',
            headerName: 'Actif',
            flex: 0.5,
            renderCell: ({ row: { deleted_at } }) => {
                return (
                    <Box
                        width="100%"
                        m="0 auto"
                        p="5px"
                        display="flex"
                        justifyContent="center"
                        backgroundColor={deleted_at === null ? green[400] : red[400]}
                        borderRadius="5px"
                    >
                        {deleted_at === null && <HowToRegIcon />}
                        {deleted_at !== null && <PersonRemoveIcon />}
                    </Box>
                );
            },
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 0.7,
            disableClickEventBubbling: true,
            renderCell: (params) => (
                <>
                    <Button
                        sx={{ marginRight: '10px', px: '20px' }}
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => {
                            handleClickOpenForm(params.row.id);
                        }}
                        startIcon={<EditIcon />}
                    >
                        Modifier
                    </Button>
                    <Button
                        sx={{ px: '20px' }}
                        variant="contained"
                        color={params.row.deleted_at === null ? 'error' : 'warning'}
                        size="small"
                        onClick={() => {
                            handleClickOpen(params.row.id);
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

    return (
        <>
            <div>
                <Box sx={{ height: 400, width: '100%' }}>
                    <h1>Barathoniens</h1>
                    <DataGrid rows={rows} columns={columns} components={{ Toolbar: GridToolbar }} />
                </Box>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{'Confirmation'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {`Êtes-vous sûr de vouloir ${
                                selectedBarathonienId !== null &&
                                allBarathoniens.find(
                                    (barathonien) => barathonien.user_id === selectedBarathonienId,
                                )?.deleted_at === null
                                    ? 'supprimer'
                                    : 'restaurer'
                            } cet utilisateur ?`}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Annuler</Button>
                        {selectedBarathonienId !== null &&
                        allBarathoniens.find((b) => b.user_id === selectedBarathonienId)
                            ?.deleted_at === null ? (
                            <Button onClick={() => handleDelete(selectedBarathonienId)}>
                                Supprimer
                            </Button>
                        ) : (
                            <Button onClick={() => handleRestore(selectedBarathonienId)}>
                                Restaurer
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
                <BarathonienForm
                    open={openForm}
                    handleClose={handleClose}
                    barathonienId={selectedBarathonienId}
                />
            </div>
        </>
    );
}

export default BarathonienDatagrid;
