"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Shield, CreditCard, Bell, Globe, Save } from "lucide-react"

export default function AdminSettingsPage() {
    const { toast } = useToast()

    const handleSave = () => {
        toast({
            title: "Đã lưu cài đặt",
            description: "Cấu hình hệ thống đã được cập nhật thành công.",
        })
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Cài đặt Hệ thống</h1>
                <p className="text-muted-foreground mt-1">Cấu hình các tham số lõi của nền tảng EduConnect</p>
            </div>

            <Tabs defaultValue="payment" className="space-y-6">
                <TabsList className="bg-muted space-x-2">
                    <TabsTrigger value="payment" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><CreditCard className="w-4 h-4 mr-2" /> Giao dịch & Escrow</TabsTrigger>
                    <TabsTrigger value="general"><Globe className="w-4 h-4 mr-2" /> Hệ thống chung</TabsTrigger>
                    <TabsTrigger value="notifications"><Bell className="w-4 h-4 mr-2" /> Thông báo</TabsTrigger>
                    <TabsTrigger value="security"><Shield className="w-4 h-4 mr-2" /> Bảo mật & Phân quyền</TabsTrigger>
                </TabsList>

                <TabsContent value="payment">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cấu trúc Phí & Thanh toán</CardTitle>
                            <CardDescription>
                                Thiết lập tỷ lệ hoa hồng, phí rút tiền và các cổng thanh toán được hỗ trợ cho quá trình Escrow.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="platform-fee">Tỷ lệ Hoa hồng Nền tảng (%)</Label>
                                    <Input id="platform-fee" defaultValue="15" type="number" />
                                    <p className="text-xs text-muted-foreground">Phần trăm giữ lại khi giải ngân cho Gia sư/Giáo viên.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="withdrawal-fee">Phí rút tiền cố định (VNĐ)</Label>
                                    <Input id="withdrawal-fee" defaultValue="5500" type="number" />
                                    <p className="text-xs text-muted-foreground">Phí ngân hàng cố định mỗi lệnh chuyển tiền (Tutor Payout).</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="default-gateway">Cổng thanh toán mặc định</Label>
                                    <Select defaultValue="vnpay">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn cổng thanh toán" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="vnpay">VNPAY</SelectItem>
                                            <SelectItem value="momo">Ví MoMo</SelectItem>
                                            <SelectItem value="zalopay">ZaloPay</SelectItem>
                                            <SelectItem value="stripe">Stripe (Thẻ Quốc tế)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 flex flex-col justify-center pt-4">
                                    <div className="flex items-center space-x-2">
                                        <Switch id="escrow-enable" defaultChecked />
                                        <Label htmlFor="escrow-enable" className="font-semibold text-primary">Kích hoạt Escrow Protocol</Label>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2 pl-11">
                                        Nếu tắt, tiền học phí sẽ chuyển thẳng tới Tutor thay vì bị khóa (Hold) tại ứng dụng trong tuần đầu.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button onClick={handleSave} className="ml-auto"><Save className="w-4 h-4 mr-2" /> Lưu thay đổi</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cấu hình chung hệ thống</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Email Hỗ trợ Khách hàng</Label>
                                <Input defaultValue="support@educonnect.vn" />
                            </div>
                            <div className="space-y-2">
                                <Label>Hotline giải quyết tranh chấp</Label>
                                <Input defaultValue="1900 1234" />
                            </div>
                            <div className="flex items-center space-x-2 pt-4 border-t">
                                <Switch id="maintenance" />
                                <Label htmlFor="maintenance" className="text-red-500 font-medium">Kích hoạt Chế độ Bảo trì (Maintenance Mode)</Label>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button onClick={handleSave} className="ml-auto"><Save className="w-4 h-4 mr-2" /> Lưu cấu hình</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
