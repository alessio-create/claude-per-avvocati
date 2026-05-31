import { getCorsoIndex } from '../../lib/content';
import { Sidebar } from '../../components/course/Sidebar';

export default function CorsoLayout({ children }: { children: React.ReactNode }) {
  const index = getCorsoIndex();
  return (
    <div className="bg-cream min-h-screen">
      <div className="flex">
        <Sidebar index={index} />
        <main className="flex-1 min-w-0 w-full px-5 sm:px-8 py-6 sm:py-10 max-w-3xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
