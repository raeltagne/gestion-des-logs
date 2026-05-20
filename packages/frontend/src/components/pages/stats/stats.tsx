import React from "react";
import './stats.css'

interface StatCardProps{
    title:string;
    description:string;
    children:React.ReactNode;
}

const StatCard:React.FC<StatCardProps>=({title,description,children})=>{
    
    return(
        <div className="stat-card">
            <h2 className="stat-title">{title}</h2>
            <p className="stat-description">{description}</p>
            <div className="stat-chart">{children}</div>
        </div>
    );
};

export default StatCard;