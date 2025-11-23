"use client"
import React, { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2, Mail } from "lucide-react"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import Link from "next/link"

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth() // Use login from context to update state

  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [verifySuccess, setVerifySuccess] = useState(false) // New state for success message

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (otp.length !== 6) {
      setError("Vui lòng nhập mã OTP 6 số")
      return
    }

    setLoading(true)
    try {
      const response = await apiClient.verifyRegistration(email, otp)

      // Show success message
      setVerifySuccess(true)

      // Delay redirect slightly so user sees the success message
      setTimeout(() => {
        router.push("/login")
      }, 1500) // 1.5 second delay

    } catch (err) {
      setError(err instanceof Error ? err.message : "Mã xác thực không hợp lệ")
      setLoading(false) // Only stop loading on error, keep loading on success until redirect
    }
  }

  const handleResend = async () => {
    setResendLoading(true)
    setResendSuccess(false)
    setError("")

    try {
      await apiClient.resendVerificationOtp(email)
      setResendSuccess(true)
      setTimeout(() => setResendSuccess(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gửi lại mã thất bại")
    } finally {
      setResendLoading(false)
    }
  }

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            Thiếu thông tin email. Vui lòng đăng ký lại.
            <br />
            <Link href="/register" className="font-bold underline mt-2 inline-block">
              Về trang đăng ký
            </Link>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex overflow-hidden bg-white">
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-20 py-12">
        <div className="max-w-md w-full space-y-8 animate-fade-in-up">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-green/10 to-accent-green/5 mb-6 shadow-lg shadow-accent-green/5">
              <Mail className="w-8 h-8 text-accent-green" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Xác thực tài khoản
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Mã xác thực đã được gửi đến email <strong>{email}</strong>
            </p>
          </div>

          <div className="mt-8 space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {resendSuccess && (
              <Alert className="border-green-200 bg-green-50 text-green-900">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <AlertDescription className="ml-2">
                  Đã gửi lại mã xác thực
                </AlertDescription>
              </Alert>
            )}

            {verifySuccess && (
              <Alert className="border-green-200 bg-green-50 text-green-900 mb-6">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <AlertDescription className="ml-2 font-medium">
                  Xác thực thành công! Vui lòng đăng nhập để tiếp tục. Đang chuyển hướng đến trang đăng nhập...
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleVerify} className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  disabled={loading}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <p className="text-xs text-muted-foreground">
                  Nhập mã 6 số gồm các chữ số
                </p>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-br from-foreground via-gray-900 to-gray-800 hover:from-gray-900 hover:via-foreground hover:to-gray-900 text-background font-semibold rounded-xl shadow-lg shadow-gray-900/25 hover:shadow-xl hover:shadow-gray-900/30 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Đang xác thực...
                    </>
                  ) : (
                    "Xác thực"
                  )}
                </Button>
              </div>
            </form>

            <div className="flex flex-col items-center gap-4">
              <div className="text-sm text-center">
                Chưa nhận được mã?{" "}
                <button
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="font-semibold text-accent-green hover:text-accent-green-dark hover:underline transition-colors disabled:opacity-50"
                >
                  {resendLoading ? "Đang gửi..." : "Gửi lại mã"}
                </button>
              </div>

              <Link
                href="/login"
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                Quay về đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
