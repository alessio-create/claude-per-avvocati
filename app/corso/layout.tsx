import { getCorsoIndex } from '../../lib/content';
import { Sidebar } from '../../components/course/Sidebar';

export default function CorsoLayout({ children }: { children: React.ReactNode }) {
  const index = getCorsoIndex();
  return (
    <div className="bg-cream min-h-screen">
      <div className="flex">
        <Sidebar index={index} />
        <main className="flex-1 px-8 py-10 max-w-3xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
