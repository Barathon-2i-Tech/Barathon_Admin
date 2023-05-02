import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Box, Button, Dialog } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Axios from '../../utils/axiosUrl';
import HeaderDatagrid from '../HeaderDatagrid';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import EditIcon from '@mui/icons-material/Edit';
import ModalDeleteRestore from '../ModalDeleteRestore';
import { rowCommonDeletedAt } from '../Datagrid/datagridUtils';
import CategoryForm from './CategoryForm';
import * as Yup from 'yup';

function CategoryDatagrid() {
    const { user } = useAuth();
    const ApiToken = user.token;
    const [allCategories, setAllCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [openCategory, setOpenCategory] = useState(false);
    const [openCategoryForm, setOpenCategoryForm] = useState(false);

    async function getCategories() {
        try {
            const response = await Axios.api.get('/categories', {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${ApiToken}`,
                },
            });
            const parsedCategories = response.data.data.map((category) => {
                const parsedCategoryDetails = JSON.parse(category.category_details);
                return {
                    ...category,
                    category_details: parsedCategoryDetails,
                };
            });
            setAllCategories(parsedCategories);
        } catch (error) {
            console.log(error);
        }
    }

    const handleClickOpenCategory = (id) => {
        setSelectedCategoryId(id);
        setOpenCategory(true);
    };

    const handleClickOpenTagForm = (id) => {
        setSelectedCategoryId(id);
        setOpenCategoryForm(true);
    };

    function handleClose() {
        setOpenCategory(false);
        setOpenCategoryForm(false);
    }
    const categoryInitialValues = {
        label: '',
        sub_category: '',
        icon: '',
    };

    const validationSchemaCategory = Yup.object({
        label: Yup.string().required('Le nom de la catégorie est obligatoire'),
        sub_category: Yup.string().required('Requis'),
        icon: Yup.string(),
    });

    const categoryRows = allCategories.map((category) => ({
        key: category.category_id,
        id: category.category_id,
        label: category.category_details.label,
        sub_category: category.category_details.sub_category,
        icon: category.category_details.icon,
        deleted_at: category.deleted_at,
    }));

    const categoryColumns = [
        { field: 'id', headerName: 'ID', headerAlign: 'center', align: 'center', flex: 0.1 },
        {
            field: 'icon',
            headerName: 'Icone',
            headerAlign: 'center',
            align: 'center',
            flex: 0.2,
            renderCell: (params) => {
                return (
                    <div
                        style={{ width: '30px', height: '30px' }}
                        dangerouslySetInnerHTML={{
                            __html: `${params.value}`,
                        }}
                    />
                );
            },
        },
        { field: 'label', headerName: 'Nom de la catégorie', headerAlign: 'center', flex: 0.5 },
        {
            field: 'sub_category',
            headerName: 'Sous-categorie',
            headerAlign: 'center',
            flex: 0.5,
            renderCell: (params) => {
                if (params.value === 'All') {
                    return 'Etablissement et événement';
                } else if (params.value === 'Establishment') {
                    return 'Etablissement';
                } else if (params.value === 'Event') {
                    return 'Evénement';
                } else {
                    return '';
                }
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
                            handleClickOpenTagForm(params.row.id);
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
                            handleClickOpenCategory(params.row.id);
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
        getCategories();
    }, [openCategory, openCategoryForm]);

    return (
        <div>
            <Box sx={{ height: '70vh', width: '100%' }}>
                <HeaderDatagrid title="Categories" />
                <DataGrid
                    rows={categoryRows}
                    columns={categoryColumns}
                    components={{ Toolbar: GridToolbar }}
                />
            </Box>
            <Dialog
                open={openCategory}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <ModalDeleteRestore
                    title="Gestion des categories"
                    content={`Êtes-vous sûr de vouloir ${
                        selectedCategoryId !== null &&
                        allCategories.find(
                            (category) => category.category_id === selectedCategoryId,
                        )?.deleted_at === null
                            ? 'supprimer'
                            : 'restaurer'
                    } cette categorie ?`}
                    onClose={handleClose}
                    deleteUrl={`/category/${selectedCategoryId}`}
                    restoreUrl={`/category/restore/${selectedCategoryId}`}
                    action={
                        selectedCategoryId !== null &&
                        allCategories.find(
                            (category) => category.category_id === selectedCategoryId,
                        )?.deleted_at === null
                            ? 'delete'
                            : 'restore'
                    }
                />
            </Dialog>
            <CategoryForm
                open={openCategoryForm}
                onClose={handleClose}
                validationSchema={validationSchemaCategory}
                getCategoryrByIdUrl={`/category/${selectedCategoryId}`}
                updateCategoryUrl={`/category/${selectedCategoryId}`}
                initialValues={categoryInitialValues}
            />
        </div>
    );
}

export default CategoryDatagrid;
