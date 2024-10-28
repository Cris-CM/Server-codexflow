export interface Message {
  id: string;
  content: string;
  from: string;
  to: string;
  userName?: string; // Agregamos el nombre del usuario
  timestamp: Date;
}

