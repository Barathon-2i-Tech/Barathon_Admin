import { useEffect, useState /* useContext */ } from 'react';
import { useAuth } from '../../hooks/useAuth';
import * as Yup from 'yup';
import Axios from '../../utils/axiosUrl';
import { Buffer } from 'buffer';
import {
    DataGrid,
    GridToolbar,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarExport,
    GridToolbarDensitySelector,
} from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { green, red, orange, grey } from '@mui/material/colors';
import HeaderDatagrid from '../HeaderDatagrid';
import ModifyUserForm from './ModifyUserForm';
import OwnerValidationForm from '../User/OwnerValidationForm';
import NewAdministratorForm from '../User/NewAdministratorForm';
import { rowCommonDeletedAt } from '../Datagrid/datagridRessource';
import ModalDeleteRestore from '../ModalDeleteRestore';

function UserDatagrid() {
    const { user } = useAuth();
    const ApiToken = user.token;

    const [allBarathoniens, setAllBarathoniens] = useState([]);
    const [allOwners, setAllOwners] = useState([]);
    const [allAdministrators, setAllAdministrators] = useState([]);

    const [selectedBarathonienId, setSelectedBarathonienId] = useState(null);
    const [selectedOwnerId, setSelectedOwnerId] = useState(null);
    const [selectedAdministratorId, setSelectedAdministratorId] = useState(null);

    const [selectedOwner, setSelectedOwner] = useState(null);
    const [openOwnerFormValidation, setOpenOwnerFormValidation] = useState(false);

    const [openBarathonien, setOpenBarathonien] = useState(false);
    const [openOwner, setOpenOwner] = useState(false);
    const [openAdministrator, setOpenAdministrator] = useState(false);

    const [openBarathonienForm, setOpenBarathonienForm] = useState(false);
    const [openOwnerForm, setOpenOwnerForm] = useState(false);
    const [openAdministratorForm, setOpenAdministratorForm] = useState(false);
    const [openNewAdministratorForm, setOpenNewAdministratorForm] = useState(false);

    function handleClose() {
        setOpenBarathonien(false);
        setOpenBarathonienForm(false);
        setOpenOwner(false);
        setOpenOwnerForm(false);
        setOpenAdministrator(false);
        setOpenAdministratorForm(false);
        setOpenOwnerFormValidation(false);
        setOpenNewAdministratorForm(false);
    }

    /*********************************************
    |
    |      Barathoniens
    |
    **********************************************/
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
        setOpenBarathonien(true);
    };

    const handleClickOpenBarathonienForm = (id) => {
        setSelectedBarathonienId(id);
        setOpenBarathonienForm(true);
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
        { field: 'id', headerName: 'ID', flex: 0.1, headerAlign: 'center', align: 'center' },
        {
            field: 'fullname',
            headerName: 'Nom complet',
            flex: 0.7,
            headerAlign: 'center',
            align: 'center',
            valueGetter: getFullName,
        },
        {
            field: 'birthday',
            headerName: 'Date de naissance',
            flex: 0.5,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'address',
            headerName: 'Adresse',
            flex: 0.7,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'postal_code',
            headerName: 'Code postal',
            flex: 0.4,
            headerAlign: 'center',
            align: 'center',
        },
        { field: 'city', headerName: 'Ville', flex: 0.4, headerAlign: 'center', align: 'center' },
        rowCommonDeletedAt,
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

    /*********************************************
    |
    |      Owners
    |
    **********************************************/

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

    const validationSchemaOwner = Yup.object({
        first_name: Yup.string().required('Requis'),
        last_name: Yup.string().required('Requis'),
        email: Yup.string().email('Email invalide').required('Requis'),
        phone: Yup.string().max(13, 'Le numéro saisie est invalide').nullable(),
    });

    const ownerInitialValues = {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
    };

    const handleClickOpenOwner = (id) => {
        setSelectedOwnerId(id);
        setOpenOwner(true);
    };

    const handleClickOpenOwnerForm = (id) => {
        setSelectedOwnerId(id);
        setOpenOwnerForm(true);
    };

    const handleCLickOpenOwnerVerification = (data) => {
        setSelectedOwner(data);
        setOpenOwnerFormValidation(true);
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

    function decodeKbis(params) {
        //get kbis encoded in base64
        const kbis = params.row.kbis;

        //decode kbis encoded in base64
        const kbisDecoded = Buffer.from(kbis, 'base64');

        //convert kbis to blob ( Javascript object who represent a file )
        const kbisBlob = new Blob([kbisDecoded], { type: 'application/pdf' });

        //create a url to download the file
        const kbisUrl = URL.createObjectURL(kbisBlob);

        // return the url
        return kbisUrl;
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
        company_name: owner.company_name,
        status: JSON.parse(owner.comment),
        deleted_at: owner.deleted_at,
    }));

    const ownersColumns = [
        { field: 'id', headerName: 'ID', flex: 0.1, headerAlign: 'center', align: 'center' },
        {
            field: 'fullname',
            headerName: 'Nom complet',
            flex: 0.5,
            headerAlign: 'center',
            align: 'center',
            valueGetter: getFullName,
        },
        {
            field: 'company_name',
            headerName: 'Raison sociale',
            flex: 0.7,
            headerAlign: 'center',
            align: 'center',
        },
        { field: 'email', headerName: 'Email', flex: 0.4, headerAlign: 'center', align: 'center' },
        { field: 'siren', headerName: 'Siren', flex: 0.3, headerAlign: 'center', align: 'center' },
        {
            field: 'kbis',
            headerName: 'Kbis',
            flex: 0.4,
            headerAlign: 'center',
            align: 'center',
            valueGetter: decodeKbis,
            renderCell: ({ row: { kbis, company_name } }) => {
                return (
                    <a href={kbis} download={`${company_name}_Kbis.pdf`}>
                        Kbis
                    </a>
                );
            },
        },
        {
            field: 'phone',
            headerName: 'Téléphone',
            flex: 0.4,
            headerAlign: 'center',
            align: 'center',
            valueGetter: ({ row }) => row.phone || 'N.C.',
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 0.3,
            headerAlign: 'center',
            align: 'center',
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
        rowCommonDeletedAt,
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            disableClickEventBubbling: true,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <>
                    <Button
                        sx={{ marginRight: '10px', px: '40px' }}
                        variant="contained"
                        color="info"
                        size="small"
                        onClick={() => {
                            handleCLickOpenOwnerVerification(params.row);
                        }}
                        startIcon={<DoneIcon />}
                        disabled={
                            params.row.deleted_at !== null ||
                            params.row.status.code === 'OWNER_VALID'
                        }
                    >
                        Valider
                    </Button>
                    <Button
                        sx={{ marginRight: '10px', px: '40px' }}
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
                        sx={{ px: '45px' }}
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

    /*********************************************
    |
    |      Admnistrators
    |
    **********************************************/

    async function getAdmnistrators() {
        try {
            const response = await Axios.api.get('/administrator/list', {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${ApiToken}`,
                },
            });
            setAllAdministrators(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    const RightAlignedContainer = styled(GridToolbarContainer)({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        '& .right-align': {
            marginLeft: 'auto',
        },
    });

    function administratorCustomToolbar() {
        return (
            <RightAlignedContainer>
                <div>
                    <GridToolbarColumnsButton />
                    <GridToolbarFilterButton />
                    <GridToolbarDensitySelector />
                    <GridToolbarExport />
                </div>
                {user.superAdmin === true && (
                    <Button
                        variant="contained"
                        size="small"
                        className="right-align"
                        startIcon={<AddIcon />}
                        onClick={handleClickOpenNewAdmnistrator}
                    >
                        Créer un administrateur
                    </Button>
                )}
            </RightAlignedContainer>
        );
    }

    const validationSchemaAdministrator = Yup.object({
        first_name: Yup.string().required('Requis'),
        last_name: Yup.string().required('Requis'),
        email: Yup.string().email('Email invalide').required('Requis'),
        superAdmin: Yup.boolean().required('Requis'),
    });

    const admnistratorInitialValues = {
        first_name: '',
        last_name: '',
        email: '',
        superAdmin: '',
    };

    const handleClickOpenAdmnistrator = (id) => {
        setSelectedAdministratorId(id);
        setOpenAdministrator(true);
    };

    const handleClickOpenNewAdmnistrator = () => {
        setOpenNewAdministratorForm(true);
    };

    const handleClickOpenAdmnistratorForm = (id) => {
        setSelectedAdministratorId(id);
        setOpenAdministratorForm(true);
    };

    const administratorsRows = allAdministrators.map((administrator) => ({
        key: administrator.user_id,
        id: administrator.user_id,
        first_name: administrator.first_name,
        last_name: administrator.last_name,
        email: administrator.email,
        administrator_id: administrator.administrator_id,
        superAdmin: administrator.superAdmin,
        deleted_at: administrator.deleted_at,
    }));

    const administratorsColumns = [
        { field: 'id', headerName: 'ID', flex: 0.1, headerAlign: 'center', align: 'center' },
        {
            field: 'fullname',
            headerName: 'Nom complet',
            flex: 0.7,
            headerAlign: 'center',
            align: 'center',
            valueGetter: getFullName,
        },
        { field: 'email', headerName: 'Email', flex: 0.4, headerAlign: 'center', align: 'center' },
        {
            field: 'superAdmin',
            headerName: 'Super Admnistrateur',
            flex: 0.4,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row: { superAdmin } }) => {
                return (
                    <Box
                        width="100%"
                        m="0 auto"
                        p="5px"
                        display="flex"
                        justifyContent="center"
                        backgroundColor={superAdmin === true ? green[400] : red[400]}
                        borderRadius="5px"
                    >
                        {superAdmin === true && <DoneIcon />}
                        {superAdmin === false && <DoNotDisturbIcon />}
                    </Box>
                );
            },
        },
        rowCommonDeletedAt,
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
                        sx={{ marginRight: '10px', px: '20px' }}
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => {
                            handleClickOpenAdmnistratorForm(params.row.id);
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
                            handleClickOpenAdmnistrator(params.row.id);
                        }}
                        startIcon={
                            params.row.deleted_at === null ? (
                                <DeleteIcon />
                            ) : (
                                <RestoreFromTrashIcon />
                            )
                        }
                        disabled={params.row.email === user.userLogged.email}
                    >
                        {params.row.deleted_at === null ? 'Supprimer' : 'Restaurer'}
                    </Button>
                </>
            ),
        },
    ];

    useEffect(() => {
        getBarathoniens();
        getOwners();
        getAdmnistrators();
    }, [
        openBarathonien,
        openOwner,
        openBarathonienForm,
        openOwnerForm,
        openAdministrator,
        openAdministratorForm,
        openOwnerFormValidation,
        openNewAdministratorForm,
    ]);

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
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <ModalDeleteRestore
                        title="Gestion du barathonien"
                        content={`Êtes-vous sûr de vouloir ${
                            selectedBarathonienId !== null &&
                            allBarathoniens.find(
                                (barathonien) => barathonien.user_id === selectedBarathonienId,
                            )?.deleted_at === null
                                ? 'supprimer'
                                : 'restaurer'
                        } ce barathonien ?`}
                        onClose={handleClose}
                        deleteUrl={`/barathonien/${selectedBarathonienId}`}
                        restoreUrl={`/barathonien/restore/${selectedBarathonienId}`}
                        action={
                            selectedBarathonienId !== null &&
                            allBarathoniens.find(
                                (barathonien) => barathonien.user_id === selectedBarathonienId,
                            )?.deleted_at === null
                                ? 'delete'
                                : 'restore'
                        }
                    />
                </Dialog>
                <ModifyUserForm
                    open={openBarathonienForm}
                    onClose={handleClose}
                    validationSchema={validationSchemaBarathonien}
                    getUserByIdUrl={`/barathonien/${selectedBarathonienId}`}
                    updateUserUrl={`/barathonien/${selectedBarathonienId}`}
                    initialValues={barathonienInitialValues}
                />
            </div>
            <div style={{ marginTop: '100px' }}>
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
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <ModalDeleteRestore
                        title="Gestion du professionnel"
                        content={`Êtes-vous sûr de vouloir ${
                            selectedOwnerId !== null &&
                            allOwners.find((owner) => owner.user_id === selectedOwnerId)
                                ?.deleted_at === null
                                ? 'supprimer'
                                : 'restaurer'
                        } ce professionnel ?`}
                        onClose={handleClose}
                        deleteUrl={`/pro/${selectedOwnerId}`}
                        restoreUrl={`/pro/restore/${selectedOwnerId}`}
                        action={
                            selectedOwnerId !== null &&
                            allOwners.find((owner) => owner.user_id === selectedOwnerId)
                                ?.deleted_at === null
                                ? 'delete'
                                : 'restore'
                        }
                    />
                </Dialog>
                <ModifyUserForm
                    open={openOwnerForm}
                    onClose={handleClose}
                    validationSchema={validationSchemaOwner}
                    getUserByIdUrl={`/pro/${selectedOwnerId}`}
                    updateUserUrl={`/pro/${selectedOwnerId}`}
                    initialValues={ownerInitialValues}
                />
                <OwnerValidationForm
                    open={openOwnerFormValidation}
                    selectedOwner={selectedOwner}
                    onClose={handleClose}
                />
            </div>
            <div style={{ marginTop: '100px' }}>
                <Box sx={{ height: 400, width: '100%' }}>
                    <HeaderDatagrid title="Administrateurs" />
                    <DataGrid
                        rows={administratorsRows}
                        columns={administratorsColumns}
                        components={{ Toolbar: administratorCustomToolbar }}
                    />
                </Box>
                <Dialog
                    open={openAdministrator}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <ModalDeleteRestore
                        title="Gestion de l'administrateur"
                        content={`Êtes-vous sûr de vouloir ${
                            selectedAdministratorId !== null &&
                            allAdministrators.find(
                                (administrator) =>
                                    administrator.user_id === selectedAdministratorId,
                            )?.deleted_at === null
                                ? 'supprimer'
                                : 'restaurer'
                        } cet administrateur ?`}
                        onClose={handleClose}
                        deleteUrl={`/administrator/${selectedAdministratorId}`}
                        restoreUrl={`/administrator/restore/${selectedAdministratorId}`}
                        action={
                            selectedAdministratorId !== null &&
                            allAdministrators.find(
                                (administrator) =>
                                    administrator.user_id === selectedAdministratorId,
                            )?.deleted_at === null
                                ? 'delete'
                                : 'restore'
                        }
                    />
                </Dialog>

                <ModifyUserForm
                    open={openAdministratorForm}
                    onClose={handleClose}
                    validationSchema={validationSchemaAdministrator}
                    getUserByIdUrl={`/administrator/${selectedAdministratorId}`}
                    updateUserUrl={`/administrator/${selectedAdministratorId}`}
                    initialValues={admnistratorInitialValues}
                />
                <NewAdministratorForm open={openNewAdministratorForm} onClose={handleClose} />
            </div>
        </>
    );
}

export default UserDatagrid;
