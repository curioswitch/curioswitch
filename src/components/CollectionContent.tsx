import { MDXContent } from "@content-collections/mdx/react";
import type { ComponentProps } from "react";
import type { Picture as ImageToolsPicture } from "vite-imagetools";

import { PICTURE_SIZE_PRESETS, serializePictureSizes } from "./Picture";

type ContentAssetMap = Record<string, ImageToolsPicture | undefined>;
type HtmlAttributes = Record<string, string | true | undefined>;

const CONTENT_IMAGE_SIZES = serializePictureSizes(
  PICTURE_SIZE_PRESETS.maxWidth5xl,
);
const HTML_ATTRIBUTE_PATTERN =
  /([^\s=/>]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

function mergeBlockClassName(className?: string) {
  return className ? `block ${className}` : "block";
}

function renderPictureSources(picture: ImageToolsPicture) {
  return Object.entries(picture.sources).map(([format, srcset]) => (
    <source
      key={`${srcset}-${format}`}
      srcSet={srcset}
      sizes={CONTENT_IMAGE_SIZES}
      type={`image/${format}`}
    />
  ));
}

function escapeHtmlAttribute(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function serializeHtmlAttributes(attributes: HtmlAttributes) {
  return Object.entries(attributes)
    .flatMap(([name, value]) => {
      if (value === undefined) {
        return [];
      }

      if (value === true) {
        return [` ${name}`];
      }

      return [` ${name}="${escapeHtmlAttribute(value)}"`];
    })
    .join("");
}

function parseHtmlAttributes(tag: string) {
  const attributes: HtmlAttributes = {};
  const attributeString = tag
    .replace(/^<img\b/i, "")
    .replace(/\/?>$/, "")
    .trim();

  HTML_ATTRIBUTE_PATTERN.lastIndex = 0;
  let match = HTML_ATTRIBUTE_PATTERN.exec(attributeString);

  while (match) {
    const [, name, doubleQuoted, singleQuoted, unquoted] = match;
    attributes[name] = doubleQuoted ?? singleQuoted ?? unquoted ?? true;
    match = HTML_ATTRIBUTE_PATTERN.exec(attributeString);
  }

  return attributes;
}

function renderPictureHtml(
  picture: ImageToolsPicture,
  originalAttributes: HtmlAttributes,
) {
  const imageAttributes = { ...originalAttributes };
  const className = mergeBlockClassName(
    typeof imageAttributes.class === "string"
      ? imageAttributes.class
      : undefined,
  );

  delete imageAttributes.src;
  delete imageAttributes.srcset;
  delete imageAttributes.sizes;

  imageAttributes.alt =
    typeof imageAttributes.alt === "string" ? imageAttributes.alt : "";
  imageAttributes.class = className;
  imageAttributes.loading =
    typeof imageAttributes.loading === "string"
      ? imageAttributes.loading
      : "lazy";
  imageAttributes.decoding =
    typeof imageAttributes.decoding === "string"
      ? imageAttributes.decoding
      : "async";
  imageAttributes.width =
    typeof imageAttributes.width === "string"
      ? imageAttributes.width
      : String(picture.img.w);
  imageAttributes.height =
    typeof imageAttributes.height === "string"
      ? imageAttributes.height
      : String(picture.img.h);
  imageAttributes.src = picture.img.src;

  const sourceMarkup = Object.entries(picture.sources)
    .map(
      ([format, srcset]) =>
        `<source${serializeHtmlAttributes({
          srcset,
          sizes: CONTENT_IMAGE_SIZES,
          type: `image/${format}`,
        })}>`,
    )
    .join("");

  return `<picture${serializeHtmlAttributes({ class: className })}>${sourceMarkup}<img${serializeHtmlAttributes(imageAttributes)}></picture>`;
}

function replaceImagesInHtml(html: string, contentAssetMap: ContentAssetMap) {
  return html.replace(/<img\b[^>]*>/g, (tag) => {
    const attributes = parseHtmlAttributes(tag);
    const src = typeof attributes.src === "string" ? attributes.src : undefined;

    if (!src) {
      return tag;
    }

    const picture = contentAssetMap[src];

    if (!picture) {
      return tag;
    }

    return renderPictureHtml(picture, attributes);
  });
}

function ContentImage({
  src,
  alt,
  className,
  loading,
  decoding,
  width,
  height,
  srcSet: _srcSet,
  sizes: _sizes,
  contentAssetMap,
  ...props
}: ComponentProps<"img"> & {
  contentAssetMap: ContentAssetMap;
}) {
  const picture =
    typeof src === "string" ? (contentAssetMap[src] ?? undefined) : undefined;

  if (!picture) {
    return <img {...props} src={src} alt={alt} className={className} />;
  }

  const resolvedClassName = mergeBlockClassName(className);

  return (
    <picture className={resolvedClassName}>
      {renderPictureSources(picture)}
      <img
        {...props}
        src={picture.img.src}
        alt={alt ?? ""}
        width={width ?? picture.img.w}
        height={height ?? picture.img.h}
        className={resolvedClassName}
        loading={loading ?? "lazy"}
        decoding={decoding ?? "async"}
      />
    </picture>
  );
}

export function CollectionContent({
  mdx,
  html,
  contentAssetMap,
}: {
  mdx: string | null;
  html: string | null;
  contentAssetMap?: ContentAssetMap;
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
        __html: replaceImagesInHtml(html ?? "", assetMap),
      }}
    />
  );
}
