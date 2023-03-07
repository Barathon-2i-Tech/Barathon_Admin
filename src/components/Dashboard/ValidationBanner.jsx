import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Axios from '../../utils/axiosUrl';
import ValidationCounter from './ValidationCounter';

function ValidationBanner() {
    const { user } = useAuth();
    const ApiToken = user.token;

    const [numberOwnerToValidate, setNumberOwnerToValidate] = useState(0);

    async function getNumberOwnerToValidate() {
        try {
            const response = await Axios.api.get('/admin/pro-to-validate', {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${ApiToken}`,
                },
            });
            setNumberOwnerToValidate(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getNumberOwnerToValidate();
    }, []);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
            <ValidationCounter title="Professionnel(s) a valider :" value={numberOwnerToValidate} />
        </Box>
    );
}

export default ValidationBanner;
