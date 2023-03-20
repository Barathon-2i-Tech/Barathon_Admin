import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InfinityLoader from '../InfinityLoader';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ButtonGroup from '@mui/material/ButtonGroup';
import PropTypes from 'prop-types';

function ValidationForm(props) {
    const {
        open,
        onClose,
        dataFromDatabase,
        loading,
        dataToDisplay,
        handleSearch,
        onClickReject,
        onClickPending,
        onClickValidate,
        disableButton,
    } = props;

    return (
        <>
            <Dialog open={open} onClose={onClose} aria-labelledby="alert-dialog-title">
                <DialogTitle id="alert-dialog-title">{'Verification de la conformité'}</DialogTitle>
                {loading ? (
                    <DialogContent
                        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                        <InfinityLoader />
                    </DialogContent>
                ) : (
                    <DialogContent>
                        <List
                            sx={{ width: '100%', maxWidth: 800 }}
                            component="div"
                            aria-labelledby="nested-list-subheader"
                            subheader={
                                <ListSubheader
                                    component="div"
                                    id="nested-list-subheader"
                                    color="primary"
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    Données saisie par l&apos;utilisateur
                                </ListSubheader>
                            }
                        >
                            {dataFromDatabase}
                        </List>
                        {loading === false && (
                            <div>
                                <List
                                    sx={{
                                        width: '100%',
                                        maxWidth: 800,
                                    }}
                                    component="div"
                                    aria-labelledby="nested-list-subheader"
                                    subheader={
                                        <ListSubheader
                                            component="div"
                                            id="nested-list-subheader"
                                            color="primary"
                                            sx={{ fontWeight: 'bold' }}
                                        >
                                            Données provenant de l&apos;INSEE
                                        </ListSubheader>
                                    }
                                >
                                    {dataToDisplay()}
                                </List>
                            </div>
                        )}
                        <Button variant="contained" onClick={handleSearch}>
                            Plus d&lsquo;informations sur Societe.com
                        </Button>
                    </DialogContent>
                )}
                <DialogActions>
                    <Button onClick={onClose}>Annuler</Button>

                    <ButtonGroup variant="contained">
                        <Button color="error" onClick={onClickReject}>
                            Refusé
                        </Button>
                        <Button color="warning" disabled={disableButton} onClick={onClickPending}>
                            En attente
                        </Button>
                        <Button color="success" disabled={disableButton} onClick={onClickValidate}>
                            Valider
                        </Button>
                    </ButtonGroup>
                </DialogActions>
            </Dialog>
        </>
    );
}

ValidationForm.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    dataFromDatabase: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    dataToDisplay: PropTypes.func.isRequired,
    handleSearch: PropTypes.func.isRequired,
    onClickReject: PropTypes.func.isRequired,
    onClickPending: PropTypes.func.isRequired,
    onClickValidate: PropTypes.func.isRequired,
    disableButton: PropTypes.bool.isRequired,
};

export default ValidationForm;
