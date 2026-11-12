import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge does not know our custom type scale, so it treats
 * `text-h2`, `text-body` and friends as colours and drops the real colour
 * class sitting next to them. Teaching it the scale keeps both — without
 * this, `cn("text-ivory", "text-h2")` silently loses the colour.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "h1",
            "h2",
            "h3",
            "hotel",
            "body",
            "secondary",
            "metadata",
            "button",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
