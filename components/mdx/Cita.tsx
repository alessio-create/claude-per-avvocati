export function Cita({ children, autore }: { children: React.ReactNode; autore?: string }) {
  // MDX wraps the children in a <p> automatically, so we don't add another here
  // (otherwise <p> nested in <p> = hydration error).
  return (
    <blockquote className="my-7 border-l-4 border-terracotta pl-5 font-serif italic text-lg leading-snug text-terracotta [&_p]:m-0 [&_p]:text-terracotta">
      {children}
      {autore && <footer className="mt-2 text-xs text-muted not-italic font-sans"> {autore}</footer>}
    </blockquote>
  );
}
