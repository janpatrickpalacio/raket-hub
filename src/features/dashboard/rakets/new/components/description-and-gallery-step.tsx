import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Database } from '@/lib/supabase/types';
import { ImagePlus, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Controller, useFormContext } from 'react-hook-form';

interface Props {
  service?: Database['public']['Tables']['services']['Row'];
}

const MAX_IMAGE_FILES = 5;
const MAX_IMAGE_SIZE_IN_BYTES = 5 * 1024 * 1024;

export function DescriptionAndGalleryStep({ service }: Props) {
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(service?.cover_image_url || null);
  const [currentGalleryImagesPreviews, setCurrentGalleryImagesPreviews] = useState<string[]>(
    service?.gallery_image_urls || []
  );
  const [galleryImagesPreviews, setGalleryImagesPreviews] = useState<string[]>([]);
  const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const galleryImageInputRef = useRef<HTMLInputElement>(null);
  const { register, control, setValue, getValues } = useFormContext();

  const onCoverImageDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (file) {
        URL.revokeObjectURL(coverImagePreview || '');
        const blobUrl = URL.createObjectURL(file);
        setCoverImagePreview(blobUrl);
      }
    },
    [coverImagePreview, setCoverImagePreview]
  );

  const onGalleryImagesDrop = useCallback(
    (acceptedFiles: File[]) => {
      galleryImagesPreviews.forEach(url => URL.revokeObjectURL(url));

      const fileList = galleryImageFiles.length ? [...galleryImageFiles, ...acceptedFiles] : acceptedFiles;

      const previews = fileList.map(file => URL.createObjectURL(file));
      setGalleryImageFiles(fileList);
      setGalleryImagesPreviews(previews);
      setValue('gallery_image_files', fileList);
      setValue('gallery_image_urls', previews);
    },
    [galleryImageFiles, galleryImagesPreviews, setValue]
  );

  const {
    getRootProps: getCoverImageRootProps,
    getInputProps: getCoverImageInputProps,
    isDragActive: isCoverImageDragActive,
  } = useDropzone({
    onDrop: onCoverImageDrop,
    maxSize: MAX_IMAGE_SIZE_IN_BYTES,
    maxFiles: 1,
    accept: {
      'image/*': [],
    },
  });

  const {
    getRootProps: getGalleryImagesRootProps,
    getInputProps: getGalleryImagesInputProps,
    isDragActive: isGalleryImagesDragActive,
  } = useDropzone({
    onDrop: onGalleryImagesDrop,
    maxSize: MAX_IMAGE_SIZE_IN_BYTES,
    maxFiles: MAX_IMAGE_FILES,
    accept: {
      'image/*': [],
    },
  });

  const handleRemoveCoverImage = (): void => {
    URL.revokeObjectURL(coverImagePreview || '');
    setCoverImagePreview(null);
    setValue('cover_image_file', null);
  };

  const handleRemoveGalleryImage = (previewUrl: string): void => {
    const index = galleryImagesPreviews.indexOf(previewUrl);
    URL.revokeObjectURL(previewUrl);

    const updatedFiles = galleryImageFiles.filter((_, i) => i !== index);
    const updatedPreviews = galleryImagesPreviews.filter((_, i) => i !== index);

    setGalleryImageFiles(updatedFiles);
    setGalleryImagesPreviews(updatedPreviews);

    if (previewUrl.startsWith('services/')) {
      setCurrentGalleryImagesPreviews(currentGalleryImagesPreviews.filter(url => url !== previewUrl));
      setValue('removed_existing_gallery_image_urls', [
        ...(getValues('removed_existing_gallery_image_urls') || []),
        previewUrl,
      ]);
    }

    setValue('gallery_image_files', updatedFiles);
    // setValue('gallery_image_urls', updatedPreviews);
  };

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(coverImagePreview || '');
      galleryImagesPreviews.forEach(URL.revokeObjectURL);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allGalleryImagePreviews = [...currentGalleryImagesPreviews, ...galleryImagesPreviews];

  return (
    <Card>
      <CardHeader>
        <CardTitle>3. Description &amp; Gallery</CardTitle>
        <Separator className='my-4' />
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col gap-1'>
            <Label htmlFor='description'>
              Description <span className='-ml-1 text-red-600'>*</span>
            </Label>
            <Textarea
              {...register('description')}
              id='description'
              placeholder='Tell clients everything they need to know about your service...'
              required
            />
          </div>
          <div className='flex flex-col gap-1'>
            <Label htmlFor='description'>
              Cover Image URL <span className='-ml-1 text-red-600'>*</span>
            </Label>
            {coverImagePreview ? (
              <div className='w-full'>
                <div className='relative w-1/2'>
                  <Image
                    width={1000}
                    height={500}
                    src={coverImagePreview}
                    quality={20}
                    alt='Cover Image'
                    className='aspect-video w-full rounded-lg border object-cover'
                  />
                  <button
                    type='button'
                    className='absolute top-0 right-0 m-2 cursor-pointer rounded-full bg-black p-1 text-white'
                    onClick={handleRemoveCoverImage}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div {...getCoverImageRootProps()}>
                <div className='flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white p-8'>
                  <ImagePlus size={40} className='mb-4 text-neutral-400' />
                  <p className='text-sm'>
                    {isCoverImageDragActive ? (
                      <>Drop the file here..</>
                    ) : (
                      <>
                        <button
                          type='button'
                          onClick={() => coverImageInputRef?.current?.click()}
                          className='cursor-pointer text-blue-600 hover:text-blue-700'
                        >
                          Upload a file
                        </button>{' '}
                        or drag and drop
                      </>
                    )}
                  </p>
                  <p className='text-xs text-black/50'>PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            )}

            <Controller
              name='cover_image_file'
              control={control}
              render={({ field }) => (
                <input
                  {...getCoverImageInputProps()}
                  onChange={e => {
                    const file = e.target.files?.[0];

                    if (file) {
                      field.onChange(file);

                      URL.revokeObjectURL(coverImagePreview || '');
                      const blobUrl = URL.createObjectURL(file);
                      setCoverImagePreview(blobUrl);
                      e.target.value = '';
                    }
                  }}
                />
              )}
            />
          </div>
          <div className='flex flex-col gap-1'>
            <Label htmlFor='gallery'>Image Gallery</Label>
            {allGalleryImagePreviews.length > 0 ? (
              <div className='grid grid-cols-3 gap-4'>
                {allGalleryImagePreviews.map(previewUrl => (
                  <div key={previewUrl} className='relative overflow-hidden rounded-sm border-2'>
                    <Image
                      src={previewUrl}
                      width={1000}
                      height={500}
                      alt='Gallery Image'
                      className='aspect-video w-full object-contain'
                    />
                    <button
                      type='button'
                      className='absolute top-0 right-0 m-2 cursor-pointer rounded-full bg-black p-1 text-white hover:bg-neutral-800'
                      onClick={() => handleRemoveGalleryImage(previewUrl)}
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                {allGalleryImagePreviews.length < MAX_IMAGE_FILES && (
                  <button
                    {...getGalleryImagesRootProps()}
                    type='button'
                    className='flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white hover:bg-neutral-50'
                    onClick={() => galleryImageInputRef?.current?.click()}
                  >
                    <ImagePlus size={40} className='text-neutral-400' />
                    {isGalleryImagesDragActive && <p className='text-sm text-black/50'>Drop the files here..</p>}
                  </button>
                )}
              </div>
            ) : (
              <div {...getGalleryImagesRootProps()}>
                <div className='flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white p-8'>
                  <ImagePlus size={40} className='mb-4 text-neutral-400' />
                  <p className='text-sm'>
                    {isGalleryImagesDragActive ? (
                      <>Drop the files here..</>
                    ) : (
                      <>
                        <button
                          type='button'
                          onClick={() => galleryImageInputRef?.current?.click()}
                          className='cursor-pointer text-blue-600 hover:text-blue-700'
                        >
                          Upload files
                        </button>{' '}
                        or drag and drop
                      </>
                    )}
                  </p>
                  <p className='text-xs text-black/50'>PNG, JPG, GIF up to 1MB</p>
                </div>
              </div>
            )}

            <Controller
              name='gallery_image_files'
              control={control}
              render={({ field }) => (
                <input
                  {...getGalleryImagesInputProps()}
                  ref={galleryImageInputRef}
                  onChange={e => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      const newFiles = Array.from(files).slice(0, MAX_IMAGE_FILES - allGalleryImagePreviews.length);
                      const updatedFiles = [...galleryImageFiles, ...newFiles];
                      field.onChange(updatedFiles);
                      setGalleryImageFiles(updatedFiles);

                      galleryImagesPreviews.forEach(URL.revokeObjectURL);
                      const newPreviews = updatedFiles.map(file => URL.createObjectURL(file));
                      setGalleryImagesPreviews(newPreviews);
                      e.target.value = '';
                    }
                  }}
                />
              )}
            />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
