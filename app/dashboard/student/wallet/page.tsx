"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    CreditCard,
    Landmark,
    History,
    Download,
    Eye,
    CheckCircle2,
    BookOpen,
    Clock
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
}

export default function StudentWalletPage() {
    const { toast } = useToast()

    // Fake Data
    const [balance, setBalance] = useState(2450000)
    const [coursesPurchased, setCoursesPurchased] = useState(3)

    const searchParams = useSearchParams()

    // Check for payment callback params
    useEffect(() => {
        const vnp_ResponseCode = searchParams.get('vnp_ResponseCode')
        if (vnp_ResponseCode) {
            if (vnp_ResponseCode === '00') {
                toast({ title: "Thanh toán thành công", description: "Cổng thanh toán đã xác nhận giao dịch của bạn." })
            } else {
                toast({ title: "Thanh toán thất bại", description: "Có lỗi xảy ra hoặc bạn đã hủy giao dịch trên cổng thanh toán.", variant: "destructive" })
            }
        }
    }, [searchParams, toast])

    const [isDepositOpen, setIsDepositOpen] = useState(false)
    const [isSuccessOpen, setIsSuccessOpen] = useState(false)
    const [lastDeposited, setLastDeposited] = useState(0)
    const [depositAmount, setDepositAmount] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)

    const [isPayOpen, setIsPayOpen] = useState(false)
    const [selectedCourseToPay, setSelectedCourseToPay] = useState<any>(null)

    const [pendingCourses, setPendingCourses] = useState([
        { id: "C1", title: "Khóa luyện thi TOEIC 650+", tutor: "Nguyễn Văn A", price: 500000 },
        { id: "C2", title: "Lớp Toán học nâng cao", tutor: "Lê Văn C", price: 800000 }
    ])

    const [transactions, setTransactions] = useState([
        { id: "TX98235", type: "pay", amount: 1200000, date: "2024-03-01 08:30", status: "success", title: "Thanh toán Khóa học IELTS 6.5+" },
        { id: "TX98231", type: "deposit", amount: 2000000, date: "2024-03-01 08:25", status: "success", title: "Nạp tiền Học phí từ MoMo" },
        { id: "TX98220", type: "pay", amount: 500000, date: "2024-02-15 14:00", status: "success", title: "Thanh toán Lớp Hóa 12 (#H12-211)" },
        { id: "TX98212", type: "deposit", amount: 1000000, date: "2024-02-15 09:45", status: "success", title: "Nạp tiền từ VNPAY (NCB)" },
        { id: "TX98199", type: "refund", amount: 350000, date: "2024-02-10 20:00", status: "success", title: "Hoàn tiền Lớp học bị hủy bởi Giáo viên (#L11-901)" },
    ])

    const handleDeposit = () => {
        const amount = parseInt(depositAmount.replace(/\D/g, ''))

        if (!amount || amount < 20000) {
            toast({ title: "Lỗi", description: "Số tiền nạp tối thiểu là 20,000đ", variant: "destructive" })
            return
        }

        setIsProcessing(true)

        // Simulate API call for Payment Gateway
        setTimeout(() => {
            setBalance(prev => prev + amount)
            setTransactions(prev => [
                {
                    id: `TX${Math.floor(Math.random() * 100000)}`,
                    type: "deposit",
                    amount: amount,
                    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
                    status: "success", // Ideally pending, then success after gateway
                    title: "Nạp tiền học phí thành công"
                },
                ...prev
            ])
            setIsProcessing(false)
            setIsDepositOpen(false)
            setIsSuccessOpen(true)
            setLastDeposited(amount)
            setDepositAmount("")

            toast({
                title: "Nạp tiền thành công",
                description: `Đã cộng ${formatCurrency(amount)} vào số dư ví của bạn.`,
            })
        }, 1500)
    }

    const handlePayCourse = () => {
        if (!selectedCourseToPay) return

        if (balance < selectedCourseToPay.price) {
            toast({ title: "Lỗi thanh toán", description: "Số dư ví không đủ để thanh toán khóa học này.", variant: "destructive" })
            return
        }

        setIsProcessing(true)

        setTimeout(() => {
            setBalance(prev => prev - selectedCourseToPay.price)
            setTransactions(prev => [
                {
                    id: `TX${Math.floor(Math.random() * 100000)}`,
                    type: "pay",
                    amount: selectedCourseToPay.price,
                    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
                    status: "success",
                    title: `Thanh toán ${selectedCourseToPay.title}`
                },
                ...prev
            ])

            // Remove from pending
            setPendingCourses(prev => prev.filter(c => c.id !== selectedCourseToPay.id))
            setCoursesPurchased(prev => prev + 1)

            setIsProcessing(false)
            setIsPayOpen(false)
            setSelectedCourseToPay(null)

            toast({
                title: "Thanh toán thành công",
                description: `Đã thanh toán ${formatCurrency(selectedCourseToPay.price)} cho ${selectedCourseToPay.title}.`,
            })
        }, 1500)
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Ví học phí (Học sinh)</h1>
                <p className="text-muted-foreground">
                    Quản lý số dư để mua khóa học, đăng ký lớp học với gia sư và xem lịch sử giao dịch.
                </p>
            </div>

            {/* Top Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Main Balance Card */}
                <Card className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-lg overflow-hidden relative border-none">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Wallet className="w-48 h-48 rotate-12 text-white" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-white/80 font-medium text-lg flex items-center gap-2">
                            Số dư khả dụng
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
                            {formatCurrency(balance)}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-6">
                            <Button
                                variant="secondary"
                                className="bg-white hover:bg-white/90 text-indigo-700 border-0 gap-2 shadow-sm font-semibold"
                                onClick={() => setIsDepositOpen(true)}
                            >
                                <ArrowDownLeft className="h-4 w-4" /> Nạp tiền vào Ví
                            </Button>
                            <Button
                                className="bg-indigo-800 hover:bg-indigo-900 text-white border-0 gap-2 shadow-sm font-semibold"
                                onClick={() => setIsPayOpen(true)}
                            >
                                <ArrowUpRight className="h-4 w-4" /> Thanh toán học phí
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Course Stats */}
                <div className="space-y-6">
                    <Card className="border-indigo-100 bg-indigo-50/50 dark:bg-indigo-900/10 dark:border-indigo-900/30 shadow-sm relative overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-indigo-800 dark:text-indigo-400 font-medium text-sm flex justify-between items-center">
                                <span>Khóa học đã đăng ký</span>
                                <BookOpen className="h-4 w-4 opacity-70" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-500 mb-1">
                                {coursesPurchased} khóa học
                            </div>
                            <p className="text-xs text-indigo-600/80 dark:text-indigo-400/80 mt-2 leading-relaxed">
                                Số dư trong ví sẽ tự động trừ khi bạn tham gia lớp từ Auto-Schedule hoặc Đăng ký với Gia sư thành công.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Deposit Dialog */}
            <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nạp tiền vào Ví Học phí</DialogTitle>
                        <DialogDescription>
                            Hỗ trợ nạp qua VNPay, MoMo, Thẻ tín dụng/ghi nợ hoặc chuyển khoản trực tiếp.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Nhập số tiền cần nạp (VNĐ)</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₫</span>
                                <Input
                                    id="amount"
                                    type="text"
                                    placeholder="Ví dụ: 1000000"
                                    className="pl-8 text-lg font-medium"
                                    value={depositAmount}
                                    onChange={(e) => {
                                        // Only allow numbers
                                        const val = e.target.value.replace(/\D/g, '')
                                        if (val) {
                                            // Format with commas for display but keep original for value
                                            const formatted = new Intl.NumberFormat('vi-VN').format(parseInt(val))
                                            setDepositAmount(formatted)
                                        } else {
                                            setDepositAmount("")
                                        }
                                    }}
                                />
                            </div>
                            <div className="flex gap-2 mt-2">
                                <Badge variant="outline" className="cursor-pointer hover:bg-muted" onClick={() => setDepositAmount("200.000")}>200k</Badge>
                                <Badge variant="outline" className="cursor-pointer hover:bg-muted" onClick={() => setDepositAmount("500.000")}>500k</Badge>
                                <Badge variant="outline" className="cursor-pointer hover:bg-muted" onClick={() => setDepositAmount("1.000.000")}>1 Triệu</Badge>
                                <Badge variant="outline" className="cursor-pointer hover:bg-muted" onClick={() => setDepositAmount("2.000.000")}>2 Triệu</Badge>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <Label className="mb-3 block">Chọn phương thức thanh toán</Label>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="border border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg flex items-center gap-3 cursor-pointer">
                                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">VNPAY</div>
                                    <span className="text-sm font-medium">VNPAY QR/Card</span>
                                </div>
                                <div className="border border-border p-3 rounded-lg flex items-center gap-3 cursor-pointer opacity-50">
                                    <div className="w-8 h-8 bg-[#A50064] rounded flex items-center justify-center text-white font-bold text-xs">MoMo</div>
                                    <span className="text-sm font-medium">MoMo (Bảo trì)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDepositOpen(false)}>Hủy</Button>
                        <Button onClick={handleDeposit} disabled={isProcessing || !depositAmount} className="bg-indigo-600 hover:bg-indigo-700">
                            {isProcessing ? "Đang kết nối cổng thanh toán..." : "Thanh toán ngay"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Success Dialog */}
            <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
                <DialogContent className="max-w-md sm:max-w-md text-center">
                    <DialogHeader>
                        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                        <DialogTitle className="text-center text-xl">Thanh toán thành công!</DialogTitle>
                        <DialogDescription className="text-center">
                            Đã nạp thành công {formatCurrency(lastDeposited)} vào Ví Học Phí của bạn.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-sm mt-2 text-left">
                        <p className="font-medium text-green-800 mb-2">Thông tin xử lý:</p>
                        <ul className="space-y-2 text-green-700">
                            <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" /> Thời gian nạp tiền: Ngay lập tức</li>
                            <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" /> Số dư ví hiện tại: {formatCurrency(balance)}</li>
                        </ul>
                    </div>
                    <DialogFooter className="sm:justify-center mt-4 border-t pt-4">
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={() => setIsSuccessOpen(false)}>
                            Đã hiểu & Đóng
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Pay Dialog */}
            <Dialog open={isPayOpen} onOpenChange={setIsPayOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Thanh toán học phí bằng Ví</DialogTitle>
                        <DialogDescription>
                            Chọn lớp học / khóa học đang chờ thanh toán để xác nhận.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label className="text-base font-medium">Số dư hiện tại</Label>
                            <div className="text-2xl font-bold text-indigo-600">{formatCurrency(balance)}</div>
                        </div>

                        {pendingCourses.length > 0 ? (
                            <div className="space-y-3 mt-4">
                                <Label>Các khoản cần thanh toán</Label>
                                {pendingCourses.map(course => (
                                    <div
                                        key={course.id}
                                        className={`border p-3 rounded-lg cursor-pointer transition-colors ${selectedCourseToPay?.id === course.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted'}`}
                                        onClick={() => setSelectedCourseToPay(course)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium">{course.title}</p>
                                                <p className="text-sm text-muted-foreground">Gia sư: {course.tutor}</p>
                                            </div>
                                            <Badge variant="outline" className="font-bold text-primary">{formatCurrency(course.price)}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 bg-muted/30 rounded border border-dashed">
                                <CheckCircle2 className="mx-auto h-8 w-8 text-green-500 mb-2" />
                                <p className="text-sm font-medium">Bạn không có rắc rối gì về học phí hiện tại!</p>
                                <p className="text-xs text-muted-foreground mt-1">Đã thanh toán tất cả các khoản.</p>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setIsPayOpen(false); setSelectedCourseToPay(null); }}>Hủy</Button>
                        <Button
                            onClick={handlePayCourse}
                            disabled={isProcessing || !selectedCourseToPay || pendingCourses.length === 0}
                            className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto"
                        >
                            {isProcessing ? "Đang xử lý..." : "Xác nhận thanh toán"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* History Section */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
                    <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <History className="h-5 w-5" /> Lịch sử ví học phí
                        </CardTitle>
                        <CardDescription>Theo dõi dòng tiền ra vào của bạn</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" /> Xuất Excel
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-border/50">
                        {transactions.map((tx) => (
                            <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full flex items-center justify-center shrink-0 ${tx.type === "deposit" || tx.type === "refund" ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" :
                                        "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                        }`}>
                                        {tx.type === "deposit" || tx.type === "refund" ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-medium text-sm line-clamp-1">{tx.title}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>{tx.date}</span>
                                            <span>•</span>
                                            <span className="font-mono">{tx.id}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right space-y-1 shrink-0 ml-4">
                                    <p className={`font-bold ${tx.type === "deposit" || tx.type === "refund" ? "text-green-600 dark:text-green-400" :
                                        "text-foreground"
                                        }`}>
                                        {tx.type === "deposit" || tx.type === "refund" ? "+" : "-"}{formatCurrency(tx.amount)}
                                    </p>
                                    <div className="flex justify-end">
                                        {tx.status === "success" ? (
                                            <Badge variant="outline" className="text-[10px] h-5 border-green-200 text-green-600 bg-green-50 dark:bg-green-900/20">Thành công</Badge>
                                        ) : tx.status === "pending" ? (
                                            <Badge variant="outline" className="text-[10px] h-5 border-amber-200 text-amber-600 bg-amber-50 dark:bg-amber-900/20 w-fit">Đang xử lý</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-[10px] h-5 border-red-200 text-red-600 bg-red-50 dark:bg-red-900/20">Thất bại</Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <div className="p-4 border-t bg-muted/20 text-center">
                    <Button variant="ghost" className="text-sm font-medium w-full">Xem toàn bộ giao dịch</Button>
                </div>
            </Card>
        </div>
    )
}
