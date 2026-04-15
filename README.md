# koda-b6-backend-node

Backend REST API built with **Node.js** and **Express**, featuring JWT authentication, file upload handling, PostgreSQL as the primary database, and Redis for caching/session management.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 24 (ESM) |
| Framework | Express v5 |
| Database | PostgreSQL (`pg`) |
| Cache / Session | Redis |
| Authentication | JWT (`jsonwebtoken`) + Argon2 (password hashing) |
| File Upload | Multer |
| Utilities | UUID |
| Containerization | Docker |

---

## Project Structure

```
koda-b6-backend-node/
├── .github/
│   └── workflows/        # CI/CD GitHub Actions
├── src/
│   └── main.js           # Application entry point
├── uploads/
│   └── products/         # Uploaded product images
├── .gitignore
├── Dockerfile
├── package.json
└── package-lock.json
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v24+
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- (Optional) [Docker](https://www.docker.com/)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/alhilalfathi/koda-b6-backend-node.git
cd koda-b6-backend-node
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Buat file `.env` di root project dan isi sesuai kebutuhan:

```env
# Server
PORT=8888

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_jwt_secret
```

### 4. Jalankan server (development)

```bash
npm run dev
```

### 5. Jalankan server (production)

```bash
npm start
```

Server akan berjalan di `http://localhost:8888`.

---

## Docker

### Build image

```bash
docker build -t koda-b6-backend-node .
```

### Run container

```bash
docker run -p 8888:8888 --env-file .env koda-b6-backend-node
```

---

## NPM Scripts

| Script | Deskripsi |
|---|---|
| `npm run dev` | Jalankan dengan hot-reload menggunakan `--watch` flag |
| `npm start` | Jalankan server production |

---

## Fitur Utama

- **Autentikasi JWT** — registrasi & login dengan token-based authentication
- **Password Hashing** — menggunakan Argon2 untuk keamanan password
- **Upload File** — upload gambar produk via Multer, disimpan di `uploads/products/`
- **PostgreSQL** — penyimpanan data utama
- **Redis** — caching dan manajemen session
- **UUID** — generate ID unik untuk setiap entitas
- **CI/CD** — pipeline otomatis via GitHub Actions

---

## License

ISC
