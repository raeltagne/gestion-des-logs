import React, { useState,useEffect } from "react";
import { User } from "../../../types";
import Modal from "./Modal";


interface UserTableProps{
    users:User[];
    isLoading:boolean;
}

const style={
    table:{
        width:'100%',
        bordercollapse:'separate',
        borderSpacing:'0',
        borderRadius:'8px',
        overflow:'hidden',
        boxShadow:'0 4px 16px rgba(0,0,0,0.5)',
        backgroundColor:'#1e293b',
        color:'#f1f5f9',
    }as React.CSSProperties,

    th:{
        borderBottom:'1px solid #475569',
        padding:'14px 16px',
        textAlign:'left',
        backgroundColor:'#334157',
        color:'#e2e8f0',
        fontWeight:'600',
        textTransform:'uppercase',
        fontSize:'0.9rem',
    }as React.CSSProperties,

    td:{
        borderBottom:'1px solid #334157',
        padding:'14px 16px',
        color:'#cbd5e1',
    }as React.CSSProperties,
};

export function UserTable({users, isLoading}:UserTableProps){

    const[selectedUser,setSelectedUser]=useState<User>();
    const [searchTerm,setSearchTerm]=useState('');
    const [filteredUsers,setFilteredUsers]=useState<User[]>();

    const handleRowClick=(user:User)=>{
        setSelectedUser(user);
    }

    useEffect(()=>{
        const results=users.filter((user:User)=>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.surname.toLowerCase().includes(searchTerm.toLowerCase()));
        setFilteredUsers(results);
    },[searchTerm,users]);

    if(isLoading){
        return <div>Loading users...</div>;
    }

    if(users.length==0){
        return <div>No users found</div>;
    }

    return(
        <div>
            <div>
                <input 
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e)=> setSearchTerm(e.target.value)}
                style={{marginBottom:'10px',  padding:'8px',  borderRadius:'4px',  border:'1px solid #555',  background:'#333',  color:'#fff'}}/>
            </div>
            <table style={style.table}>
                <thead>
                    <th style={style.th}>name</th>
                    <th style={style.th}>surname</th>
                    <th style={style.th}>number</th>
                    <th style={style.th}>email</th>
                    <th style={style.th}>role</th>
                    <th style={style.th}>actions</th>
                </thead>
                <tbody>
                    {filteredUsers?.map((user,index)=>(
                        <tr key={index}  
                        onClick={()=>handleRowClick(user)}
                        style={{
                            cursor:'pointer',
                            backgroundColor: selectedUser?.name===user?.name ? '#f0f8ff':'white'
                        }}>
                            <td style={style.td}>{user.name}</td>
                            <td style={style.td}>{user.surname}</td>
                            <td style={style.td}>{user.number}</td>
                            <td style={style.td}>{user.email}</td>
                            <td style={style.td}>{user.role}</td>
                            <td style={style.td}>
                                <button style={{backgroundColor:'yellow'}}>Edit</button>|
                                <button onClick={()=>handleRowClick(user)} style={{backgroundColor:'red'}}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedUser && (<Modal user={selectedUser}/>)}
        </div>
    );

}