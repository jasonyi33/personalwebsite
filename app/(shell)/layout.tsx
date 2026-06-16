import { NavAnchorProvider } from '@/components/shell/NavAnchorContext';
import TopNav from '@/components/shell/TopNav';
import TransitionShell from '@/components/shell/TransitionShell';

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <NavAnchorProvider>
      <TopNav />
      <TransitionShell>{children}</TransitionShell>
    </NavAnchorProvider>
  );
}
