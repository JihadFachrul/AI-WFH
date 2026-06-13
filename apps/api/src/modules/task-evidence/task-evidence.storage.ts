import { existsSync, mkdirSync } from 'fs';
import { join, extname } from 'path';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';

/** Direktori penyimpanan lokal evidence (foundation phase, bukan cloud). */
export const EVIDENCE_DIR = join(process.cwd(), 'uploads', 'task-evidence');

/** URL publik (disajikan statis via useStaticAssets di main.ts). */
export const EVIDENCE_URL_PREFIX = '/uploads/task-evidence';

// Pastikan folder ada (multer tidak membuat otomatis).
if (!existsSync(EVIDENCE_DIR)) {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
}

/** Konfigurasi multer: nama file unik (uuid) + ekstensi asli, batas 10MB. */
export const evidenceMulterStorage = diskStorage({
  destination: EVIDENCE_DIR,
  filename: (_req, file, cb) => {
    cb(null, `${randomUUID()}${extname(file.originalname)}`);
  },
});

export const EVIDENCE_MAX_BYTES = 10 * 1024 * 1024;
