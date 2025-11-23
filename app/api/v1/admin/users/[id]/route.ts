import { type NextRequest } from "next/server"
import { proxyBackend } from "@/app/api/_lib/backend"

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  return proxyBackend(request, `/admin/users/${params.id}`)
}
