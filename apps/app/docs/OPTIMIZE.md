## Kesimpulan utama

Paradigma terbaik untuk performa Next.js bukan:

> “Semakin sedikit Server Components, semakin cepat.”

Paradigma yang lebih tepat:

> **Minimalkan pekerjaan yang dilakukan ulang, minimalkan data yang dipindahkan, dan jalankan pekerjaan di lokasi yang paling tepat.**

Secara kasar:

```text
Biaya server
≈ jumlah request dinamis
× kerja yang tidak ter-cache
× CPU rendering
× ukuran data/RSC payload
× concurrency

Peak memory
≈ module yang dimuat
+ concurrency × memory per request
+ cache
+ connection pool
+ object yang bocor/tertahan
```

Jumlah Server Components sendiri bukan metrik yang berguna. Seribu komponen kecil yang hanya menghasilkan markup bisa lebih murah daripada satu komponen yang menjalankan query berat, memproses 50.000 item, lalu mengirim object 2 MB ke browser.

---

# 1. Paradigma rendering: static sebanyak mungkin, dynamic seperlunya

Untuk setiap bagian UI, klasifikasikan ke salah satu kategori ini:

| Jenis konten                                          | Strategi                                  |
| ----------------------------------------------------- | ----------------------------------------- |
| Sama untuk semua pengguna dan jarang berubah          | Static atau cached                        |
| Sama untuk semua pengguna tetapi cukup sering berubah | Cached dengan revalidation                |
| Personal per user                                     | Dynamic, isolasi dalam bagian kecil       |
| Interaktif tetapi data awal stabil                    | Server Component + Client Component kecil |
| Browser-only, misalnya map atau editor                | Client Component, lazy-load               |
| Polling/realtime                                      | Client-side fetch atau koneksi realtime   |

Struktur ideal halaman:

```text
Static/cached shell
├── Header
├── Navigation
├── Product information
├── Cached recommendations
└── Dynamic personalized island
    ├── User balance
    └── Cart
```

Bukan:

```text
Satu halaman dinamis besar
└── Semua komponen menunggu cookie, user, query, dan API
```

Pada Next.js 16, fitur Cache Components memungkinkan static shell, cached content, dan dynamic content hidup dalam route yang sama. Dynamic content dapat ditempatkan di bawah `Suspense`, sementara shell statis dikirim lebih awal. Fitur ini bersifat opt-in melalui `cacheComponents: true`. ([Next.js][1])

---

# 2. Fetch dua atau lebih data: bedakan berdasarkan dependensi

## Kasus A: kedua request independen dan semuanya dibutuhkan

Gunakan `Promise.all`.

```tsx
export default async function DashboardPage() {
  const userPromise = getUser();
  const summaryPromise = getSummary();

  const [user, summary] = await Promise.all([userPromise, summaryPromise]);

  return <Dashboard user={user} summary={summary} />;
}
```

Jangan menulis:

```tsx
const user = await getUser();
const summary = await getSummary();
```

Kode tersebut membuat waterfall:

```text
getUser:    ███████
getSummary:        ███████
```

Dengan `Promise.all`:

```text
getUser:    ███████
getSummary: █████████
```

Next.js merekomendasikan memulai request independen secara bersamaan dan kemudian menunggunya dengan `Promise.all`. ([Next.js][2])

### Catatan penting

`Promise.all` berarti seluruh operasi gagal ketika salah satu promise gagal.

Ketika kegagalan satu sumber tidak boleh menghancurkan seluruh halaman:

```tsx
const [profileResult, recommendationsResult] = await Promise.allSettled([
  getProfile(),
  getRecommendations(),
]);

const profile =
  profileResult.status === "fulfilled" ? profileResult.value : null;

const recommendations =
  recommendationsResult.status === "fulfilled"
    ? recommendationsResult.value
    : [];
```

---

## Kasus B: request independen, tetapi UI bisa tampil sebagian

Jangan menahan seluruh halaman dengan satu `Promise.all`. Pisahkan menggunakan `Suspense`.

```tsx
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <main>
      <DashboardHeader />

      <Suspense fallback={<SummarySkeleton />}>
        <AccountSummary />
      </Suspense>

      <Suspense fallback={<TransactionsSkeleton />}>
        <RecentTransactions />
      </Suspense>

      <Suspense fallback={<RecommendationsSkeleton />}>
        <Recommendations />
      </Suspense>
    </main>
  );
}

async function AccountSummary() {
  const summary = await getAccountSummary();
  return <Summary data={summary} />;
}

async function RecentTransactions() {
  const transactions = await getRecentTransactions();
  return <TransactionList data={transactions} />;
}

async function Recommendations() {
  const recommendations = await getRecommendations();
  return <RecommendationList data={recommendations} />;
}
```

