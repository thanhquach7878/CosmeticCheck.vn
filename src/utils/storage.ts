export interface SavedProduct {
  id: string;
  name: string;
  date: string;
  rawText: string;
  ingredientsCount: number;
  safetyScore: number;
  safeCount: number;
  cautionCount: number;
  highRiskCount: number;
  pregnancySafe: boolean;
}

const STORAGE_KEY = "cosmeticcheck_saved_products_v1";

export function getSavedProducts(): SavedProduct[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading saved products", e);
    return [];
  }
}

export function saveProduct(product: Omit<SavedProduct, "id" | "date">): SavedProduct {
  const current = getSavedProducts();
  const newProduct: SavedProduct = {
    ...product,
    id: "prod_" + Date.now(),
    date: new Date().toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    })
  };

  const updated = [newProduct, ...current.slice(0, 49)]; // Store up to 50 items
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Error saving product to localStorage", e);
  }
  return newProduct;
}

export function removeSavedProduct(id: string): SavedProduct[] {
  const current = getSavedProducts();
  const updated = current.filter((p) => p.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Error removing product from localStorage", e);
  }
  return updated;
}
