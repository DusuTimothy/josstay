import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { AuthForm } from "@/components/auth/auth-form";
import { Logo } from "@/components/layout/logo";
import { Card, CardBody } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to manage your JosStay bookings.",
};

export default function SignInPage() {
  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-12 sm:py-16">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo size="lg" />
          <h1 className="mt-5 text-h2 text-ocean">Welcome back</h1>
          <p className="mt-2 text-secondary text-charcoal/65">
            Sign in to see your bookings and plan your next stay in Jos.
          </p>
        </div>

        <Card>
          <CardBody>
            <AuthForm mode="sign-in" />
          </CardBody>
        </Card>

        <p className="mt-5 flex items-center justify-center gap-2 text-metadata text-charcoal/55">
          <ShieldCheck className="size-4 text-sage" aria-hidden="true" />
          Your details are encrypted and never shared with hotels.
        </p>
      </div>
    </Container>
  );
}
