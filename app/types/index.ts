// アイテムのカテゴリ
export type Category = "drink" | "food";

// アイテム（飲み物・食事）
export interface Item {
  id: string;
  label: string;
  price: number;
  category: Category;
}

// 参加者
export interface Person {
  id: string;
  name: string;
  items: Item[];
}

// アプリ全体の状態
export interface AppState {
  persons: Person[];
  totalAmount: number; // レジの合計金額
}

// Context用のAction型
export type Action =
  | { type: "ADD_PERSON"; payload: { name: string } }
  | { type: "REMOVE_PERSON"; payload: { personId: string } }
  | { type: "ADD_ITEM"; payload: { personId: string; item: Omit<Item, "id"> } }
  | { type: "REMOVE_ITEM"; payload: { personId: string; itemId: string } }
  | { type: "COPY_ITEM"; payload: { personId: string; item: Item } }
  | { type: "SET_TOTAL_AMOUNT"; payload: { amount: number } }
  | { type: "RESET_STATE" }
  | { type: "LOAD_STATE"; payload: AppState };

// プリセットラベル
export const PRESET_LABELS = {
  drink: ["ビール", "ハイボール", "サワー", "ワイン", "ソフトドリンク"],
  food: ["フード", "お通し", "デザート"],
} as const;
