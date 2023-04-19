import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Box, Button, Dialog } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Axios from '../../utils/axiosUrl';
import HeaderDatagrid from '../HeaderDatagrid';
import DeleteIcon from '@mui/icons-material/Delete';
import ModalDeleteRestore from '../ModalDeleteRestore';

function CategoryDatagrid() {
    const { user } = useAuth();
    const ApiToken = user.token;
    const [allCategories, setAllCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [openCategory, setOpenCategory] = useState(false);

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
    function handleClose() {
        setOpenCategory(false);
    }

    const categoryRows = allCategories.map((category) => ({
        key: category.category_id,
        id: category.category_id,
        name: category.category_details.label,
        sub_category: category.category_details.sub_category,
        icon: category.category_details.icon,
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
        { field: 'name', headerName: 'Nom de la catégorie', headerAlign: 'center', flex: 0.5 },
        { field: 'sub_category', headerName: 'Sous-categorie', headerAlign: 'center', flex: 0.5 },
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
                        sx={{ px: '20px' }}
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => {
                            handleClickOpenCategory(params.row.id);
                        }}
                        startIcon={<DeleteIcon />}
                    >
                        Supprimer
                    </Button>
                </>
            ),
        },
    ];

    useEffect(() => {
        getCategories();
    }, [openCategory]);

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
                    onClose={handleClose}
                    title="Suppression de la catégorie"
                    content="Voulez-vous vraiment supprimer cette catégorie ?"
                    action="delete"
                    deleteUrl={`/category/${selectedCategoryId}`}
                />
            </Dialog>
        </div>
    );
}

export default CategoryDatagrid;
