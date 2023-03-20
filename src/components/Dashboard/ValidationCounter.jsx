import { Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { green, red } from '@mui/material/colors';
import PropTypes from 'prop-types';

function ValidationCounter({ title, value }) {
    const backgroundColor = value === 0 ? green[400] : red[400];

    return (
        <Card variant="outlined" sx={{ backgroundColor, mx: '10px' }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {title}
                </Typography>
                <Typography variant="h3" component="div" sx={{ textAlign: 'center' }}>
                    {value}
                </Typography>
            </CardContent>
        </Card>
    );
}

ValidationCounter.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
};

export default ValidationCounter;
