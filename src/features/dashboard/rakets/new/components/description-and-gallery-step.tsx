import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useRaketFormStore } from '@/features/dashboard/rakets/stores/useRaketFormStore';
import { ImagePlus, X } from 'lucide-react';
import Image from 'next/image';
import { ChangeEvent, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';

const MAX_IMAGE_FILES = 5;
const MAX_IMAGE_SIZE_IN_BYTES = 5 * 1024 * 1024;

export function DescriptionAndGalleryStep() {
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const galleryImageInputRef = useRef<HTMLInputElement>(null);
  const { coverImageFile, galleryImageFiles, updateDescription, updateCoverImageFile, updateGalleryImageFiles } =
    useRaketFormStore();

  const onCoverImageDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const blobUrl = URL.createObjectURL(file);
      updateCoverImageFile({ file, blobUrl });
    },
    [updateCoverImageFile]
  );

  const onGalleryImagesDrop = useCallback(
    (acceptedFiles: File[]) => {
      const filteredAcceptedFiles = Array.from(acceptedFiles).filter(
        file => !galleryImageFiles.find(f => f.file.name === file.name)
      );
      updateGalleryImageFiles([
        ...galleryImageFiles,
        ...filteredAcceptedFiles.map(file => ({ file, blobUrl: URL.createObjectURL(file) })),
      ]);
    },
    [galleryImageFiles, updateGalleryImageFiles]
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

  const handleCoverImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) return;

    const file = files[0];
    const blobUrl = URL.createObjectURL(file);
    updateCoverImageFile({ file, blobUrl });
  };

  const handleGalleryImagesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) return;

    const filteredAcceptedFiles = Array.from(files)
      .filter(file => !galleryImageFiles.find(f => f.file.name === file.name))
      .map(file => ({ file, blobUrl: URL.createObjectURL(file) }));

    const newFiles = [...galleryImageFiles, ...filteredAcceptedFiles].slice(0, MAX_IMAGE_FILES);

    updateGalleryImageFiles(newFiles);
  };

  const handleRemoveCoverImage = (): void => {
    URL.revokeObjectURL(coverImageFile?.blobUrl || '');
    updateCoverImageFile(null);
  };

  const handleRemoveGalleryImage = (index: number): void => {
    URL.revokeObjectURL(galleryImageFiles[index].blobUrl);
    updateGalleryImageFiles(galleryImageFiles.filter((_, i) => i !== index));
  };

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
              id='description'
              placeholder='Tell clients everything they need to know about your service...'
              onChange={event => updateDescription(event.target.value)}
              required
            />
          </div>
          <div className='flex flex-col gap-1'>
            <Label htmlFor='description'>
              Cover Image URL <span className='-ml-1 text-red-600'>*</span>
            </Label>
            {coverImageFile ? (
              <div className='w-full'>
                <div className='relative w-1/2'>
                  <Image
                    width={1000}
                    height={500}
                    src={coverImageFile.blobUrl}
                    quality={20}
                    alt='Cover Image'
                    className='aspect-video w-full rounded-lg object-cover'
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
                <input {...getCoverImageInputProps()} onChange={handleCoverImageChange} ref={coverImageInputRef} />
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
            <input {...getCoverImageInputProps()} ref={coverImageInputRef} onChange={handleCoverImageChange} />
          </div>
          <div className='flex flex-col gap-1'>
            <Label htmlFor='gallery'>Image Gallery</Label>
            {galleryImageFiles.length > 0 ? (
              <div className='grid grid-cols-3 gap-4'>
                {galleryImageFiles.map((file, index) => (
                  <div key={file.blobUrl} className='relative overflow-hidden rounded-sm border-2'>
                    <Image
                      src={file.blobUrl}
                      width={1000}
                      height={500}
                      alt='Gallery Image'
                      className='aspect-video w-full object-contain'
                    />
                    <button
                      type='button'
                      className='absolute top-0 right-0 m-2 cursor-pointer rounded-full bg-black p-1 text-white hover:bg-neutral-800'
                      onClick={() => handleRemoveGalleryImage(index)}
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                {galleryImageFiles.length < MAX_IMAGE_FILES && (
                  <button
                    {...getGalleryImagesRootProps()}
                    type='button'
                    className='flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white hover:bg-neutral-50'
                    onClick={() => galleryImageInputRef?.current?.click()}
                  >
                    <input
                      {...getGalleryImagesInputProps()}
                      onChange={handleGalleryImagesChange}
                      ref={galleryImageInputRef}
                    />
                    <ImagePlus size={40} className='text-neutral-400' />
                    {isGalleryImagesDragActive && <p className='text-sm text-black/50'>Drop the files here..</p>}
                  </button>
                )}
              </div>
            ) : (
              <div {...getGalleryImagesRootProps()}>
                <input
                  {...getGalleryImagesInputProps()}
                  onChange={handleGalleryImagesChange}
                  ref={galleryImageInputRef}
                />
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
            <input {...getGalleryImagesInputProps()} ref={galleryImageInputRef} onChange={handleGalleryImagesChange} />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
