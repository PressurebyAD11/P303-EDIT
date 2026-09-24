import type { SavedLook, StyleRequest } from "@/lib/types";
import type { StorageService } from "./StorageService";

const SAVED_KEY = "edit:saved-looks";
const LAST_REQUEST_KEY = "edit:last-request";

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full / unavailable — fail quietly for the MVP
  }
}

export class LocalStorageService implements StorageService {
  async getSaved(): Promise<SavedLook[]> {
    return read<SavedLook[]>(SAVED_KEY) ?? [];
  }

  async save(look: SavedLook): Promise<void> {
    const all = await this.getSaved();
    // De-dupe by id (last write wins).
    const next = [look, ...all.filter((l) => l.id !== look.id)];
    write(SAVED_KEY, next);
  }

  async remove(id: string): Promise<void> {
    const all = await this.getSaved();
    write(
      SAVED_KEY,
      all.filter((l) => l.id !== id),
    );
  }

  async getLastRequest(): Promise<StyleRequest | null> {
    return read<StyleRequest>(LAST_REQUEST_KEY);
  }

  async setLastRequest(req: StyleRequest): Promise<void> {
    write(LAST_REQUEST_KEY, req);
  }
}
