import React from 'react';
import { pdf, type DocumentProps } from '@react-pdf/renderer';
import type { ResumeData } from '@resucraft/shared';
import { AtsSingleColumnPdf } from '../../components/pdf/AtsSingleColumnPdf';

/**
 * Sanitizes candidate name into an enterprise-standard PDF filename.
 * Example: "Vikash Singh" -> "Vikash_Singh_Resume.pdf"
 */
export function formatPdfFilename(name?: string, defaultTitle = 'Resume'): string {
  if (!name || !name.trim()) {
    return `${defaultTitle}.pdf`;
  }
  const cleanName = name
    .trim()
    .replace(/[^a-zA-Z0-9\s-_]/g, '')
    .replace(/\s+/g, '_');

  return `${cleanName}_Resume.pdf`;
}

/**
 * Generates an in-memory PDF Blob directly in the browser via @react-pdf/renderer.
 * Zero round-trips to any server or external API (100% local-first privacy).
 */
export async function generatePdfBlob(resume: ResumeData): Promise<Blob> {
  const element = React.createElement(AtsSingleColumnPdf, { resume }) as unknown as React.ReactElement<DocumentProps>;
  const instance = pdf(element);
  return await instance.toBlob();
}

/**
 * Triggers a direct client-side download of the ATS-optimized resume PDF.
 * Allocates a temporary Object URL and revokes it immediately to prevent memory leaks.
 */
export async function downloadPdfResume(
  resume: ResumeData,
  customFilename?: string,
): Promise<void> {
  const blob = await generatePdfBlob(resume);
  const filename = customFilename || formatPdfFilename(resume.basics.name);

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();

  // Cleanup to avoid browser memory leaks
  setTimeout(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Generates a Node.js Buffer for automated extraction testing and server environments.
 */
export async function generatePdfBuffer(resume: ResumeData): Promise<Buffer> {
  const element = React.createElement(AtsSingleColumnPdf, { resume }) as unknown as React.ReactElement<DocumentProps>;
  const instance = pdf(element);
  const streamOrBuffer = await instance.toBuffer();

  if (Buffer.isBuffer(streamOrBuffer)) {
    return streamOrBuffer;
  }

  // Handle stream in Node.js runtime
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    const stream = streamOrBuffer as unknown as NodeJS.ReadableStream;

    stream.on('data', (chunk: Uint8Array) => {
      chunks.push(chunk);
    });

    stream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    stream.on('error', (err: Error) => {
      reject(err);
    });
  });
}
