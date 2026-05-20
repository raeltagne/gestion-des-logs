import { useEffect,useRef } from "react";
import { Chart } from "chart.js/auto";
import { Pie,Line ,Bar} from "react-chartjs-2";

 export type dataSets={
  label:string;
  data:number[];
  backgroundColor:string;
  borderColor:string
};

type dataProps={
  type:string;
  label:string[];
  dataset:dataSets[];
};


const options={
  maintainAspectRatio: false ,
};

const containerStyle: React.CSSProperties = {
    maxWidth: '500px',
    margin: '2rem auto',
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
};

export function GraphChart({type,label, dataset}:dataProps){
const chartRef=useRef<HTMLCanvasElement>(null);

useEffect(()=>{
    let chart:Chart|null=null;
    if(chartRef.current){
      chart=new Chart(chartRef.current, {
    type: type as any,
    data: {
      labels: label,
      datasets: dataset ,
      
    },
     options : {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#f8fafc',
        font: {
          size: 14,
          family: 'Segoe UI'
        }
      }
    },
    tooltip: {
      backgroundColor: '#1e293b',
      titleColor: '#38bdf8',
      bodyColor: '#f8fafc'
    }
  }
}

    /*options: {
      plugins: {
        legend: {
          display: true,
          
        },
        tooltip: {
          boxPadding: 3
        }
      }
    }*/
  })

    };
    return ()=>{
      if(chart)
        chart.destroy();
    }

  },[dataset,label] )
/*
  let chart = new Chart {chartRef,{
    type='line'
  }
  labels:{labels},
  datasets:[
    {
      label:datasets.label,
      data:datasets.data,
      backgroundColor:datasets.backgroundColor
    }
  ]
  };*/
  return(
    
      <canvas ref={chartRef} id="myChart" width="800" height="200"></canvas>
    
  )
;}

