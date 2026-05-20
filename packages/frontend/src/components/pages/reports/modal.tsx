import { useState } from 'react'
import { Log } from '../../../types';
//import PropTypes from 'prop-types'; // Pour valider les types de propriétés

interface IModalProps  {
  log: Log
}
const Modal = (log:Log) => {

  const[isOpen,setIsOpen]=useState(true) 
  const onClose=()=>{
    setIsOpen(false)
  }
  return ( isOpen &&
    <div style={styles.overlay}>
      
      <div style={styles.modal}>
        <h2>Détails sur le log</h2>
       
        <p><strong>Application :</strong> {log.application}</p>
        <p><strong>Source :</strong> {log.source}</p>
        <p><strong>Level :</strong> {log.level}</p>
        <p><strong>Timestamp :</strong> {log.timestamp}</p>
        <p><strong>Message :</strong> {log.message}</p>

        <button style={styles.closeButton} onClick={onClose}>
          Fermer
        </button>
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