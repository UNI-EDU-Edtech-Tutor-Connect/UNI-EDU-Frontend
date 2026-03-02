"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Clock, Plus, Trash2, Save, Calendar, Copy } from "lucide-react"
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

export default function TutorAvailabilityPage() {
    const { toast } = useToast()

    const [availability, setAvailability] = useState<Record<number, { active: boolean; slots: { start: string; end: string }[] }>>({
        1: { active: true, slots: [{ start: "08:00", end: "11:30" }, { start: "14:00", end: "17:00" }] },
        2: { active: true, slots: [{ start: "08:00", end: "11:30" }] },
        3: { active: true, slots: [{ start: "14:00", end: "17:00" }, { start: "18:00", end: "21:00" }] },
        4: { active: false, slots: [] },
        5: { active: true, slots: [{ start: "08:00", end: "11:30" }, { start: "13:30", end: "17:00" }] },
        6: { active: false, slots: [] },
        0: { active: false, slots: [] },
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
                slots: [...prev[dayId].slots, { start: "08:00", end: "10:00" }]
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
            title: "Đã lưu Thiết lập",
            description: "Hệ thống sẽ dùng lịch này để tự động sắp xếp lớp học cho bạn.",
        })
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Thiết lập Lịch rảnh (Availability)</h1>
                <p className="text-muted-foreground">
                    Cài đặt khung giờ làm việc cố định hàng tuần. Hệ thống tự động xếp lịch sẽ ưu tiên phân bổ lịch dạy vào các khung giờ này.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            Giờ làm việc trong tuần
                        </CardTitle>
                        <CardDescription>
                            Bật/tắt các ngày làm việc và thiết lập khung giờ rảnh cho từng ngày.
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
                                                        Nghỉ ngơi (Không nhận lớp)
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
                                                                <Plus className="h-3 w-3 mr-1" /> Thêm khung giờ
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
                            <Save className="h-4 w-4" /> Lưu cấu hình lịch
                        </Button>
                    </CardFooter>
                </Card>

                <div className="space-y-6">
                    <Card className="bg-primary/5 border-primary/20 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <Clock className="w-32 h-32" />
                        </div>
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-primary/20 p-3 rounded-xl shrink-0">
                                    <Calendar className="h-6 w-6 text-primary" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-lg">Hệ thống Auto-matching</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Hệ thống AI sẽ quét cấu hình này theo thời gian thực để:
                                    </p>
                                    <ul className="text-sm text-muted-foreground leading-relaxed list-disc list-inside space-y-1.5 pl-1">
                                        <li>Đề xuất bạn vào danh sách Gia sư cho Học sinh.</li>
                                        <li>Sắp xếp đúng khung giờ mà bạn mong muốn.</li>
                                        <li>Tránh trùng lặp các lịch hẹn và ca dạy.</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base text-center">Tổng thời gian sẵn sàng</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-4">
                                <div className="w-32 h-32 rounded-full border-8 border-muted flex items-center justify-center relative shadow-inner">
                                    <svg className="absolute inset-0 w-full h-full -rotate-90 text-primary drop-shadow-md">
                                        <circle cx="64" cy="64" r="56" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray="351" strokeDashoffset="140" className="opacity-100" />
                                    </svg>
                                    <div className="text-center">
                                        <span className="text-3xl font-bold text-primary">28h</span>
                                        <p className="text-xs text-muted-foreground">/ tuần</p>
                                    </div>
                                </div>
                                <p className="text-center text-sm font-medium mt-6">Tuần làm việc khá lý tưởng!</p>
                                <p className="text-center text-xs text-muted-foreground mt-1 px-4">Với 28h/tuần, bạn có thể nhận thêm khoảng ~14 ca dạy 2h.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
