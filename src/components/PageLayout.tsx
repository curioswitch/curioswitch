import type { ReactNode } from "react";

export function PageIntro({
  description,
  title,
}: {
  description?: ReactNode;
  title: string;
}) {
  const hasDescription = description !== null && description !== undefined;

  return (
    <header
      className={
        hasDescription
          ? "page-gutter grid items-center gap-6 py-16 md:py-20 lg:grid-cols-2 lg:gap-10"
          : "page-gutter py-16 md:py-20"
      }
    >
      <div className="text-3xl md:text-5xl">
        <h1>{title}</h1>
      </div>
      {hasDescription ? (
        <div className="text-sm md:text-lg leading-6 md:leading-8 text-gray-600 lg:max-w-2xl lg:justify-self-end">
          {description}
        </div>
      ) : null}
    </header>
  );
}

export function ContentEntryPage({
  children,
  hero,
  title,
  titleMeta,
}: {
  children: ReactNode;
  hero: ReactNode;
  title: string;
  titleMeta?: ReactNode;
}) {
  return (
    <main className="page-gutter bg-white py-12">
      <article className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="flex flex-col gap-4">
          {titleMeta}
          <h1 className="text-4xl font-semibold md:text-6xl">{title}</h1>
        </header>

        {hero}

        <div className="prose prose-lg max-w-none">{children}</div>
      </article>
    </main>
  );
}
