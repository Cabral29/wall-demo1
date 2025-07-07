// Test script to verify photo upload functionality
// Run this in your browser console to test the Supabase connection

const testPhotoUpload = async () => {
  try {
    // Test database connection
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .limit(1);
    
    if (postsError) {
      console.error('Database connection failed:', postsError);
      return;
    }
    console.log('✅ Database connection successful');
    
    // Test storage bucket access
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketsError) {
      console.error('Storage access failed:', bucketsError);
      return;
    }
    
    const wallPhotosBucket = buckets.find(bucket => bucket.name === 'wall-photos');
    if (!wallPhotosBucket) {
      console.error('❌ wall-photos bucket not found');
      return;
    }
    console.log('✅ wall-photos bucket found');
    
    // Test bucket permissions
    const { data: files, error: filesError } = await supabase
      .storage
      .from('wall-photos')
      .list();
    
    if (filesError) {
      console.error('❌ Cannot list files in wall-photos bucket:', filesError);
      return;
    }
    console.log('✅ Can access wall-photos bucket');
    
    console.log('🎉 All tests passed! Photo upload should work.');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testPhotoUpload(); 