import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '../components/Navbar';

export const metadata: Metadata = {
  title: 'ResuCraft AI — The Open, ATS-Conscious AI Resume Engine',
  description:
    'Build, refine and tailor your resume with transparent job-description insights, private local storage, and clean ATS-conscious vector PDF exports.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t py-6 text-center text-xs text-slate-500" style={{ borderColor: 'var(--border)' }}>
          <p>© {new Date().getFullYear()} ResuCraft AI. Privacy-First & Open-Source ATS Resume Engine.</p>
        </footer>
      </body>
    </html>
  );
}
