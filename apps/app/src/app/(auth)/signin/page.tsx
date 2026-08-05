import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { WordRotate } from "@/components/ui/word-rotate";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export default function SignupPage() {
  const providers = [
    { name: "Google", icon: "/icons/social-auth/google.svg" },
    { name: "GitHub", icon: "/icons/social-auth/github.svg" },
    { name: "Microsoft", icon: "/icons/social-auth/microsoft.svg" },
  ];
  const rotatePromotions = [
    "Login into clickfor.",
    "Access your Workspace",
    "Access your Shop",
  ];
  return (
    <div>
      <div className="sticky top-0 z-50 flex items-center justify-between p-4">
        <div>
          <h1 className="font-semibold text-2xl">Clickfor.</h1>
        </div>
        <Link href={"/signup"}>
          <Button variant={"outline"}>Sign Up</Button>
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-xl">
          <CardHeader className="mx-auto max-w-md w-full text-center py-8 mt-8">
            <WordRotate
              className="text-4xl font-semibold"
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
        </div>
      </div>
    </div>
  );
}
