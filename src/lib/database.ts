import { supabase } from './supabase';

export interface Post {
  id: string;
  user_id: string | null;
  body: string;
  created_at: string;
  photo_url?: string;
}

export const database = {
  async getPosts(): Promise<Post[]> {
    console.log('Attempting to fetch posts...'); // Debug log
    
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return [];
    }

    console.log('Fetched posts from database:', data); // Debug log
    return data || [];
  },

  async addPost(body: string): Promise<boolean> {
    console.log('Adding post:', { body }); // Debug log
    
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{ 
          body: body,
          user_id: null // The database schema doesn't have an author column, only user_id
        }])
        .select();

      if (error) {
        console.error('Supabase error adding post:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return false;
      }

      console.log('Post added successfully:', data); // Debug log
      return true;
    } catch (err) {
      console.error('Exception adding post:', err);
      console.error('Exception type:', typeof err);
      console.error('Exception stack:', err instanceof Error ? err.stack : 'No stack trace');
      return false;
    }
  },

  async addPhotoPost(body: string, photoUrl: string): Promise<boolean> {
    console.log('Adding photo post:', { body, photoUrl }); // Debug log
    
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{ 
          body: body,
          photo_url: photoUrl,
          user_id: null
        }])
        .select();

      if (error) {
        console.error('Supabase error adding photo post:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return false;
      }

      console.log('Photo post added successfully:', data); // Debug log
      return true;
    } catch (err) {
      console.error('Exception adding photo post:', err);
      console.error('Exception type:', typeof err);
      console.error('Exception stack:', err instanceof Error ? err.stack : 'No stack trace');
      return false;
    }
  },

  async deletePost(postId: string): Promise<boolean> {
    console.log('Deleting post:', postId);
    
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) {
        console.error('Supabase error deleting post:', error);
        return false;
      }

      console.log('Post deleted successfully');
      return true;
    } catch (err) {
      console.error('Exception deleting post:', err);
      return false;
    }
  },

  async cleanUpOrphanedPhotoPosts(): Promise<void> {
    console.log('Cleaning up orphaned photo posts...');
    
    try {
      // Get all posts with photo_url
      const { data: posts, error } = await supabase
        .from('posts')
        .select('id, photo_url')
        .not('photo_url', 'is', null);

      if (error) {
        console.error('Error fetching photo posts:', error);
        return;
      }

      if (!posts) return;

      // Check each photo URL
      for (const post of posts) {
        try {
          // Try to access the file in storage
          const { data, error: storageError } = await supabase.storage
            .from('wall-photos')
            .list('', {
              search: post.photo_url.split('/').pop() // Get filename from URL
            });

          if (storageError || !data || data.length === 0) {
            // File doesn't exist, delete the post
            console.log('Deleting orphaned post:', post.id);
            await this.deletePost(post.id);
          }
        } catch (err) {
          console.error('Error checking photo:', err);
        }
      }
    } catch (err) {
      console.error('Error cleaning up orphaned posts:', err);
    }
  }
}; 