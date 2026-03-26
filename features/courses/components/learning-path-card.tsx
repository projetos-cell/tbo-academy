"use client";

import { IconRoute, IconArrowRight } from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { LearningPath } from "../types";

interface LearningPathCardProps {
  path: LearningPath;
}

export function LearningPathCard({ path }: LearningPathCardProps) {
  return (
    <Card className="py-0 transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
      <CardContent className="flex items-center gap-5 p-5">
        <div className="shrink-0 rounded-xl bg-[#BAF241] p-3">
          <IconRoute className="size-7 text-black" />
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div>
            <h3 className="text-base font-semibold">{path.title}</h3>
            <p className="text-muted-foreground line-clamp-1 text-sm">{path.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <Progress value={path.progress} className="h-2 flex-1" />
            <span className="text-muted-foreground text-xs whitespace-nowrap">
              {path.completedCourses} de {path.totalCourses} cursos
            </span>
          </div>
        </div>

        <Button variant="outline" size="sm" className="shrink-0 gap-1">
          Continuar
          <IconArrowRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
