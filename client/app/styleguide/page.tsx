"use client";

import { useState, type ReactNode } from "react";
import { Search, ShieldCheck } from "lucide-react";
import { HotelCard } from "@/components/hotel/hotel-card";
import { TrustStrip } from "@/components/layout/trust-strip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Chip } from "@/components/ui/chip";
import { Container } from "@/components/ui/container";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Rating } from "@/components/ui/rating";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { SAMPLE_HOTELS } from "@/lib/sample-data";

const COLOURS = [
  { name: "Deep Ocean", hex: "#173B4D", className: "bg-ocean text-ivory" },
  { name: "Sage Green", hex: "#7F9C8D", className: "bg-sage text-ocean" },
  { name: "Soft Sage", hex: "#DCE7E0", className: "bg-sage-soft text-ocean" },
  { name: "Warm Ivory", hex: "#F7F4ED", className: "bg-ivory text-ocean" },
  { name: "Sand", hex: "#E9DFCF", className: "bg-sand text-ocean" },
  { name: "Muted Gold", hex: "#B99A62", className: "bg-gold text-ocean" },
  { name: "Charcoal", hex: "#283238", className: "bg-charcoal text-ivory" },
  { name: "Error", hex: "#B42318", className: "bg-error text-white" },
];

export default function StyleGuidePage() {
  const [breakfast, setBreakfast] = useState(true);
  const [cancellation, setCancellation] = useState(false);

  return (
    <Container className="space-y-14 py-12">
      <header className="border-b border-sand pb-8">
        <p className="text-metadata font-semibold uppercase tracking-[0.16em] text-sage">
          Design system
        </p>
        <h1 className="mt-2 text-h1 text-ocean">JosStay component library</h1>
        <p className="mt-3 max-w-2xl text-body text-charcoal/65">
          Every brand token and component state on one page. This route is a
          build reference — remove or protect it before launch.
        </p>
      </header>

      <Section title="Colour">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {COLOURS.map((colour) => (
            <div
              key={colour.name}
              className="overflow-hidden rounded-lg border border-sand"
            >
              <div
                className={`flex h-24 items-end p-3 text-metadata font-semibold ${colour.className}`}
              >
                {colour.name}
              </div>
              <div className="flex items-center justify-between bg-white px-3 py-2 text-metadata text-charcoal/60">
                <span>{colour.hex}</span>
                <span>{colour.name.split(" ")[0].toLowerCase()}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <div className="space-y-5 rounded-lg border border-sand bg-white p-6">
          <p className="font-serif text-h1 text-ocean">
            H1 · Find somewhere that feels like home.
          </p>
          <p className="font-serif text-h2 text-ocean">
            H2 · Stays guests return to
          </p>
          <p className="text-h3 text-ocean">H3 · What this place offers</p>
          <p className="text-hotel font-semibold text-ocean">
            Hotel name · Crestview Suites Jos
          </p>
          <p className="text-body text-charcoal/75">
            Body · Discover hotels designed around the way you travel. Prices
            always show whether taxes and fees are included.
          </p>
          <p className="text-secondary text-charcoal/70">
            Secondary · Free cancellation until 19 Nov 2026.
          </p>
          <p className="text-metadata font-medium uppercase tracking-[0.12em] text-charcoal/60">
            Metadata · 2.4 km from centre
          </p>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-sand bg-white p-6">
          <Button>Primary action</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="subtle">Subtle</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="link">Text link</Button>
          <Button isLoading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Search">
            <Search aria-hidden="true" />
          </Button>
        </div>
      </Section>

      <Section title="Form controls">
        <div className="grid gap-6 rounded-lg border border-sand bg-white p-6 md:grid-cols-2">
          <FormField id="sg-email" label="Email address" required>
            <Input id="sg-email" type="email" placeholder="you@example.com" />
          </FormField>
          <FormField
            id="sg-phone"
            label="Phone number"
            hint="We use this for WhatsApp updates."
          >
            <Input id="sg-phone" type="tel" placeholder="+234 803 000 0000" />
          </FormField>
          <FormField
            id="sg-error"
            label="Error state"
            error="Enter a valid email address."
          >
            <Input id="sg-error" invalid defaultValue="not-an-email" />
          </FormField>
          <FormField id="sg-select" label="Guests">
            <Select id="sg-select" defaultValue="2">
              <option value="1">1 adult</option>
              <option value="2">2 adults</option>
              <option value="3">3 adults</option>
            </Select>
          </FormField>
          <FormField
            id="sg-message"
            label="Special requests"
            optionalLabel="Optional"
            className="md:col-span-2"
          >
            <Textarea
              id="sg-message"
              placeholder="Anything the hotel should know?"
            />
          </FormField>
          <div className="space-y-4 md:col-span-2">
            <Checkbox label="Free cancellation only" />
            <Toggle
              label="Breakfast included"
              checked={breakfast}
              onCheckedChange={setBreakfast}
            />
            <Toggle
              label="Free cancellation"
              checked={cancellation}
              onCheckedChange={setCancellation}
            />
          </div>
        </div>
      </Section>

      <Section title="Chips, badges and rating">
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-sand bg-white p-6">
          <Chip tone="sage">Free cancellation</Chip>
          <Chip tone="gold">Breakfast included</Chip>
          <Chip tone="neutral">Limited availability</Chip>
          <Chip tone="outline">Wi-Fi</Chip>
          <Chip tone="ocean">Guest favourite</Chip>
          <Badge tone="verified" icon={<ShieldCheck className="size-3.5" />}>
            Verified by JosStay
          </Badge>
          <Badge tone="favourite">Guest favourite</Badge>
          <Badge tone="limited">Only 2 left</Badge>
          <Badge tone="success">Instant confirmation</Badge>
        </div>

        <div className="mt-4 flex flex-wrap gap-6 rounded-lg border border-sand bg-white p-6">
          <Rating score={9.2} reviewCount={1284} />
          <Rating score={8.1} reviewCount={214} size="sm" />
          <Rating score={7.4} reviewCount={48} showStars={false} />
        </div>
      </Section>

      <Section title="Hotel card">
        <div className="max-w-md">
          <HotelCard hotel={SAMPLE_HOTELS[0]} />
        </div>
      </Section>

      <Section title="Trust patterns">
        <TrustStrip variant="cards" />
        <TrustStrip className="mt-6" />
      </Section>
    </Container>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={`section-${title.replace(/\s+/g, "-").toLowerCase()}`}>
      <h2
        id={`section-${title.replace(/\s+/g, "-").toLowerCase()}`}
        className="text-h2 text-ocean"
      >
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}
