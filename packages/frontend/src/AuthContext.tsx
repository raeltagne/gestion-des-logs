import React,{createContext,useState,useEffect, useContext} from "react";
import axios from "axios";

interface AuthContextType{
    isAuthentificated:boolean;
    user:any;
    login:(username:string,password:string)=>Promise <void>;
    logout: ()=>void
}
interface AuthProviderProps{
    children:any
}

const API_URL= 'http://localhost:3000/auth';
const AuthContext=createContext<AuthContextType|undefined>(undefined);
export const AuthProvider=({children}:AuthProviderProps)=>{
    const [isAuthentificated,setIsAuthentificated]=useState(false);
    const [user,setUser]=useState(null);

    useEffect(()=>{
        const token=localStorage.getItem('token');

        if(token){
            const validateToken=async ()=>{
                try {
                    const response=await axios.get(`${API_URL}/status`,{
                        headers:{
                            Authorization:`Bearer ${token}`,
                        },
                    });
                    const data= response.data;
                    if(data){
                        setIsAuthentificated(true);
                        setUser(data);
                    }else{
                        localStorage.removeItem('token');
                    }
                } catch (error)
                 {
                    console.error('echec de la validation du token ',error);
                    localStorage.removeItem('token');
                }
            };
            validateToken();
        }
    },[]);

    const login=async (username :string,password:string)=>{
        try {
            const response=await axios.post(`${API_URL}/login`,{username,password});
            const data=response.data;
            if (data) {
                localStorage.setItem('token',data.token);
                setIsAuthentificated(true);
                setUser(data.user);
                localStorage.setItem('token',data.token);
                localStorage.setItem('username',data.user.username);
                localStorage.setItem('role',data.user.role);
            }else{
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            console.error('Login failed',error);
            throw error;
        }
    };

    const logout=()=>{
        localStorage.removeItem('token');
        setIsAuthentificated(false);
        setUser(null);
        
    };

    return(
        <AuthContext.Provider value={{ isAuthentificated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth=():AuthContextType=>{
    const context=useContext(AuthContext);
    if(!context) throw new Error('useAuth must be used within in an AuthProvider');
    return context;
}
