import { useAuth } from "../../../AuthContext";


/*export default function Home(){

    const {user,logout}=useAuth();  
    return (
        <div>
            WELCOME
            <button onClick={logout}>Logout</button>
        </div>
    );
}*/


import './home.css';

export default function Home() {
  
  const data = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'],
    datasets: [{
      label: 'Transactions',
      data: [120, 190, 300, 250, 400],
      borderColor: '#00bcd4',
      backgroundColor: 'rgba(0,188,212,0.1)',
      fill: true,
      tension: 0.3
    }]
  };

  return (
    <div className="s">
    <div className="container" >
    <section className="hero">
      <h2>Bienvenue à vous</h2>
      <p>Surveillez, analysez et gérer vos logs en toute simplicité.</p>
    </section>
    <section className="features">
      <div className="card">
        <h3>Recherche intelligente</h3>
        <p>Filtrez vos logs par période, niveau ou source pour un diagnostic rapide.</p>
      </div>
      <div className="card">
        <h3>Statistique en temps réel</h3>
        <p>Visualisez les tendances et les pics d'activité avec des graphiques dynamiques.</p>
      </div>
      <div className="card">
        <h3>Paramétrage flexible</h3>
        <p>Personnalisez les sources de logs et les niveaux d'alerte selon vos besoins.</p>
      </div>
      <div className="card">
        <h3>Alertes automatisées</h3>
        <p>Recevez des notifications en cas d'erreurs critiques ou d'évènement suspects.</p>
      </div>
    </section>
    </div>
    </div>
  );
};
