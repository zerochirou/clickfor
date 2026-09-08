## Kesimpulan

Untuk Next.js App Router modern, pola terbaik bukan memilih satu di antara Server Action, Route Handler, atau library HTTP.

Gunakan kombinasi berikut:

| Kebutuhan                                                      | Pilihan utama                                          |
| -------------------------------------------------------------- | ------------------------------------------------------ |
| GET saat render halaman                                        | Server Component → panggil external API langsung       |
| POST/PATCH/DELETE dari form atau tombol UI                     | Server Action                                          |
| Endpoint untuk browser, mobile app, webhook, atau pihak ketiga | Route Handler                                          |
| Polling, infinite scroll, realtime-ish client state            | SWR atau TanStack Query                                |
| HTTP client internal                                           | Native `fetch`, dibungkus dalam satu Data Access Layer |

**Rekomendasi default saya: native `fetch` + server-only Data Access Layer.** Server Component, Server Action, dan Route Handler semuanya memanggil layer yang sama.

---

## 1. Arsitektur yang disarankan

```text
External API
     ↑
src/lib/api/              ← satu-satunya layer yang tahu URL, token, timeout
├── client.ts
├── products.ts
└── users.ts
     ↑
     ├── Server Components   ← GET untuk rendering
     ├── Server Actions      ← mutasi dari UI
     └── Route Handlers      ← public/BFF endpoints
```

Dengan struktur ini:

- API key tidak tersebar.
- Error handling konsisten.
- Timeout, headers, dan logging terpusat.
- Business logic tidak tergantung pada transport.
- Tidak ada duplikasi antara Server Action dan Route Handler.

Next.js sendiri merekomendasikan Data Access Layer untuk memusatkan akses data, authorization, dan DTO yang aman. Modul tersebut dapat ditandai dengan `server-only` agar gagal saat tidak sengaja diimpor ke Client Component. ([Next.js][1])

---

## 2. GET: panggil langsung dari Server Component

```tsx
// app/products/[id]/page.tsx
import { getProduct } from "@/lib/api/products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  return (
    <main>
      <h1>{product.name}</h1>
      <p>{product.price}</p>
    </main>
  );
}
```

Jangan lakukan ini dari Server Component:

```tsx
// Hindari
await fetch("https://my-next-app.com/api/products/123");
```

Lalu Route Handler tersebut memanggil external API lagi.

Itu menghasilkan jalur:

```text
Server Component
→ Route Handler Next.js
→ External API
```

Padahal bisa langsung:

```text
Server Component
→ External API
```

Dokumentasi Next.js secara eksplisit menyarankan Server Component mengambil data langsung dari sumbernya, bukan melalui Route Handler internal. Memanggil Route Handler sendiri menambah HTTP round trip dan bahkan dapat bermasalah ketika prerendering saat build. ([Next.js][2])

---

## 3. POST, PATCH, DELETE dari UI: gunakan Server Action

Server Action cocok ketika mutasi berasal dari UI aplikasi Next.js sendiri:

- Submit form
- Update profile
- Create order
- Delete item
- Toggle status
- Upload metadata

Server Action dapat menjalankan mutasi, menginvalidasi cache, dan mengirim hasil serta UI terbaru dalam satu round trip. Namun Server Action hanya dipanggil melalui POST dan client menjalankan action secara berurutan, sehingga bukan pilihan yang tepat untuk GET paralel atau polling. ([Next.js][3])

Contoh:

```ts
// app/products/actions.ts
"use server";

import { updateTag } from "next/cache";
import { patchProduct } from "@/lib/api/products";
import { requireAdmin } from "@/lib/auth";

type UpdateProductInput = {
  id: string;
  name: string;
  price: number;
};

export async function updateProductAction(input: UpdateProductInput) {
  await requireAdmin();

  if (
    typeof input.id !== "string" ||
    typeof input.name !== "string" ||
    typeof input.price !== "number" ||
    input.price < 0
  ) {
    return {
      success: false as const,
      message: "Data produk tidak valid.",
    };
  }

  try {
    const product = await patchProduct(input.id, {
      name: input.name.trim(),
      price: input.price,
    });

    updateTag(`product:${input.id}`);
    updateTag("products");

    return {
      success: true as const,
      data: product,
    };
  } catch {
    return {
      success: false as const,
      message: "Gagal memperbarui produk.",
    };
  }
}
```

`updateTag()` cocok setelah Server Action ketika user harus langsung melihat hasil mutasinya. Untuk invalidasi dari Route Handler atau webhook, gunakan `revalidateTag(tag, 'max')`. ([Next.js][4])

### Hal penting tentang keamanan

Jangan menganggap Server Action sebagai fungsi internal biasa. Server Action tetap dapat dijangkau melalui network request.

Setiap Server Action harus:

- Memeriksa authentication.
- Memeriksa authorization.
- Memvalidasi input.
- Tidak mengembalikan error internal atau response mentah upstream.
- Tidak mempercayai ID, role, price, atau owner yang dikirim client.

