'use client'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { WordRotate } from "@/components/ui/word-rotate";
import { ArrowRight, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { handleGoogleAuth } from "../lib/handle-google-auth";
import { handleGithubAuth } from "../lib/handle-github-auth";
import { handleMicrosoftAuth } from "../lib/handle-microsoft-auth";

export function SignInBackground({ children }: { children: React.ReactNode }) {
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

export function SignInHeader() {
  return (
    <div className="absolute top-0 w-full z-50 flex items-center justify-between p-4">
      <div>
        <h1 className="font-semibold text-2xl">Clickfor.</h1>
      </div>
      <Link href={"/signup"}>
        <Button variant={"default"}>
          Sign Up <ChevronRight />
        </Button>
      </Link>
    </div>
  );
}

export function SignInContent() {
  const providers = [
    { name: "Google", icon: "/icons/social-auth/google.svg", onClick: handleGoogleAuth },
    { name: "GitHub", icon: "/icons/social-auth/github.svg", onClick: handleGithubAuth },
    { name: "Microsoft", icon: "/icons/social-auth/microsoft.svg", onClick: handleMicrosoftAuth },
  ];
  const rotatePromotions = [
    "Login into clickfor.",
    "Access your Workspace",
    "Access your Shop",
  ];
  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="mx-auto max-w-xl w-full text-center mt-8">
        <WordRotate
          className="text-3xl font-semibold"
          words={rotatePromotions}
        />
      </CardHeader>
      <CardContent className="mx-auto max-w-sm w-full">
        <ul className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Input placeholder="Email Address" type="email" />
            <Button>
              Next <ArrowRight />
            </Button>
          </div>
          <Separator className={"my-4"} />
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
      <CardFooter className="flex items-center flex-col justify-center mx-auto max-w-md mt-2 w-full">
        <Link href={"/signup"}>
          <Button variant={"ghost"} className="text-blue-500 w-full">
            Dont have an account?
          </Button>
        </Link>
        <p className="text-xs text-gray-500 mt-8">
          By joining, you agree to our Terms of Service and Privacy Policy
        </p>
      </CardFooter>
    </Card>
  );
}
