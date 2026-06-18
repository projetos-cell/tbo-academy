"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { IconSearch, IconBookmark, IconChevronUp, IconChevronDown } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EnrollmentDialog } from "@/features/admin/components/enrollment-dialog";
import { useAdminUsers } from "@/features/admin/hooks/use-admin-users";
import type { AdminUser } from "@/features/admin/types";

const ROLE_LABELS: Record<string, string> = {
  founder: "Fundador",
  diretoria: "Diretoria",
  lider: "Líder",
  colaborador: "Colaborador",
};

const ROLE_COLORS: Record<string, string> = {
  founder: "bg-forest-900 text-volt border-transparent",
  diretoria: "bg-forest-100 text-forest-700 border-forest-200",
  lider: "bg-paper-off text-forest-700 border-black/[0.06]",
  colaborador: "bg-paper-off text-[var(--tbo-gray-500)] border-black/[0.06]",
};

function UserAvatar({ user }: { user: AdminUser }) {
  const initials = user.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : user.email.slice(0, 2).toUpperCase();

  return (
    <Avatar className="size-8">
      <AvatarImage src={user.avatar_url ?? undefined} />
      <AvatarFallback className="bg-forest-900 text-volt text-xs font-semibold">{initials}</AvatarFallback>
    </Avatar>
  );
}

const columnHelper = createColumnHelper<AdminUser>();

export function UserTable() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [enrollmentOpen, setEnrollmentOpen] = useState(false);

  // Debounce search
  const handleSearchChange = (value: string) => {
    setSearch(value);
    clearTimeout((handleSearchChange as any)._timer);
    (handleSearchChange as any)._timer = setTimeout(() => {
      setDebouncedSearch(value);
    }, 400);
  };

  const { data, isLoading } = useAdminUsers({ search: debouncedSearch });
  const users = data?.users ?? [];
  const total = data?.total ?? 0;

  const columns = useMemo(
    () => [
      columnHelper.accessor("full_name", {
        header: "Usuário",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <UserAvatar user={row.original} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{row.original.full_name ?? "Sem nome"}</p>
              <p className="truncate text-xs text-[var(--tbo-gray-500)]">{row.original.email}</p>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("role", {
        header: "Perfil",
        cell: ({ getValue }) => {
          const role = getValue();
          if (!role) return <span className="text-xs text-[var(--tbo-gray-500)]">—</span>;
          return (
            <Badge
              variant="outline"
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                ROLE_COLORS[role] ?? "bg-paper-off border-black/[0.06] text-[var(--tbo-gray-500)]"
              }`}
            >
              {ROLE_LABELS[role] ?? role}
            </Badge>
          );
        },
      }),
      columnHelper.accessor("enrollment_count", {
        header: "Cursos",
        cell: ({ getValue }) => (
          <span className="font-display text-sm font-semibold tracking-tight tabular-nums">{getValue()}</span>
        ),
      }),
      columnHelper.accessor("created_at", {
        header: "Membro desde",
        cell: ({ getValue }) => {
          const date = new Date(getValue());
          return (
            <span className="text-sm text-[var(--tbo-gray-500)]">
              {date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <Button
            size="sm"
            variant="ghost"
            className="text-forest-700 hover:bg-forest-900 h-7 gap-1.5 rounded-full px-3 text-xs font-semibold hover:text-white"
            onClick={() => {
              setSelectedUser(row.original);
              setEnrollmentOpen(true);
            }}
          >
            <IconBookmark className="size-3.5" />
            Matrículas
          </Button>
        ),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: users,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <IconSearch className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--tbo-gray-500)]" />
          <Input
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-9 rounded-full pl-9"
          />
        </div>
        {!isLoading && <span className="text-sm text-[var(--tbo-gray-500)]">{total} usuário(s)</span>}
      </div>

      {/* Table */}
      <div className="bg-card overflow-hidden rounded-2xl border border-black/[0.06] shadow-sm">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-black/[0.06]">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-[11px] font-bold tracking-[0.1em] text-[var(--tbo-gray-500)] uppercase"
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        className={`flex items-center gap-1 ${
                          header.column.getCanSort()
                            ? "hover:text-ink cursor-pointer transition-colors select-none"
                            : ""
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === "asc" ? (
                          <IconChevronUp className="size-3" />
                        ) : header.column.getIsSorted() === "desc" ? (
                          <IconChevronDown className="size-3" />
                        ) : null}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-black/[0.05] last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-3.5 w-32" />
                        <Skeleton className="h-3 w-44" />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-6" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-7 w-20" />
                  </td>
                </tr>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center text-sm text-[var(--tbo-gray-500)]">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-paper-off border-b border-black/[0.05] transition-colors last:border-0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <EnrollmentDialog
        user={selectedUser}
        open={enrollmentOpen}
        onOpenChange={(open) => {
          setEnrollmentOpen(open);
          if (!open) setSelectedUser(null);
        }}
      />
    </div>
  );
}
