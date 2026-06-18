"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconBell, IconClock, IconTarget, IconArrowRight } from "@tabler/icons-react";

export default function AcademyConfiguracoesPage() {
  return (
    <div className="max-w-2xl space-y-8">
      <PageHeader
        eyebrow="Sua experiência"
        title="Preferências"
        description="Configure sua experiência de aprendizado"
      />

      <Card className="border border-black/[0.06] shadow-sm">
        <CardHeader>
          <span className="text-forest-500 text-xs font-bold tracking-[0.14em] uppercase">Avisos</span>
          <CardTitle className="font-display flex items-center gap-2.5 text-xl font-bold tracking-tight">
            <span className="bg-forest-900 text-volt grid size-9 flex-none place-items-center rounded-full">
              <IconBell className="size-4" />
            </span>
            Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Lembrete diário</Label>
              <p className="text-xs text-[var(--tbo-gray-500)]">Receba um lembrete para estudar todos os dias</p>
            </div>
            <Switch defaultChecked className="data-[state=checked]:bg-volt" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Novos cursos</Label>
              <p className="text-xs text-[var(--tbo-gray-500)]">Seja notificado quando novos cursos forem publicados</p>
            </div>
            <Switch defaultChecked className="data-[state=checked]:bg-volt" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Conquistas</Label>
              <p className="text-xs text-[var(--tbo-gray-500)]">Notificações de medalhas e certificados</p>
            </div>
            <Switch defaultChecked className="data-[state=checked]:bg-volt" />
          </div>
        </CardContent>
      </Card>

      <Card className="border border-black/[0.06] shadow-sm">
        <CardHeader>
          <span className="text-forest-500 text-xs font-bold tracking-[0.14em] uppercase">Ritmo</span>
          <CardTitle className="font-display flex items-center gap-2.5 text-xl font-bold tracking-tight">
            <span className="bg-forest-900 text-volt grid size-9 flex-none place-items-center rounded-full">
              <IconTarget className="size-4" />
            </span>
            Metas de Aprendizado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Meta semanal de módulos</Label>
            <Select defaultValue="5">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 módulos por semana</SelectItem>
                <SelectItem value="5">5 módulos por semana</SelectItem>
                <SelectItem value="7">7 módulos por semana</SelectItem>
                <SelectItem value="10">10 módulos por semana</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tempo diário de estudo</Label>
            <Select defaultValue="30">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutos</SelectItem>
                <SelectItem value="30">30 minutos</SelectItem>
                <SelectItem value="60">1 hora</SelectItem>
                <SelectItem value="120">2 horas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-black/[0.06] shadow-sm">
        <CardHeader>
          <span className="text-forest-500 text-xs font-bold tracking-[0.14em] uppercase">Rotina</span>
          <CardTitle className="font-display flex items-center gap-2.5 text-xl font-bold tracking-tight">
            <span className="bg-forest-900 text-volt grid size-9 flex-none place-items-center rounded-full">
              <IconClock className="size-4" />
            </span>
            Horário Preferido
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Melhor horário para estudar</Label>
            <Select defaultValue="morning">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Manhã (8h - 12h)</SelectItem>
                <SelectItem value="afternoon">Tarde (13h - 17h)</SelectItem>
                <SelectItem value="evening">Noite (18h - 22h)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <button className="bg-forest-900 hover:bg-ink flex items-center justify-between gap-6 rounded-full py-3 pr-3 pl-6 text-sm font-bold text-white transition-all hover:-translate-y-px">
        Salvar Preferências
        <span className="bg-volt text-ink grid size-7 place-items-center rounded-full">
          <IconArrowRight className="size-4" />
        </span>
      </button>
    </div>
  );
}
