import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Axios from '../../utils/axiosUrl';
import ValidationCounter from './ValidationCounter';

function ValidationBanner() {
    const { user } = useAuth();
    const ApiToken = user.token;

    const [numberOwnerToValidate, setNumberOwnerToValidate] = useState(0);
    const [numberEstablishmentToValidate, setNumberEstablishmentToValidate] = useState(0);
    const [numberEventToValidate, setNumberEventToValidate] = useState(0);

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
    async function getNumberEstablishmentToValidate() {
        try {
            const response = await Axios.api.get('/admin/establishment-to-validate', {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${ApiToken}`,
                },
            });
            setNumberEstablishmentToValidate(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }
    async function getNumberEventToValidate() {
        try {
            const response = await Axios.api.get('/admin/event-to-validate', {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${ApiToken}`,
                },
            });
            setNumberEventToValidate(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getNumberOwnerToValidate();
        getNumberEstablishmentToValidate();
        getNumberEventToValidate();
    }, []);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
            <ValidationCounter title="Professionnel(s) à valider :" value={numberOwnerToValidate} />
            <ValidationCounter
                title="Etablissement(s) à valider :"
                value={numberEstablishmentToValidate}
            />
            <ValidationCounter title="Evénement(s) à valider :" value={numberEventToValidate} />
        </Box>
    );
}

export default ValidationBanner;
