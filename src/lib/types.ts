export interface Message {
  id: string;
  author: string;
  content: string;
  timestamp: number;
}

export type Messages = Message[]; 