export interface Message {
  id: string;
  content: string;
  from: string;
  to: string;
  userName?: string;
  timestamp: Date;
}

