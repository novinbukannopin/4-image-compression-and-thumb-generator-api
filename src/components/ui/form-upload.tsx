'use client';

import React, { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function FormUpload() {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState(null);
  const [size, setSize] = useState(0);
  const [afterSize, setAfterSize] = useState(0);
  const [outputUrl, setOutputUrl] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!file || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      const param = 32;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.floor(data[i] / param) * param;
        data[i + 1] = Math.floor(data[i + 1] / param) * param;
        data[i + 2] = Math.floor(data[i + 2] / param) * param;
      }

      ctx.putImageData(imgData, 0, 0);

      const base64 = canvas.toDataURL('image/png');
      setOutputUrl(base64);
      canvas.toBlob((blob) => {
        setAfterSize(blob?.size);
      });
    };
    img.src = URL.createObjectURL(file);
  }, [image]);

  async function uploadFile(
    ev: React.MouseEvent<HTMLInputElement, MouseEvent>,
  ) {
    setIsLoading(true);
    try {
      ev.preventDefault();
      setIsLoading(true);

      const formData = new FormData();

      formData.append('image', fileInputRef?.current?.files?.[0]!);
      // @ts-ignore
      formData.append('title', fileInputRef?.current?.files?.[0].name);
      // @ts-ignore
      formData.append('type_before', fileInputRef?.current?.files?.[0].type);
      // @ts-ignore
      formData.append('size_before', fileInputRef?.current?.files?.[0].size);
      // @ts-ignore
      formData.append('size_after', afterSize);
      // @ts-ignore
      formData.append('type_after', 'null');

      //fullPath, id, path

      const generateNumber = Math.floor(Math.random() * 4);

      const { data, error } = await supabase.storage
        .from('compress')
        .upload(
          `public/${fileInputRef?.current?.files?.[0].name}-${generateNumber}`,
          fileInputRef?.current?.files?.[0]!,
          {
            cacheControl: '3600',
            upsert: false,
          },
        );

      // @ts-ignore
      formData.append('fullPath', data?.fullPath);
      // @ts-ignore
      formData.append('path', data?.path);

      const res = await fetch(`/api/v1/compress`, {
        method: 'POST',
        body: formData,
      });

      console.log(data);

      const result = await res.json();
      console.log(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      redirect('/');
    }
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    // @ts-ignore
    setImage(URL.createObjectURL(e?.target?.files?.[0]));
    // @ts-ignore
    setSize(e.target.files[0].size);
    // @ts-ignore
    setFile(e?.target?.files?.[0]);
  }

  return (
    <form className="flex flex-col gap-4">
      <div>
        <label>
          <span>Upload a file</span>
          <input
            type="file"
            name="file"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          {image && (
            <>
              <img src={image} alt={'image'} width={200} height={200} />
              <p>{size} bytes</p>
            </>
          )}
        </label>
      </div>

      <div className={'flex gap-10'}>
        <div>
          <label>After</label>
          <canvas className="canvas" ref={canvasRef} />
          {afterSize > 0 && <p>{afterSize} bytes</p>}
        </div>

        <div>
          <p>thumbnail</p>
          {image && (
            <>
              <img src={image} alt={'image'} width={'auto'} height={150} />
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Compressing... please wait 🌀</p>
      ) : (
        <button onClick={uploadFile}>Upload & Compress</button>
      )}
    </form>
  );
}
