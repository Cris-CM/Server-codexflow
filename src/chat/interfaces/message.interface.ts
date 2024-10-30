export interface ChatMessage {
  from: string;
  to: string;
  content: string;
  userName: string;
  timestamp: Date;
}
