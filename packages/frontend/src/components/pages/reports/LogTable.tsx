import { Log ,Application} from '../../../types';
import { useEffect, useState } from 'react';
import Modal from './modal';

interface LogTableProps {
  logs: Log[];
  isLoading: boolean;
  applications:Application[];
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

  levelCell: (level: string) => {
    const colors: { [key: string]: string } = {
     /* error: '#e57373',
      warning: '#ffb74d',
      info: '#64b5f6',*/

      error: '#f87171',
      warning: '#facc15',
      info: '#38bdf8',
      
    };
    return {
      color: colors[level] || '#94a3b8',
      fontWeight: 'bold',
      textTransform:'uppercase',
      letterSpacing:'0.5px',
    } as React.CSSProperties;
  },
};



export function LogTable({ logs, isLoading,applications }: LogTableProps) {
  
const [selectedLog,setSelectedLog]=useState<Log>();
const [searchTerm, setSearchTerm] = useState('');
const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);

const handleRowClick=(log:Log)  =>{
  setSelectedLog(log);
}

   useEffect(() => {
      const results = logs.filter((log:Log) =>
        log.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLogs(results);
    }, [searchTerm,logs]);
  
  if (isLoading) {
    return <div>Loading logs...</div>;
  }

  if (logs.length === 0) {
    return <div>No logs found.</div>;
  }

  return (
    <div>
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
          <th style={styles.th}>Level</th>
          <th style={styles.th}>Message</th>
          <th style={styles.th}>Application</th>
          <th style={styles.th}>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {filteredLogs.map((log, index) => (
          <tr key={index} onClick={() => handleRowClick(log)}   // Définition de l'action de clic
          style={{
            cursor: 'pointer',
            backgroundColor: selectedLog?.timestamp === log.timestamp ? '#f0f8ff' : 'white' // Met en surbrillance la ligne sélectionnée
          }}>
            <td style={{...styles.td, ...styles.levelCell(log.level)}}>
              {log.level.toUpperCase()}
            </td>
            <td style={styles.td}>{log.message}</td>
            <td style={styles.td}>{(applications.filter(app=>app.id===log.application).map(app=>app.name))}</td>
            <td style={styles.td}>{log.timestamp}</td>
          </tr>
        ))}
      </tbody>
    </table>

    {selectedLog && (<Modal {...selectedLog}/>)}
    </div>
  );
} 