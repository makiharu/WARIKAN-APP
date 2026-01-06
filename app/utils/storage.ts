import { AppState } from "../types/index";

 // SessionStorageのキー名（アプリ固有の名前にする）
 const STORAGE_KEY = "warikan-app-state";

 /**
  * SessionStorageから状態を読み込む
  * @returns 保存されていた状態、または存在しない場合はnull
  */
 export const loadStateFromStorage = (): AppState | null => {
   // サーバーサイドレンダリング時はwindowが存在しないのでチェック
   if (typeof window === "undefined") return null;

   try {
     // SessionStorageから文字列として取得
     const stored = sessionStorage.getItem(STORAGE_KEY);

     // データがない場合はnullを返す
     if (!stored) return null;

     // JSON文字列をオブジェクトに変換
     const parsed = JSON.parse(stored);
     return parsed as AppState;
   } catch (error) {
     // エラーが発生した場合（不正なJSON等）はログを出してnullを返す
     console.error("Failed to load state from sessionStorage:", error);
     return null;
   }
 };

 /**
  * SessionStorageに状態を保存
  * @param state 保存する状態
  */
 export const saveStateToStorage = (state: AppState): void => {
   // サーバーサイドレンダリング時は何もしない
   if (typeof window === "undefined") return;

   try {
     // オブジェクトをJSON文字列に変換してSessionStorageに保存
     sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
   } catch (error) {
     // エラーが発生した場合（容量オーバー等）はログを出す
     console.error("Failed to save state to sessionStorage:", error);
   }
 };

 /**
  * SessionStorageをクリア（状態をリセットする時に使用）
  */
 export const clearStorage = (): void => {
   // サーバーサイドレンダリング時は何もしない
   if (typeof window === "undefined") return;

   try {
     sessionStorage.removeItem(STORAGE_KEY);
   } catch (error) {
     console.error("Failed to clear sessionStorage:", error);
   }
 };

 // 使用例：
 // import { loadStateFromStorage, saveStateToStorage, clearStorage } from "@/app/utils/storage";
 //
 // // 読み込み
 // const savedState = loadStateFromStorage();
 // if (savedState) {
 //   console.log("保存されていた状態を読み込みました", savedState);
 // }
 //
 // // 保存
 // const newState: AppState = { persons: [...] };
 // saveStateToStorage(newState);
 //
 // // クリア
 // clearStorage();