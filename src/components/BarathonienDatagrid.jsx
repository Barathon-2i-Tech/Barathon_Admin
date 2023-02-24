import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Axios from '../utils/axiosUrl';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { Box, useTheme } from '@mui/material';
import { tokens } from './theme';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

function BarathonienDatagrid() {
    const { user } = useAuth();
    const [barathoniens, setBarathoniens] = useState([]);
    const ApiToken = user.token;
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [open, setOpen] = useState(false);
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
            console.log(response.data.data);
            setBarathoniens(response.data.data);
            await new Promise((resolve) => setTimeout(resolve));
        } catch (error) {
            console.log(error);
        }
    }

    async function handleDelete(id) {
        console.log('delete' + id);
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
        console.log('restore' + id);
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
        console.log("id de l'open " + id);
        setSelectedBarathonienId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        getBarathoniens();
    }, [open]);

    const rows = barathoniens.map((barathonien) => ({
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
        { field: 'postal_code', headerName: 'Code postal', flex: 0.7 },
        { field: 'city', headerName: 'Ville', flex: 0.7 },
        {
            field: 'deleted_at',
            headerName: 'Actif',
            flex: 0.7,
            renderCell: ({ row: { deleted_at } }) => {
                return (
                    <Box
                        width="100%"
                        m="0 auto"
                        p="5px"
                        display="flex"
                        justifyContent="center"
                        backgroundColor={
                            deleted_at === null ? colors.greenAccent[600] : colors.redAccent[600]
                        }
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
                <Button
                    variant="contained"
                    color={params.row.deleted_at === null ? 'error' : 'warning'}
                    size="small"
                    onClick={() => {
                        handleClickOpen(params.row.id);
                    }}
                    startIcon={
                        params.row.deleted_at === null ? <DeleteIcon /> : <RestoreFromTrashIcon />
                    }
                >
                    {params.row.deleted_at === null ? 'Supprimer' : 'Restaurer'}
                </Button>
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
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {`Êtes-vous sûr de vouloir ${
                                selectedBarathonienId !== null &&
                                barathoniens.find(
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
                        barathoniens.find((b) => b.user_id === selectedBarathonienId)
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
            </div>
        </>
    );
}

export default BarathonienDatagrid;
