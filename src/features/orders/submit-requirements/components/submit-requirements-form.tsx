'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';
import { ServiceWithRaketero } from '@/lib/supabase/custom-types';
import { generateUUID } from '@/lib/utils';
import { AuthRoutes, DashboardRoutes } from '@/routes';
import { ImagePlus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, MouseEvent, useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

interface Props {
  orderId: string;
  service: ServiceWithRaketero;
}

const MAX_IMAGE_FILES = 5;
const MAX_IMAGE_SIZE_IN_MB = 10;

export default function SubmitRequirementsForm({ orderId, service }: Props) {
  const [attachedFiles, setAttachedFiles] = useState<{ file: File; blobUrl: string }[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const onImagesDrop = useCallback(
    (acceptedFiles: File[]) => {
      const filteredAcceptedFiles = Array.from(acceptedFiles).filter(
        file => !attachedFiles.find(f => f.file.name === file.name)
      );
      setAttachedFiles([
        ...attachedFiles,
        ...filteredAcceptedFiles.map(file => ({ file, blobUrl: URL.createObjectURL(file) })),
      ]);
    },
    [attachedFiles, setAttachedFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onImagesDrop,
    maxSize: MAX_IMAGE_SIZE_IN_MB * 1024 * 1024,
    maxFiles: MAX_IMAGE_FILES,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],

      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'],

      'application/postscript': ['.ai'],
      'application/octet-stream': ['.psd'],
      'image/svg+xml': ['.svg'],
    },
  });

  const handleAttachmentsChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) return;

    const filteredAcceptedFiles = Array.from(files)
      .filter(file => !attachedFiles.find(f => f.file.name === file.name))
      .map(file => ({ file, blobUrl: URL.createObjectURL(file) }));

    const newFiles = [...attachedFiles, ...filteredAcceptedFiles].slice(0, MAX_IMAGE_FILES);

    setAttachedFiles(newFiles);
  };

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setSubmitting(true);

    const supabase = createClient();
    const description = textAreaRef.current?.value;

    if (!description) {
      toast.error('Description is required');
      setSubmitting(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push(AuthRoutes.LOGIN);
      setSubmitting(false);
      return;
    }

    // Upload attachments to order-attachments bucket with the path <order_id>/<file_name>
    const storage = supabase.storage.from('order-attachments');

    const attachedFileUrls = await Promise.all(
      attachedFiles.map(async ({ file }) => {
        const { data, error } = await storage.upload(`${orderId}/${generateUUID()}`, file, {
          metadata: {
            originalFileName: file.name,
          },
        });

        if (error) {
          return '';
        } else {
          return data.fullPath;
        }
      })
    );

    // Update the existing order with the requirements, attachments and status to 'In Progress'
    const { error } = await supabase
      .from('orders')
      .update({
        requirements: description,
        attachment_urls: attachedFileUrls,
        status: 'In Progress',
      })
      .eq('id', orderId);

    if (error) {
      toast(error.message);
      setSubmitting(false);
      return;
    }

    // Redirect to the order page
    toast.success('Order requirements submitted successfully. Please wait for the Raketero to get back to you.');
    router.push(`${DashboardRoutes.ORDERS}/${orderId}`);
  };

  return (
    <Card className='w-full max-w-3xl'>
      <CardContent className='flex flex-col gap-6 px-8 py-4'>
        <h1 className='text-2xl font-bold'>{service.title}</h1>
        <p className='-mt-6 text-neutral-500'>
          {service.raketero.first_name} {service.raketero.last_name} will work on this project.
        </p>

        <div className='flex flex-col'>
          <p className='text-left text-lg font-semibold'>Project Details</p>
          <p className='text-sm text-neutral-500'>
            Describe what you need. Be as detailed as possible to ensure the best results.
          </p>
          <Textarea
            ref={textAreaRef}
            className='mt-2 min-h-32 resize-none !text-base'
            placeholder='For my logo, I want a minimalist design using the colors blue and gold. The company name is "RaketHub"...'
            required
          />
        </div>

        <div className='flex flex-col'>
          <p className='text-left text-lg font-semibold'>Attach Files (Optional)</p>
          <p className='mb-2 text-sm text-neutral-500'>Upload any relevant documents, images, or examples.</p>
          <div {...getRootProps()}>
            <input {...getInputProps()} onChange={handleAttachmentsChanged} ref={fileInputRef} />
            <div className='relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-white p-8'>
              {isDragActive && (
                <div className='absolute z-10 flex h-full w-full items-center justify-center bg-black'>
                  <p className='text-sm text-white'>Drop the files here..</p>
                </div>
              )}

              {attachedFiles.length > 0 ? (
                <div className='flex flex-wrap items-center justify-center gap-2'>
                  {attachedFiles.map(({ file, blobUrl }) => (
                    <div
                      key={blobUrl}
                      className='flex items-center justify-between gap-2 rounded-full bg-neutral-600 py-1 pr-2 pl-3 text-white'
                    >
                      <p className='text-sm'>{file.name}</p>
                      <button
                        type='button'
                        className='cursor-pointer rounded-full text-white hover:text-neutral-300'
                        onClick={() => setAttachedFiles(attachedFiles.filter(f => f.blobUrl !== blobUrl))}
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                  {attachedFiles.length < MAX_IMAGE_FILES && (
                    <div className='mt-4 block w-full text-center'>
                      <button
                        type='button'
                        onClick={() => fileInputRef?.current?.click()}
                        className='cursor-pointer text-blue-600 hover:text-blue-700'
                      >
                        Upload more files
                      </button>{' '}
                      <span>or drag and drop</span>
                      <p className='text-xs text-black/50'>Up to {MAX_IMAGE_SIZE_IN_MB}MB</p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div>
                    <ImagePlus size={40} className='mx-auto mb-4 text-neutral-400' />
                    <button
                      type='button'
                      onClick={() => fileInputRef?.current?.click()}
                      className='cursor-pointer text-blue-600 hover:text-blue-700'
                    >
                      Upload files
                    </button>{' '}
                    <span>or drag and drop</span>
                  </div>
                  <p className='text-xs text-black/50'>Up to {MAX_IMAGE_SIZE_IN_MB}MB</p>
                </>
              )}
            </div>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          className='mt-4 w-full cursor-pointer rounded-sm bg-blue-600 p-3 text-center font-semibold text-white transition-colors hover:bg-blue-700'
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Requirements'}
        </Button>
      </CardContent>
    </Card>
  );
}
