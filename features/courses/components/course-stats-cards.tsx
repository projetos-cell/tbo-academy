"use client";

import { IconRocket, IconFlame, IconTrophy, IconBolt } from "@tabler/icons-react";
import type { Course } from "../types";

interface CourseStatsCardsProps {
  courses: Course[];
}

interface StatItem {
  label: string;
  value: string | number;
  icon: React.ElementType;
  /** "black" = bg preto + ícone lime, "lime" = bg lime + ícone preto */
  variant: "black" | "lime";
}

export function CourseStatsCards({ courses }: CourseStatsCardsProps) {
  const totalCourses = courses.length;
  const inProgress = courses.filter((c) => c.status === "em_andamento").length;
  const completed = courses.filter((c) => c.status === "concluido").length;

  const totalHours = courses.reduce((acc, c) => {
    const match = c.duration.match(/(\d+)h/);
    return acc + (match ? parseInt(match[1], 10) : 0);
  }, 0);

  const stats: StatItem[] = [
    {
      label: "Total de Cursos",
      value: totalCourses,
      icon: IconRocket,
      variant: "black",
    },
    {
      label: "Em Andamento",
      value: inProgress,
      icon: IconFlame,
      variant: "lime",
    },
    {
      label: "Concluidos",
      value: completed,
      icon: IconTrophy,
      variant: "black",
    },
    {
      label: "Horas de Aprendizado",
      value: `${totalHours}h`,
      icon: IconBolt,
      variant: "lime",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isBlack = stat.variant === "black";

        return (
          <div
            key={stat.label}
            className={`group relative cursor-default overflow-hidden rounded-2xl p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] ${
              isBlack ? "bg-black text-white" : "bg-[#BAF241] text-black"
            } `}
          >
            {/* Background shape decorativo */}
            <div
              className={`absolute -top-3 -right-3 size-20 rounded-full opacity-[0.07] transition-transform duration-500 group-hover:scale-125 ${isBlack ? "bg-[#BAF241]" : "bg-black"} `}
            />
            <div
              className={`absolute -right-1 -bottom-4 size-14 rounded-full opacity-[0.05] transition-transform duration-500 group-hover:scale-110 ${isBlack ? "bg-white" : "bg-black"} `}
            />

            {/* Icon */}
            <div
              className={`mb-3 inline-flex items-center justify-center rounded-xl p-2.5 ${
                isBlack ? "bg-[#BAF241] text-black" : "bg-black text-[#BAF241]"
              } `}
            >
              <Icon className="size-5" strokeWidth={2.2} />
            </div>

            {/* Value */}
            <p className="text-3xl leading-none font-bold tracking-tight">{stat.value}</p>

            {/* Label */}
            <p className={`mt-1 text-xs font-medium ${isBlack ? "text-white/60" : "text-black/50"} `}>{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
