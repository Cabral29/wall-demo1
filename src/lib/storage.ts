import { Message, Messages } from './types';

const STORAGE_KEY = 'wall_messages';
const AUTHOR_KEY = 'wall_author';
const DEFAULT_AUTHOR = 'Greg Wientjes';

const INITIAL_MESSAGES: Messages = [
  {
    id: '6',
    author: 'Sheryl',
    content: "Greg, when are we gonna deploy your latest dance moves to production? #AgileDancer",
    timestamp: Date.now() - 1000
  },
  {
    id: '5',
    author: 'Alex',
    content: "Yo Greg, just pulled an all-nighter on the assignment. Turns out sleep deprivation doesn't improve coding skills. Weird!",
    timestamp: Date.now() - 2000
  },
  {
    id: '4',
    author: 'Maija',
    content: "Greg, rumor has it your computer has more stickers than code running on it. Confirm?",
    timestamp: Date.now() - 3000
  },
  {
    id: '3',
    author: 'Juho',
    content: "Greg, are you still coding in pajamas, or have you upgraded to full-time sweatpants mode?",
    timestamp: Date.now() - 4000
  },
  {
    id: '2',
    author: 'Adelaida',
    content: "Greg, saw your last coding session—pretty sure you broke Stack Overflow again! 😈",
    timestamp: Date.now() - 5000
  },
  {
    id: '1',
    author: 'Anna',
    content: "Hey Greg, did you debug your coffee maker yet? Last cup tasted like JavaScript errors.",
    timestamp: Date.now() - 6000
  }
];

export const storage = {
  getMessages: (): Messages => {
    if (typeof window === 'undefined') return INITIAL_MESSAGES;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : INITIAL_MESSAGES;
  },

  saveMessage: (message: Message): void => {
    if (typeof window === 'undefined') return;
    const messages = storage.getMessages();
    messages.unshift(message); // Add new message at the beginning
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  },

  clearMessages: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  },

  getAuthor: (): string => {
    if (typeof window === 'undefined') return DEFAULT_AUTHOR;
    return localStorage.getItem(AUTHOR_KEY) || DEFAULT_AUTHOR;
  },

  saveAuthor: (author: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(AUTHOR_KEY, author);
  }
}; 