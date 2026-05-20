
import { Navigate,useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface AuthProviderProps{
    children:JSX.Element;
}

const ProtectedRoute=({children}:AuthProviderProps)=>{

    const {isAuthentificated}=useAuth();
    const location=useLocation();

    return isAuthentificated? children: <Navigate to="/login" state={{from:location}} replace />;
}

export default ProtectedRoute;