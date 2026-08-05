import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { WordRotate } from "@/components/ui/word-rotate";
import { ArrowRight, LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SignupPage() {
  const providers = [
    { name: "Google", icon: "/icons/social-auth/google.svg" },
    { name: "GitHub", icon: "/icons/social-auth/github.svg" },
    { name: "Microsoft", icon: "/icons/social-auth/microsoft.svg" },
  ];
  const rotatePromotions = [
    "has 6× faster preview builds & deployments",
    "had 100% uptime at peak Black Friday volume",
    "has 6× faster preview builds & deployments",
  ];
  return (
    <div>
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
              {providers.map((item, index) => {
                return (
                  <li key={index}>
                    <Button
                      variant={"outline"}
                      className="w-full text-md flex flex-row items-center gap-2"
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
  );
}
