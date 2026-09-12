"use client";

import { useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Workspace } from "@/lib/types/workspace";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { Building2, Save } from "lucide-react";
import { updateWorkspace } from "../../api/update-workspace";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const updateWorkspaceSchema = z.object({
  workspaceName: z
    .string()
    .min(2, "Nama workspace minimal 2 karakter")
    .max(100, "Nama workspace maksimal 100 karakter"),
  description: z
    .string()
    .max(300, "Deskripsi maksimal 300 karakter")
    .optional(),
  isActive: z.boolean(),
});

type UpdateWorkspaceValues = z.infer<typeof updateWorkspaceSchema>;

interface WorkspaceGeneralCardProps {
  workspace: Workspace;
}

export function WorkspaceGeneralCard({ workspace }: WorkspaceGeneralCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<UpdateWorkspaceValues>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      workspaceName: workspace.workspaceName || "",
      description: workspace.description || "",
      isActive: workspace.isActive ?? true,
    },
  });

  const isActiveValue = useWatch({
    control,
    name: "isActive",
    defaultValue: workspace.isActive ?? true,
  });

  const onSubmit = async (values: UpdateWorkspaceValues) => {
    try {
      await updateWorkspace({
        workspaceId: workspace.id,
        data: {
          workspaceName: values.workspaceName,
          description: values.description || null,
          isActive: values.isActive,
        },
      });

      toast.success("Pengaturan workspace berhasil diperbarui!");
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Failed to update workspace:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal memperbarui pengaturan workspace",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="bg-background">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="size-5 text-primary" />
            <CardTitle>Informasi Workspace</CardTitle>
          </div>
          <CardDescription>
            Ubah nama, deskripsi, dan status operasional workspace Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="workspaceName">Nama Workspace</Label>
            <Input
              id="workspaceName"
              placeholder="Contoh: Toko Kopi Senja"
              {...register("workspaceName")}
              className="max-w-md"
              disabled={isSubmitting || isPending}
            />
            {errors.workspaceName && (
              <p className="text-xs text-destructive">
                {errors.workspaceName.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Deskripsi (Opsional)</Label>
            <Textarea
              id="description"
              placeholder="Jelaskan secara singkat mengenai workspace atau cabang ini..."
              rows={3}
              {...register("description")}
              className="max-w-md resize-none"
              disabled={isSubmitting || isPending}
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between max-w-md pt-2 border-t">
            <div className="flex flex-col gap-0.5">
              <Label
                htmlFor="isActive"
                className="text-sm font-medium cursor-pointer"
              >
                Status Operasional Workspace
              </Label>
              <p className="text-xs text-muted-foreground">
                Nonaktifkan jika workspace ini sedang tidak beroperasi sementara
              </p>
            </div>
            <Switch
              id="isActive"
              checked={isActiveValue}
              onCheckedChange={(checked) =>
                setValue("isActive", checked, { shouldDirty: true })
              }
              disabled={isSubmitting || isPending}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t pt-4">
          <Button
            type="submit"
            disabled={!isDirty || isSubmitting || isPending}
            className="gap-2"
          >
            {isSubmitting || isPending ? (
              <Spinner className="size-4" />
            ) : (
              <Save className="size-4" />
            )}
            Simpan Perubahan
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
