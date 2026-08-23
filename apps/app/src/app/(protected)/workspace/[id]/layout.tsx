import { SidebarLayout } from "@/features/workspace/components/sidebar/sidebar-layout";
import { ThemeProvider } from "@/lib/theme-provider";

export default function WorkspaceLayout({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider>
      <SidebarLayout>{children}</SidebarLayout>
    </ThemeProvider>
  );
}
