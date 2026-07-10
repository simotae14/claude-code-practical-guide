import { Header } from '@/components/header';

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className='mx-auto max-w-4xl px-6 py-8'>{children}</main>
    </>
  );
}
