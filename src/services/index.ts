import { closet } from "@/data/closet";
import { MockStylistService } from "./stylist/MockStylistService";
import { LocalStorageService } from "./storage/LocalStorageService";

/** App-wide service singletons. Swap these two lines to change implementations. */
export const stylist = new MockStylistService(closet);
export const storage = new LocalStorageService();

export type { StylistService } from "./stylist/StylistService";
export type { StorageService } from "./storage/StorageService";
export { NoValidOutfitError } from "./stylist/rules/generate";
