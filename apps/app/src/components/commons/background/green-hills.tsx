export function GreenHillsBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[url('/images/background/green-hills.jpg')] bg-cover bg-center bg-no-repeat min-h-screen flex flex-col items-center justify-center p-4">
      {children}
    </div>
  );
}
