<!-- PROJECT HEADER -->

<br />
<div align="center">
  <a id="readme-top"></a>
  <h3 align="center">Clickfor</h3>

  <p align="center">
    Monorepo untuk aplikasi utama, website marketing, dan backend API Clickfor.
    <br />
    Dibangun menggunakan <strong>Next.js</strong>, <strong>NestJS</strong>, <strong>TypeScript</strong>, <strong>Node.js</strong>, <strong>npm Workspaces</strong>, dan <strong>Turborepo</strong>.
    <br />
    <br />
    <a href="https://github.com/zerochirou/clickfor"><strong>Jelajahi Dokumentasi »</strong></a>
    <br />
    <br />
    <a href="https://github.com/zerochirou/clickfor/issues/new?labels=bug&template=bug-report---.md">Laporkan Bug</a>
    &middot;
    <a href="https://github.com/zerochirou/clickfor/issues/new?labels=enhancement&template=feature-request---.md">Ajukan Fitur Baru</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->

<details>
  <summary>Daftar Isi</summary>
  <ol>
    <li><a href="#tentang-proyek">Tentang Proyek</a></li>
    <li><a href="#arsitektur-monorepo">Arsitektur Monorepo</a></li>
    <li><a href="#dibuat-dengan">Dibuat Dengan</a></li>
    <li><a href="#memulai">Memulai</a></li>
    <li><a href="#cara-penggunaan">Cara Penggunaan</a></li>
    <li><a href="#aturan-git--github">Aturan Git & GitHub</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#berkontribusi">Berkontribusi</a></li>
    <li><a href="#lisensi">Lisensi</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## Tentang Proyek

**Clickfor** adalah monorepo TypeScript yang menggabungkan seluruh aplikasi utama dalam satu repository.

Monorepo ini terdiri dari tiga aplikasi utama:

- **`app`**: aplikasi utama Clickfor yang dibangun menggunakan Next.js.
- **`marketing`**: website publik, landing page, dan halaman marketing yang dibangun menggunakan Next.js.
- **`server`**: backend API dan business logic yang dibangun menggunakan NestJS.

Pendekatan monorepo digunakan untuk:

- Menyatukan pengelolaan dependency dan tooling.
- Membagikan konfigurasi TypeScript, linting, dan formatting.
- Mempermudah sinkronisasi tipe antara frontend dan backend.
- Menjalankan build, test, lint, dan deployment secara terpusat.
- Menjaga batas tanggung jawab setiap aplikasi tetap jelas.

<p align="right">(<a href="#readme-top">kembali ke atas</a>)</p>

---

## Arsitektur Monorepo

```text
clickfor/
├── apps/
│   ├── app/                    # Aplikasi utama Next.js
│   ├── marketing/              # Website marketing Next.js
│   └── server/                 # Backend API NestJS
│
├── packages/
│   ├── ui/                     # Shared UI components
│   ├── types/                  # Shared TypeScript types
│   ├── eslint-config/          # Shared ESLint configuration
│   └── tsconfig/               # Shared TypeScript configuration
│
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── workflows/
│   ├── CODEOWNERS
│   └── pull_request_template.md
│
├── .husky/
├── .gitignore
├── package-lock.json
├── package.json
├── turbo.json
├── README.md
└── LICENSE
```

### Tanggung Jawab Aplikasi

| Workspace                | Teknologi  | Tanggung Jawab                                                         |
| ------------------------ | ---------- | ---------------------------------------------------------------------- |
| `apps/app`               | Next.js    | Dashboard, autentikasi pengguna, dan fitur utama produk                |
| `apps/marketing`         | Next.js    | Landing page, halaman publik, SEO, dan konten marketing                |
| `apps/server`            | NestJS     | REST API, business logic, database, autentikasi, dan integrasi service |
| `packages/ui`            | React      | Komponen UI yang digunakan bersama                                     |
| `packages/types`         | TypeScript | Tipe, interface, dan kontrak data lintas aplikasi                      |
| `packages/eslint-config` | ESLint     | Konfigurasi linting bersama                                            |
| `packages/tsconfig`      | TypeScript | Konfigurasi TypeScript bersama                                         |

