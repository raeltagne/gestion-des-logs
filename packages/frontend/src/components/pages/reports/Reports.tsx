import { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import { Log ,Application} from '../../../types';
import { LogTable } from './LogTable';
import { GraphChart } from './Barchart';
import { dataSets } from './Barchart';
import './report.css';

const API_URL = 'http://localhost:3000';
const token=localStorage.getItem('token');

export default function(){
  const [applications, setApplications] = useState<Application[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState('');
  const [applicationFilter, setapplicationFilter] = useState('');
  const [periodFilter, setperiodFilter] = useState(7);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [labelDate,setLabelDate]=useState<string[]>([]);
  const [tblNbrError,setTblNbrError]=useState<number[]>([]);
  const [tblNbrWarning,setTblNbrWarning]=useState<number[]>([]);
  const [tblNbrInfo,setTblNbrInfo]=useState<number[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Don't set loading to true for auto-refresh, to avoid UI flicker
        if (!autoRefresh) {
          setIsLoading(true);
        }
        setError(null);
        const params = levelFilter ? {level: levelFilter } : {};
        const responseLogs = await axios.get<Log[]>(`${API_URL}/logs`, { 
          headers:{
            Authorization:`Bearer ${token}`,
          },
          params 
        });
        setLogs(responseLogs.data);
        const responseApps = await axios.get<Application[]>(`${API_URL}/applications`,{
          headers:{
        Authorization:`Bearer ${token}`,
      },
        });
        setApplications([ ...new Set(responseApps.data)]);
      } catch (err) {
        const message= err.responseLogs?.data?.message || err.responseApps?.data?.message|| 'Failed to fetch logs. Is the backend server running?';
        setError(message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs(); // Initial fetch
    if (autoRefresh) {
      const intervalId = setInterval(fetchLogs, 3000); // Refresh every 3 seconds
      return () => clearInterval(intervalId); // Cleanup on component unmount or when autoRefresh is turned off
    }
  }, [levelFilter, autoRefresh]);

  useEffect(()=>{
    let tblDate:string[]=[];
      for (let index = periodFilter-1; index >= 0; index--) {
        let date=moment();
        date.subtract(index,'day');
        tblDate.push(date.format('DD-MM-YYYY'));
      }
      setLabelDate(tblDate);
        let maxDate=moment();
        let minDate=moment();
        
        minDate.subtract(periodFilter+1,'day');
        let results=logs ;
        if(applicationFilter!="")
          results=logs.filter((log)=>log.application===applicationFilter);
        setFilteredLogs(results.filter((log)=>moment(log.timestamp).isBetween(minDate,maxDate)));
    },[logs,applicationFilter,periodFilter]);


  useEffect(() =>{

    let tblError:number[]=[];
    let tblInfo:number[]=[];
    let tblWarning:number[]=[];
    for (let index = 0; index < labelDate.length; index++) {
      const i = filteredLogs.filter((log)=> moment(log.timestamp).format('DD-MM-YYYY')==labelDate[index]&& log.level.toLowerCase()==="error").length;
      tblError.push(i)
       const j = filteredLogs.filter((log)=> moment(log.timestamp).format('DD-MM-YYYY')==labelDate[index]&& log.level.toLowerCase()==="info").length;
      tblInfo.push(j)
       const k = filteredLogs.filter((log)=> moment(log.timestamp).format('DD-MM-YYYY')==labelDate[index]&& log.level.toLowerCase()==="warning").length;
      tblWarning.push(k)
      
    }

    setTblNbrError(tblError);
    setTblNbrInfo(tblInfo);
    setTblNbrWarning(tblWarning);

  },[labelDate,filteredLogs]);

  let datasetList:dataSets[]=[
    {
      label:"Error",
      data:tblNbrError,
      backgroundColor:'#f87171',
      borderColor:'#f87171',
      tension: 0.3
    },
    {
      label:"Warning",
      data:tblNbrWarning,
      backgroundColor:'#facc15',
      borderColor:'#facc15',
      tension: 0.3
    },
    {
      label:"Info",
      data:tblNbrInfo,
      backgroundColor:'#38bdf8',
      borderColor:'#38bdf8',
      tension: 0.3
    }
  ];

 
 return (
     
    <div>
      <h1 style={{marginTop:350}}>Freemo Logs Dashboard</h1>
      <div className='dashboard-header'>
      <GraphChart type='line' label={labelDate} dataset={datasetList} ></GraphChart>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div>
          <label htmlFor="level-filter" style={{ marginRight: '10px' }}>Filter by level:</label>
          <select 
            id="level-filter"
            value={levelFilter} 
            onChange={(e) => setLevelFilter(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555', background: '#333', color: '#fff' }}
          >
            <option value="">All</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>
        <div>
          <label htmlFor="application-filter" style={{ marginRight: '10px' }}>Filter by application:</label>
          <select 
            id="application-filter"
            value={applicationFilter} 
            onChange={(e) => setapplicationFilter(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555', background: '#333', color: '#fff' }}
          >
            <option value="">All</option>
            {applications.map(app =>(
              <option value={app.id}>{app.name.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="period-filter" style={{ marginRight: '10px' }}>Filter by period:</label>
          <select 
            id="period-filter"
            value={periodFilter} 
            onChange={(e) => setperiodFilter(parseInt(e.target.value,10))}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555', background: '#333', color: '#fff' }}
          >
            <option value='7'>last 7 days</option>
            <option value='30'>last 30 days</option>
          </select>
        </div>
        
        <div>
          <input 
            type="checkbox" 
            id="auto-refresh"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
          />
          <label htmlFor="auto-refresh" style={{ marginLeft: '8px' }}>Auto-refresh</label>
        </div>
      </div>
</div>

      {error && <p style={{ color: '#e57373' }}>{error}</p>}
      <div className='log-table-container'>
      <LogTable  logs={filteredLogs} isLoading={isLoading} applications={applications}/>
      {isLoading && <div className='spinner'>chargement...</div>}
     </div>
</div>
  );

 
}