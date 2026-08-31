import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { lazy, type ReactNode, Suspense } from "react";
import type { Picture as ImageToolsPicture } from "vite-imagetools";

import picMembersChoko from "../../assets/members-choko.jpg?w=480;640;960;1280&format=avif;webp;jpg&as=picture";
import picMembersSkop from "../../assets/members-skop.jpg?w=480;640;960;1280&format=avif;webp;jpg&as=picture";
import { FadeIn } from "../../components/FadeIn";
import { PageIntro } from "../../components/PageLayout";
import { Picture } from "../../components/Picture";
import { m } from "../../paraglide/messages";

const MembersWorkspace = lazy(
  () => import("../../components/MembersWorkspace"),
);

function MembersWorkspaceFallback({ label }: { label: string }) {
  return (
    <>
      <style>{`
        .members-workspace-fallback {
          height: 16rem;
          width: 100%;
          background: #ffd83d;
        }

        @media (min-width: 48rem) {
          .members-workspace-fallback {
            height: 24rem;
          }
        }
      `}</style>
      <div
        className="members-workspace-fallback"
        role="img"
        aria-label={label}
      />
    </>
  );
}

type MemberProfile = {
  career: string[];
  image: ImageToolsPicture;
  education: string[];
  frameworks?: string[];
  intro: string[];
  name: string;
  role: string;
  skills: string[];
  title: string;
};

function getMemberProfiles(): MemberProfile[] {
  return [
    {
      name: "Choko",
      image: picMembersChoko,
      role: m.members_choko_role(),
      title: m.members_choko_title(),
      intro: [m.members_choko_intro_1(), m.members_choko_intro_2()],
      career: [
        m.members_choko_career_1(),
        m.members_choko_career_2(),
        m.members_choko_career_3(),
        m.members_choko_career_4(),
      ],
      education: [m.members_choko_education_1(), m.members_choko_education_2()],
      skills: [
        m.members_choko_skill_1(),
        m.members_choko_skill_2(),
        m.members_choko_skill_3(),
        m.members_choko_skill_4(),
        m.members_choko_skill_5(),
        m.members_choko_skill_6(),
      ],
      frameworks: [
        m.members_choko_framework_1(),
        m.members_choko_framework_2(),
        m.members_choko_framework_3(),
        m.members_choko_framework_4(),
        m.members_choko_framework_5(),
        m.members_choko_framework_6(),
      ],
    },
    {
      name: "Skop",
      image: picMembersSkop,
      role: m.members_skop_role(),
      title: m.members_skop_title(),
      intro: [m.members_skop_intro_1(), m.members_skop_intro_2()],
      career: [
        m.members_skop_career_1(),
        m.members_skop_career_2(),
        m.members_skop_career_3(),
      ],
      education: [m.members_skop_education_1(), m.members_skop_education_2()],
      skills: [
        m.members_skop_skill_1(),
        m.members_skop_skill_2(),
        m.members_skop_skill_3(),
        m.members_skop_skill_4(),
        m.members_skop_skill_5(),
      ],
    },
  ];
}

export const Route = createFileRoute("/members/")({
  component: RouteComponent,
});

function ProfileSection({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="rounded-2xl bg-gray-50 p-6 md:p-8">
      <h3 className="text-sm font-medium tracking-[0.18em] text-gray-500 uppercase">
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function TagList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-full bg-white px-3 py-1 text-sm text-gray-700 ring-1 ring-gray-200"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function MemberCard({
  career,
  education,
  frameworks,
  image,
  intro,
  name,
  role,
  skills,
  title,
}: MemberProfile) {
  return (
    <article className="page-gutter-wide border-t border-gray-100 py-10 lg:py-20">
      <div className="grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,1fr)]">
        <header className="order-2 flex flex-col gap-3 lg:col-start-1 lg:row-start-1">
          <p className="text-sm font-medium tracking-[0.24em] text-orange-500 uppercase">
            {role}
          </p>
          <h2 className="text-3xl font-medium md:text-4xl">{name}</h2>
          <p className="text-lg text-gray-600">{title}</p>
        </header>
        <div className="order-3 lg:col-start-1 lg:row-start-2">
          <div className="space-y-4 text-gray-800">
            {intro.map((paragraph) => (
              <p key={paragraph} className="leading-8 whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-10 space-y-6">
            <ProfileSection title={m.members_section_career()}>
              <ul className="space-y-3 pl-5 text-gray-800 list-disc marker:text-orange-500">
                {career.map((item) => (
                  <li key={item} className="leading-7">
                    {item}
                  </li>
                ))}
              </ul>
            </ProfileSection>
            <div className="grid gap-6 md:grid-cols-2">
              <ProfileSection title={m.members_section_education()}>
                <ul className="space-y-3 text-gray-800">
                  {education.map((item) => (
                    <li key={item} className="leading-7">
                      {item}
                    </li>
                  ))}
                </ul>
              </ProfileSection>
              <ProfileSection title={m.members_section_skills()}>
                <TagList items={skills} />
              </ProfileSection>
            </div>
            {frameworks ? (
              <ProfileSection title={m.members_section_frameworks()}>
                <TagList items={frameworks} />
              </ProfileSection>
            ) : null}
          </div>
        </div>
        <div className="order-1 lg:col-start-2 lg:row-start-2">
          <Picture
            picture={image}
            alt={m.members_profile_alt({ name })}
            className="h-80 w-full rounded-2xl object-cover md:h-112"
            sizePreset="twoColumn"
          />
        </div>
      </div>
    </article>
  );
}

function RouteComponent() {
  const memberProfiles = getMemberProfiles();
  const workspaceFallback = (
    <MembersWorkspaceFallback label={m.members_workspace_alt()} />
  );

  return (
    <main className="bg-white">
      <PageIntro
        title={m.common_page_members()}
        description={<p>{m.members_description()}</p>}
      />
      <ClientOnly fallback={workspaceFallback}>
        <Suspense fallback={workspaceFallback}>
          <MembersWorkspace
            label={m.members_workspace_alt()}
            hint={m.members_workspace_hint()}
          />
        </Suspense>
      </ClientOnly>
      {memberProfiles.map((member, i) => (
        <FadeIn key={member.name} delay={i * 150}>
          <MemberCard {...member} />
        </FadeIn>
      ))}
    </main>
  );
}