Paradigmanya:

- `Promise.all` mengoptimalkan waktu penyelesaian keseluruhan.
- `Suspense` mengoptimalkan waktu sampai pengguna melihat bagian pertama.
- Kombinasikan keduanya ketika satu region membutuhkan beberapa request.

```tsx
async function AccountSummary() {
  const [balance, limits, rewards] = await Promise.all([
    getBalance(),
    getLimits(),
    getRewards(),
  ]);

  return <Summary balance={balance} limits={limits} rewards={rewards} />;
}
```

Next.js menggunakan streaming untuk mengirim bagian halaman secara progresif sehingga satu request lambat tidak harus memblokir semua UI. ([Next.js][3])

---

## Kasus C: request kedua bergantung pada request pertama

Sequential fetching memang diperlukan:

```tsx
const user = await getUser();
const orders = await getOrders(user.id);
```

Tetapi pertanyaan berikutnya adalah:

> Apakah dependensi tersebut benar-benar diperlukan, atau hanya akibat desain API yang buruk?

Alternatifnya:

```tsx
const [user, orders] = await Promise.all([getUser(userId), getOrders(userId)]);
```

Atau buat endpoint/query agregat:

```tsx
const dashboard = await getDashboardData(userId);
```

Tetapi endpoint agregat jangan sekadar menjalankan request secara sequential di belakang layar. Idealnya backend melakukan query paralel, database join, atau batch query.

---

# 3. Colocate fetch, tetapi deduplikasi pekerjaan

Tidak harus semua fetching dilakukan di `page.tsx`.

Ini sah:

```tsx
async function HeaderUser() {
  const user = await getUser();
  return <span>{user.name}</span>;
}

async function AccountPanel() {
  const user = await getUser();
  return <Account userId={user.id} />;
}
```

Identical `fetch` GET dalam React component tree dimemoisasi selama satu render request, asalkan URL dan opsinya identik. Untuk ORM, database client, atau fungsi non-`fetch`, gunakan `React.cache`. ([Next.js][2])

```ts
// lib/user.ts
import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";

export const getCurrentUser = cache(async () => {
  const session = await verifySession();

  return db.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      role: true,
    },
  });
});
```

Perlu dipahami:

- `React.cache` mencegah duplikasi dalam satu server request.
- Itu bukan persistent cache lintas pengguna.
- Cache React direset untuk setiap server request.
- Argumen harus konsisten. `getUser('1')` dan `getUser(1)` adalah key berbeda. ([React][4])

---

# 4. Bedakan request memoization dan persistent caching

Ini dua hal berbeda.

## Request memoization

Tujuannya:

> Jangan menjalankan operasi sama dua kali dalam satu render.

Contoh:

```ts
const user = await getCurrentUser();
```

Dipanggil di layout, navbar, dan halaman, tetapi query hanya sekali dalam request tersebut.

## Persistent caching

Tujuannya:

> Jangan menjalankan operasi sama pada setiap request pengguna.

Untuk Next.js 16 dengan Cache Components:

```ts
// next.config.ts
import type { NextConfig } from "next";

const config: NextConfig = {
  cacheComponents: true,
};

export default config;
```

```ts
// lib/catalog.ts
import "server-only";
import { cacheLife, cacheTag } from "next/cache";

export async function getCatalog() {
  "use cache";

  cacheLife("hours");
  cacheTag("catalog");

  const response = await fetch(`${process.env.API_URL}/catalog`);

  if (!response.ok) {
    throw new Error("Failed to fetch catalog");
  }

  return response.json();
}
```

Setelah mutasi:

```ts
"use server";

import { updateTag } from "next/cache";

export async function updateProduct(productId: string, input: ProductInput) {
  await updateExternalProduct(productId, input);

  updateTag("catalog");
}
```

`use cache` dapat digunakan pada fungsi, komponen, atau route. `cacheLife` mengatur umur cache dan `cacheTag` memungkinkan invalidasi granular. ([Next.js][5])

### Jangan mengandalkan default cache

