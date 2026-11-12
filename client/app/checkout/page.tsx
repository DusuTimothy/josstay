import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, LockKeyhole } from "lucide-react";
import { GuestForm } from "@/components/checkout/guest-form";
import { PaymentForm } from "@/components/checkout/payment-form";
import { ReservationSummary } from "@/components/checkout/reservation-summary";
import { Container } from "@/components/ui/container";
import { Card, CardBody } from "@/components/ui/card";
import { SAMPLE_RESERVATION } from "@/lib/sample-data";

export const metadata: Metadata = {
  title: "Confirm and pay",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="pb-20">
      <Container className="py-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-metadata text-charcoal/60">
            <li>
              <Link href="/" className="hover:text-ocean">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" />
            </li>
            <li>
              <Link
                href="/hotels/crestview-suites-jos"
                className="hover:text-ocean"
              >
                Crestview Suites Jos
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" />
            </li>
            <li aria-current="page" className="font-medium text-charcoal">
              Checkout
            </li>
          </ol>
        </nav>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-h1 text-ocean">Confirm and pay</h1>
            <p className="mt-2 max-w-xl text-secondary text-charcoal/65">
              One calm step to go. Your total includes all taxes and fees, and
              the cancellation deadline is shown before you pay.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-soft px-3 py-1.5 text-metadata font-medium text-success">
            <LockKeyhole className="size-3.5" aria-hidden="true" />
            Secure checkout
          </span>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-start">
          <div className="space-y-6">
            <Card>
              <CardBody>
                <GuestForm
                  defaultValues={{
                    fullName: "",
                    email: "",
                    phone: "",
                  }}
                />
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <PaymentForm />
              </CardBody>
            </Card>

            <p className="px-1 text-metadata text-charcoal/55">
              By confirming, you agree to the JosStay terms and the hotel&apos;s
              cancellation policy. Payment is processed securely by Paystack.
            </p>
          </div>

          <ReservationSummary data={SAMPLE_RESERVATION} />
        </div>
      </Container>
    </div>
  );
}
