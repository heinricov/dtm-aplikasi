import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form
        action=""
        className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div>
            <h1 className="mb-1 mt-4 text-xl font-semibold">
              Recover Password
            </h1>
            <p className="text-sm">Enter your email to receive a reset link</p>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="block text-sm">
                Name
              </Label>
              <Input
                type="text"
                required
                name="name"
                id="name"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm">
                Email
              </Label>
              <Input
                type="email"
                required
                name="email"
                id="email"
                placeholder="name@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="block text-sm">
                New Password
              </Label>
              <Input
                type="password"
                required
                name="newPassword"
                id="newPassword"
                placeholder="New Password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword" className="block text-sm">
                Confirm New Password
              </Label>
              <Input
                type="password"
                required
                name="confirmNewPassword"
                id="confirmNewPassword"
                placeholder="Confirm New Password"
              />
            </div>

            <Button className="w-full">Create New Password</Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              We'll send you a link to reset your password.
            </p>
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