Dokumentasi Next.js menyatakan Server Actions harus diperlakukan sebagai untrusted entry point, walaupun implementasinya tidak masuk ke client bundle. ([Next.js][5])

---

## 4. Route Handler: gunakan ketika benar-benar membutuhkan endpoint HTTP

Route Handler adalah pilihan tepat untuk:

- API yang digunakan mobile app.
- Endpoint yang dipanggil Client Component.
- Webhook payment gateway.
- OAuth callback.
- Endpoint publik.
- Proxy/BFF untuk menyembunyikan API key.
- Download file atau streaming.
- Endpoint yang harus mendukung GET, POST, PUT, PATCH, DELETE.
- Endpoint yang harus bisa dites dengan Postman atau dipakai service lain.

```ts
// app/api/products/[id]/route.ts
import { getProduct, patchProduct } from "@/lib/api/products";
import { requireApiSession } from "@/lib/auth";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await requireApiSession();
  const { id } = await context.params;

  const product = await getProduct(id, session);

  return Response.json(product);
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await requireApiSession();
  const { id } = await context.params;
  const body: unknown = await request.json();

  if (!isValidProductPatch(body)) {
    return Response.json({ message: "Invalid request body" }, { status: 400 });
  }

  const product = await patchProduct(id, body, session);

  return Response.json(product);
}

function isValidProductPatch(
  value: unknown,
): value is { name?: string; price?: number } {
  if (!value || typeof value !== "object") {
    return false;
  }

  const input = value as Record<string, unknown>;

  return (
    (input.name === undefined || typeof input.name === "string") &&
    (input.price === undefined ||
      (typeof input.price === "number" && input.price >= 0))
  );
}
```

Route Handlers mendukung GET, POST, PUT, PATCH, DELETE, HEAD, dan OPTIONS. Route Handler merupakan endpoint publik, bukan private function, sehingga authentication dan authorization tetap wajib. GET tidak di-cache secara default kecuali Anda mengaktifkannya secara eksplisit. ([Next.js][6])

---

## 5. Gunakan native `fetch`, bukan Axios secara default

Next.js memperluas native `fetch` dengan dukungan untuk:

- `cache: 'force-cache'`
- `cache: 'no-store'`
- `next.revalidate`
- `next.tags`
- Integrasi dengan Data Cache Next.js

Karena itu, `fetch` adalah pilihan paling natural dan paling ringan untuk App Router. ([Next.js][7])

Axios masih masuk akal apabila:

- Codebase lama sudah sangat bergantung pada interceptor Axios.
- Ada package internal yang mewajibkan Axios.
- Anda membutuhkan kompatibilitas khusus di luar runtime Next.js.
- Tim sudah mempunyai abstraction Axios yang matang dan teruji.

Tetapi jangan memasang Axios hanya agar sintaks POST terlihat lebih nyaman. Buat wrapper `fetch` kecil saja.

---

## 6. Contoh HTTP client yang ringan

```ts
// src/lib/api/client.ts
import "server-only";

type NextFetchOptions = {
  revalidate?: number | false;
  tags?: string[];
};

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  timeoutMs?: number;
  next?: NextFetchOptions;
};

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly payload: unknown,
  ) {
    super(`External API returned status ${status}`);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const baseUrl = process.env.EXTERNAL_API_URL;

  if (!baseUrl) {
    throw new Error("EXTERNAL_API_URL is not configured");
  }

  const token = process.env.EXTERNAL_API_TOKEN;
  const { body, timeoutMs = 8_000, headers, ...requestOptions } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(new URL(path, baseUrl), {
      ...requestOptions,
      headers: {
        accept: "application/json",
        ...(body !== undefined ? { "content-type": "application/json" } : {}),
        ...(token ? { authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });

    const contentType = response.headers.get("content-type") ?? "";

    const payload =
      response.status === 204
        ? null
        : contentType.includes("application/json")
          ? await response.json()
          : await response.text();

    if (!response.ok) {
      throw new ApiError(response.status, payload);
    }

    return payload as T;
  } finally {
    clearTimeout(timeout);
  }
}
```

Resource-specific client:

```ts
// src/lib/api/products.ts
import "server-only";
import { apiRequest } from "./client";

export type Product = {
  id: string;
  name: string;
  price: number;
};

type ProductPatch = {
  name?: string;
  price?: number;
};

export function getProduct(id: string): Promise<Product> {
  return apiRequest<Product>(`/products/${encodeURIComponent(id)}`, {
    next: {
      revalidate: 300,
      tags: ["products", `product:${id}`],
    },
  });
}

export function patchProduct(
  id: string,
  input: ProductPatch,
): Promise<Product> {
  return apiRequest<Product>(`/products/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: input,
    cache: "no-store",
  });
}

