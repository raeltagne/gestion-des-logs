
import {useState } from 'react';
import './sign-in.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../AuthContext';


const API_URL= 'http://localhost:3000/auth';

 function sign(){
  const navigate=useNavigate();
 const {login}=useAuth();
  const [password,setPassword]=useState('');
  const [username,setUsername]=useState('');
  const [token,setToken]=useState('');
  const[status,setStatus]=useState<string | null>(null);

const handleLogin=async (e)=>{
  e.preventDefault();
  try {
    await login(username,password);
    
    ///const res=await axios.post(`${API_URL}/login`,{username,password});
    //setToken(res.data.token);
    navigate('/');
  } catch (error) {
    alert('echec de la connexion');
  }
};

const checkStatus= async ()=>{
  try {
    const res=await axios.get(`${API_URL}/status`,{
      headers:{
        Authorization:`Bearer ${token}`,
      },
    });
    setStatus(res.data);
  } catch (error) {
    setStatus('non authentifié');
  }
};


  return (
    <div style={{marginTop:100}}>
      <h1>Please Sign-in</h1> 
      <form className='form-signin' onSubmit={handleLogin}>
        <div>
          <p>Username</p>
          <input type="text" value={username} onChange={(e)=> setUsername(e.target.value)}/>
          </div>
          <div>
          <p>Password</p>
          <input type="password" value={password} onChange={(e)=> setPassword(e.target.value)}/>
        </div>
        <div>
          <button className='signin-button' type='submit'>Sign in</button>
        </div>
      </form>
          
    </div>
  );
}
export default sign;