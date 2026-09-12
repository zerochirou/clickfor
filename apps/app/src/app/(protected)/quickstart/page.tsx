import {
  OnBoardingHeader,
  OnBoardingLayout,
  OnBoardingView,
} from "@/features/quickstart/components/onboarding";
import { isAuthenticated } from "@/lib/auth/auth-check";

export default async function QuickstartPage() {
  await isAuthenticated();

  return (
    <OnBoardingLayout>
      <OnBoardingHeader />
      <OnBoardingView />
    </OnBoardingLayout>
  );
}
