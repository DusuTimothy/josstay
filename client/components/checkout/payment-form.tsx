import { CreditCard, LockKeyhole, ShieldCheck } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

export interface PaymentErrors {
  cardNumber?: string;
  expiry?: string;
  cvc?: string;
}

export interface PaymentFormProps {
  errors?: PaymentErrors;
  disabled?: boolean;
  className?: string;
}

export function PaymentForm({
  errors,
  disabled,
  className,
}: PaymentFormProps) {
  return (
    <section className={className} aria-labelledby="payment-details">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-sand pb-4">
        <div>
          <h2 id="payment-details" className="text-h3 font-semibold text-ocean">
            Payment details
          </h2>
          <p className="mt-1 text-secondary text-charcoal/75">
            You&apos;ll complete payment on Paystack&apos;s secure checkout.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-soft px-3 py-1 text-metadata font-medium text-success">
          <LockKeyhole className="size-3.5" aria-hidden="true" />
          Secure payment
        </span>
      </div>

      <div className="mt-5 space-y-4">
        <FormField
          id="cardNumber"
          label="Card number"
          error={errors?.cardNumber}
        >
          <div className="relative">
            <Input
              id="cardNumber"
              name="cardNumber"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="0000 0000 0000 0000"
              invalid={Boolean(errors?.cardNumber)}
              aria-describedby={
                errors?.cardNumber ? "cardNumber-error" : undefined
              }
              disabled={disabled}
              className="pl-10"
            />
            <CreditCard
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-charcoal/35"
              aria-hidden="true"
            />
          </div>
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField id="expiry" label="Expiry" error={errors?.expiry}>
            <Input
              id="expiry"
              name="expiry"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM / YY"
              invalid={Boolean(errors?.expiry)}
              aria-describedby={errors?.expiry ? "expiry-error" : undefined}
              disabled={disabled}
            />
          </FormField>

          <FormField id="cvc" label="CVC" error={errors?.cvc}>
            <Input
              id="cvc"
              name="cvc"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="123"
              maxLength={4}
              invalid={Boolean(errors?.cvc)}
              aria-describedby={errors?.cvc ? "cvc-error" : undefined}
              disabled={disabled}
            />
          </FormField>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-2.5 rounded-md bg-ivory p-3 text-metadata text-charcoal/75">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-sage-deep" aria-hidden="true" />
        <p>
          Card details are entered on Paystack. JosStay never stores your card
          number. Your total is shown before you confirm.
        </p>
      </div>
    </section>
  );
}
