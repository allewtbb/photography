import { 
  type Collection, 
  type InsertCollection,
  type Photo,
  type InsertPhoto,
  collections,
  photos,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Collections
  getAllCollections(): Promise<Collection[]>;
  getCollectionById(id: string): Promise<Collection | undefined>;
  createCollection(collection: InsertCollection): Promise<Collection>;
  updateCollection(id: string, collection: Partial<InsertCollection>): Promise<Collection | undefined>;
  deleteCollection(id: string): Promise<void>;

  // Photos
  getAllPhotos(): Promise<Photo[]>;
  getPhotoCounts(): Promise<Record<string, number>>;
  getPhotosByCollectionId(collectionId: string): Promise<Photo[]>;
  getPhotoById(id: string): Promise<Photo | undefined>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  updatePhoto(id: string, photo: Partial<InsertPhoto>): Promise<Photo | undefined>;
  deletePhoto(id: string): Promise<void>;
}

export class DbStorage implements IStorage {
  // Collections
  async getAllCollections(): Promise<Collection[]> {
    return await db.select().from(collections).orderBy(desc(collections.createdAt));
  }

  async getCollectionById(id: string): Promise<Collection | undefined> {
    const result = await db.select().from(collections).where(eq(collections.id, id));
    return result[0];
  }

  async createCollection(collection: InsertCollection): Promise<Collection> {
    const result = await db.insert(collections).values(collection).returning();
    return result[0];
  }

  async updateCollection(id: string, collection: Partial<InsertCollection>): Promise<Collection | undefined> {
    const result = await db.update(collections)
      .set(collection)
      .where(eq(collections.id, id))
      .returning();
    return result[0];
  }

  async deleteCollection(id: string): Promise<void> {
    await db.delete(collections).where(eq(collections.id, id));
  }

  // Photos
  async getAllPhotos(): Promise<Photo[]> {
    return await db.select().from(photos).orderBy(photos.order);
  }

  async getPhotoCounts(): Promise<Record<string, number>> {
    const allPhotos = await db.select().from(photos);
    const counts: Record<string, number> = {};
    
    for (const photo of allPhotos) {
      counts[photo.collectionId] = (counts[photo.collectionId] || 0) + 1;
    }
    
    return counts;
  }

  async getPhotosByCollectionId(collectionId: string): Promise<Photo[]> {
    return await db.select().from(photos)
      .where(eq(photos.collectionId, collectionId))
      .orderBy(photos.order);
  }

  async getPhotoById(id: string): Promise<Photo | undefined> {
    const result = await db.select().from(photos).where(eq(photos.id, id));
    return result[0];
  }

  async createPhoto(photo: InsertPhoto): Promise<Photo> {
    const result = await db.insert(photos).values(photo).returning();
    return result[0];
  }

  async updatePhoto(id: string, photo: Partial<InsertPhoto>): Promise<Photo | undefined> {
    const result = await db.update(photos)
      .set(photo)
      .where(eq(photos.id, id))
      .returning();
    return result[0];
  }

  async deletePhoto(id: string): Promise<void> {
    await db.delete(photos).where(eq(photos.id, id));
  }
}

export const storage = new DbStorage();