Pada Next.js modern, cache semantics dibuat semakin eksplisit. `fetch` menggunakan perilaku `auto no cache` secara default, dan Next.js 16 menjalankan dynamic code saat request kecuali Anda memilih untuk men-cache-nya. ([Next.js][6])

Artinya, tulis niat Anda dengan jelas:

```ts
// Harus fresh
fetch(url, {
  cache: "no-store",
});
```

```ts
// Boleh di-cache
fetch(url, {
  cache: "force-cache",
});
```

Atau gunakan `use cache` pada Next.js 16.

---

# 5. Jangan cache data sensitif sembarangan

Data berikut biasanya jangan masuk shared persistent cache:

- Balance user.
- Permission.
- Session.
- Data tenant tanpa tenant-aware cache key.
- Cart.
- Status transaksi.
- Informasi yang berubah pada setiap request.

Kesalahan fatal:

```ts
export async function getDashboard() {
  "use cache";

  const user = await getCurrentUser();
  return getDashboardByUser(user.id);
}
```

Anda harus sangat yakin identitas user masuk ke cache key dan mekanisme cache sesuai untuk private data.

Pola lebih aman:

```ts
export async function getPublicCatalog() {
  "use cache";
  // Shared, aman untuk semua pengguna
}

export async function getUserCart(userId: string) {
  // Dynamic, tidak persistent cached
}
```

Untuk cached function, Next.js menyarankan nilai runtime seperti cookies atau headers dibaca di luar cached scope lalu diteruskan sebagai argumen. ([Next.js][7])

---

# 6. Apakah banyak Server Components meningkatkan biaya server?

## Jawaban yang akurat: kadang iya, tetapi bukan karena jumlah komponennya

Server Components harus dieksekusi pada server ketika route dirender secara dinamis. Hasilnya diserialisasi menjadi RSC Payload dan digunakan bersama Client Components untuk menghasilkan tampilan. ([Next.js][8])

Biaya meningkat ketika Server Components:

- Dirender ulang pada setiap request.
- Menjalankan database query yang tidak di-cache.
- Menjalankan transformasi CPU berat.
- Melakukan N+1 query.
- Menghasilkan markup atau payload sangat besar.
- Mengirim object besar ke Client Components.
- Mengakses external API dengan latency tinggi.
- Memicu banyak request sequential.
- Membaca data runtime terlalu tinggi di component tree.

Tetapi banyak Server Components yang:

- Murni menghasilkan markup.
- Static.
- Di-cache.
- Tidak mempunyai fetching sendiri.
- Tidak mengirim props besar.

biasanya bukan masalah besar.

## Perbandingan yang lebih tepat

### Murah

```tsx
function ProductTitle({ title }: { title: string }) {
  return <h1>{title}</h1>;
}
```

Walaupun ada ratusan komponen semacam itu, kerja komputasinya sederhana.

### Mahal

```tsx
async function Analytics() {
  const rows = await db.events.findMany({
    where: {
      createdAt: {
        gte: startOfYear(new Date()),
      },
    },
  });

  const report = expensiveAggregation(rows);

  return <Chart data={report} />;
}
```

Masalahnya bukan “satu Server Component”. Masalahnya:

- Query tidak dibatasi.
- Data dipindahkan ke memory.
- Agregasi dilakukan di Node.
- Hasilnya mungkin besar.
- Seluruh operasi diulang setiap request.

Solusi yang lebih tepat:

- Agregasi di database.
- Pilih hanya field yang diperlukan.
- Cache hasil.
- Pagination atau time window.
- Precompute.
- Jalankan sebagai background analytics pipeline bila bukan data request-time.

---

# 7. Mengubah semuanya menjadi Client Components bukan solusi

Mengubah Server Component menjadi Client Component tidak otomatis menghilangkan biaya.

Pada first load, Client Components tetap digunakan dalam proses prerendering, lalu browser harus mengunduh JavaScript dan melakukan hydration. Semua module yang berada di bawah batas `"use client"` juga masuk ke client module graph. ([Next.js][8])

Artinya Anda bisa menukar:

```text
Server CPU kecil
```

menjadi:

```text
Server prerender
+ JavaScript lebih besar
+ parsing browser
+ hydration
+ memory browser
+ execution pada perangkat pengguna
```

Pengguna dengan perangkat murah akhirnya membayar biaya yang sebelumnya ditanggung server.

Paradigma yang lebih baik:

> Server Component adalah default untuk rendering dan data. Client Component hanya untuk interaktivitas.

