export function Checklist({ children }: { children: React.ReactNode }) {
  return (
    <ul className="my-5 list-none p-0 space-y-2">
      {children}
    </ul>
  );
}

export function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-sm text-body">
      <span className="text-terracotta font-bold mt-0.5">☐</span>
      <span>{children}</span>
    </li>
  );
}
