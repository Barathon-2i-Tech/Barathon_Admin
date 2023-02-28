import { useEffect, useState, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Axios from '../utils/axiosUrl';
import { Box, Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import EditIcon from '@mui/icons-material/Edit';
import { green, red, orange, grey } from '@mui/material/colors';
import HeaderDatagrid from './HeaderDatagrid';
import * as Yup from 'yup';
import ModifyUserForm from './ModifyUserForm';
import ModalUpdateUser from './ModalUpdateUser';
import { ModalContext } from './contexts/ModalContextProvider';

function UserDatagrid() {
    const { user } = useAuth();
    const ApiToken = user.token;

    const [allBarathoniens, setAllBarathoniens] = useState([]);
    const [allOwners, setAllOwners] = useState([]);
    const [selectedBarathonienId, setSelectedBarathonienId] = useState(null);
    const [selectedOwnerId, setSelectedOwnerId] = useState(null);

    const {
        handleCloseModal,
        openBarathonien,
        openOwner,
        openBarathonienForm,
        openOwnerForm,
        openBarathonienModal,
        openBarathonienFormModal,
        openOwnerModal,
        openOwnerFormModal,
    } = useContext(ModalContext);

    /****************** barathonien ************************** */
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
        } catch (error) {
            console.log(error);
        }
    }

    const validationSchemaBarathonien = Yup.object({
        first_name: Yup.string().required('Requis'),
        last_name: Yup.string().required('Requis'),
        email: Yup.string().email('Email invalide').required('Requis'),
        address: Yup.string().required('Requis').min(5, "L'adresse est invalide"),
        postal_code: Yup.string().required('Requis').min(5, 'Le code postal est invalide'),
        city: Yup.string().required('Requis'),
    });

    const barathonienInitialValues = {
        first_name: '',
        last_name: '',
        email: '',
        address: '',
        postal_code: '',
        city: '',
    };

    const handleClickOpenBarathonien = (id) => {
        setSelectedBarathonienId(id);
        openBarathonienModal(true);
    };

    const handleClickOpenBarathonienForm = (id) => {
        setSelectedBarathonienId(id);
        openBarathonienFormModal(true);
    };

    const handleClickOpenOwner = (id) => {
        setSelectedOwnerId(id);
        openOwnerModal(true);
    };

    const handleClickOpenOwnerForm = (id) => {
        setSelectedOwnerId(id);
        openOwnerFormModal(true);
    };

    const barathoniensRows = allBarathoniens.map((barathonien) => ({
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

    const barathonienColumns = [
        { field: 'id', headerName: 'ID', flex: 0.2 },
        { field: 'fullname', headerName: 'Nom complet', flex: 0.7, valueGetter: getFullName },
        { field: 'birthday', headerName: 'Date de naissance', flex: 0.5 },
        { field: 'address', headerName: 'Adresse', flex: 0.7 },
        { field: 'postal_code', headerName: 'Code postal', flex: 0.4 },
        { field: 'city', headerName: 'Ville', flex: 0.4 },
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
                            handleClickOpenBarathonienForm(params.row.id);
                        }}
                        startIcon={<EditIcon />}
                        disabled={params.row.deleted_at !== null}
                    >
                        Modifier
                    </Button>
                    <Button
                        sx={{ px: '20px' }}
                        variant="contained"
                        color={params.row.deleted_at === null ? 'error' : 'warning'}
                        size="small"
                        onClick={() => {
                            handleClickOpenBarathonien(params.row.id);
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

    /************ owners  */
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

    const ownerInitialValues = {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
    };
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

    const ownersRows = allOwners.map((owner) => ({
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

    const ownersColumns = [
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
            flex: 0.2,
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
                            handleClickOpenOwnerForm(params.row.id);
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
                            handleClickOpenOwner(params.row.id);
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
    const validationSchemaOwner = Yup.object({
        first_name: Yup.string().required('Requis'),
        last_name: Yup.string().required('Requis'),
        email: Yup.string().email('Email invalide').required('Requis'),
        phone: Yup.string().max(13, 'Le numéro saisie est invalide').nullable(),
    });

    useEffect(() => {
        getBarathoniens();
        getOwners();
    }, [openBarathonien, openOwner, openBarathonienForm, openOwnerForm]);

    return (
        <>
            <div>
                <Box sx={{ height: 400, width: '100%' }}>
                    <HeaderDatagrid title="Barathoniens" />
                    <DataGrid
                        rows={barathoniensRows}
                        columns={barathonienColumns}
                        components={{ Toolbar: GridToolbar }}
                    />
                </Box>
                <Dialog
                    open={openBarathonien}
                    onClose={handleCloseModal}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <ModalUpdateUser
                        users={allBarathoniens}
                        selectedUserId={selectedBarathonienId}
                        onClose={handleCloseModal}
                        deleteUrl={`/barathonien/delete/${selectedBarathonienId}`}
                        restoreUrl={`/barathonien/restore/${selectedBarathonienId}`}
                    />
                </Dialog>

                <ModifyUserForm
                    open={openBarathonienForm}
                    validationSchema={validationSchemaBarathonien}
                    getUserByIdUrl={`/barathonien/${selectedBarathonienId}`}
                    updateUserUrl={`/barathonien/update/${selectedBarathonienId}`}
                    initialValues={barathonienInitialValues}
                />
            </div>
            <div>
                <Box sx={{ height: 400, width: '100%' }}>
                    <HeaderDatagrid title="Professionnels" />
                    <DataGrid
                        rows={ownersRows}
                        columns={ownersColumns}
                        components={{ Toolbar: GridToolbar }}
                    />
                </Box>
                <Dialog
                    open={openOwner}
                    onClose={handleCloseModal}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <ModalUpdateUser
                        users={allOwners}
                        selectedUserId={selectedOwnerId}
                        onClose={handleCloseModal}
                        deleteUrl={`/pro/delete/${selectedOwnerId}`}
                        restoreUrl={`/pro/restore/${selectedOwnerId}`}
                    />
                </Dialog>

                <ModifyUserForm
                    open={openOwnerForm}
                    validationSchema={validationSchemaOwner}
                    getUserByIdUrl={`/pro/${selectedOwnerId}`}
                    updateUserUrl={`/pro/update/${selectedOwnerId}`}
                    initialValues={ownerInitialValues}
                />
            </div>
        </>
    );
}

export default UserDatagrid;