```tsx
// Server Component
export default async function ProductPage() {
  const product = await getProduct();

  return (
    <>
      <ProductInformation product={product} />
      <BuyButton productId={product.id} />
    </>
  );
}
```

```tsx
// Client Component kecil
"use client";

export function BuyButton({ productId }: { productId: string }) {
  return <button onClick={() => addToCart(productId)}>Add to cart</button>;
}
```

Jangan jadikan seluruh halaman client hanya karena satu tombol membutuhkan `onClick`.

---

# 8. Gunakan Client Component ketika memang lebih murah

Ada kondisi saat memindahkan pekerjaan ke browser masuk akal:

- Chart berat yang hanya terlihat setelah scroll.
- Map.
- Rich text editor.
- Visualisasi interaktif.
- Data publik yang boleh diambil langsung browser.
- Widget yang tidak penting untuk SEO.
- Fitur yang baru dibuka setelah user interaction.

Lazy-load komponen tersebut:

```tsx
"use client";

import dynamic from "next/dynamic";

const HeavyChart = dynamic(() => import("./heavy-chart"), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

export function AnalyticsPanel() {
  return <HeavyChart />;
}
```

`ssr: false` benar-benar menghindari server rendering untuk widget itu, tetapi konsekuensinya konten muncul lebih lambat dan tidak cocok untuk konten SEO-critical. Next.js menyediakan dynamic import untuk mengurangi initial JavaScript dan menunda pemuatan komponen berat. ([Next.js][9])

---

# 9. Minimalkan RSC payload dan serialisasi

Server Components mengurangi client JavaScript, tetapi tetap menghasilkan RSC Payload.

Jangan melakukan:

```tsx
const user = await db.user.findUnique({
  include: {
    organization: true,
    projects: true,
    permissions: true,
    auditLogs: true,
    sessions: true,
  },
});

return <ClientDashboard user={user} />;
```

Gunakan DTO kecil:

```ts
const user = await db.user.findUnique({
  where: { id },
  select: {
    id: true,
    name: true,
    avatarUrl: true,
  },
})

return <ClientDashboard user={user} />
```

Lebih baik lagi, kirim hanya yang benar-benar dibutuhkan komponen interaktif:

```tsx
return <ClientDashboard userId={user.id} displayName={user.name} />;
```

Props dari Server Component ke Client Component harus diserialisasi sebagai bagian dari protokol React. ([Next.js][8])

Jangan memindahkan object hanya karena “mungkin nanti dibutuhkan”.

---

# 10. Strategi memory Next.js

Pertama, bedakan tiga jenis memory:

1. **Build-time memory**
2. **Runtime server memory**
3. **Browser memory**

Ketiganya mempunyai penyebab berbeda.

---

## A. Runtime server memory

### 1. Hindari cache global tanpa batas

Berbahaya:

```ts
const cache = new Map<string, unknown>();

export function setCache(key: string, value: unknown) {
  cache.set(key, value);
}
```

Map tersebut tidak memiliki:

- TTL.
- Batas jumlah item.
- Batas ukuran.
- Eviction.
- Tenant isolation.

Pada long-running server, ukurannya akan terus tumbuh.

Gunakan salah satu:

- Cache bawaan Next.js.
- Redis atau external KV.
- Bounded LRU.
- TTL cache dengan maximum size.
- CDN cache untuk public response.

Kalau menggunakan cache in-memory sendiri, selalu punya batas:

```ts
import { LRUCache } from "lru-cache";

const cache = new LRUCache<string, Product>({
  max: 1_000,
  ttl: 5 * 60 * 1_000,
});
```

Tetapi jangan tambahkan library dan cache baru sebelum mengukur bahwa itu memang diperlukan.

---

### 2. Jangan memuat dataset besar ke memory

Buruk:

```ts
const events = await db.event.findMany();
const csv = events.map(toCsvRow).join("\n");
return new Response(csv);
```

Untuk 1 juta row, Anda menyimpan sekaligus:

- Array database result.
- Object JavaScript.
- Array hasil `map`.
- String CSV final.
- Buffer response.

Gunakan:

- Cursor pagination.
- Database streaming.
- Chunking.
- `ReadableStream`.
- Direct file upload stream.
- Background export job.

Node streams menerapkan buffering dan backpressure agar producer tidak membanjiri consumer dan menyebabkan memory terus meningkat. ([Node.js][10])

---

### 3. Batasi concurrency

