import { OrangeGradientBackground } from "@/components/commons/background/orange-gradient";

export function WorkspaceLobbyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OrangeGradientBackground>
      <div className="mx-auto max-w-xl w-full relative z-10">{children}</div>
    </OrangeGradientBackground>
  );
}
