import { createContext, useState, useContext } from 'react';

const ModalContext = createContext();

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
};

export const ModalProvider = ({ children }) => {
  const [modals, setModals] = useState({});

  const openModal = (modalName, data = null) => {
    setModals(prev => ({ ...prev, [modalName]: { isOpen: true, data } }));
  };

  const closeModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: { isOpen: false, data: null } }));
  };

  const getModalState = (modalName) => {
    return modals[modalName] || { isOpen: false, data: null };
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, getModalState }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContext;
