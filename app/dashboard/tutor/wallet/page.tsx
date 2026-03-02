"use client"

import { useState } from "react"
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
    Clock,
    XCircle,
    Shield
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

export default function ScholarWalletPage() {
    const { toast } = useToast()

    // Fake Data
    const [balance, setBalance] = useState(4850000)
    const [escrowBalance, setEscrowBalance] = useState(1200000)
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
    const [isSuccessOpen, setIsSuccessOpen] = useState(false)
    const [lastWithdrawn, setLastWithdrawn] = useState(0)
    const [withdrawAmount, setWithdrawAmount] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)

    const [transactions, setTransactions] = useState([
        { id: "TX98234", type: "receive", amount: 400000, date: "2024-03-02 14:30", status: "success", title: "Thù lao dạy Lớp Toán 10 (#L10-402)" },
        { id: "TX98230", type: "withdraw", amount: 2000000, date: "2024-02-28 09:15", status: "success", title: "Rút tiền về Vietcombank (***8899)" },
        { id: "TX98221", type: "escrow_lock", amount: 400000, date: "2024-02-25 10:00", status: "pending", title: "Khóa Quỹ nhận lớp Hóa 12 (#H12-211)" },
        { id: "TX98210", type: "escrow_unlock", amount: 500000, date: "2024-02-20 18:45", status: "success", title: "Hoàn Quỹ Escrow lớp Lý 11 (Hoàn thành mốc 3 buổi)" },
        { id: "TX98198", type: "receive", amount: 350000, date: "2024-02-18 20:00", status: "success", title: "Thù lao dạy Lớp Lý 11 (#L11-901)" },
    ])

    const handleWithdraw = () => {
        const amount = parseInt(withdrawAmount.replace(/\D/g, ''))

        if (!amount || amount < 50000) {
            toast({ title: "Lỗi", description: "Số tiền rút tối thiểu là 50,000đ", variant: "destructive" })
            return
        }

        if (amount > balance) {
            toast({ title: "Lỗi", description: "Số dư khả dụng không đủ", variant: "destructive" })
            return
        }

        setIsProcessing(true)

        // Simulate API call
        setTimeout(() => {
            setBalance(prev => prev - amount)
            setTransactions(prev => [
                {
                    id: `TX${Math.floor(Math.random() * 100000)}`,
                    type: "withdraw",
                    amount: amount,
                    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
                    status: "pending",
                    title: "Lệnh Rút tiền đang chờ xử lý (Ngân hàng)"
                },
                ...prev
            ])
            setIsProcessing(false)
            setIsWithdrawOpen(false)
            setIsSuccessOpen(true)
            setLastWithdrawn(amount)
            setWithdrawAmount("")

            toast({
                title: "Tạo lệnh rút thành công",
                description: `Hệ thống đang xử lý chuyển ${formatCurrency(amount)} về tài khoản của bạn.`,
            })
        }, 1500)
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Ví điện tử & Thu nhập</h1>
                <p className="text-muted-foreground">
                    Quản lý doanh thu giảng dạy, theo dõi dòng tiền và thực hiện Rút/Nạp tiền nhanh chóng qua cổng thanh toán bảo mật.
                </p>
            </div>

            {/* Top Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Main Balance Card */}
                <Card className="md:col-span-2 bg-gradient-to-br from-primary/90 to-primary text-primary-foreground shadow-lg overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Wallet className="w-48 h-48 rotate-12" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-primary-foreground/80 font-medium text-lg flex items-center gap-2">
                            Số dư khả dụng
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
                            {formatCurrency(balance)}
                        </div>
                        <div className="flex items-center gap-2 mt-6">
                            <Button
                                variant="secondary"
                                className="bg-white/20 hover:bg-white/30 text-white border-0 gap-2"
                                onClick={() => setIsWithdrawOpen(true)}
                            >
                                <ArrowUpRight className="h-4 w-4" /> Rút tiền
                            </Button>
                            <Button variant="secondary" className="bg-white text-primary hover:bg-white/90 gap-2">
                                <ArrowDownLeft className="h-4 w-4" /> Nạp quỹ Escrow
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Escrow Balance & Stats */}
                <div className="space-y-6">
                    <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-900/30 shadow-sm relative overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-amber-800 dark:text-amber-400 font-medium text-sm flex justify-between items-center">
                                <span>Quỹ đảm bảo (Escrow)</span>
                                <Shield className="h-4 w-4 opacity-50" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-700 dark:text-amber-500 mb-1">
                                {formatCurrency(escrowBalance)}
                            </div>
                            <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-2 leading-relaxed">
                                Số tiền đang bị khóa để đảm bảo hợp đồng nhận lớp. Hệ thống sẽ tự động hoàn về Ví Chính vào ngày cuối cùng của tháng.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Withdraw Dialog */}
            <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rút tiền về Ngân hàng</DialogTitle>
                        <DialogDescription>
                            Chuyển số dư khả dụng về tài khoản ngân hàng đã liên kết.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="p-4 rounded-lg bg-muted/50 border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Landmark className="h-8 w-8 text-blue-600 p-1.5 bg-blue-100 rounded-md" />
                                <div>
                                    <p className="font-medium text-sm">Vietcombank</p>
                                    <p className="text-xs text-muted-foreground">***8899 - NGUYEN VAN A</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs">Thay đổi</Button>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label htmlFor="amount">Số tiền rút (VNĐ)</Label>
                                <span className="text-xs text-muted-foreground">Khả dụng: <strong className="text-primary">{formatCurrency(balance)}</strong></span>
                            </div>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₫</span>
                                <Input
                                    id="amount"
                                    type="text"
                                    placeholder="Ví dụ: 500000"
                                    className="pl-8 text-lg font-medium"
                                    value={withdrawAmount}
                                    onChange={(e) => {
                                        // Only allow numbers
                                        const val = e.target.value.replace(/\D/g, '')
                                        if (val) {
                                            // Format with commas for display but keep original for value
                                            const formatted = new Intl.NumberFormat('vi-VN').format(parseInt(val))
                                            setWithdrawAmount(formatted)
                                        } else {
                                            setWithdrawAmount("")
                                        }
                                    }}
                                />
                            </div>
                            <div className="flex gap-2 mt-2">
                                <Badge variant="outline" className="cursor-pointer hover:bg-muted" onClick={() => setWithdrawAmount("500.000")}>500k</Badge>
                                <Badge variant="outline" className="cursor-pointer hover:bg-muted" onClick={() => setWithdrawAmount("1.000.000")}>1 Triệu</Badge>
                                <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground" onClick={() => setWithdrawAmount(new Intl.NumberFormat('vi-VN').format(balance))}>Rút tất cả</Badge>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsWithdrawOpen(false)}>Hủy</Button>
                        <Button onClick={handleWithdraw} disabled={isProcessing || !withdrawAmount}>
                            {isProcessing ? "Đang xử lý..." : "Xác nhận Rút tiền"}
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
                        <DialogTitle className="text-center text-xl">Tạo lệnh rút thành công!</DialogTitle>
                        <DialogDescription className="text-center">
                            Đã tạo lệnh chuyển {formatCurrency(lastWithdrawn)} về tài khoản Vietcombank của bạn.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-sm mt-2 text-left">
                        <p className="font-medium text-green-800 mb-2">Thông tin xử lý:</p>
                        <ul className="space-y-2 text-green-700">
                            <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" /> Thời gian nhận tiền: 5 - 15 phút.</li>
                            <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" /> Ngân hàng: Vietcombank (***8899)</li>
                            <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" /> Lệnh rút: Đang xử lý tự động</li>
                        </ul>
                    </div>
                    <DialogFooter className="sm:justify-center mt-4 border-t pt-4">
                        <Button className="w-full bg-primary" onClick={() => setIsSuccessOpen(false)}>
                            Đã hiểu & Đóng
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* History Section */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
                    <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <History className="h-5 w-5" /> Lịch sử giao dịch
                        </CardTitle>
                        <CardDescription>Các giao dịch gần đây nhất của bạn</CardDescription>
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
                                    <div className={`p-2 rounded-full flex items-center justify-center shrink-0 ${tx.type === "receive" || tx.type === "escrow_unlock" ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" :
                                        tx.type === "withdraw" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" :
                                            "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                                        }`}>
                                        {tx.type === "receive" ? <ArrowDownLeft className="h-5 w-5" /> :
                                            tx.type === "withdraw" ? <ArrowUpRight className="h-5 w-5" /> :
                                                tx.type === "escrow_unlock" ? <Shield className="h-5 w-5" /> :
                                                    <Clock className="h-5 w-5" />}
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
                                    <p className={`font-bold ${tx.type === "receive" || tx.type === "escrow_unlock" ? "text-green-600 dark:text-green-400" :
                                        "text-foreground"
                                        }`}>
                                        {tx.type === "receive" || tx.type === "escrow_unlock" ? "+" : "-"}{formatCurrency(tx.amount)}
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
