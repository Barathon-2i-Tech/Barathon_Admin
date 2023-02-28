import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import PropTypes from 'prop-types';
import Axios from '../utils/axiosUrl';
import { Button } from '@mui/material';
import { useFormik } from 'formik';
import Grid from '@mui/material/Grid';
import { Toaster } from 'react-hot-toast';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InfinityLoader from './InfinityLoader';
import BarathonienFieldForm from './Form/BarathonienFieldForm';

function ModifyUserForm({ open, handleClose, validationSchema, handleModify, url, initialValues }) {
  const { user } = useAuth();
  const ApiToken = user.token;
  const [loading, setLoading] = useState(true);

  const formik = useFormik({
      initialValues: initialValues,
      enableReinitialize: true,
      validationSchema,
      onSubmit: (values) => handleModify(values),
  });



  async function getUserById() {
      try {
          const response = await Axios.api.get(`${url}`, {
              headers: {
                  accept: 'application/vnd.api+json',
                  'Content-Type': 'application/vnd.api+json',
                  Authorization: `Bearer ${ApiToken}`,
              },
          });
          formik.setValues(response.data.data[0]);
          setLoading(false);
      } catch (error) {
          console.log(error);
      }
  }
  useEffect(() => {
      if (open) {
        getUserById();
      }
  }, [open]);

  return (
      <>
          <Toaster />
          <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title">
              <DialogTitle id="alert-dialog-title">{"Modification de l'utilisateur"}</DialogTitle>
              {loading ? (
                  <DialogContent>
                      <InfinityLoader />
                  </DialogContent>
              ) : (
                  <DialogContent>
                      <form onSubmit={formik.handleSubmit}>
                          <Grid container spacing={2} sx={{ mt: 1 }}>
                            <BarathonienFieldForm formik={formik} />
                          </Grid>
                      </form>
                  </DialogContent>
              )}
              <DialogActions>
                  <Button onClick={handleClose} variant="contained" color="error">
                      Annuler
                  </Button>
                  <Button
                      type="submit"
                      onClick={formik.handleSubmit}
                      variant="contained"
                      color="success"
                  >
                      Modifier
                  </Button>
              </DialogActions>
          </Dialog>
      </>
  );
}

ModifyUserForm.propTypes = {
    userId: PropTypes.number,
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    validationSchema: PropTypes.object.isRequired,
    handleModify: PropTypes.func.isRequired,
    url: PropTypes.string.isRequired,
    initialValues: PropTypes.object.isRequired,
};

export default ModifyUserForm