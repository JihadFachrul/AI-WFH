"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const departmentSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(120, "Maksimal 120 karakter"),
  description: z.string().optional(),
});

export type DepartmentFormValues = z.infer<typeof departmentSchema>;

export interface DepartmentFormSubmit {
  name: string;
  description?: string;
}

interface Props {
  defaultValues: DepartmentFormValues;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (values: DepartmentFormSubmit) => void | Promise<void>;
}

export function DepartmentForm({
  defaultValues,
  isSubmitting,
  submitLabel,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues,
  });

  const submit = (values: DepartmentFormValues) =>
    onSubmit({
      name: values.name,
      description: values.description?.trim() || undefined,
    });

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Nama Department
        </label>
        <Input id="name" placeholder="mis. Engineering" {...register("name")} />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="description" className="text-sm font-medium">
          Deskripsi
        </label>
        <Textarea
          id="description"
          placeholder="Deskripsi singkat (opsional)"
          {...register("description")}
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Menyimpan…" : submitLabel}
      </Button>
    </form>
  );
}
