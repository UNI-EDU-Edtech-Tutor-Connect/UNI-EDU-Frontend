"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Clock, Plus, Trash2, Save, Calendar, Copy, Zap } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const DAYS_OF_WEEK = [
    { id: 1, label: "Thứ 2", value: "T2" },
    { id: 2, label: "Thứ 3", value: "T3" },
    { id: 3, label: "Thứ 4", value: "T4" },
    { id: 4, label: "Thứ 5", value: "T5" },
    { id: 5, label: "Thứ 6", value: "T6" },
    { id: 6, label: "Thứ 7", value: "T7" },
    { id: 0, label: "Chủ nhật", value: "CN" },
]

export default function StudentAvailabilityPage() {
    const { toast } = useToast()

    const [availability, setAvailability] = useState<Record<number, { active: boolean; slots: { start: string; end: string }[] }>>({
        1: { active: false, slots: [] },
        2: { active: true, slots: [{ start: "18:00", end: "21:00" }] },
        3: { active: false, slots: [] },
        4: { active: true, slots: [{ start: "18:00", end: "21:00" }] },
        5: { active: false, slots: [] },
        6: { active: true, slots: [{ start: "14:00", end: "17:00" }, { start: "19:00", end: "21:30" }] },
        0: { active: true, slots: [{ start: "08:00", end: "11:00" }, { start: "14:00", end: "17:00" }] },
    })

    const handleToggleDay = (dayId: number) => {
        setAvailability(prev => ({
            ...prev,
            [dayId]: { ...prev[dayId], active: !prev[dayId].active }
        }))
    }

    const handleAddSlot = (dayId: number) => {
        setAvailability(prev => ({
            ...prev,
            [dayId]: {
                ...prev[dayId],
                slots: [...prev[dayId].slots, { start: "18:00", end: "20:00" }]
            }
        }))
    }

    const handleRemoveSlot = (dayId: number, index: number) => {
        setAvailability(prev => {
            const newSlots = [...prev[dayId].slots]
            newSlots.splice(index, 1)
            return {
                ...prev,
                [dayId]: { ...prev[dayId], slots: newSlots }
            }
        })
    }

    const handleTimeChange = (dayId: number, index: number, field: 'start' | 'end', value: string) => {
        setAvailability(prev => {
            const newSlots = [...prev[dayId].slots]
            newSlots[index] = { ...newSlots[index], [field]: value }
            return {
                ...prev,
                [dayId]: { ...prev[dayId], slots: newSlots }
            }
        })
    }

    const handleCopyFromPrevious = (dayId: number) => {
        let prevDayId = dayId - 1;
        if (prevDayId < 0) prevDayId = 6;

        setAvailability(prev => ({
            ...prev,
            [dayId]: {
                active: prev[prevDayId]?.active || false,
                slots: JSON.parse(JSON.stringify(prev[prevDayId]?.slots || []))
            }
        }))
    }

    const handleSave = () => {
        toast({
            title: "Cập nhật thành công",
            description: "Thuật toán sẽ bắt đầu tìm kiếm lớp học và gia sư khớp với lịch này.",
        })
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Thời gian rảnh học tập</h1>
                <p className="text-muted-foreground">
                    Hãy thiết lập các khung giờ rảnh của bạn. AI của hệ thống sẽ dựa vào đây để gợi ý Gia sư hoặc tự động xếp lớp phù hợp nhất.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            Lịch trống trong tuần
                        </CardTitle>
                        <CardDescription>
                            Bạn có thể học vào những khoảng thời gian nào? Kích hoạt và nhập giờ để hệ thống ghi nhận.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-6 divide-y">
                            {DAYS_OF_WEEK.map((day) => {
                                const dayData = availability[day.id] || { active: false, slots: [] }
                                return (
                                    <div key={day.id} className="pt-6 first:pt-0">
                                        <div className="flex items-start gap-4">
                                            <div className="flex items-center gap-4 w-32 shrink-0">
                                                <Switch
                                                    checked={dayData.active}
                                                    onCheckedChange={() => handleToggleDay(day.id)}
                                                    id={`day-${day.id}`}
                                                />
                                                <Label
                                                    htmlFor={`day-${day.id}`}
                                                    className={`font-semibold text-base cursor-pointer ${!dayData.active && 'opacity-50'}`}
                                                >
                                                    {day.label}
                                                </Label>
                                            </div>

                                            <div className="flex-1 space-y-3">
                                                {!dayData.active ? (
                                                    <div className="h-9 flex items-center text-sm text-muted-foreground">
                                                        Không học (Bận)
                                                    </div>
                                                ) : (
                                                    <>
                                                        {dayData.slots.length === 0 ? (
                                                            <div className="h-9 flex items-center border-l-2 border-yellow-500 pl-3 text-sm text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 py-1">
                                                                Vui lòng thêm khung giờ
                                                            </div>
                                                        ) : (
                                                            dayData.slots.map((slot, idx) => (
                                                                <div key={idx} className="flex items-center gap-2">
                                                                    <input
                                                                        type="time"
                                                                        className="flex h-9 w-full rounded-md border border-input bg-background/50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary max-w-[120px]"
                                                                        value={slot.start}
                                                                        onChange={(e) => handleTimeChange(day.id, idx, 'start', e.target.value)}
                                                                    />
                                                                    <span className="text-muted-foreground">-</span>
                                                                    <input
                                                                        type="time"
                                                                        className="flex h-9 w-full rounded-md border border-input bg-background/50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary max-w-[120px]"
                                                                        value={slot.end}
                                                                        onChange={(e) => handleTimeChange(day.id, idx, 'end', e.target.value)}
                                                                    />
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="text-muted-foreground hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                                                                        onClick={() => handleRemoveSlot(day.id, idx)}
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            ))
                                                        )}
                                                        <div className="flex gap-2 pt-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-xs h-8 border-dashed"
                                                                onClick={() => handleAddSlot(day.id)}
                                                            >
                                                                <Plus className="h-3 w-3 mr-1" /> Thêm ca
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-xs h-8 text-muted-foreground hover:text-foreground"
                                                                onClick={() => handleCopyFromPrevious(day.id)}
                                                                title="Chép từ ngày hôm trước"
                                                            >
                                                                <Copy className="h-3 w-3 mr-1" /> Chép ngày trước
                                                            </Button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                    <CardFooter className="bg-secondary/20 pt-6">
                        <Button onClick={handleSave} className="w-full sm:w-auto gap-2">
                            <Zap className="h-4 w-4" /> Bắt đầu khớp lịch thông minh
                        </Button>
                    </CardFooter>
                </Card>

                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent border-indigo-500/20 shadow-sm relative overflow-hidden">
                        <div className="absolute -top-4 -right-4 p-4 opacity-10 pointer-events-none">
                            <Zap className="w-32 h-32 text-indigo-500" />
                        </div>
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-indigo-500/20 p-3 rounded-xl shrink-0">
                                    <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-lg text-indigo-900 dark:text-indigo-300">Smart Connect</h3>
                                    <p className="text-sm text-indigo-800/80 dark:text-indigo-200/80 leading-relaxed">
                                        Khi bạn mở thời gian rảnh, hệ thống sẽ:
                                    </p>
                                    <ul className="text-sm text-indigo-800/80 dark:text-indigo-200/80 leading-relaxed list-disc list-inside space-y-1.5 pl-1">
                                        <li>Gợi ý hàng trăm ca dạy Gia sư phù hợp để bạn "ghép cặp".</li>
                                        <li>Sắp xếp lớp tự động đến khi bạn cảm thấy vừa ý.</li>
                                        <li>Thông báo ngay cho bạn khi ghép thành công.</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3 border-b border-border/50">
                            <CardTitle className="text-base text-center">Gia sư trực tuyến sẵn sàng</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Phù hợp Toán học</span>
                                    <span className="font-bold text-green-600">142</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Phù hợp Tiếng Anh</span>
                                    <span className="font-bold text-green-600">89</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Phù hợp Lập Trình</span>
                                    <span className="font-bold text-green-600">215</span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-border/50 text-center">
                                    <p className="text-xs text-muted-foreground italic">Mở rảnh càng nhiều giờ, cơ hội tìm được Gia sư tốt nhất càng cao.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
