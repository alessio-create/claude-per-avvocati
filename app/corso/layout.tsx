import { getCorsoIndex } from '../../lib/content';
import { Sidebar } from '../../components/course/Sidebar';

export default function CorsoLayout({ children }: { children: React.ReactNode }) {
  const index = getCorsoIndex();
  return (
    <div className="bg-cream min-h-screen">
      {/* `md:flex` not `flex`: on mobile the sidebar is a fixed off-canvas
          drawer, so block layout lets <main> take the whole viewport width.
          On desktop the flex row puts the sidebar (260px) next to main. */}
      <div className="md:flex">
        <Sidebar index={index} />
        {/* `max-w-3xl mx-auto` centers the inner content but lives on a
            child div, not directly on the flex item — putting it on the
            flex child itself fights with flex-1 and collapses the column
            on narrow viewports. */}
        <main className="flex-1 min-w-0 w-full">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 py-6 sm:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
