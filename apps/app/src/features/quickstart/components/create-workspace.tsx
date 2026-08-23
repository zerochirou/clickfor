"use client";

import { OnBoardingStep } from "./onboarding";

import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { TextAlignStart, User } from "lucide-react";

interface SetWorkspaceNameProps {
  value: string;
  onChange: (value: string) => void;
}

interface SetWorkspaceDescriptionProps {
  value: string;
  onChange: (value: string) => void;
}

export function SetWorkspaceName({ value, onChange }: SetWorkspaceNameProps) {
  return (
    <OnBoardingStep>
      <FieldSet>
        <Field>
          <FieldLabel htmlFor="workspace-name">
            <User className="h-4 w-4" />
            Apa nama workspace kamu?
          </FieldLabel>

          <Input
            id="workspace-name"
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Coffee Shop Kediri"
            autoComplete="organization"
          />

          <FieldDescription>
            Buat nama workspace yang unik untuk workspace kamu.
          </FieldDescription>
        </Field>
      </FieldSet>
    </OnBoardingStep>
  );
}

export function SetWorkspaceDescription({
  value,
  onChange,
}: SetWorkspaceDescriptionProps) {
  return (
    <OnBoardingStep>
      <FieldSet>
        <Field>
          <FieldLabel htmlFor="workspace-description">
            <TextAlignStart className="h-4 w-4" />
            Masukkan Deskripsi!
          </FieldLabel>

          <Textarea
            id="workspace-description"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Deskripsi workspace kamu"
          />

          <FieldDescription>
            Deskripsi workspace kamu akan ditampilkan di halaman utama.
          </FieldDescription>
        </Field>
      </FieldSet>
    </OnBoardingStep>
  );
}
