import { supabase } from './supabase';

export interface Post {
  id: string;
  user_id: string | null;
  body: string;
  created_at: string;
}

export const database = {
  async getPosts(): Promise<Post[]> {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return [];
    }

    return data || [];
  },

  async addPost(body: string): Promise<boolean> {
    const { error } = await supabase
      .from('posts')
      .insert([{ body }]);

    if (error) {
      console.error('Error adding post:', error);
      return false;
    }

    return true;
  }
}; 