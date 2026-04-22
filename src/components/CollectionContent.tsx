import { MDXContent } from "@content-collections/mdx/react";
import type { ComponentProps } from "react";

function replaceAssetUrlsInHtml(
  html: string,
  contentAssetMap: Record<string, string | undefined>,
) {
  return html.replace(
    /(<img\b[^>]*\bsrc=["'])([^"']+)(["'][^>]*>)/g,
    (_, prefix: string, src: string, suffix: string) =>
      `${prefix}${contentAssetMap[src] ?? src}${suffix}`,
  );
}

function ContentImage({
  src,
  alt,
  contentAssetMap,
  ...props
}: ComponentProps<"img"> & {
  contentAssetMap: Record<string, string | undefined>;
}) {
  const resolvedSrc =
    typeof src === "string" ? (contentAssetMap[src] ?? src) : src;

  return <img {...props} src={resolvedSrc} alt={alt} />;
}

export function CollectionContent({
  mdx,
  html,
  contentAssetMap,
}: {
  mdx: string | null;
  html: string | null;
  contentAssetMap?: Record<string, string | undefined>;
}) {
  const assetMap = contentAssetMap ?? {};

  if (mdx) {
    return (
      <MDXContent
        code={mdx}
        components={{
          img: (props) => (
            <ContentImage {...props} contentAssetMap={assetMap} />
          ),
        }}
      />
    );
  }

  return (
    <div
      // biome-ignore lint/security/noDangerouslySetInnerHtml: compiled by remark
      dangerouslySetInnerHTML={{
        __html: replaceAssetUrlsInHtml(html ?? "", assetMap),
      }}
    />
  );
}
