// Cleanup script to remove posts with missing images
// Run this in your browser console to clean up orphaned photo posts

const cleanupOrphanedPosts = async () => {
  try {
    console.log('🔍 Starting cleanup of orphaned photo posts...');
    
    // Get all posts with photo_url
    const { data: posts, error } = await supabase
      .from('posts')
      .select('id, photo_url, body')
      .not('photo_url', 'is', null);

    if (error) {
      console.error('❌ Error fetching photo posts:', error);
      return;
    }

    if (!posts || posts.length === 0) {
      console.log('✅ No photo posts found to check');
      return;
    }

    console.log(`📸 Found ${posts.length} photo posts to check...`);

    let deletedCount = 0;

    // Check each photo URL
    for (const post of posts) {
      try {
        // Extract filename from URL
        const filename = post.photo_url.split('/').pop();
        
        // Try to access the file in storage
        const { data, error: storageError } = await supabase.storage
          .from('wall-photos')
          .list('', {
            search: filename
          });

        if (storageError || !data || data.length === 0) {
          // File doesn't exist, delete the post
          console.log(`🗑️ Deleting orphaned post: "${post.body.substring(0, 50)}..."`);
          
          const { error: deleteError } = await supabase
            .from('posts')
            .delete()
            .eq('id', post.id);

          if (deleteError) {
            console.error('❌ Error deleting post:', deleteError);
          } else {
            deletedCount++;
            console.log(`✅ Deleted orphaned post: ${post.id}`);
          }
        } else {
          console.log(`✅ Photo exists for post: ${post.id}`);
        }
      } catch (err) {
        console.error('❌ Error checking photo:', err);
      }
    }

    console.log(`🎉 Cleanup complete! Deleted ${deletedCount} orphaned posts.`);
    console.log('🔄 Refresh the page to see the updated posts.');
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  }
};

// Run the cleanup
cleanupOrphanedPosts(); 