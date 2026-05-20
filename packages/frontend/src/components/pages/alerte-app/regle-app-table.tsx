import { RegleApp,Regle } from '../../../types';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface RegleAppTableProps {
  regles:Regle[];
  regleApps: RegleApp[];
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



export function RegleAppTable({ regles,regleApps, isLoading }: RegleAppTableProps) {
  const API_URL='http://localhost:3000';
const token=localStorage.getItem('token');
  const [selectedRegle,setSelectedRegle]=useState<Regle>();
  const [isSelected,setIsSelected]=useState(false);
  const [checkboxEtat,setCheckboxEtat]=useState({});
const [filteredRegle, setFilteredRegle] = useState<Regle[]>([]);
/*
const handleCheckboxClick=(regle:Regle)  =>{
  setSelectedRegle(regle);
}
const checkedRow=(regle:Regle,isSelect:boolean)  =>{
  return regleApps.find(reg=>reg.regle===regle.id) && isSelect?true:false;
}*/

/*useEffect(() => {
    const etatInitial={};
    regles.forEach((element)=> {
      etatInitial[element.id]=regleApps.some((selected)=>selected.regle===element.id);
    });
    setCheckboxEtat(etatInitial);
    }, [regles,regleApps]);
*/const regleState:Record<string,boolean>={};
let listChange:RegleApp[];
    const handleCheckboxChange=(event)  =>{
      setCheckboxEtat((preEtat)=> ({
        ...preEtat,
      }));
      regleState [event.target.name]=event.target.checked
    };
    
    const handleValidation= async (listChange:RegleApp[])  =>{
      for (const element of listChange) {
        const body={
          "application": element.application,
          "regle": element.regle,  
          "etat": element.etat,
        };
        try {
          await axios.post(`${API_URL}/regle-app/update/${element.id}`,body,{
             headers:{
        Authorization:`Bearer ${token}`,
      },
        });
        } catch (error) {
          console.error("Erreur lors de la mise ajour de la regle ",error);
        }
        
      };
      
      };

   useEffect(() => {
    const tblId=regleApps.map(regleApp=> regleApp.application);
      const results = regles.filter((regle:Regle) =>
        tblId.includes(regle.id)
      );
      setFilteredRegle(results);
    }, [regles,regleApps]);
  
  if (isLoading) {
    return <div>Loading regles...</div>;
  }

  if (regles.length === 0) {
    return <div>No regles found.</div>;
  }

  return (
    <div>
      
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}></th>
          <th style={styles.th}>Regle</th>
        </tr>
      </thead>
      <tbody>
        {regles.map((regle) => (
          <tr>
            <td style={{...styles.td,}}>
              <input
               type="checkbox" 
               name={regle.id}
               onChange={handleCheckboxChange}
               />
            </td>
            <td style={{...styles.td,}}>
              {regle.description.toUpperCase()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    </div>
  );
} 