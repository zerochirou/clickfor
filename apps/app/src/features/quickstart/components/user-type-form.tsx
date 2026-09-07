"use client";

import { OnBoardingStep } from "./onboarding";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Store, ToggleRight, User } from "lucide-react";

export type UserType = "owner" | "employee";

interface UserTypeFormProps {
  value: UserType | "";
  onChange: (value: UserType) => void;
}

export function UserTypeForm({ value, onChange }: UserTypeFormProps) {
  return (
    <OnBoardingStep>
      <FieldSet>
        <FieldLegend className="flex items-center justify-center gap-2">
          <ToggleRight className="h-4 w-4" />
          Pilih Peran Kamu!
        </FieldLegend>

        <FieldDescription>
          Pilih jenis pengguna untuk menentukan peran.
        </FieldDescription>

        <RadioGroup
          value={value}
          onValueChange={(value) => {
            if (value === "owner" || value === "employee") {
              onChange(value);
            }
          }}
        >
          {/* Owner */}
          <FieldLabel htmlFor="owner">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>
                  <Store className="text-primary" />
                  Owner
                </FieldTitle>

                <FieldDescription>
                  Pemilik kedai kopi, restoran, atau tempat makan lokal berskala
                  kecil.
                </FieldDescription>
              </FieldContent>

              <RadioGroupItem id="owner" value="owner" />
            </Field>
          </FieldLabel>

          {/* Employee */}
          <FieldLabel htmlFor="employee">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>
                  <User className="text-primary" />
                  Karyawan
                </FieldTitle>

                <FieldDescription>
                  Karyawan kedai kopi, restoran, atau tempat makan lokal kecil.
                </FieldDescription>
              </FieldContent>

              <RadioGroupItem id="employee" value="employee" />
            </Field>
          </FieldLabel>
        </RadioGroup>
      </FieldSet>
    </OnBoardingStep>
  );
}
