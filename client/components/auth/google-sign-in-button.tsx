"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const GSI_SRC = "https://accounts.google.com/gsi/client";

interface GoogleCredentialResponse {
  credential?: string;
}

interface GoogleIdentityApi {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    ux_mode?: "popup" | "redirect";
    context?: "signin" | "signup";
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: {
      theme?: string;
      size?: string;
      shape?: string;
      text?: string;
      width?: number;
      logo_alignment?: string;
    },
  ) => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: GoogleIdentityApi;
      };
    };
  }
}

let scriptLoader: Promise<void> | null = null;

/**
 * Load Google Identity Services once per page. The script is shared between
 * the sign-in and sign-up pages, and a failed load can be retried.
 */
function loadGoogleIdentity(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google sign-in needs a browser."));
  }

  if (window.google?.accounts?.id) return Promise.resolve();

  if (!scriptLoader) {
    scriptLoader = new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(
        `script[src="${GSI_SRC}"]`,
      );
      const script = existing ?? document.createElement("script");

      script.addEventListener("load", () => resolve(), { once: true });
      script.addEventListener(
        "error",
        () => reject(new Error("Google sign-in could not be loaded.")),
        { once: true },
      );

      if (!existing) {
        script.src = GSI_SRC;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    }).catch((error: Error) => {
      scriptLoader = null;
      throw error;
    });
  }

  return scriptLoader;
}

export interface GoogleSignInButtonProps {
  clientId: string;
  onCredential: (idToken: string) => void;
  className?: string;
}

/**
 * Google's own sign-in button. It returns an ID token that the API verifies,
 * so the browser never handles a password for Google accounts.
 */
export function GoogleSignInButton({
  clientId,
  onCredential,
  className,
}: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(onCredential);
  const [error, setError] = useState<string | null>(null);

  callbackRef.current = onCredential;

  useEffect(() => {
    let active = true;

    loadGoogleIdentity()
      .then(() => {
        const container = containerRef.current;
        const api = window.google?.accounts?.id;

        if (!active) return;

        if (!container || !api) {
          throw new Error("Google sign-in could not be loaded.");
        }

        api.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response.credential) {
              callbackRef.current(response.credential);
            }
          },
          ux_mode: "popup",
        });

        api.renderButton(container, {
          theme: "outline",
          size: "large",
          shape: "rectangular",
          text: "continue_with",
          width: 320,
        });
      })
      .catch((loadError: Error) => {
        if (active) setError(loadError.message);
      });

    return () => {
      active = false;
    };
  }, [clientId]);

  if (error) {
    return (
      <p
        role="status"
        className={cn(
          "flex items-start gap-2 rounded-md border border-sand bg-ivory px-3.5 py-3 text-metadata text-charcoal/65",
          className,
        )}
      >
        <AlertCircle
          className="mt-0.5 size-4 shrink-0 text-sage"
          aria-hidden="true"
        />
        {error} Please use email and password instead.
      </p>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("flex w-full justify-center", className)}
    />
  );
}
