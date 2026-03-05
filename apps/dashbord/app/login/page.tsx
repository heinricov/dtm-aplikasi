"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/services/auth";
import { toast } from "sonner";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from "@/components/ui/input-group";
import { EyeIcon, EyeOffIcon, LockIcon } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("pwd") ?? "").trim();
    try {
      setSubmitting(true);
      const res = await login({ email, password });
      try {
        localStorage.setItem("dtm_user", JSON.stringify(res.user));
      } catch {
        // ignore localStorage errors
      }
      try {
        document.cookie = `access_token=${encodeURIComponent(
          res.token
        )}; Path=/; SameSite=Lax`;
      } catch {
        // ignore client cookie errors
      }
      toast.success("Signed in successfully");
      router.push("/dashboard");
    } catch (err) {
      const message =
        (err as { message?: string })?.message ?? "Failed to sign in";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form
        onSubmit={onSubmit}
        className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="p-8 pb-6">
          <div>
            <h1 className="mb-1 mt-4 text-xl font-semibold">Sign In to DTM</h1>
            <p className="text-sm">Welcome back! Sign in to continue</p>
          </div>

          <hr className="my-4 border-dashed" />

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm">
                Email
              </Label>
              <Input type="email" required name="email" id="email" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="pwd" className="text-sm">
                  Password
                </Label>
                <Button asChild variant="link" size="sm">
                  <Link
                    href="/login/forgot-password"
                    className="link intent-info variant-ghost text-sm"
                  >
                    Forgot your Password ?
                  </Link>
                </Button>
              </div>
              <InputGroup>
                <InputGroupAddon>
                  <LockIcon className="text-muted-foreground" />
                </InputGroupAddon>
                <InputGroupInput
                  className="border-0 shadow-none focus-visible:ring-0"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  name="pwd"
                  id="pwd"
                />

                <InputGroupAddon align="inline-end">
                  <InputGroupButton onClick={togglePasswordVisibility}>
                    {showPassword ? (
                      <EyeOffIcon className="size-4 text-muted-foreground" />
                    ) : (
                      <EyeIcon className="size-4 text-muted-foreground" />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>

            <Button className="w-full" type="submit" disabled={submitting}>
              {submitting ? "Signing In..." : "Sign In"}
            </Button>
          </div>
        </div>

        <div className="bg-muted rounded-(--radius) border p-3">
          <p className="text-accent-foreground text-center text-sm">
            If you any problem, please contact our support
            <Button asChild variant="link" className="px-2 text-blue-500">
              <Link href="#">DTM</Link>
            </Button>
            .
          </p>
        </div>
      </form>
    </section>
  );
}
