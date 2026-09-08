"use client";

import { ReactNode, useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { setQuickstartCompleted } from "@/features/quickstart/lib/quickstart-check";
import {
  UserType,
  UserTypeForm,
} from "@/features/quickstart/components/user-type-form";
import { JoinWorkspace } from "@/features/quickstart/components/join-workspace";
import {
  SetWorkspaceDescription,
  SetWorkspaceName,
} from "@/features/quickstart/components/create-workspace";
import { createWorkspace } from "@/features/workspace/api/post-workspaces";
import { Spinner } from "@/components/ui/spinner";

interface OnBoardingFrameProps {
  steps: ReactNode[];
  step: number;
  direction: number;
  canNext: boolean;
  onNext: () => void;
  onPrev: () => void;
  isLoading?: boolean;
}

interface OnBoardingIndicatorProps {
  step: number;
  totalSteps: number;
}

const variants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 50 : -50,
    scale: 0.985,
    filter: "blur(3px)",
  }),

  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
  },

  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -50 : 50,
    scale: 0.985,
    filter: "blur(3px)",
  }),
};

export function OnBoardingHeader() {
  return (
    <div className="absolute top-0 z-50 flex w-full items-center justify-between p-4">
      <h1 className="text-2xl font-semibold">Clickfor.</h1>

      <Button variant="outline">Skip</Button>
    </div>
  );
}

function OnBoardingIndicator({ step, totalSteps }: OnBoardingIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {Array.from({
        length: totalSteps,
      }).map((_, index) => {
        const dotStep = index + 1;

        const isCompleted = dotStep < step;

        const isCurrent = dotStep === step;

        return (
          <motion.div
            key={dotStep}
            initial={false}
            animate={{
              width: isCurrent ? 24 : 8,
              opacity: isCurrent || isCompleted ? 1 : 0.3,
              scale: isCurrent ? 1 : 0.9,
            }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="h-2 rounded-full bg-card"
          />
        );
      })}
    </div>
  );
}

export function OnBoardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(rgba(0,0,0,0) 0%, rgba(255,230,180,0.12) 28%, rgb(255,255,255) 18%, rgb(255,200,140) 68%, rgb(230,170,100) 100%)",
          mixBlendMode: "multiply",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 blur-[90px] md:blur-[130px]"
        style={{
          background:
            "linear-gradient(rgba(0,0,0,0) 0%, rgba(255,230,180,0.22) 34%, rgb(255,255,255) 66%, rgb(255,200,140) 82%, rgb(230,170,100) 100%)",
          mixBlendMode: "multiply",
        }}
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export function OnBoardingStep({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

export function OnBoardingFrame({
  steps,
  step,
  direction,
  canNext,
  onNext,
  onPrev,
  isLoading,
}: OnBoardingFrameProps) {
  const totalSteps = steps.length;

  const currentStep = steps[step - 1];

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-center">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto w-full max-w-xl overflow-hidden"
        >
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>
                Step {step} of {totalSteps}
              </CardTitle>
            </CardHeader>

            <CardContent className="relative overflow-hidden">
              {currentStep}
            </CardContent>

            <CardFooter className="flex items-center justify-between">
              {step > 1 ? (
                <Button variant="outline" onClick={onPrev}>
                  <ChevronLeft />
                  Kembali
                </Button>
              ) : (
                <div />
              )}

              <Button onClick={onNext} disabled={!canNext && isLoading}>
                {step === totalSteps ? (
                  <>
                    {isLoading ? (
                      <>
                        Loading
                        <Spinner />
                      </>
                    ) : (
                      <>
                        Selesai
                        <Check />
                      </>
                    )}
                  </>
                ) : (
                  <>
                    Lanjut
                    <ChevronRight />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>

      <OnBoardingIndicator step={step} totalSteps={totalSteps} />
    </div>
  );
}

export function OnBoardingView() {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType | "">("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isCreateWorkspacePending, startTransitionCreateWorkspace] =
    useTransition();
  const [workspaceId, setWorkspaceId] = useState("");

  const steps = [
    <UserTypeForm
      key="user-type"
      value={userType}
      onChange={(value) => {
        setUserType(value);
        setStep(1);
        setDirection(1);
      }}
    />,

    ...(userType === "owner"
      ? [
          <SetWorkspaceName
            key="workspace-name"
            value={workspaceName}
            onChange={setWorkspaceName}
          />,

          <SetWorkspaceDescription
            key="workspace-description"
            value={workspaceDescription}
            onChange={setWorkspaceDescription}
          />,
        ]
      : userType === "employee"
        ? [<JoinWorkspace key="join-workspace" />]
        : []),
  ];

  const totalSteps = steps.length;

  const canNext = (() => {
    switch (step) {
      case 1:
        return userType !== "";

      case 2:
        if (userType === "owner") {
          return workspaceName.trim().length > 0;
        }

        if (userType === "employee") {
          // Nanti ganti dengan validasi OTP
          return true;
        }

        return false;

      case 3:
        if (userType === "owner") {
          return workspaceDescription.trim().length > 0;
        }

        return false;

      default:
        return false;
    }
  })();

  const handleNext = () => {
    // Defensive validation.
    // Jangan hanya bergantung pada disabled.
    if (!canNext) {
      return;
    }

    if (step < totalSteps) {
      setDirection(1);
      setStep((prev) => prev + 1);

      return;
    }

    handleFinish();
  };

  const handlePrev = () => {
    if (step <= 1) {
      return;
    }

    setDirection(-1);
    setStep((prev) => prev - 1);
  };

  const handleFinish = () => {
    startTransitionCreateWorkspace(async () => {
      try {
        let targetWorkspaceId = workspaceId;

        if (userType === "owner") {
          const res = await createWorkspace({
            data: {
              workspaceName: workspaceName,
              description: workspaceDescription,
            },
          });
          targetWorkspaceId = res.id;
          setWorkspaceId(res.id);
        }

        await setQuickstartCompleted();

        if (targetWorkspaceId) {
          router.push(`/workspace/${targetWorkspaceId}`);
        } else {
          router.push("/workspace");
        }
      } catch (error) {
        console.error("Gagal menyelesaikan onboarding:", error);
      }
    });
  };

  return (
    <OnBoardingFrame
      steps={steps}
      step={step}
      direction={direction}
      canNext={canNext}
      onNext={handleNext}
      onPrev={handlePrev}
      isLoading={isCreateWorkspacePending}
    />
  );
}
