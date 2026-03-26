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
import { IconSearch, IconBookmark, IconLoader2, IconChevronUp, IconChevronDown } from "@tabler/icons-react";
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
  founder: "bg-purple-100 text-purple-700 border-purple-200",
  diretoria: "bg-blue-100 text-blue-700 border-blue-200",
  lider: "bg-emerald-100 text-emerald-700 border-emerald-200",
  colaborador: "bg-gray-100 text-gray-600 border-gray-200",
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
      <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">{initials}</AvatarFallback>
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
              <p className="truncate text-sm font-medium">{row.original.full_name ?? "Sem nome"}</p>
              <p className="text-muted-foreground truncate text-xs">{row.original.email}</p>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("role", {
        header: "Perfil",
        cell: ({ getValue }) => {
          const role = getValue();
          if (!role) return <span className="text-muted-foreground text-xs">—</span>;
          return (
            <Badge
              variant="outline"
              className={`text-xs font-medium ${ROLE_COLORS[role] ?? "bg-gray-100 text-gray-600"}`}
            >
              {ROLE_LABELS[role] ?? role}
            </Badge>
          );
        },
      }),
      columnHelper.accessor("enrollment_count", {
        header: "Cursos",
        cell: ({ getValue }) => <span className="text-sm tabular-nums">{getValue()}</span>,
      }),
      columnHelper.accessor("created_at", {
        header: "Membro desde",
        cell: ({ getValue }) => {
          const date = new Date(getValue());
          return (
            <span className="text-muted-foreground text-sm">
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
            className="text-muted-foreground hover:text-foreground h-7 gap-1 px-2 text-xs"
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
          <IconSearch className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-9 pl-9"
          />
        </div>
        {!isLoading && <span className="text-muted-foreground text-sm">{total} usuário(s)</span>}
      </div>

      {/* Table */}
      <div className="bg-card overflow-hidden rounded-lg border">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-muted/30 border-b">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wide uppercase"
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        className={`flex items-center gap-1 ${
                          header.column.getCanSort()
                            ? "hover:text-foreground cursor-pointer transition-colors select-none"
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
                <tr key={i} className="border-b last:border-0">
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
                <td colSpan={columns.length} className="text-muted-foreground px-4 py-16 text-center text-sm">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-muted/30 border-b transition-colors last:border-0">
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
