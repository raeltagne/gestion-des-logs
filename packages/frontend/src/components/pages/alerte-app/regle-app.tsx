import { useState,useEffect } from "react";
import axios from "axios";
import { RegleApp,Regle, Application } from "../../../types";
import { RegleAppTable } from "./regle-app-table";

export default function AlerteApp(application:Application){

const API_URL='http://localhost:3000';
const token=localStorage.getItem('token');
const [regles,setRegles]=useState<Regle[]>([]);
const [regleApps,setRegleApps]=useState<RegleApp[]>([]);
const[isLoading,setIsLoading]=useState(true);
const[error,setError]=useState<string | null>(null);

useEffect(()=>{
    const fetchApplications=async ()=>{
        const params={application:application.id};
    try{
        const responseRegle=await axios.get<Regle[]>(`${API_URL}/regle`,{
             headers:{
                Authorization:`Bearer ${token}`,
            },
        });

        setRegles(responseRegle.data);

        const responseRegleApp=await axios.get<RegleApp[]>(`${API_URL}/regle-app`,{
            headers:{
                Authorization:`Bearer ${token}`,
            },
            params,
        });

        setRegleApps(responseRegleApp.data);
    }catch(err){
        setError('Failed to fetch regles applications. Is the backend server running?');
        console.error(err);
    }finally{
        setIsLoading(false);
    }
};
fetchApplications();
},[])

    return(
        <div>
            {error && <p style={{color:'#e57373'}}>{error}  </p>}
            <RegleAppTable regles={regles} regleApps={regleApps} isLoading={isLoading}/>
        </div>
    );
}