Parallel fetching mempercepat response, tetapi terlalu banyak operasi paralel dapat meningkatkan peak memory dan membanjiri upstream.

Berbahaya:

```ts
await Promise.all(productIds.map((id) => getProduct(id)));
```

Jika `productIds` berjumlah 20.000, Anda memulai 20.000 request.

Gunakan batch:

```ts
const products = await getProductsByIds(productIds);
```

Atau concurrency limit:

```ts
import pLimit from "p-limit";

const limit = pLimit(10);

const products = await Promise.all(
  productIds.map((id) => limit(() => getProduct(id))),
);
```

Prinsipnya:

```text
Promise.all untuk sejumlah kecil operasi independen
Batching untuk jumlah besar
Concurrency limit jika batching tidak tersedia
```

---

### 4. Atur database connection pool

Kesalahan umum pada deployment horizontal:

```text
50 instance Next.js
× pool 20 connection
= 1.000 database connection
```

Pool harus dihitung berdasarkan:

- Maximum instance.
- Concurrency per instance.
- Limit database.
- Serverless atau long-running server.
- Adanya connection proxy.

Gunakan singleton per process agar hot reload atau module import tidak membuat pool baru berulang kali.

---

### 5. Jangan menyimpan request-scoped object di module scope

Berbahaya:

```ts
const requestHistory: Request[] = [];

export async function GET(request: Request) {
  requestHistory.push(request);
}
```

Juga perhatikan:

- Event listener yang tidak dilepas.
- Timer yang tidak dibersihkan.
- Subscription yang tidak ditutup.
- Promise yang tidak pernah settle.
- Closure yang menahan object besar.
- Logger yang menyimpan seluruh request body.
- Metrics dengan cardinality tidak terbatas.

---

### 6. Hindari base64 untuk file besar

Base64 membesarkan ukuran data dan sering menghasilkan beberapa salinan data di memory.

Hindari:

```ts
const buffer = await file.arrayBuffer();
const base64 = Buffer.from(buffer).toString("base64");
```

Untuk upload besar, lebih baik:

```text
Browser
→ signed upload URL
→ object storage
```

Bukan:

```text
Browser
→ Next.js memory
→ Buffer
→ base64
→ external storage
```

Gunakan Next.js sebagai authorization layer untuk menghasilkan signed URL, bukan sebagai tempat transit seluruh file bila tidak diperlukan.

---

## B. Memory pada browser

Penyebab utama:

- Client bundle besar.
- Global state menyimpan dataset besar.
- Query cache tidak dibatasi.
- Banyak komponen tetap mounted.
- Image atau canvas besar.
- Event listener bocor.
- Chart library berat.
- Infinite scroll tanpa virtualization.

Strateginya:

- Perkecil `"use client"` boundary.
- Gunakan lazy loading.
- Virtualize tabel/list panjang.
- Jangan simpan response besar dalam global state.
- Atur `gcTime` atau cache policy TanStack Query.
- Hapus query yang tidak diperlukan.
- Paginate data.
- Jangan mengirim seluruh database entity ke browser.

Next.js merekomendasikan bundle analyzer untuk menemukan package besar, import chain, dan heavy client workload. Bundle yang lebih kecil juga mengurangi JavaScript execution dan cold-start cost. ([Next.js][11])

---

## C. Build-time memory

Untuk masalah saat `next build`, bukan runtime:

```bash
next build --experimental-debug-memory-usage
```

Next.js dapat mencetak heap usage dan statistik garbage collection serta menghasilkan heap snapshot ketika mendekati memory limit. Next.js juga menyediakan `experimental.webpackMemoryOptimizations` untuk proyek Webpack, dengan trade-off waktu kompilasi sedikit lebih lama. ([Next.js][12])

Contoh:

```ts
import type { NextConfig } from "next";

const config: NextConfig = {
  experimental: {
    webpackMemoryOptimizations: true,
  },
};

export default config;
```

Jangan langsung menaikkan:

```bash
NODE_OPTIONS=--max-old-space-size=8192
```

Itu bisa menyembunyikan masalah dependency atau build graph. Diagnosis terlebih dahulu:

- Dependency besar.
- Barrel exports.
- Source maps.
- Generated files.
- Static generation terlalu banyak halaman.
- Custom Webpack plugin.
- Import package server yang sangat besar.

