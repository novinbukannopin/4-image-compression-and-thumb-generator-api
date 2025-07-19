import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'node:fs';
import prisma from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const file = form.get('image') as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    fs.writeFile(`./public/uploads/${file.name}`, buffer, (err) => {
      if (err) {
        console.error('Error writing file:', err);
        throw new Error('Failed to save the file');
      }
    });

    await prisma.image.create({
      data: {
        title: form.get('title') as string,
        sizeBefore: form.get('size_before') as string,
        sizeAfter: form.get('size_after') as string,
        typeBefore: form.get('type_before') as string,
        typeAfter: form.get('type_after') as string,
        fullPath: form.get('fullPath') as string,
        path: form.get('path') as string,
      },
    });

    return NextResponse.json({
      message: 'File received successfully',
      fileName: file.name,
      fileSize: file.size + ' bytes',
      contentType: file.type,
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json({
      error: 'Failed to process the file',
      details: e instanceof Error ? e.message : 'Unknown error',
    });
  }
  // todo bikin service untuk compress image dan simpan di storage
}