> Folder di dalam `packages` dapat ditambahkan sesuai kebutuhan. Jangan memindahkan business logic spesifik aplikasi ke shared package hanya untuk menghindari duplikasi kecil.

<p align="right">(<a href="#readme-top">kembali ke atas</a>)</p>

---

## Dibuat Dengan

- [![TypeScript][TypeScript]][TypeScript-url]
- [![Next.js][Next.js]][Next.js-url]
- [![NestJS][NestJS]][NestJS-url]
- [![Turborepo][Turborepo]][Turborepo-url]
- [![Node.js][Node.js]][Node.js-url]

<p align="right">(<a href="#readme-top">kembali ke atas</a>)</p>

---

<!-- GETTING STARTED -->

## Memulai

### Prasyarat

Pastikan perangkat sudah memiliki:

- [Node.js](https://nodejs.org/) versi LTS
- npm
- Git
- Docker dan Docker Compose jika backend menggunakan database atau service eksternal

Periksa versi Node.js dan npm:

```sh
node --version
npm --version
```

### Instalasi

1. Clone repository.

   ```sh
   git clone https://github.com/zerochirou/clickfor.git
   cd clickfor
   ```

2. Install seluruh dependency workspace.

   ```sh
   npm install
   ```

3. Salin environment file untuk setiap aplikasi.

   ```sh
   cp apps/app/.env.example apps/app/.env.local
   cp apps/marketing/.env.example apps/marketing/.env.local
   cp apps/server/.env.example apps/server/.env
   ```

4. Isi environment variable sesuai kebutuhan masing-masing aplikasi.

5. Jalankan service pendukung menggunakan Docker jika tersedia.

   ```sh
   docker compose up -d
   ```

6. Jalankan seluruh aplikasi dalam development mode.

   ```sh
   npm run dev
   ```

Secara default, setiap aplikasi disarankan menggunakan port berbeda:

| Aplikasi    |   Port |
| ----------- | -----: |
| `app`       | `3000` |
| `marketing` | `3001` |
| `server`    | `4000` |

Port dapat diubah melalui environment variable masing-masing aplikasi.

<p align="right">(<a href="#readme-top">kembali ke atas</a>)</p>

---

<!-- USAGE -->

## Cara Penggunaan

### Perintah Utama

```sh
# Jalankan seluruh workspace dalam development mode
npm run dev

# Build seluruh workspace
npm run build

# Jalankan lint seluruh workspace
npm run lint

# Jalankan type checking seluruh workspace
npm run typecheck

# Jalankan test seluruh workspace
npm run test

# Format seluruh repository
npm run format
```

### Menjalankan Workspace Tertentu

```sh
# Jalankan aplikasi utama
npm run dev:app

# Jalankan website marketing
npm run dev:marketing

# Jalankan backend server
npm run dev:server
```

Alternatif menggunakan filter Turborepo:

```sh
npx turbo dev --filter=@clickfor/app
npx turbo dev --filter=@clickfor/marketing
npx turbo dev --filter=@clickfor/server
```

### Contoh Root `package.json`

Root `package.json` disarankan menggunakan npm workspaces:

```json
{
  "name": "clickfor",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "turbo dev",
    "dev:app": "turbo dev --filter=@clickfor/app",
    "dev:marketing": "turbo dev --filter=@clickfor/marketing",
    "dev:server": "turbo dev --filter=@clickfor/server",
    "build": "turbo build",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "test": "turbo test",
    "format": "prettier --write ."
  },
  "devDependencies": {
    "prettier": "latest",
    "turbo": "latest",
    "typescript": "latest"
  },
  "engines": {
    "node": ">=20",
    "npm": ">=10"
  }
}
```

> Sebaiknya gunakan versi dependency yang spesifik dan konsisten. Hindari `latest` pada repository production karena dapat menghasilkan instalasi yang tidak deterministik.

### Menjalankan Perintah dengan npm Workspaces

Perintah dapat dijalankan langsung pada workspace tertentu:

```sh
npm run dev --workspace=@clickfor/app
npm run dev --workspace=@clickfor/marketing
npm run dev --workspace=@clickfor/server
```

Menjalankan script pada seluruh workspace:

```sh
npm run lint --workspaces
npm run test --workspaces
```

### Environment Variables

Environment variable harus dipisahkan berdasarkan workspace.

```text
apps/
├── app/
│   ├── .env.example
│   └── .env.local
├── marketing/
│   ├── .env.example
│   └── .env.local
└── server/
    ├── .env.example
    └── .env
```

Aturan environment:

- Jangan commit file `.env`, `.env.local`, atau file yang mengandung secret.
- Selalu perbarui `.env.example` ketika menambahkan environment variable baru.
- Environment variable publik Next.js harus menggunakan prefix `NEXT_PUBLIC_`.
- Secret backend hanya boleh disimpan di workspace `server`.
- Jangan menduplikasi secret backend ke aplikasi frontend.
- Validasi environment variable saat aplikasi dijalankan.

<p align="right">(<a href="#readme-top">kembali ke atas</a>)</p>

---

<!-- GIT AND GITHUB RULES -->

## Aturan Git & GitHub

Repository ini menggunakan:

- Conventional Commits.
- Scope berdasarkan workspace.
- Branch naming berbasis jenis perubahan dan workspace.
- Pull Request sebagai satu-satunya jalur perubahan menuju branch utama.
- GitHub Actions sebagai quality gate sebelum merge.

### Prinsip Dasar

1. Satu commit harus mewakili satu perubahan logis.
2. Satu Pull Request harus memiliki satu tujuan utama.
3. Perubahan lintas aplikasi harus dipisahkan jika tidak memiliki ketergantungan langsung.
4. Jangan mencampur refactor, formatting, dan fitur baru dalam satu commit.
5. Jangan melakukan commit langsung ke `main`.
6. Jangan memasukkan generated file kecuali memang dibutuhkan oleh repository.
7. Jangan melewati CI dengan menonaktifkan test, lint, atau type checking tanpa alasan yang terdokumentasi.

<p align="right">(<a href="#readme-top">kembali ke atas</a>)</p>

### Strategi Percabangan

| Jenis Cabang | Format                    | Tujuan                                            |
| ------------ | ------------------------- | ------------------------------------------------- |
| Produksi     | `main`                    | Kode stabil dan siap production                   |
| Pengembangan | `develop`                 | Integrasi perubahan sebelum production            |
| Fitur        | `feature/<scope>/<name>`  | Pengembangan fitur baru                           |
| Bugfix       | `fix/<scope>/<name>`      | Perbaikan bug                                     |
| Hotfix       | `hotfix/<scope>/<name>`   | Perbaikan mendesak pada production                |
| Refactor     | `refactor/<scope>/<name>` | Perubahan struktur tanpa mengubah perilaku        |
| Chore        | `chore/<scope>/<name>`    | Tooling, konfigurasi, dependency, dan maintenance |
| Dokumentasi  | `docs/<scope>/<name>`     | Perubahan dokumentasi                             |

Contoh branch:

```text
feature/app/onboarding-flow
feature/server/workspace-invitation
feature/marketing/pricing-page

fix/app/session-expiration
fix/server/refresh-token-validation
fix/marketing/mobile-navigation

refactor/server/auth-module
chore/repo/update-node-version
docs/server/api-authentication
```

#### Aturan Penamaan Branch

- Gunakan huruf kecil.
- Gunakan format kebab-case.
- Sertakan scope workspace setelah jenis branch.
- Hindari nama umum seperti `feature/update`, `fix/bug`, atau `chore/change`.
- Gunakan nama yang menjelaskan hasil perubahan, bukan aktivitas pengembang.

Contoh yang baik:

```text
feature/app/team-member-management
fix/server/prevent-duplicate-email
chore/repo/update-node-version
```

Contoh yang buruk:

```text
feature/new-feature
fix/bug
update-code
my-branch
```

<p align="right">(<a href="#readme-top">kembali ke atas</a>)</p>

### Konvensi Pesan Commit

Setiap commit harus mengikuti Conventional Commits:

```text
<type>(<scope>): <deskripsi singkat>

[badan pesan commit opsional]

[footer opsional]
```

Contoh:

```text
feat(app): tambahkan halaman pengaturan workspace
fix(server): cegah pembuatan pengguna dengan email duplikat
docs(repo): perbarui panduan kontribusi
refactor(marketing): pisahkan komponen pricing card
chore(deps): perbarui dependensi Next.js
```

### Commit Types

| Type       | Penggunaan                                     |
| ---------- | ---------------------------------------------- |
| `feat`     | Menambahkan fitur baru                         |
| `fix`      | Memperbaiki bug                                |
| `docs`     | Mengubah dokumentasi                           |
| `style`    | Mengubah formatting tanpa mengubah logika      |
| `refactor` | Mengubah struktur kode tanpa fitur atau bugfix |
| `perf`     | Meningkatkan performa                          |
| `test`     | Menambahkan atau memperbaiki test              |
| `build`    | Mengubah build system atau dependency build    |
| `ci`       | Mengubah workflow CI/CD                        |
| `chore`    | Maintenance yang tidak masuk kategori lain     |
| `revert`   | Membatalkan commit sebelumnya                  |

### Commit Scopes

Scope harus menunjukkan area utama yang terkena perubahan.

| Scope       | Digunakan Untuk                                          |
| ----------- | -------------------------------------------------------- |
| `app`       | Perubahan dalam `apps/app`                               |
| `marketing` | Perubahan dalam `apps/marketing`                         |
| `server`    | Perubahan dalam `apps/server`                            |
| `ui`        | Perubahan dalam `packages/ui`                            |
| `types`     | Shared types dan kontrak data                            |
| `config`    | Shared ESLint, TypeScript, formatter, dan tooling config |
| `repo`      | Struktur dan konfigurasi root monorepo                   |
| `deps`      | Dependency dan lockfile                                  |
| `ci`        | GitHub Actions dan automation                            |
| `docs`      | Dokumentasi umum repository                              |
| `release`   | Versioning, changelog, dan release                       |

### Aturan Pemilihan Scope

Gunakan scope berdasarkan sumber perubahan utama.

```text
feat(app): tambahkan halaman detail proyek
feat(marketing): tambahkan halaman studi kasus
feat(server): tambahkan endpoint pembuatan proyek
```

Untuk shared package:

```text
feat(ui): tambahkan komponen date picker
refactor(types): pisahkan tipe workspace
fix(config): perbaiki konfigurasi path alias
```

Untuk konfigurasi repository:

```text
chore(repo): tambahkan konfigurasi Turborepo
ci(repo): tambahkan workflow pull request
docs(repo): tambahkan aturan kontribusi
```

Untuk dependency:

```text
chore(deps): perbarui Next.js
chore(deps): perbarui NestJS
chore(deps): perbarui dependency workspace
```

### Perubahan Lintas Workspace

Commit tidak boleh menggunakan scope gabungan seperti:

```text
feat(app-server): tambahkan autentikasi
feat(app,server): tambahkan autentikasi
```

Pisahkan menjadi commit logis:

```text
feat(server): tambahkan endpoint autentikasi
feat(types): tambahkan tipe respons autentikasi
feat(app): integrasikan halaman login dengan API
```

Pemisahan tersebut membuat perubahan lebih mudah:

- Direview.
- Direvert.
- Dilacak.
- Dirilis.
- Dianalisis oleh changelog automation.

Jika perubahan benar-benar tidak dapat dipisahkan, gunakan scope yang mewakili sumber perubahan utama dan jelaskan dampak lintas workspace pada body commit.

### Breaking Changes

Breaking change harus ditandai menggunakan `!`:

```text
feat(server)!: ubah format respons autentikasi
```

Tambahkan penjelasan pada footer:

```text
feat(server)!: ubah format respons autentikasi

BREAKING CHANGE: field `accessToken` dipindahkan ke dalam object `data`.
```

### Contoh Commit yang Baik

```text
feat(app): tambahkan halaman manajemen anggota
feat(marketing): tambahkan bagian testimonial
feat(server): tambahkan endpoint undangan workspace
fix(app): tangani session yang sudah kedaluwarsa
fix(server): validasi refresh token sebelum rotasi
refactor(ui): sederhanakan API komponen button
test(server): tambahkan integration test autentikasi
ci(repo): jalankan test berdasarkan workspace terdampak
chore(deps): perbarui dependency monorepo
```

### Contoh Commit yang Tidak Baik

```text
update stuff
fix bug
done
perbaikan
update app
feat: changes
fix(all): fix everything
```

<p align="right">(<a href="#readme-top">kembali ke atas</a>)</p>

---

### Aturan Pull Request

#### Target Branch

| Jenis Perubahan   | Source Branch | Target Branch |
| ----------------- | ------------- | ------------- |
| Fitur             | `feature/*`   | `develop`     |
| Bugfix            | `fix/*`       | `develop`     |
| Refactor          | `refactor/*`  | `develop`     |
| Chore             | `chore/*`     | `develop`     |
| Dokumentasi       | `docs/*`      | `develop`     |
| Hotfix production | `hotfix/*`    | `main`        |
| Release           | `release/*`   | `main`        |

Jika repository tidak menggunakan `develop`, seluruh Pull Request dapat diarahkan langsung ke `main` dengan branch protection yang sama.

#### Judul Pull Request

Judul Pull Request harus mengikuti format Conventional Commits:

```text
<type>(<scope>): <deskripsi singkat>
```

Contoh:

```text
feat(app): tambahkan alur onboarding pengguna
fix(server): cegah refresh token digunakan ulang
docs(repo): perbarui aturan kontribusi
```

#### Isi Pull Request

Setiap Pull Request harus menjelaskan:

- Masalah yang diselesaikan.
- Pendekatan yang digunakan.
- Workspace yang terdampak.
- Perubahan perilaku aplikasi.
- Cara melakukan pengujian.
- Screenshot atau rekaman untuk perubahan UI.
- Perubahan environment variable.
- Perubahan database atau migration.
- Risiko dan kemungkinan regresi.
- Issue atau tiket terkait.

Contoh referensi issue:

```text
Closes #45
Fixes #72
Related to #103
```

#### Batas Pull Request

- Jaga Pull Request tetap kecil dan fokus.
- Disarankan kurang dari 400 baris perubahan efektif.
- Lockfile, generated file, dan snapshot tidak dihitung sebagai perubahan efektif.
- Pull Request besar harus dipecah berdasarkan lapisan atau workspace.
- Jangan mencampur dependency update dengan fitur produk.
- Jangan mencampur formatting seluruh repository dengan perubahan logika.

#### Persyaratan Merge

Pull Request hanya dapat di-merge jika:

1. Minimal satu approval diperoleh.
2. Seluruh percakapan review sudah diselesaikan.
3. Seluruh CI checks berhasil.
4. Branch sudah mengikuti perubahan target branch terbaru.
5. Tidak terdapat unresolved conflict.
6. Dokumentasi sudah diperbarui jika perilaku berubah.
7. Migration sudah disertakan jika schema database berubah.
8. `.env.example` sudah diperbarui jika environment variable berubah.
9. Perubahan API sudah mempertimbangkan consumer yang terdampak.
10. Tidak ada secret atau credential yang masuk ke repository.

#### Merge Strategy

Gunakan **Squash and Merge** sebagai strategi default.

Judul squash commit harus mengikuti Conventional Commits:

```text
feat(app): tambahkan alur onboarding pengguna
```

Gunakan merge commit hanya untuk:

- Release branch.
- Sinkronisasi branch jangka panjang.
- Kasus khusus yang membutuhkan histori commit lengkap.

Jangan gunakan rebase merge jika menghasilkan histori yang sulit ditelusuri atau commit sementara masuk ke branch utama.

<p align="right">(<a href="#readme-top">kembali ke atas</a>)</p>

---

### GitHub Branch Protection

#### Branch `main`

Branch `main` harus memiliki aturan berikut:

- Require a pull request before merging.
- Require minimal satu approval.
- Dismiss stale approvals ketika commit baru ditambahkan.
- Require review dari Code Owners.
- Require status checks to pass.
- Require branches to be up to date before merging.
- Require conversation resolution before merging.
- Block force pushes.
- Block branch deletion.
- Restrict direct pushes.
- Izinkan bypass hanya untuk administrator repository yang ditentukan.

#### Branch `develop`

Branch `develop` disarankan memiliki aturan berikut:

- Require a pull request before merging.
- Require minimal satu approval.
- Require status checks to pass.
- Require conversation resolution before merging.
- Block force pushes.
- Block branch deletion.
- Restrict direct pushes.

### Required Status Checks

Status checks minimum:

```text
lint
typecheck
test
build
```

Untuk monorepo, checks sebaiknya dijalankan berdasarkan path yang terdampak.

| Path yang Berubah    | Checks                                             |
| -------------------- | -------------------------------------------------- |
| `apps/app/**`        | lint, typecheck, test, dan build untuk `app`       |
| `apps/marketing/**`  | lint, typecheck, test, dan build untuk `marketing` |
| `apps/server/**`     | lint, typecheck, test, dan build untuk `server`    |
| `packages/ui/**`     | check `ui`, `app`, dan `marketing`                 |
| `packages/types/**`  | check seluruh consumer tipe                        |
| `packages/config/**` | check seluruh workspace                            |
| Root config          | check seluruh workspace                            |
| `package-lock.json`  | check seluruh workspace                            |

Perubahan pada shared package harus memicu pemeriksaan seluruh workspace yang bergantung pada package tersebut.

<p align="right">(<a href="#readme-top">kembali ke atas</a>)</p>

---

### CODEOWNERS

Repository disarankan memiliki file `.github/CODEOWNERS`.

Contoh:

```text
# Default owners
* @zerochirou

# Applications
/apps/app/ @zerochirou
/apps/marketing/ @zerochirou
/apps/server/ @zerochirou

# Shared packages
/packages/ui/ @zerochirou
/packages/types/ @zerochirou
/packages/eslint-config/ @zerochirou
/packages/tsconfig/ @zerochirou

# Repository configuration
/.github/ @zerochirou
/turbo.json @zerochirou
/package.json @zerochirou
/package-lock.json @zerochirou
```

Tambahkan owner lain sesuai tanggung jawab tim.

<p align="right">(<a href="#readme-top">kembali ke atas</a>)</p>

---

### Sinkronisasi Frontend dan Backend

Perubahan API harus memperhatikan aplikasi yang menggunakannya.

Jika kontrak API berubah:

1. Perbarui implementasi pada `apps/server`.
2. Perbarui shared types atau generated client.
3. Perbarui consumer pada `apps/app`.
4. Perbarui consumer pada `apps/marketing` jika menggunakan API tersebut.
5. Tambahkan atau perbarui test.
6. Dokumentasikan breaking change.
7. Pastikan backward compatibility jika perubahan tidak dapat dirilis secara bersamaan.

Jangan mengubah response API tanpa memeriksa seluruh consumer.

Perubahan berikut harus dianggap berisiko tinggi:

- Menghapus field response.
- Mengubah nama field.
- Mengubah tipe data.
- Mengubah status code.
- Mengubah struktur error.
- Mengubah authentication flow.
- Mengubah authorization rule.
- Mengubah pagination.
- Mengubah default sorting atau filtering.

<p align="right">(<a href="#readme-top">kembali ke atas</a>)</p>

---

<!-- ROADMAP -->

## Roadmap

### Monorepo Foundation

- [ ] Setup Node.js versi LTS.
- [ ] Setup npm workspaces.
- [ ] Setup Turborepo.
- [ ] Setup shared TypeScript configuration.
- [ ] Setup shared ESLint configuration.
- [ ] Setup formatter.
- [ ] Setup Husky dan lint-staged.
- [ ] Setup Conventional Commits validation.
- [ ] Setup GitHub Actions.
- [ ] Setup CODEOWNERS.
- [ ] Setup branch protection.

### Main Application

- [ ] Setup aplikasi Next.js pada `apps/app`.
- [ ] Setup authentication.
- [ ] Setup application layout.
- [ ] Setup dashboard.
- [ ] Setup API client.
- [ ] Setup error handling.
- [ ] Setup testing.

### Marketing Website

- [ ] Setup aplikasi Next.js pada `apps/marketing`.
- [ ] Setup landing page.
- [ ] Setup SEO metadata.
- [ ] Setup sitemap dan robots.txt.
- [ ] Setup analytics.
- [ ] Setup content management.
- [ ] Setup performance monitoring.

### Backend Server

- [ ] Setup NestJS pada `apps/server`.
- [ ] Setup environment validation.
- [ ] Setup database.
- [ ] Setup authentication dan authorization.
- [ ] Setup API documentation.
- [ ] Setup structured logging.
- [ ] Setup error handling.
- [ ] Setup unit dan integration testing.
- [ ] Setup health check.
- [ ] Setup rate limiting.

Lihat [open issues](https://github.com/zerochirou/clickfor/issues) untuk daftar fitur, bug, dan perubahan yang sedang direncanakan.

<p align="right">(<a href="#readme-top">kembali ke atas</a>)</p>

---

<!-- CONTRIBUTING -->

## Berkontribusi

Kontribusi harus mengikuti alur berikut:

1. Fork repository.

2. Buat branch dari `develop`.

   ```sh
   git checkout develop
   git pull origin develop
   git checkout -b feature/app/nama-fitur
   ```

3. Lakukan perubahan secara fokus.

4. Install dependency menggunakan lockfile.

   ```sh
   npm ci
   ```

5. Jalankan pemeriksaan lokal.

   ```sh
   npm run lint
   npm run typecheck
   npm run test
   npm run build
   ```

6. Commit perubahan menggunakan Conventional Commits.

   ```sh
   git commit -m "feat(app): tambahkan nama fitur"
   ```

7. Push branch.

   ```sh
   git push origin feature/app/nama-fitur
   ```

8. Buat Pull Request menuju `develop`.

9. Lengkapi template Pull Request.

10. Tautkan issue terkait.

11. Tunggu review dan pastikan seluruh CI checks berhasil.

<p align="right">(<a href="#readme-top">kembali ke atas</a>)</p>

---

<!-- LICENSE -->

## Lisensi

Distributed under the **Zense License**.

Lihat file `LICENSE` untuk informasi lebih lanjut.

<p align="right">(<a href="#readme-top">kembali ke atas</a>)</p>

---

<!-- MARKDOWN LINKS & IMAGES -->

[TypeScript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Next.js]: https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white
[Next.js-url]: https://nextjs.org/
[NestJS]: https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white
[NestJS-url]: https://nestjs.com/
[Turborepo]: https://img.shields.io/badge/Turborepo-000000?style=for-the-badge&logo=turborepo&logoColor=white
[Turborepo-url]: https://turbo.build/repo
[Node.js]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white
[Node.js-url]: https://nodejs.org/
