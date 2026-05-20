import { useState } from 'react'
import { User } from '../../../types';
//import PropTypes from 'prop-types'; // Pour valider les types de propriétés

interface IModalProps  {
  user: User
}
const Modal = ({user}:IModalProps) => {

  const[isOpen,setIsOpen]=useState(true) 
  const onClose=()=>{
    setIsOpen(false)
  }
  return ( isOpen &&
    <div style={styles.overlay}>
      
      <div style={styles.modal}>
        <h2>Voulez-vous vraiment supprimer l'utilisteur {user.name} ?</h2>
        <div>
            <button style={styles.closeButton} onClick={onClose}>
                Supprimer
            </button>
                
            <button style={styles.closeButton} onClick={onClose}>
                Fermer
            </button>
        </div>
      </div>
    </div>
  );
};

// Définit les styles pour la fenêtre modale
const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fond semi-transparent
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // Centrage de la fenêtre modale
    zIndex: 1000, // Priorité d'affichage
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px', // Coins arrondis
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Ombre pour donner de la profondeur
    width: '300px', // Largeur fixe
    textAlign: 'center' as const,
  },
  closeButton: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#007bff', // Couleur du bouton
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};
export default Modal;