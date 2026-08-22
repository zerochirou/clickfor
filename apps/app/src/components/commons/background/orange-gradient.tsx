export function OrangeGradientBackground({
  children, 
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden min-h-screen">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(rgba(0,0,0,0) 0%, rgba(255,230,180,0.12) 28%, rgb(255,255,255) 18%, rgb(255,200,140) 68%, rgb(230,170,100) 100%)",
          mixBlendMode: "multiply",
        }}
        aria-hidden="true"
      />

      {/* Layer 2 */}
      <div
        className="absolute inset-0 pointer-events-none blur-[90px] md:blur-[130px]"
        style={{
          background:
            "linear-gradient(rgba(0,0,0,0) 0%, rgba(255,230,180,0.22) 34%, rgb(255,255,255) 66%, rgb(255,200,140) 82%, rgb(230,170,100) 100%)",
          mixBlendMode: "multiply",
        }}
        aria-hidden="true"
      />
      <div className="relative flex min-h-screen flex-col items-center justify-center z-1">
        {children}
      </div>
    </div>
  );
}
