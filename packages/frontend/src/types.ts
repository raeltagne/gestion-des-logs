export interface Log {
  id:string;
  level: string;
  message: string;
  application: string;
  source: string;
  timestamp: string;
} 

export interface User {
  id:string;
  name: string;
  surname: string;
  username: string;
  password: string;
  role: string;
  number: string;
  email: string;
  etat: string;
}
export interface Application {
  id:string;
  name: string;
}
export interface Alerte {
  id:string;
  dateAlerte:Date;
}
export interface Regle {
  id:string;
  level: string;
  description: string;
} 
export interface RegleApp {
  id:string;
  regle: string;
  application: string;
  etat: string;
} 