"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { UserRole } from "@/types/auth";

const SELECT_CLASS =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const ROLES: UserRole[] = ["EMPLOYEE", "MANAGER", "ADMIN", "SUPER_ADMIN"];

const baseSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(120),
  email: z.string(),
  password: z.string(),
  role: z.enum(["EMPLOYEE", "MANAGER", "ADMIN", "SUPER_ADMIN"]),
  departmentId: z.string(),
  isActive: z.boolean(),
});

export type UserFormValues = z.infer<typeof baseSchema>;

export interface UserFormSubmit {
  name: string;
  email?: string;
  password?: string;
  role: UserRole;
  departmentId?: string;
  isActive: boolean;
}

/** Validasi email & password hanya wajib saat create. */
function makeSchema(mode: "create" | "edit") {
  return baseSchema.superRefine((val, ctx) => {
    if (mode !== "create") return;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val.email)) {
      ctx.addIssue({
        path: ["email"],
        code: z.ZodIssueCode.custom,
        message: "Email tidak valid",
      });
    }
    if (val.password.length < 8) {
      ctx.addIssue({
        path: ["password"],
        code: z.ZodIssueCode.custom,
        message: "Password minimal 8 karakter",
      });
    }
  });
}

interface Props {
  mode: "create" | "edit";
  defaultValues: UserFormValues;
  departments: { id: string; name: string }[];
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (values: UserFormSubmit) => void | Promise<void>;
}

export function UserForm({
  mode,
  defaultValues,
  departments,
  isSubmitting,
  submitLabel,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(makeSchema(mode)),
    defaultValues,
  });

  const submit = (values: UserFormValues) =>
    onSubmit({
      name: values.name,
      email: mode === "create" ? values.email : undefined,
      password: mode === "create" ? values.password : undefined,
      role: values.role,
      departmentId: values.departmentId || undefined,
      isActive: values.isActive,
    });

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Nama
        </label>
        <Input id="name" placeholder="Nama lengkap" {...register("name")} />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      {mode === "create" && (
        <>
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="user@company.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Minimal 8 karakter"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
        </>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="role" className="text-sm font-medium">
            Role
          </label>
          <select id="role" className={SELECT_CLASS} {...register("role")}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="departmentId" className="text-sm font-medium">
            Department
          </label>
          <select
            id="departmentId"
            className={SELECT_CLASS}
            {...register("departmentId")}
          >
            <option value="">— Tidak ada —</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {mode === "edit" && (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="size-4 rounded border-input accent-primary"
            {...register("isActive")}
          />
          Akun aktif
        </label>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Menyimpan…" : submitLabel}
      </Button>
    </form>
  );
}
