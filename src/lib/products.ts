import {
  collection, addDoc, getDocs, query, orderBy,
  doc, getDoc, deleteDoc, updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Product {
  name: string;
  category: string;
  description: string;
  price?: number | null;
  sizes: string[];
  images: string[];
  video?: string;
  createdAt: Date;
}

export interface FirestoreProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  price?: number | null;
  sizes: string[];
  images: string[];
  video?: string;
  createdAt: Date;
}

/** Fetch all products, newest first */
export const getProducts = async (): Promise<FirestoreProduct[]> => {
  const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<FirestoreProduct, "id">),
  }));
};

/** Fetch a single product by Firestore document ID */
export const getProduct = async (id: string): Promise<FirestoreProduct | null> => {
  const docRef = doc(db, "products", id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<FirestoreProduct, "id">) };
};

/** Add a new product */
export const addProduct = async (product: Product): Promise<string> => {
  const docRef = await addDoc(collection(db, "products"), {
    ...product,
    createdAt: new Date(),
  });
  return docRef.id;
};

/** Delete a product by ID */
export const deleteProduct = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "products", id));
};

/** Update specific fields of a product */
export const updateProduct = async (
  id: string,
  data: Partial<Omit<FirestoreProduct, "id" | "createdAt">>
): Promise<void> => {
  await updateDoc(doc(db, "products", id), data);
};