Next.js juga memuat page modules saat server startup untuk response lebih cepat. `experimental.preloadEntriesOnStart: false` dapat menurunkan initial memory, tetapi dokumentasi menyatakan memory akhirnya dapat mencapai tingkat yang sama setelah seluruh halaman pernah diminta. Jadi ini trade-off startup, bukan solusi memory leak. ([Next.js][12])

---

# 11. Hindari internal HTTP hop

Pada Server Component, jangan lakukan:

```tsx
await fetch(`${process.env.APP_URL}/api/products`);
```

kemudian Route Handler memanggil external API atau database.

Itu menciptakan:

```text
Server Component
→ Next.js Route Handler
→ database/external API
```

Panggil Data Access Layer langsung:

```tsx
import { getProducts } from "@/lib/products";

const products = await getProducts();
```

Route Handler diperlukan saat memang ada HTTP consumer:

- Browser client.
- Mobile application.
- Webhook.
- Third-party integration.
- Public API.

Internal HTTP hop menambah serialization, network stack, memory buffering, dan error boundary yang sebenarnya tidak diperlukan.

---

# 12. Arsitektur yang saya rekomendasikan

```text
app/
├── dashboard/
│   ├── page.tsx
│   ├── loading.tsx
│   └── components/
│       ├── account-summary.tsx
│       ├── recent-transactions.tsx
│       └── interactive-filter.tsx
│
lib/
├── data/
│   ├── user.ts
│   ├── account.ts
│   └── transactions.ts
├── api/
│   └── client.ts
├── auth/
│   └── session.ts
└── dto/
    └── account.ts
```

`page.tsx`:

```tsx
import { Suspense } from "react";
import { AccountSummary } from "./components/account-summary";
import { RecentTransactions } from "./components/recent-transactions";
import { InteractiveFilter } from "./components/interactive-filter";

export default function DashboardPage() {
  return (
    <main>
      <h1>Dashboard</h1>

      <InteractiveFilter />

      <Suspense fallback={<SummarySkeleton />}>
        <AccountSummary />
      </Suspense>

      <Suspense fallback={<TransactionsSkeleton />}>
        <RecentTransactions />
      </Suspense>
    </main>
  );
}
```

Data function:

```ts
import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/auth/session";

export const getAccountSummary = cache(async () => {
  const session = await verifySession();

  return db.account.findUnique({
    where: {
      userId: session.userId,
    },
    select: {
      balance: true,
      currency: true,
      updatedAt: true,
    },
  });
});
```

Cached public data:

```ts
import "server-only";
import { cacheLife, cacheTag } from "next/cache";

export async function getExchangeConfig() {
  "use cache";

  cacheLife("hours");
  cacheTag("exchange-config");

  return db.exchangeConfig.findMany({
    select: {
      currency: true,
      rate: true,
    },
  });
}
```

---

# 13. Urutan optimasi yang paling efektif

Jangan mulai dari micro-optimization komponen. Prioritaskan berdasarkan dampak:

## Prioritas 1: hilangkan waterfall

Cari:

```ts
await a();
await b();
await c();
```

Tentukan mana yang bisa dijalankan paralel.

## Prioritas 2: kurangi query dan external request

Pantau:

```text
DB queries/request
External API calls/request
Cache hit rate
```

## Prioritas 3: cache shared computation

Cache:

- Public catalog.
- Configuration.
- CMS content.
- Expensive shared aggregation.
- Product metadata.

Jangan cache sembarang data user.

## Prioritas 4: kurangi payload

Pantau:

```text
HTML size
RSC payload size
JSON size
Client JS size
```

## Prioritas 5: kecilkan client boundary

Cari `"use client"` yang terlalu tinggi pada tree.

## Prioritas 6: kontrol concurrency dan memory

Pantau:

```text
RSS
heapUsed
heapTotal
external memory
event-loop delay
DB connection count
```

## Prioritas 7: optimalkan CPU

Baru setelah itu periksa:

- Expensive transformations.
- Markdown processing.
- Syntax highlighting.
- Image manipulation.
- Encryption.
- Large JSON serialization.

---

# Paradigma final

Gunakan aturan ini:

```text
1. Static by default.
2. Cache shared data explicitly.
3. Dynamic only for truly request-specific data.
4. Isolate dynamic regions with Suspense.
5. Server Components by default.
6. Client Components as small interactive islands.
7. Promise.all for small independent operations.
8. Batch or limit concurrency for large collections.
9. Never transfer data you do not need.
10. Measure work per request, not number of components.
```
