import { useEffect, useState /* useContext */ } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Axios from '../../utils/axiosUrl';
import { Box, Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import DoneIcon from '@mui/icons-material/Done';
import { green, red, orange, grey } from '@mui/material/colors';
import HeaderDatagrid from '../HeaderDatagrid';
import ModalDeleteRestore from '../ModalDeleteRestore';
import EstablishmentValidationForm from './EstablishmentValidationForm';
import { rowCommonDeletedAt } from '../Datagrid/datagridRessource';

function EstablishmentDatagrid() {
    const { user } = useAuth();
    const ApiToken = user.token;

    const [allEstablishments, setAllEstablishments] = useState([]);
    const [selectedEstablishment, setSelectedEstablishment] = useState(null);
    const [selectedEstablishmentId, setSelectedEstablishmentId] = useState(null);
    const [selectedOwnerId, setSelectedOwnerId] = useState(null);
    const [openEstablishment, setOpenEstablishment] = useState(false);
    const [openEstablishmentFormValidation, setOpenEstablishmentFormValidation] = useState(false);

    function handleClose() {
        setOpenEstablishment(false);
        setOpenEstablishmentFormValidation(false);
    }

    async function getEstablishments() {
        try {
            const response = await Axios.api.get('/establishments/list', {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${ApiToken}`,
                },
            });
            setAllEstablishments(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleCLickOpenEstablishmentVerification = (data) => {
        console.log(data);
        setSelectedEstablishment(data);
        setOpenEstablishmentFormValidation(true);
    };
    const handleClickOpenEstablishment = (id, owner_id) => {
        setSelectedEstablishmentId(id);
        setSelectedOwnerId(owner_id);
        setOpenEstablishment(true);
    };

    function getStatus(params) {
        switch (params.row.status.code) {
            case 'ESTABL_VALID':
                return 'Validé';

            case 'ESTABL_REFUSE':
                return 'Refusé';

            case 'ESTABL_PENDING':
                return 'En attente';

            default:
                return 'Erreur';
        }
    }

    const establishmentRows = allEstablishments.map((establishment) => ({
        key: establishment.establishment_id,
        id: establishment.establishment_id,
        owner_id: establishment.owner_id,
        trade_name: establishment.trade_name,
        siret: establishment.siret,
        phone: establishment.phone,
        email: establishment.email,
        address: establishment.address,
        postal_code: establishment.postal_code,
        city: establishment.city,
        status: JSON.parse(establishment.comment),
        deleted_at: establishment.deleted_at,
    }));

    const establishmentColumns = [
        { field: 'id', headerName: 'ID', flex: 0.1, headerAlign: 'center', align: 'center' },
        {
            field: 'trade_name',
            headerName: 'Raison sociale',
            flex: 0.2,
            headerAlign: 'center',
            align: 'center',
        },
        { field: 'siret', headerName: 'SIRET', flex: 0.2, headerAlign: 'center', align: 'center' },
        {
            field: 'phone',
            headerName: 'Téléphone',
            flex: 0.2,
            headerAlign: 'center',
            align: 'center',
        },
        { field: 'email', headerName: 'Email', flex: 0.2, headerAlign: 'center', align: 'center' },
        {
            field: 'address',
            headerName: 'Adresse',
            flex: 0.2,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'postal_code',
            headerName: 'Code postal',
            flex: 0.2,
            headerAlign: 'center',
            align: 'center',
        },
        { field: 'city', headerName: 'Ville', flex: 0.2, headerAlign: 'center', align: 'center' },
        {
            field: 'status',
            headerName: 'Statut',
            flex: 0.2,
            headerAlign: 'center',
            align: 'center',
            valueGetter: getStatus,
            renderCell: ({ row: { status } }) => {
                let backgroundColor = null;
                switch (status.code) {
                    case 'ESTABL_VALID':
                        backgroundColor = green[400];
                        break;
                    case 'ESTABL_PENDING':
                        backgroundColor = orange[400];
                        break;
                    case 'ESTABL_REFUSE':
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
            flex: 0.7,
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
                            handleCLickOpenEstablishmentVerification(params.row);
                        }}
                        startIcon={<DoneIcon />}
                        disabled={
                            params.row.deleted_at !== null ||
                            params.row.status.code === 'ESTABL_VALID'
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
                            handleClickOpenEstablishment(params.row.id, params.row.owner_id);
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
        getEstablishments();
    }, [openEstablishment, openEstablishmentFormValidation]);

    return (
        <div>
            <Box sx={{ height: 400, width: '100%' }}>
                <HeaderDatagrid title="Etablissements" />
                <DataGrid
                    rows={establishmentRows}
                    columns={establishmentColumns}
                    components={{ Toolbar: GridToolbar }}
                />
            </Box>
            <Dialog
                open={openEstablishment}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <ModalDeleteRestore
                    title="Suppression d'un établissement"
                    content={`Êtes-vous sûr de vouloir ${
                        selectedEstablishmentId !== null &&
                        allEstablishments.find(
                            (establishment) =>
                                establishment.establishment_id === selectedEstablishmentId,
                        )?.deleted_at === null
                            ? 'supprimer'
                            : 'restaurer'
                    } cet établissement ?`}
                    onClose={handleClose}
                    deleteUrl={`/pro/${selectedOwnerId}/establishment/${selectedEstablishmentId}`}
                    restoreUrl={`/pro/${selectedOwnerId}/establishment/${selectedEstablishmentId}/restore`}
                    action={
                        selectedEstablishmentId !== null &&
                        allEstablishments.find(
                            (establishment) =>
                                establishment.establishment_id === selectedEstablishmentId,
                        )?.deleted_at === null
                            ? 'delete'
                            : 'restore'
                    }
                />
            </Dialog>
            <EstablishmentValidationForm
                open={openEstablishmentFormValidation}
                selectedEstablishment={selectedEstablishment}
                onClose={handleClose}
            />
        </div>
    );
}

export default EstablishmentDatagrid;
