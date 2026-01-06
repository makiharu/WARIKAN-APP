"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { AppState, Action, Person, Item } from "../types";
import {
  loadStateFromStorage,
  saveStateToStorage,
  clearStorage,
} from "../utils/storage";

// 初期状態
const initialState: AppState = {
  persons: [],
  totalAmount: 0,
};

// Reducer関数
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "ADD_PERSON": {
      const newPerson: Person = {
        id: crypto.randomUUID(),
        name: action.payload.name,
        items: [],
      };
      return {
        ...state,
        persons: [...state.persons, newPerson],
      };
    }

    case "REMOVE_PERSON": {
      return {
        ...state,
        persons: state.persons.filter((p) => p.id !== action.payload.personId),
      };
    }

    case "ADD_ITEM": {
      const newItem: Item = {
        id: crypto.randomUUID(),
        ...action.payload.item,
      };
      return {
        ...state,
        persons: state.persons.map((person) =>
          person.id === action.payload.personId
            ? { ...person, items: [...person.items, newItem] }
            : person
        ),
      };
    }

    case "REMOVE_ITEM": {
      return {
        ...state,
        persons: state.persons.map((person) =>
          person.id === action.payload.personId
            ? {
                ...person,
                items: person.items.filter(
                  (item) => item.id !== action.payload.itemId
                ),
              }
            : person
        ),
      };
    }

    case "COPY_ITEM": {
      const copiedItem: Item = {
        ...action.payload.item,
        id: crypto.randomUUID(), // 新しいIDを生成
      };
      return {
        ...state,
        persons: state.persons.map((person) =>
          person.id === action.payload.personId
            ? { ...person, items: [...person.items, copiedItem] }
            : person
        ),
      };
    }

    case "SET_TOTAL_AMOUNT": {
      return {
        ...state,
        totalAmount: action.payload.amount,
      };
    }

    case "RESET_STATE": {
      return initialState;
    }

    case "LOAD_STATE": {
      return action.payload;
    }

    default:
      return state;
  }
};

// Context型定義
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  resetApp: () => void;
}

// Context作成
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider Props
interface AppProviderProps {
  children: React.ReactNode;
}

// Provider Component
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 初期化時にSessionStorageから状態を読み込む
  useEffect(() => {
    const savedState = loadStateFromStorage();
    if (savedState) {
      dispatch({ type: "LOAD_STATE", payload: savedState });
    }
  }, []);

  // 状態が変更されたらSessionStorageに保存
  useEffect(() => {
    if (state.persons.length > 0 || state.persons.length === 0) {
      saveStateToStorage(state);
    }
  }, [state]);

  // アプリをリセットする関数
  const resetApp = () => {
    clearStorage();
    dispatch({ type: "RESET_STATE" });
  };

  return (
    <AppContext.Provider value={{ state, dispatch, resetApp }}>
      {children}
    </AppContext.Provider>
  );
};

// カスタムフック
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};
