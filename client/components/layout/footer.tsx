import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { FOOTER_LINKS, SITE } from "@/lib/constants";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-sand bg-white">
      <Container className="py-14 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-sm">
            <Logo size="md" showTagline />
            <p className="mt-5 text-secondary text-charcoal/70">
              Verified hotels, clear prices and a team that knows Jos. Book with
              confidence, every time.
            </p>

            <div className="mt-6 space-y-2.5 text-secondary">
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                className="flex items-center gap-2.5 text-charcoal/75 transition-colors hover:text-ocean"
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="size-4 text-sage" aria-hidden="true" />
                WhatsApp support
              </a>
              <a
                href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2.5 text-charcoal/75 transition-colors hover:text-ocean"
              >
                <Phone className="size-4 text-sage" aria-hidden="true" />
                {SITE.phone}
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-2.5 text-charcoal/75 transition-colors hover:text-ocean"
              >
                <Mail className="size-4 text-sage" aria-hidden="true" />
                {SITE.email}
              </a>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <FooterColumn title="Explore" links={FOOTER_LINKS.explore} />
            <FooterColumn title="Company" links={FOOTER_LINKS.company} />
            <FooterColumn title="Support" links={FOOTER_LINKS.support} />
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-sand pt-6 text-metadata text-charcoal/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.name}. Made for Jos, Plateau State.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/legal/privacy" className="hover:text-ocean">
              Privacy
            </Link>
            <Link href="/legal/terms" className="hover:text-ocean">
              Terms
            </Link>
            <Link href="/legal/cancellations" className="hover:text-ocean">
              Cancellation policy
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}) {
  return (
    <div>
      <h2 className="text-metadata font-semibold uppercase tracking-[0.12em] text-ocean">
        {title}
      </h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-secondary text-charcoal/70 transition-colors hover:text-ocean"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
