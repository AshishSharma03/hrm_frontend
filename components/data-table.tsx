"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { ReactNode } from "react"

interface DataTableProps {
  title?: string
  description?: string
  columns: Array<{
    key: string
    label: string
    width?: string
  }>
  data: Array<Record<string, ReactNode>>
  actions?: (row: Record<string, ReactNode>) => ReactNode
  emptyState?: {
    title: string
    description: string
    icon?: ReactNode
  }
}

export function DataTable({
  title,
  description,
  columns,
  data,
  actions,
  emptyState,
}: DataTableProps) {
  return (
    <Card className="border-border">
      {(title || description) && (
        <div className="px-6 py-4 border-b border-border">
          {title && <h3 className="text-lg font-semibold text-foreground">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={`bg-muted/50 font-semibold text-foreground ${col.width || ""}`}
                >
                  {col.label}
                </TableHead>
              ))}
              {actions && (
                <TableHead className="bg-muted/50 text-right font-semibold text-foreground">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((row, idx) => (
                <TableRow key={idx} className="border-border hover:bg-muted/50 transition-colors">
                  {columns.map((col) => (
                    <TableCell key={`${idx}-${col.key}`} className="text-foreground">
                      {row[col.key] || "-"}
                    </TableCell>
                  ))}
                  {actions && <TableCell className="text-right">{actions(row)}</TableCell>}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="h-24 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    {emptyState?.icon && <div className="text-muted">{emptyState.icon}</div>}
                    <div>
                      <p className="font-medium text-foreground">
                        {emptyState?.title || "No data available"}
                      </p>
                      {emptyState?.description && (
                        <p className="text-sm text-muted-foreground">{emptyState.description}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
