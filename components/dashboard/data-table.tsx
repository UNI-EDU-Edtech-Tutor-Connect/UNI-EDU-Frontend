"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from "lucide-react"

interface Column<T> {
  key: keyof T | string
  header: string
  render?: (item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  title?: string
  columns: Column<T>[]
  data: T[]
  actions?: React.ReactNode
  emptyMessage?: string
  loading?: boolean
  itemsPerPage?: number
  sortNewestFirst?: boolean
  dateKey?: string
  pagination?: {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
  }
}

export function DataTable<T extends { id: string }>({
  title,
  columns,
  data,
  actions,
  emptyMessage = "Không có dữ liệu",
  loading = false,
  itemsPerPage: defaultItemsPerPage = 10,
  sortNewestFirst = true,
  dateKey = "createdAt",
  pagination: externalPagination,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage)

  const getValue = (item: T, key: string): unknown => {
    const keys = key.split(".")
    let value: unknown = item
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k]
    }
    return value
  }

  // Sort data newest first if enabled
  const sortedData = useMemo(() => {
    if (!sortNewestFirst) return data
    return [...data].sort((a, b) => {
      const dateA = getValue(a, dateKey) as string
      const dateB = getValue(b, dateKey) as string
      if (!dateA || !dateB) return 0
      // Try parsing various date formats
      const parsedA = new Date(dateA).getTime()
      const parsedB = new Date(dateB).getTime()
      if (isNaN(parsedA) || isNaN(parsedB)) return 0
      return parsedB - parsedA
    })
  }, [data, sortNewestFirst, dateKey])

  // Internal pagination
  const totalPages = externalPagination
    ? externalPagination.totalPages
    : Math.ceil(sortedData.length / itemsPerPage)

  const activePage = externalPagination ? externalPagination.currentPage : currentPage
  const handlePageChange = externalPagination
    ? externalPagination.onPageChange
    : (page: number) => setCurrentPage(page)

  const paginatedData = externalPagination
    ? sortedData
    : sortedData.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage)

  // Reset to page 1 when data changes significantly
  const totalItems = sortedData.length

  return (
    <Card>
      {(title || actions) && (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          {title && <CardTitle className="text-lg font-semibold">{title}</CardTitle>}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={String(column.key)} className={column.className}>
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item) => (
                  <TableRow key={item.id}>
                    {columns.map((column) => (
                      <TableCell key={`${item.id}-${String(column.key)}`} className={column.className}>
                        {column.render ? column.render(item) : String(getValue(item, String(column.key)) ?? "")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">
                Hiển thị {((activePage - 1) * itemsPerPage) + 1}-{Math.min(activePage * itemsPerPage, totalItems)} trong {totalItems} mục
              </p>
              {!externalPagination && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Hiển thị</span>
                  <Select
                    value={String(itemsPerPage)}
                    onValueChange={(val) => {
                      setItemsPerPage(Number(val))
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">/ trang</span>
                </div>
              )}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={activePage === 1}
                  onClick={() => handlePageChange(1)}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={activePage === 1}
                  onClick={() => handlePageChange(activePage - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1 mx-2">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum: number
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (activePage <= 3) {
                      pageNum = i + 1
                    } else if (activePage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = activePage - 2 + i
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={activePage === pageNum ? "default" : "outline"}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={activePage === totalPages}
                  onClick={() => handlePageChange(activePage + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={activePage === totalPages}
                  onClick={() => handlePageChange(totalPages)}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
