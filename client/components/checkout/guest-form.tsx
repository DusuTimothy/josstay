import type { GuestDetails } from "@/lib/types";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

export interface GuestFormProps {
  defaultValues?: Partial<GuestDetails>;
  errors?: Partial<Record<keyof GuestDetails, string>>;
  disabled?: boolean;
  className?: string;
}

export function GuestForm({
  defaultValues,
  errors,
  disabled,
  className,
}: GuestFormProps) {
  return (
    <section className={className} aria-labelledby="guest-information">
      <div className="border-b border-sand pb-4">
        <h2
          id="guest-information"
          className="text-h3 font-semibold text-ocean"
        >
          Guest information
        </h2>
        <p className="mt-1 text-secondary text-charcoal/75">
          We&apos;ll send your confirmation and receipt to these details.
        </p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <FormField
          id="fullName"
          label="Full name"
          required
          error={errors?.fullName}
          className="sm:col-span-2"
        >
          <Input
            id="fullName"
            name="fullName"
            autoComplete="name"
            placeholder="As it appears on your ID"
            defaultValue={defaultValues?.fullName}
            invalid={Boolean(errors?.fullName)}
            aria-describedby={errors?.fullName ? "fullName-error" : undefined}
            disabled={disabled}
            required
          />
        </FormField>

        <FormField id="email" label="Email address" required error={errors?.email}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            defaultValue={defaultValues?.email}
            invalid={Boolean(errors?.email)}
            aria-describedby={errors?.email ? "email-error" : undefined}
            disabled={disabled}
            required
          />
        </FormField>

        <FormField
          id="phone"
          label="Phone number"
          required
          hint="We use this for WhatsApp updates."
          error={errors?.phone}
        >
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+234 803 000 0000"
            defaultValue={defaultValues?.phone}
            invalid={Boolean(errors?.phone)}
            aria-describedby={
              errors?.phone ? "phone-error" : "phone-hint"
            }
            disabled={disabled}
            required
          />
        </FormField>
      </div>
    </section>
  );
}
