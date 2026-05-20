import { useState,useEffect } from "react";
import axios from "axios";
import { User } from "../../../types";
import { UserTable } from "./UserTable";

export default function Users(){

    const API_URL='http://localhost:3000';
    const token =localStorage.getItem('token');

const [users,setUsers]=useState<User[]>([]);
const [filteredUsers,setFilteredUsers]=useState<User[]>([]);
const[isLoading,setIsLoading]=useState(true);
const[error,setError]=useState<string | null>(null);
const[searchTerm,setSearchTerm] =useState('');

useEffect(()=>{
    const fetchUsers=async ()=>{
    try{
        const response=await axios.get<User[]>(`${API_URL}/users`,{
            headers:{
                Authorization:`Bearer ${token}`,
            },
        });
        setUsers(response.data);
    }catch(err){
        setError('Failed to fetch users. Is the backend server running?');
        console.error(err);
    }finally{
        setIsLoading(false);
    }
};
fetchUsers();
},[])



    return(
        <div style={{marginTop:100}}>
            {error && <p style={{color:'#e57373'}}>{error}  </p>}
            <UserTable users={users} isLoading={isLoading}/>
        </div>
    );
}