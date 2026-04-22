import type { Picture as ImageToolsPicture } from "vite-imagetools";

const TAILWIND_BREAKPOINTS = {
  sm: "40rem",
  md: "48rem",
  lg: "64rem",
  xl: "80rem",
  "2xl": "96rem",
} as const;

type TailwindBreakpoint = keyof typeof TAILWIND_BREAKPOINTS;

export type PictureSizes =
  | string
  | ({
      base: string;
    } & Partial<Record<TailwindBreakpoint, string>>);

export const PICTURE_SIZE_PRESETS = {
  fullWidth: {
    base: "100vw",
  },
  carousel: {
    base: "80vw",
    md: "50vw",
  },
  maxWidth5xl: {
    base: "calc(100vw - 3rem)",
    md: "calc(100vw - 10rem)",
    xl: "64rem",
  },
  twoColumn: {
    base: "calc(100vw - 5rem)",
    lg: "42vw",
  },
  threeColumn: {
    base: "calc(100vw - 5rem)",
    md: "calc(50vw - 3.75rem)",
    lg: "calc(33.333vw - 5rem)",
  },
} satisfies Record<string, PictureSizes>;

export type PictureSizePreset = keyof typeof PICTURE_SIZE_PRESETS;

function serializeSizes(sizes?: PictureSizes): string | undefined {
  if (!sizes) {
    return undefined;
  }

  if (typeof sizes === "string") {
    return sizes;
  }

  const responsiveSizes = [
    ...(Object.keys(TAILWIND_BREAKPOINTS) as TailwindBreakpoint[]),
  ]
    .reverse()
    .flatMap((breakpoint) => {
      const value = sizes[breakpoint];
      return value
        ? [`(min-width: ${TAILWIND_BREAKPOINTS[breakpoint]}) ${value}`]
        : [];
    });

  responsiveSizes.push(sizes.base);
  return responsiveSizes.join(", ");
}

export function Picture({
  picture,
  alt,
  className,
  loading,
  priority = false,
  sizes,
  sizePreset,
}: {
  picture: ImageToolsPicture;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
  priority?: boolean;
  sizes?: PictureSizes;
  sizePreset?: PictureSizePreset;
}) {
  const resolvedSizes = serializeSizes(
    sizes ?? (sizePreset ? PICTURE_SIZE_PRESETS[sizePreset] : undefined),
  );
  const resolvedLoading = loading ?? (priority ? "eager" : "lazy");

  return (
    <picture className={className}>
      {Object.entries(picture.sources).map(([format, srcset]) => (
        <source
          key={`${srcset}-${format}`}
          srcSet={srcset}
          sizes={resolvedSizes}
          type={`image/${format}`}
        />
      ))}
      <img
        src={picture.img.src}
        alt={alt}
        width={picture.img.w}
        height={picture.img.h}
        className={className}
        loading={resolvedLoading}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
      />
    </picture>
  );
}
