export function ContentWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col flex-1 min-h-screen overflow-hidden">
      {children}
    </div>
  );
}