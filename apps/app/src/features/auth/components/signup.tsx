"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { WordRotate } from "@/components/ui/word-rotate";
import { ArrowRight, ChevronRight, LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { handleGoogleAuth } from "../lib/handle-google-auth";
import { handleGithubAuth } from "../lib/handle-github-auth";
import { handleMicrosoftAuth } from "../lib/handle-microsoft-auth";
import { OrangeGradientBackground } from "@/components/commons/background/orange-gradient";

export function SignUpBackground({ children }: { children: React.ReactNode }) {
  return <OrangeGradientBackground>{children}</OrangeGradientBackground>;
}

export function SignUpHeader() {
  return (
    <div className="absolute top-0 w-full z-50 flex items-center justify-between p-4">
      <div>
        <h1 className="font-semibold text-2xl">Clickfor.</h1>
      </div>
      <Link href={"/signin"}>
        <Button variant={"outline"}>
          Sign In <ChevronRight />
        </Button>
      </Link>
    </div>
  );
}

export function SignUpContent() {
  const providers = [
    {
      name: "Google",
      icon: "/icons/social-auth/google.svg",
      onClick: handleGoogleAuth,
    },
    {
      name: "GitHub",
      icon: "/icons/social-auth/github.svg",
      onClick: handleGithubAuth,
    },
    {
      name: "Microsoft",
      icon: "/icons/social-auth/microsoft.svg",
      onClick: handleMicrosoftAuth,
    },
  ];
  const rotatePromotions = [
    "SignUp into clickfor.",
    "Create your Workspace",
    "Create your Shop",
  ];
  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="mx-auto max-w-md w-full text-center py-4 mt-8">
        <WordRotate
          duration={4000}
          className="text-3xl font-semibold"
          words={rotatePromotions}
        />
      </CardHeader>
      <CardContent className="mx-auto max-w-md w-full">
        <ul className="flex flex-col gap-2">
          {providers.map((item, index) => {
            return (
              <li key={index}>
                <Button
                  variant={"outline"}
                  className="w-full text-md flex flex-row items-center gap-2"
                  onClick={item.onClick}
                >
                  <Image
                    src={item.icon}
                    alt={item.name}
                    className="w-4 h-4"
                    width={40}
                    height={40}
                  />
                  <span>{item.name}</span>
                </Button>
              </li>
            );
          })}
        </ul>
      </CardContent>
      <CardFooter className="flex items-center flex-col justify-center mx-auto max-w-md w-full mt-2">
        <p className="text-xs text-gray-500 mt-8">
          By joining, you agree to our Terms of Service and Privacy Policy
        </p>
      </CardFooter>
    </Card>
  );
}

export function SignUpFooter() {
  const rotatePromotions = [
    "has 6× faster preview builds & deployments",
    "had 100% uptime at peak Black Friday volume",
    "has 6× faster preview builds & deployments",
  ];
  return (
    <div className="mt-4">
      <WordRotate words={rotatePromotions} />
    </div>
  );
}

export function SignupForm() {
  const rotatePromotions = [
    "has 6× faster preview builds & deployments",
    "had 100% uptime at peak Black Friday volume",
    "has 6× faster preview builds & deployments",
  ];
  return (
    <div className="relative overflow-hidden min-h-screen">
      <div
        className="absolute inset-0 pointer-events-none blur-[125px] md:blur-[180px]"
        style={{
          background:
            "linear-gradient(rgba(0,0,0,0) 0%, rgba(255,183,77,0.12) 28%, rgb(255,255,255) 18%, rgb(255,138,61) 68%, rgb(183,77,0) 100%)",
          mixBlendMode: "multiply",
        }}
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 pointer-events-none blur-[100px] md:blur-[144px]"
        style={{
          background:
            "linear-gradient(rgba(0,0,0,0) 0%, rgba(255,183,77,0.22) 34%, rgb(255,255,255) 66%, rgb(255,138,61) 82%, rgb(183,77,0) 100%)",
          mixBlendMode: "multiply",
        }}
        aria-hidden="true"
      />
      <div className="relative z-1">
        <div className="sticky top-0 z-50 flex items-center justify-between p-4">
          <div>
            <h1 className="font-semibold text-2xl">Clickfor.</h1>
          </div>
          <Link href={"/signin"}>
            <Button variant={"outline"}>
              Sign In <LogIn />
            </Button>
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Card className="w-full max-w-xl">
            <CardHeader className="mx-auto max-w-md w-full text-center py-4 mt-8">
              <h2 className="text-3xl font-semibold">
                Your digital store is just a step away.
              </h2>
            </CardHeader>
            <CardContent className="mx-auto max-w-md w-full">
              <ul className="flex flex-col gap-2">
                <Button
                  variant={"outline"}
                  className="w-full text-md flex flex-row items-center gap-2"
                  onClick={handleGoogleAuth}
                >
                  <Image
                    src={"/icons/social-auth/google.svg"}
                    alt={"Google"}
                    className="w-4 h-4"
                    width={40}
                    height={40}
                  />
                  <span>Google</span>
                </Button>
                <Button
                  variant={"outline"}
                  className="w-full text-md flex flex-row items-center gap-2"
                >
                  <Image
                    src={"/icons/social-auth/github.svg"}
                    alt={"GitHub"}
                    className="w-4 h-4"
                    width={40}
                    height={40}
                  />
                  <span>GitHub</span>
                </Button>
                <Button
                  variant={"outline"}
                  className="w-full text-md flex flex-row items-center gap-2"
                >
                  <Image
                    src={"/icons/social-auth/microsoft.svg"}
                    alt={"Microsoft"}
                    className="w-4 h-4"
                    width={40}
                    height={40}
                  />
                  <span>Microsoft</span>
                </Button>
              </ul>
            </CardContent>
            <CardFooter className="flex items-center flex-col justify-center mx-auto max-w-md w-full mt-2">
              <Link href={"/signup/email"}>
                <Button variant={"ghost"} className="text-blue-500 w-full">
                  Continue with Email <ArrowRight />
                </Button>
              </Link>
              <p className="text-xs text-gray-500 mt-8">
                By joining, you agree to our Terms of Service and Privacy Policy
              </p>
            </CardFooter>
          </Card>
          <div className="mt-4">
            <WordRotate words={rotatePromotions} />
          </div>
        </div>
      </div>
    </div>
  );
}
