export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const DATASET_BASE_URL = "http://103.245.38.142/datasets"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get("filename")

    if (!filename) {
      return Response.json(
        {
          message: "Nama file dataset tidak ditemukan.",
        },
        {
          status: 400,
        }
      )
    }

    // Mencegah penggunaan path seperti ../../file
    const isValidFilename =
      /^[a-zA-Z0-9._-]+\.csv$/i.test(filename)

    if (!isValidFilename) {
      return Response.json(
        {
          message: "Nama file dataset tidak valid.",
        },
        {
          status: 400,
        }
      )
    }

    const fileUrl = `${DATASET_BASE_URL}/${encodeURIComponent(filename)}`

    const response = await fetch(fileUrl, {
      method: "GET",
      cache: "no-store",
    })

    if (!response.ok) {
      return Response.json(
        {
          message: `File dataset gagal diambil dari VPS. Status: ${response.status}`,
        },
        {
          status: response.status,
        }
      )
    }

    if (!response.body) {
      return Response.json(
        {
          message: "Isi file dataset kosong.",
        },
        {
          status: 404,
        }
      )
    }

    const headers = new Headers()

    headers.set(
      "Content-Type",
      response.headers.get("content-type") ??
        "text/csv; charset=utf-8"
    )

    headers.set(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    )

    headers.set("Cache-Control", "no-store")

    const contentLength =
      response.headers.get("content-length")

    if (contentLength) {
      headers.set("Content-Length", contentLength)
    }

    return new Response(response.body, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error("Proxy download dataset error:", error)

    return Response.json(
      {
        message: "Terjadi kesalahan saat mengambil dataset.",
      },
      {
        status: 500,
      }
    )
  }
}