export interface Post {
  id: string;
  url: string;
  description: string;
  author: string;
  category: string;
  triggerWord: string | null;
  tools: string[];
  hasList: boolean;
  links: string[];
}
