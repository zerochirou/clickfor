import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { LogIn } from "lucide-react";
import Link from "next/link";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import FlickerUnboxing from "@/components/commons/flicker-loading/flicker-unboxing";

export default function EmailPage() {
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
        <div className="w-full max-w-xl">
          <CardHeader className="mx-auto max-w-md w-full text-center py-4 mt-8">
            <h2 className="text-3xl font-semibold">Email Signup</h2>
          </CardHeader>
          <CardContent className="mx-auto max-w-md w-full">
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Full name</FieldLabel>
                  <Input
                    id="name"
                    autoComplete="off"
                    placeholder="Evil Rabbit"
                  />
                  <FieldDescription>
                    This appears on invoices and emails.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    autoComplete="off"
                    placeholder="you@example.com"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
          </CardContent>
          <CardFooter className="flex mt-6 items-end flex-col justify-end mx-auto max-w-md w-full">
            <Button variant={"default"} className="">
              {/*Create Account <ArrowRight />*/}
              Loading <FlickerUnboxing />
            </Button>
          </CardFooter>
        </div>
      </div>
    </div>
  );
}
