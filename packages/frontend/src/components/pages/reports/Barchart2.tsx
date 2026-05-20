import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

export type dataSets = {
  label: string;
  data: number[];
  backgroundColor: string | string[];
  borderColor: string;
};

type dataProps = {
  type: string;
  label: string[];
  dataset: dataSets[];
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
export function GraphChart({ type, label, dataset }: dataProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let chart: Chart | null = null;
    if (chartRef.current) {
      chart = new Chart(chartRef.current, {
        type: type as any,
        data: {
          labels: label,
          datasets: dataset,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#1e293b',
                font: {
                  size: 14,
                  family: 'Segoe UI',
                },
              },
            },
            tooltip: {
              backgroundColor: '#1e293b',
              titleColor: '#38bdf8',
              bodyColor: '#f8fafc',
              padding: 8,
            },
          },
          hover: {
            mode: 'nearest',
            animationDuration: 400,
          },
          animation: {
            duration: 500,
            easing: 'easeOutQuart',
          },
          elements: {
            arc: {
              hoverOffset: 12,
            },
            bar: {
              backgroundColor: dataset[0].backgroundColor,
              borderRadius: 4,
              hoverBackgroundColor: '#38bdf8',
            },
            point: {
              radius: 4,
              hoverRadius: 6,
              hoverBorderWidth: 2,
            },
          },
        },
      });
    }

    return () => {
      if (chart) chart.destroy();
    };
  }, [dataset, label, type]);
  // Étape 1 : Identifier les colonnes à garder
const validColumnIndices = label.map((_, colIndex) => {
  return dataset.some(ds => ds.data[colIndex] !== 0 && ds.data[colIndex] !== null && ds.data[colIndex] !== undefined)
    ? colIndex
    : null;
}).filter((i): i is number => i !== null);

// Étape 2 : Filtrer les labels et les datasets
const filteredLabels = validColumnIndices.map(i => label[i]);
const filteredDataset = dataset
  .filter(ds => ds.data.some(val => val !== 0 && val !== null && val !== undefined))
  .map(ds => ({
    ...ds,
    data: validColumnIndices.map(i => ds.data[i]),
  }));


  // Filtrer les datasets avec au moins une valeur non nulle
  //const filteredDataset = dataset.filter(ds => ds.data.some(val => val !== 0 && val !== null && val !== undefined));

  return (
    <div style={{ width: '100%', margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
      <div style={{ height: '300px' }}>
        <canvas ref={chartRef} id="myChart" />
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Tableau Statistique</h3>
        <table style={{
  width: '100%',
  borderCollapse: 'collapse',
  fontFamily: 'Segoe UI',
  fontSize: '14px',
  textAlign: 'center',
}}>
  <thead>
    <tr style={{ backgroundColor: '#f1f5f9' }}>
      <th style={{ border: '1px solid #ccc', padding: '8px' }}>Label</th>
      {filteredLabels.map((lbl, idx) => (
        <th key={idx} style={{ border: '1px solid #ccc', padding: '8px' }}>{lbl}</th>
      ))}
    </tr>
  </thead>
  <tbody>
    {filteredDataset.map((ds, i) => (
      <tr key={i}>
        <td style={{ border: '1px solid #ccc', padding: '8px', fontWeight: 'bold' }}>{ds.label}</td>
        {ds.data.map((val, j) => (
          <td key={j} style={{ border: '1px solid #ccc', padding: '8px' }}>{val}</td>
        ))}
      </tr>
    ))}
  </tbody>
</table>

      </div>
    </div>
  );
}

/*
export function GraphChart({ type, label, dataset }: dataProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let chart: Chart | null = null;
    if (chartRef.current) {
      chart = new Chart(chartRef.current, {
        type: type as any,
        data: {
          labels: label,
          datasets: dataset,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#1e293b',
                font: {
                  size: 14,
                  family: 'Segoe UI',
                },
              },
            },
            tooltip: {
              backgroundColor: '#1e293b',
              titleColor: '#38bdf8',
              bodyColor: '#f8fafc',
              padding: 8,
            },
          },
          hover: {
            mode: 'nearest',
            animationDuration: 400,
          },
          animation: {
            duration: 500,
            easing: 'easeOutQuart',
          },
          elements: {
            arc: {
              hoverOffset: 12, // Pour les Pie charts
            },
            bar: {
              backgroundColor: dataset[0].backgroundColor,
              borderRadius: 4,
              hoverBackgroundColor: '#38bdf8',
            },
            point: {
              radius: 4,
              hoverRadius: 6,
              hoverBorderWidth: 2,
            },
          },
        },
      });
    }

    return () => {
      if (chart) chart.destroy();
    };
  }, [dataset, label, type]);

  return (
    <div style={containerStyle}>
      <div style={{ height: '300px' }}>
        <canvas ref={chartRef} id="myChart" />
      </div>
      <div style={{ marginTop: '2rem' }}>
  <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Tableau Statistique</h3>
  <table style={{
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: 'Segoe UI',
    fontSize: '14px',
    textAlign: 'center',
  }}>
    <thead>
      <tr style={{ backgroundColor: '#f1f5f9' }}>
        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Label</th>
        {label.map((lbl, idx) => (
          <th key={idx} style={{ border: '1px solid #ccc', padding: '8px' }}>{lbl}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {dataset.map((ds, i) => (
        <tr key={i}>
          <td style={{ border: '1px solid #ccc', padding: '8px', fontWeight: 'bold' }}>{ds.label}</td>
          {ds.data.map((val, j) => (
            <td key={j} style={{ border: '1px solid #ccc', padding: '8px' }}>{val}</td>
          ))
          }
        </tr>
      ) )}
    </tbody>
  </table>
</div>

    </div>
  );
}*/
