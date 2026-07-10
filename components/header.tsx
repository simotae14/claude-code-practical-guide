import Link from 'next/link';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { HeaderActions } from './header-actions';

export async function Header() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <header className='sticky top-0 z-10 flex items-center justify-between border-b border-foreground/10 bg-background px-6 py-3'>
      <Link
        href='/notes'
        className='text-lg font-semibold text-foreground hover:opacity-80 transition-opacity'
      >
        NextNotes
      </Link>
      <HeaderActions session={session} />
    </header>
  );
}
