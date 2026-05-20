import { Application } from '../../../types';
import { useEffect, useState } from 'react';
import AlerteApp from '../alerte-app/regle-app';

interface ApplicationTableProps {
  applications: Application[];
  isLoading: boolean;
}

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing:'0',
    borderRadius:'8px',
    overflow:'hidden',
    boxShadow:'0 4px 16px rgba(0,0,0,0.05)',
    backgroundColor:'#1e293b',
    color: '#f1f5f9',
  } as React.CSSProperties,

  th: {
    borderBottom: '1px solid #475569',
    padding: '14px 16px',
    textAlign: 'left',
    backgroundColor: '#334157',
     color: '#e2e8f0',
     fontWeight:600,
     textTransform:'uppercase',
     fontSize:'0.9rem',
  } as React.CSSProperties,

  td: {
    borderBottom: '1px solid #334155',
    padding: '14px 16px',
    color:'#cbd5e1',
  } as React.CSSProperties,

};



export function ApplicationTable({ applications, isLoading }: ApplicationTableProps) {
  
const [selectedApplication,setSelectedApplication]=useState<Application| null>(null);
const [searchTerm, setSearchTerm] = useState('');
const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
const [visible, setVisible] = useState(false);

const handleRowClick=(application?:Application)  =>{
  setSelectedApplication(application  || null);
  setVisible(!visible);
}

   useEffect(() => {
      const results = applications.filter((application:Application) =>
        application.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredApplications(results);
    }, [searchTerm,applications]);
  
  if (isLoading) {
    return <div>Loading applications...</div>;
  }

  if (applications.length === 0) {
    return <div>No applications found.</div>;
  }

  return (
    <div>
      <div id='application-list' style={{display:visible? 'none':'block'}}>
        <div >
        <input
        type='text'
        placeholder="Search..."
        itemID='seach'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '10px',  padding: '8px', borderRadius: '4px', border: '1px solid #555', background: '#333', color: '#fff' }}
      />
      </div>
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Id</th>
          <th style={styles.th}>Application</th>
        </tr>
      </thead>
      <tbody>
        {filteredApplications.map((application, index) => (
          <tr key={index} onClick={() => handleRowClick(application)
            
          }   // Définition de l'action de clic
          style={{
            cursor: 'pointer',
            backgroundColor: selectedApplication?.id === application.id ? '#f0f8ff' : 'white' // Met en surbrillance la ligne sélectionnée
          }}>
             <td style={{...styles.td,}}>{application.id}</td>
            <td style={{...styles.td,}}>
              {application.name.toUpperCase()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    {selectedApplication && visible && (
    <div>
      <h2 style={{}}>Liste des alertes possible pour l'application</h2>
      <h3>veuillez selectionner pour en ajouter ou retirer et validez</h3>
      <AlerteApp {...selectedApplication}/>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '20px' , marginRight:'1px'}}>
        <div>
          <button
          style={{ marginBottom: '10px',  padding: '8px', borderRadius: '4px', border: '1px solid #555', background: '#333', color: '#fff' }}
          >
            valider
          </button>
        </div>
        <div>
          <button onClick={() => handleRowClick(selectedApplication)}
          style={{ marginBottom: '10px',  padding: '8px', borderRadius: '4px', border: '1px solid #555', background: '#333', color: '#fff' }}
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  )}
    
    </div>
  );
} 