export function deleteProduct(id: string): Promise<void> {
  return apiRequest<void>(`/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
    cache: "no-store",
  });
}
```

Ini memberi DX mirip library HTTP:

```ts
await getProduct(id);
await patchProduct(id, input);
await deleteProduct(id);
```

Tanpa menambah abstraction besar.

---

## 7. Kapan menggunakan SWR atau TanStack Query?

Gunakan client-side data library hanya ketika data benar-benar dikelola di browser.

### Gunakan SWR ketika

- Kebutuhannya sederhana.
- GET dan polling.
- Auto-refetch saat window focus.
- Optimistic update sederhana.
- Ingin API kecil dan mudah.

### Gunakan TanStack Query ketika

- Banyak query saling terkait.
- Mutation lifecycle kompleks.
- Optimistic update kompleks.
- Infinite query.
- Prefetch dan invalidation granular.
- Dashboard dengan banyak state asynchronous.
- Aplikasi lebih mirip SPA.

Next.js menyebut SWR dan React Query sebagai pilihan untuk data yang harus diambil di client, khususnya data yang sering dipolling atau bergantung pada browser API. ([Next.js][2])

Jangan menggunakan React Query untuk setiap halaman hanya karena aplikasinya memakai Next.js. Untuk halaman SSR/RSC biasa, Server Component sudah cukup dan mengirim lebih sedikit JavaScript ke browser.

---

## 8. Strategi caching yang masuk akal

### Data publik dan relatif stabil

```ts
fetch(url, {
  next: {
    revalidate: 300,
    tags: ["products"],
  },
});
```

Contoh:

- Product catalog
- Artikel
- Public configuration
- Daftar kategori

### Data user-specific atau sensitif

```ts
fetch(url, {
  cache: "no-store",
});
```

Contoh:

- Saldo
- Cart
- User profile
- Permission
- Dashboard pribadi
- Status transaksi

Kesalahan umum adalah meng-cache response berdasarkan URL saja padahal hasilnya bergantung pada cookie, token, tenant, atau user. Secara teknis cache mungkin membuat request lebih cepat, tetapi secara keamanan dapat menghasilkan kebocoran data lintas user.

---

## 9. Asumsi yang perlu dibongkar

### “Server Action lebih aman karena tidak terlihat sebagai API”

Tidak benar.

Implementasinya memang berada di server, tetapi action tetap merupakan network entry point. Authentication dan authorization wajib dilakukan ulang di dalam action. ([Next.js][5])

### “Semua external API sebaiknya diproxy melalui `/api`”

Tidak benar.

Proxy diperlukan ketika browser atau service eksternal membutuhkan endpoint tersebut. Server Component sebaiknya langsung memanggil Data Access Layer agar tidak menambah round trip. ([Next.js][2])

### “Library HTTP otomatis meningkatkan performance”

Biasanya tidak.

Faktor yang lebih signifikan adalah:

- Jumlah network round trip.
- Lokasi server Next.js dan external API.
- Connection reuse.
- Caching.
- Parallel request.
- Ukuran response.
- Timeout dan retry.
- Data yang dikirim ke Client Component.
- Waterfall saat rendering.

Mengganti `fetch` dengan Axios tidak menyelesaikan faktor-faktor tersebut.

---

## Rekomendasi final

Untuk mayoritas aplikasi Next.js:

```text
Native fetch
+ server-only Data Access Layer
+ direct fetch dari Server Components
+ Server Actions untuk mutasi UI
+ Route Handlers untuk public/BFF endpoints
+ SWR/TanStack Query hanya untuk kebutuhan client-side
```

Urutan prioritas implementasinya:

1. Buat satu `lib/api/client.ts`.
2. Buat service berdasarkan domain, bukan berdasarkan HTTP method.
3. Panggil service langsung dari Server Component untuk GET.
4. Panggil service yang sama dari Server Action untuk mutasi UI.
5. Tambahkan Route Handler hanya ketika memang membutuhkan HTTP endpoint.
6. Validasi ulang authentication, authorization, dan input pada setiap mutation boundary.
7. Cache hanya data yang memang aman untuk dibagikan atau disimpan sementara.

Ini memberi keseimbangan terbaik antara performance, bobot dependency, keamanan, dan DX.

[1]: https://nextjs.org/docs/15/app/guides/data-security?utm_source=chatgpt.com "Guides: Data Security | Next.js"
[2]: https://nextjs.org/docs/app/guides/backend-for-frontend?utm_source=chatgpt.com "Guides: Backend for Frontend | Next.js"
[3]: https://nextjs.org/docs/app/getting-started/mutating-data?utm_source=chatgpt.com "Getting Started: Mutating Data | Next.js"
[4]: https://nextjs.org/docs/app/api-reference/functions/updateTag?utm_source=chatgpt.com "Functions: updateTag | Next.js"
[5]: https://nextjs.org/docs/app/guides/server-actions?utm_source=chatgpt.com "Guides: Server Actions | Next.js"
[6]: https://nextjs.org/docs/app/getting-started/route-handlers?utm_source=chatgpt.com "Getting Started: Route Handlers | Next.js"
[7]: https://nextjs.org/docs/app/api-reference/functions/fetch?utm_source=chatgpt.com "Functions: fetch | Next.js"
