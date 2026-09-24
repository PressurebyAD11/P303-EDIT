import type { SavedLook, StyleRequest } from "@/lib/types";

/**
 * Persistence contract. Phase 1 backs this with localStorage; a real API
 * can replace it later behind the same interface. See EDIT_PRD.md §7.4.
 */
export interface StorageService {
  getSaved(): Promise<SavedLook[]>;
  save(look: SavedLook): Promise<void>;
  remove(id: string): Promise<void>;
  getLastRequest(): Promise<StyleRequest | null>;
  setLastRequest(req: StyleRequest): Promise<void>;
}
