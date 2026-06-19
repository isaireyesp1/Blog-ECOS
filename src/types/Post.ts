export interface Post {
  id: string; // 🔥 IMPORTANTE
  title: string;
  content: string;
  category: string;
  likes: number;
  alias: string;
  createdAt?: any;
}