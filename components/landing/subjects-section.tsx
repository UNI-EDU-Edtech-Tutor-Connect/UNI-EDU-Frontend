"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import { fetchSubjectsRequest } from "@/store/slices/subjects-slice"
import { Card, CardContent } from "@/components/ui/card"

export function SubjectsSection() {
  const dispatch = useAppDispatch()
  const { subjects, isLoading } = useAppSelector((state) => state.subjects)

  useEffect(() => {
    dispatch(fetchSubjectsRequest())
  }, [dispatch])

  if (isLoading) {
    return (
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">12 môn học cơ bản</h2>
            <p className="text-lg text-muted-foreground">
              Đầy đủ các môn học theo chương trình phổ thông, từ lớp 1 đến lớp 12
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 rounded-full bg-muted mx-auto mb-2" />
                  <div className="h-4 w-16 bg-muted mx-auto rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">12 môn học cơ bản</h2>
          <p className="text-lg text-muted-foreground">
            Đầy đủ các môn học theo chương trình phổ thông, từ lớp 1 đến lớp 12
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {subjects.map((subject) => (
            <Card key={subject.id} className="group hover:shadow-md transition-shadow cursor-pointer border-border">
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{subject.icon}</div>
                <h3 className="font-medium text-foreground text-sm">{subject.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Lớp {subject.gradeRange.min}-{subject.gradeRange.max}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
