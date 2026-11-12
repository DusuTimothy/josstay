import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { AuthForm } from "@/components/auth/auth-form";
import { Logo } from "@/components/layout/logo";
import { Card, CardBody } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create a JosStay account to book verified hotels in Jos.",
};

export default function SignUpPage() {
  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-12 sm:py-16">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo size="lg" />
          <h1 className="mt-5 text-h2 text-ocean">Create your account</h1>
          <p className="mt-2 text-secondary text-charcoal/75">
            One account for clear prices, instant confirmation and every stay in
            Jos.
          </p>
        </div>

        <Card>
          <CardBody>
            <AuthForm mode="sign-up" />
          </CardBody>
        </Card>

        <p className="mt-5 flex items-center justify-center gap-2 text-metadata text-charcoal/75">
          <ShieldCheck className="size-4 text-sage-deep" aria-hidden="true" />
          We never store card details. Payments go through Paystack.
        </p>
      </div>
    </Container>
  );
}
