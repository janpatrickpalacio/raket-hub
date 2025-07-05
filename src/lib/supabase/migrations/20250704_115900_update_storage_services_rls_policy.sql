-- Create a policy that allows users to upload files to their own folder
CREATE POLICY "Allow users to upload to their own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  -- Check if the file path starts with 'services/' followed by the user's ID
  bucket_id = 'services' AND 
  (storage.foldername(name))[1] = (auth.uid())::text
);

-- Create a policy that allows all users (including anonymous) to read files from the services bucket
CREATE POLICY "Allow public read access to services bucket"
ON storage.objects
FOR SELECT
TO authenticated, anon
USING (
  bucket_id = 'services'
);

-- Create a policy that allows users to update their own files
CREATE POLICY "Allow users to update their own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'services' AND 
  (storage.foldername(name))[1] = (auth.uid())::text
);

-- Create a policy that allows users to delete their own files
CREATE POLICY "Allow users to delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'services' AND 
  (storage.foldername(name))[1] = (auth.uid())::text
);