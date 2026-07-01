"use client";

import Link from "next/link";
import {
  ArrowLeftRight,
  ArrowRight,
  Armchair,
  Brain,
  BookOpen,
  CalendarDays,
  Calendar,
  Clock,
  ClipboardCheck,
  Cloud,
  FileText,
  Lightbulb,
  LayoutGrid,
  MessageCircle,
  Moon,
  NotebookText,
  School,
  Search,
  Star,
  Sun,
  Target,
  User,
  UserRound,
  Users,
  Utensils,
  Zap,
  type LucideIcon,
} from "lucide-react";

type ListItem = {
  icon: LucideIcon;
  label: string;
};

type TipSection = {
  heading?: string;
  items: ListItem[];
};

type ResourceItem = {
  icon: LucideIcon;
  label: string;
  description?: string;
  href: string;
};

// Placeholder until the questions -> Claude -> Supabase pipeline is wired up.
// `name` and `age` will come from the child's profile row in Supabase.
const CHILD = {
  name: "Alex",
  age: 8,
};

const SYMPTOMS: ListItem[] = [
  { icon: Sun, label: "Sensory overload" },
  { icon: Target, label: "Difficulty focusing" },
  { icon: Cloud, label: "Anxious mood" },
  { icon: Moon, label: "Sleep changes" },
  { icon: User, label: "Social withdrawal" },
  { icon: Calendar, label: "Routine change" },
  { icon: Utensils, label: "Appetite change" },
  { icon: Zap, label: "Meltdown trigger" },
];

const TIPS: TipSection[] = [
  {
    items: [
      { icon: Calendar, label: "Keep a visual routine" },
      { icon: Armchair, label: "Offer a quiet reset space" },
      { icon: Clock, label: "Prepare transitions early" },
      { icon: MessageCircle, label: "Use short clear instructions" },
    ],
  },
  {
    heading: "Daily support",
    items: [
      { icon: ClipboardCheck, label: "Track triggers" },
      { icon: Moon, label: "Log sleep patterns" },
      { icon: Star, label: "Reinforce calm behavior" },
      { icon: NotebookText, label: "Keep notes after therapy" },
    ],
  },
];

const RESOURCES: ResourceItem[] = [
  {
    icon: BookOpen,
    label: "Communication support",
    description: "Tools and strategies to support daily communication.",
    href: "#",
  },
  { icon: School, label: "School routine guidance", href: "#" },
  { icon: Brain, label: "Behavior guides", href: "#" },
  { icon: Search, label: "Therapy search", href: "#" },
  { icon: FileText, label: "IEP / school support", href: "#" },
  { icon: Users, label: "Local family support", href: "#" },
  { icon: Lightbulb, label: "Sensory overload tips", href: "#" },
  { icon: ArrowLeftRight, label: "Managing transitions", href: "#" },
];

const NAV_ITEMS = [
  { icon: LayoutGrid, label: "Dashboard", href: "/info" },
  { icon: UserRound, label: "Child Profile", href: "/info" },
  { icon: CalendarDays, label: "Log Calendar", href: "/info" },
];

function Pill({ icon: Icon, label }: ListItem) {
  return (
    <div className="flex items-center gap-3 rounded-full bg-wello-beige px-4 py-3 text-sm font-medium text-wello-dark-brown">
      <Icon className="h-4 w-4 shrink-0 text-wello-dark-brown/80" />
      <span>{label}</span>
    </div>
  );
}

function Column({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-wello-yellow/40 p-5">
      <p className="text-xs tracking-widest text-wello-yellow/70">{index}</p>
      <h2 className="mb-4 font-serif text-2xl font-semibold text-wello-yellow">
        {title}
      </h2>
      <div className="flex max-h-[26rem] flex-col gap-3 overflow-y-auto pr-1">
        {children}
      </div>
      <p className="mt-4 text-center text-xs text-wello-beige/50">
        Scroll down for more
      </p>
    </div>
  );
}

export default function InfoPage() {
  return (
    <div className="flex min-h-screen bg-[#2B2119]">
      <main className="flex-1 px-10 py-10">
        <h1 className="mb-8 font-serif text-4xl font-semibold text-wello-yellow">
          Dashboard
        </h1>

        <div className="flex flex-col gap-6 lg:flex-row">
          <Column index="01" title="Symptoms">
            {SYMPTOMS.map((item) => (
              <Pill key={item.label} {...item} />
            ))}
          </Column>

          <Column index="02" title="Tips">
            {TIPS.map((section, i) => (
              <div key={section.heading ?? i} className="flex flex-col gap-3">
                {section.heading && (
                  <div className="my-1 flex items-center gap-3 text-xs font-medium text-wello-yellow/70">
                    <span className="h-px flex-1 bg-wello-yellow/30" />
                    <span>{section.heading}</span>
                    <span className="h-px flex-1 bg-wello-yellow/30" />
                  </div>
                )}
                {section.items.map((item) => (
                  <Pill key={item.label} {...item} />
                ))}
              </div>
            ))}
          </Column>

          <Column index="03" title="Resources">
            {RESOURCES.map((resource) => (
              <Link
                key={resource.label}
                href={resource.href}
                className="flex items-center gap-3 rounded-full bg-wello-beige px-4 py-3 text-sm font-medium text-wello-dark-brown transition-colors hover:bg-wello-light-yellow"
              >
                <resource.icon className="h-4 w-4 shrink-0 text-wello-dark-brown/80" />
                <span className="flex-1">
                  {resource.description ? (
                    <>
                      <span className="block font-semibold">{resource.label}</span>
                      <span className="block text-xs font-normal text-wello-grey-brown">
                        {resource.description}
                      </span>
                    </>
                  ) : (
                    resource.label
                  )}
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-wello-dark-brown/60" />
              </Link>
            ))}
          </Column>
        </div>
      </main>

      <aside className="flex w-72 shrink-0 flex-col items-center gap-6 bg-wello-light-yellow px-6 py-10">
        <div className="h-24 w-24 rounded-full border-[6px] border-wello-dark-brown bg-wello-white" />
        <p className="font-medium text-wello-dark-brown">
          {CHILD.name} <span className="text-wello-dark-brown/50">|</span> Age {CHILD.age}
        </p>

        <nav className="flex w-full flex-col gap-1">
          {NAV_ITEMS.map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                i === 0
                  ? "bg-wello-yellow/60 text-wello-dark-brown"
                  : "text-wello-dark-brown/80 hover:bg-wello-yellow/30"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  );
}
