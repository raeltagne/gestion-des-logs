import axios from "axios";
import { useState,useEffect } from "react";
import { Bar, Line,Pie } from "react-chartjs-2";
import moment, { max, Moment } from "moment";
import StatCard from "./stats";
import { Log ,Application} from "../../../types";
import { GraphChart} from "../reports/Barchart2";
import './statistic.css';
import Applications from "../applications/applications";

const API_URL = 'http://localhost:3000';
const token =localStorage.getItem('token');



export default function Statistics() {

    const [logs, setLogs] = useState<Log[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tblNbrError,setTblNbrError]=useState<number[]>([]);
    const [tblNbrWarning,setTblNbrWarning]=useState<number[]>([]);
    const [tblNbrInfo,setTblNbrInfo]=useState<number[]>([]);
    const [beginDate,setBeginDate]=useState<Moment>(moment().subtract(30,'day'));
    const [endDate,setEndDate]=useState<Moment>(moment());
    const [maxDate,setMaxDate]=useState<Moment>();
    const [minDate,setMinDate]=useState<Moment>();
    const [labelDate,setLabelDate]=useState<string[]>([]);
    const [atDate,setAtDate]=useState<string>(moment().format('YYYY-MM-DD'));
    const [fromDate, setFromDate] = useState<string>((moment().subtract(30,'day')).format('YYYY-MM-DD'));
    const [dataLogByApp, setDataLogByApp]= useState<any>();
    const [dataLogByDay, setDataLogByDay]= useState<any>();

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setError(null);
                const params ={};
                const response = await axios.get<Log[]>(`${API_URL}/logs`, { 
                    headers:{
                        Authorization:`Bearer ${token}`,
                    },
                 });
                setLogs(response.data);

                const responseApp = await axios.get<Application[]>(`${API_URL}/applications`, { 
                    headers:{
                        Authorization:`Bearer ${token}`,
                    },
                 });
                 setApplications(responseApp.data);

            } catch (error) {
                setError('Failed to fetch logs. Is the backend server running?');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLogs(); // Initial fetch
        

    }, []);

    useEffect(() =>{
        if(logs.length>0){

            setDataLogByApp(getDataLogsByApp(logs,applications,beginDate,endDate));
            setDataLogByDay(getDataLogsByDay(logs,beginDate,endDate));
        }
     },[logs,beginDate,endDate,applications]);

    useEffect(() =>{
        
    setBeginDate(moment(fromDate));
    setEndDate(moment(atDate));
    setDataLogByApp(getDataLogsByApp(logs,applications,beginDate,endDate));
    setDataLogByDay(getDataLogsByDay(logs,beginDate,endDate))
    
    },[logs,fromDate,atDate]);


    if (isLoading) {
        return <div style={{marginTop:150}}>Loading logs...</div>
    };

    if(logs.length==0){
        return <div style={{marginTop:150}}>No logs found</div>
    }

  return (
        <div  style={{ width: '90%', fontFamily: 'sans-serif',marginTop:600 }}>
            <h1 style={{color:'green', alignItems:'center', textAlign:'center'}}>Consultez une évaluation statistique sur vos applications</h1>
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                
                <div> 
                    <label htmlFor="fromDate" style={{ marginRight: '10px' }}>From:</label>
                    <input 
                        id="fromDate"
                        type="date"
                        value={fromDate} 
                        onChange={(e) => setFromDate(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555', background: '#333', color: '#fff' }}
                    />
                </div>
                <div>
                    <label htmlFor="atDate" style={{ marginRight: '10px' }}>At:</label>
                    <input 
                        id="atDate"
                        type="date"
                        value={atDate} 
                        onChange={(e) => setAtDate(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555', background: '#333', color: '#fff' }}
                    />
                </div>
            </div>
            <div>
                <GraphChart type='pie' label={dataLogByApp.labels} dataset={dataLogByApp.datasets} ></GraphChart>
                <GraphChart type='line' label={dataLogByDay.labels} dataset={dataLogByDay.datasets} ></GraphChart>
            </div>
        </div>
    );
};

//fonction de formation des données pour la stat de log par application
 function getDataLogsByApp(logs:Log[],applications:Application[],minDate:Moment,maxDate:Moment) {
    if(minDate.isAfter(maxDate)){
        let date=minDate;
        minDate=maxDate;
        maxDate=date;
    }

    const filteredLogs=logs.filter((log)=>moment(log.timestamp).isBetween(minDate,maxDate));

    const appCounts:Record<string,number>={};
    applications.forEach(app => {
        appCounts[app.name.toUpperCase()]=0;
        filteredLogs.forEach(log => {
            if(log.application===app.id)
            {
                appCounts[app.name.toUpperCase()]=appCounts[app.name.toUpperCase()] + 1;
            }
        });
    });
    const labels=applications.map(app=>app.name.toUpperCase());//Object.keys(appCounts);
    const data=labels.map(app=>appCounts[app]);
   
    const dataApp = {
  labels: labels, // ex: ['App1', 'App2', 'App3']
  datasets: [{
    label: 'Répartition des logs par application',
    data: data, // ex: [120, 90, 60]
    backgroundColor: [
      '#22c55e', // vert
      '#a855f7', // violet
      '#38bdf8', // bleu clair
      '#facc15', // jaune
      '#ef4444', // rouge
      '#f97316'  // orange
    ],
    borderColor: '#0f172a',
    borderWidth: 2
  }]
};

    return dataApp;
}

// fonction de formation des données pour la stat de logs par jour
function getDataLogsByDay(logs:Log[],minDate:Moment,maxDate:Moment) {
    if(minDate.isAfter(maxDate)){
        let date=minDate;
        minDate=maxDate;
        maxDate=date;
    }
    const filteredLogs=logs.filter((log)=>moment(log.timestamp).isBetween(minDate,maxDate) );
    //liste des dates inclus
    let distinctDate:string[]=[];
    let date=moment(minDate);
    do {
        distinctDate.push(date.format('YYYY/MM/DD'));
        date.add(1,'day');
    } while (!date.isAfter(maxDate));

    
    let data:number[]=distinctDate.map(d =>
        filteredLogs.filter((log)=>moment(log.timestamp).format('YYYY/MM/DD')===d
        ).length
    );
    const dataDay={
        labels: distinctDate,
        datasets: [{
            label:'log par jour',
            data: data,
            borderColor: '#00bcd4',
            backgroundColor: 'rgba(0,188,212,0.1)',
            fill: true,
            tension: 0.3
        }],
    };
    return dataDay;
}