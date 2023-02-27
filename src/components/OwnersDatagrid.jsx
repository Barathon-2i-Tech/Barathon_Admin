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
import { green, red, orange, grey } from '@mui/material/colors';
import OwnerForm from './OwnerForm';

function OwnersDatagrid() {
    const { user } = useAuth();
    const ApiToken = user.token;

    const [allOwners, setAllOwners] = useState([]);
    const [open, setOpen] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [selectedOwnerId, setSelectedOwnerId] = useState(null);

    async function getOwners() {
        try {
            const response = await Axios.api.get('/pro/list', {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${ApiToken}`,
                },
            });
            setAllOwners(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleDelete(id) {
        try {
            await Axios.api.delete(`/pro/delete/${id}`, {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${ApiToken}`,
                },
            });
            setOpen(false);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleRestore(id) {
        try {
            await Axios.api.get(`/pro/restore/${id}`, {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${ApiToken}`,
                },
            });
            setOpen(false);
        } catch (error) {
            console.log(error);
        }
    }

    const handleClickOpen = (id) => {
        setSelectedOwnerId(id);
        setOpen(true);
    };

    const handleClickOpenForm = (id) => {
        setSelectedOwnerId(id);
        setOpenForm(true);
    };

    const handleClose = () => {
        setOpen(false);
        setOpenForm(false);
    };

    useEffect(() => {
        getOwners();
    }, [open, openForm]);

    const rows = allOwners.map((owner) => ({
        key: owner.user_id,
        id: owner.user_id,
        first_name: owner.first_name,
        last_name: owner.last_name,
        email: owner.email,
        owner_id: owner.owner_id,
        siren: owner.siren,
        kbis: owner.kbis,
        phone: owner.phone,
        status: JSON.parse(owner.comment),
        deleted_at: owner.deleted_at,
    }));

    function getFullName(params) {
        return `${params.row.first_name || ''} ${params.row.last_name || ''}`;
    }

    function getStatus(params) {
        switch (params.row.status.code) {
            case 'OWNER_VALID':
                return 'Validé';

            case 'OWNER_REFUSE':
                return 'Refusé';

            case 'OWNER_PENDING':
                return 'En attente';

            default:
                return 'Erreur';
        }
    }

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.2 },
        { field: 'fullname', headerName: 'Nom complet', flex: 0.7, valueGetter: getFullName },
        { field: 'email', headerName: 'Email', flex: 0.4 },
        { field: 'siren', headerName: 'Siren', flex: 0.4 },
        { field: 'kbis', headerName: 'Kbis', flex: 0.4 },
        {
            field: 'phone',
            headerName: 'Téléphone',
            flex: 0.4,
            valueGetter: ({ row }) => row.phone || 'NC',
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 0.4,
            valueGetter: getStatus,
            renderCell: ({ row: { status } }) => {
                let backgroundColor = null;
                switch (status.code) {
                    case 'OWNER_VALID':
                        backgroundColor = green[400];
                        break;
                    case 'OWNER_PENDING':
                        backgroundColor = orange[400];
                        break;
                    case 'OWNER_REFUSE':
                        backgroundColor = red[400];
                        break;
                    default:
                        backgroundColor = grey[400];
                        break;
                }
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
            field: 'deleted_at',
            headerName: 'Actif',
            flex: 0.3,
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
                        disabled={
                            params.row.deleted_at !== null ||
                            params.row.status.code !== 'OWNER_VALID'
                        }
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
        <div>
            <Box sx={{ height: 400, width: '100%', mt: 10 }}>
                <h1>Professionels</h1>
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
                            selectedOwnerId !== null &&
                            allOwners.find((owner) => owner.user_id === selectedOwnerId)
                                ?.deleted_at === null
                                ? 'supprimer'
                                : 'restaurer'
                        } cet utilisateur ?`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Annuler</Button>
                    {selectedOwnerId !== null &&
                    allOwners.find((owner) => owner.user_id === selectedOwnerId)?.deleted_at ===
                        null ? (
                        <Button onClick={() => handleDelete(selectedOwnerId)}>Supprimer</Button>
                    ) : (
                        <Button onClick={() => handleRestore(selectedOwnerId)}>Restaurer</Button>
                    )}
                </DialogActions>
            </Dialog>
            <OwnerForm open={openForm} handleClose={handleClose} userId={selectedOwnerId} />
        </div>
    );
}

export default OwnersDatagrid;
