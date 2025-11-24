"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, Clock, Bell, MapPin, Calendar, ArrowRight, Sparkles, Package } from "lucide-react"
import { useBooking } from "@/hooks/use-bookings"
import { Skeleton } from "@/components/ui/skeleton"
import { navItems } from "@/lib/customer-nav-config"


export default function BookingSuccessPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = Number.parseInt(params.id as string)
  const { booking, isLoading } = useBooking(bookingId)
  const [notificationsSent, setNotificationsSent] = useState(0)
  const [isNotifying, setIsNotifying] = useState(true)

  // Simulate transporter notification process
  useEffect(() => {
    let count = 0
    const interval = setInterval(() => {
      count++
      setNotificationsSent(count)
      if (count >= 5) {
        clearInterval(interval)
        setIsNotifying(false)
      }
    }, 800)

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <DashboardLayout navItems={navItems} title="Đang tải booking">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <Skeleton className="h-64 w-full" />
        </div>
      </DashboardLayout>
    )
  }

  if (!booking) {
    return (
      <DashboardLayout navItems={navItems} title="Booking không tồn tại">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <Alert variant="destructive">
            <AlertDescription>Không tìm thấy booking</AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    )
  }

  const bookingItems = (booking.items || []) as Array<any>
  const pickupAddress =
    (booking as any).pickupAddress ||
    booking.pickup_address_line ||
    [booking.pickup_contact_name, booking.pickup_address_line].filter(Boolean).join(", ")
  const deliveryAddress =
    (booking as any).deliveryAddress ||
    booking.delivery_address_line ||
    [booking.delivery_contact_name, booking.delivery_address_line].filter(Boolean).join(", ")
  const preferredDate = (booking as any).preferredDate || booking.preferred_date || ""
  const preferredTimeSlot = (booking as any).preferredTimeSlot || booking.preferred_time_slot || ""

  return (
    <DashboardLayout navItems={navItems} title={`Booking #${bookingId}`}>
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-4">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Tạo booking thành công!</h1>
          <p className="text-lg text-muted-foreground">
            Booking #{bookingId} đã được tạo và gửi đến các đơn vị vận chuyển
          </p>
        </div>

        {/* Notification Status */}
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Thông báo đến đơn vị vận chuyển
            </CardTitle>
            <CardDescription>Hệ thống đang tự động gửi thông báo đến các đơn vị phù hợp</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isNotifying ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Đang gửi thông báo...</span>
                  <Badge variant="secondary">
                    <Clock className="h-3 w-3 mr-1 animate-spin" />
                    {notificationsSent}/5
                  </Badge>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                        i <= notificationsSent ? "bg-success/10" : "bg-muted/50"
                      }`}
                    >
                      {i <= notificationsSent ? (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                      )}
                      <span className="text-sm">Đơn vị vận chuyển #{i}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Alert className="bg-success/10 border-success">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <AlertDescription className="text-success-foreground">
                  Đã gửi thông báo thành công đến {notificationsSent} đơn vị vận chuyển phù hợp!
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Booking Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin booking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Addresses */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium mb-1">Địa chỉ đón</p>
                  <p className="text-sm text-muted-foreground">{pickupAddress}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 text-destructive mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium mb-1">Địa chỉ giao</p>
                  <p className="text-sm text-muted-foreground">{deliveryAddress}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Date & Time */}
            <div className="flex gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="font-medium mb-1">Thời gian đón</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(preferredDate).toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <Badge variant="outline" className="mt-2">
                  {preferredTimeSlot === "MORNING" && "Buổi sáng (7h-12h)"}
                  {preferredTimeSlot === "AFTERNOON" && "Buổi chiều (12h-17h)"}
                  {preferredTimeSlot === "EVENING" && "Buổi tối (17h-21h)"}
                  {preferredTimeSlot === "FLEXIBLE" && "Linh hoạt"}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Items */}
            <div className="flex gap-3">
              <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="font-medium mb-2">Đồ vật ({bookingItems.length} món)</p>
                <div className="space-y-2">
                  {bookingItems.map((item, index) => {
                    const itemName = item.name ?? item.item_name ?? `Item ${index + 1}`
                    const quantity = item.quantity ?? 0
                    const weight = item.weight ?? item.weight_kg ?? null

                    return (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {itemName} x{quantity}
                        </span>
                        {weight && <span className="font-medium">{weight}kg</span>}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Bước tiếp theo</CardTitle>
            <CardDescription>Những gì sẽ xảy ra sau đây</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Chờ báo giá</h4>
                <p className="text-sm text-muted-foreground">
                  Các đơn vị vận chuyển sẽ xem thông tin và gửi báo giá trong vòng 1-2 giờ
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">So sánh và chọn</h4>
                <p className="text-sm text-muted-foreground">
                  Bạn sẽ nhận được thông báo khi có báo giá mới. So sánh giá và dịch vụ để chọn đơn vị phù hợp
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Xác nhận và thanh toán</h4>
                <p className="text-sm text-muted-foreground">
                  Sau khi chấp nhận báo giá, hợp đồng sẽ được tạo và bạn có thể thanh toán đặt cọc
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" className="flex-1 bg-transparent" onClick={() => router.push("/customer/bookings")}>
            Xem tất cả booking
          </Button>
          <Button className="flex-1" onClick={() => router.push(`/customer/bookings/${bookingId}`)}>
            Xem chi tiết booking
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* AI Badge */}
        {bookingItems.some((item) => {
          const images = item.imageUrls ?? item.image_urls ?? []
          return Array.isArray(images) ? images.length > 0 : typeof images === "string" && images.length > 0
        }) && (
          <Alert className="bg-primary/5 border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <AlertDescription>
              Booking này được tạo với sự hỗ trợ của AI Scanning, giúp tiết kiệm thời gian và tăng độ chính xác
            </AlertDescription>
          </Alert>
        )}
      </div>
    </DashboardLayout>
  )
}











