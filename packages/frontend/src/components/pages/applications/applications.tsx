import { useState,useEffect } from "react";
import axios from "axios";
import { Application } from "../../../types";
import {ApplicationTable } from "./applicationTable";

export default function Applications(){

    const API_URL='http://localhost:3000';
    const token=localStorage.getItem('token');

const [applications,setApplications]=useState<Application[]>([]);
const [filteredApplications,setFilteredApplications]=useState<Application[]>([]);
const[isLoading,setIsLoading]=useState(true);
const[error,setError]=useState<string | null>(null);
const[searchTerm,setSearchTerm] =useState('');

useEffect(()=>{
    const fetchApplications=async ()=>{
    try{
        const response=await axios.get<Application[]>(`${API_URL}/applications`,{
             headers:{
        Authorization:`Bearer ${token}`,
      },
        }
        );

        setApplications(response.data);
    }catch(err){
        setError('Failed to fetch applications. Is the backend server running?');
        console.error(err);
    }finally{
        setIsLoading(false);
    }
};
fetchApplications();
},[])



    return(
        <div style={{marginTop:100}}>
            {error && <p style={{color:'#e57373'}}>{error}  </p>}
            <ApplicationTable applications={applications} isLoading={isLoading}/>
        </div>
    );
}
