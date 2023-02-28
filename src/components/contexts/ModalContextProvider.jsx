import { createContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

export const ModalContext = createContext();

const ModalContextProvider = ({ children }) => {
    const [openBarathonien, setOpenBarathonien] = useState(false);
    const [openOwner, setOpenOwner] = useState(false);
    const [openBarathonienForm, setOpenBarathonienForm] = useState(false);
    const [openOwnerForm, setOpenOwnerForm] = useState(false);

    const modalContextValue = useMemo(() => {
        return {
            openBarathonien,
            openOwner,
            openBarathonienForm,
            openOwnerForm,
            handleCloseModal: () => {
                setOpenBarathonien(false);
                setOpenOwner(false);
                setOpenBarathonienForm(false);
                setOpenOwnerForm(false);
            },
            openBarathonienModal: () => setOpenBarathonien(true),
            openBarathonienFormModal: () => setOpenBarathonienForm(true),
            openOwnerModal: () => setOpenOwner(true),
            openOwnerFormModal: () => setOpenOwnerForm(true),
        };
    }, [openBarathonien, openOwner, openBarathonienForm, openOwnerForm]);

    return <ModalContext.Provider value={modalContextValue}>{children}</ModalContext.Provider>;
};

ModalContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
export default ModalContextProvider;
