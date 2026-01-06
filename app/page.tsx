"use client";

import Link from "next/link";
import { useApp } from "./context/AppContext";

export default function Home() {
  const { resetApp } = useApp();

  const handleStart = () => {
    // 新規で始める場合は状態をリセット
    resetApp();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <main className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            割り勘会計アプリ
          </h1>
          <p className="text-lg text-gray-600">
            飲み会・食事会の割り勘を
            <br />
            公平に計算します
          </p>
        </div>

        <div className="space-y-4 border-t border-gray-200 pt-6">
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">✓</span>
              <p>参加者ごとに飲み物・食事を入力</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">✓</span>
              <p>自動で支払金額を計算</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">✓</span>
              <p>結果をコピーして共有</p>
            </div>
          </div>
        </div>

        <Link
          href="/members"
          onClick={handleStart}
          className="block w-full rounded-lg bg-blue-600 px-6 py-4 text-center text-lg font-semibold text-white transition-colors hover:bg-blue-700"
        >
          始める
        </Link>

        <p className="text-center text-xs text-gray-500">
          ※データはこのタブのみで保持されます
        </p>
      </main>
    </div>
  );
}
