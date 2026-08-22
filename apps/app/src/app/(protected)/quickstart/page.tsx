import {
  OnBoardingHeader,
  OnBoardingLayout,
  OnBoardingView,
} from "@/features/quickstart/components/onboarding";

export default function QuickstartPage() {
  return (
    <OnBoardingLayout>
      <OnBoardingHeader />
      <OnBoardingView />
    </OnBoardingLayout>
  );
}
