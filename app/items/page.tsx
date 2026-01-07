"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "../context/AppContext";
import { Category, PRESET_LABELS } from "../types";

export default function ItemsPage() {
  const { state, dispatch } = useApp();
  const router = useRouter();
  const [totalAmount, setTotalAmount] = useState((state.totalAmount || 0).toString());

  if (state.persons.length === 0) {
    router.push("/members");
    return null;
  }

  const handleTotalAmountChange = (value: string) => {
    setTotalAmount(value);
    const amount = parseInt(value);
    if (!isNaN(amount) && amount >= 0) {
      dispatch({ type: "SET_TOTAL_AMOUNT", payload: { amount } });
    }
  };

  const handleCalculate = () => {
    router.push("/result");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-xl space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">飲み物・食事入力</h1>
            <p className="mt-2 text-sm text-gray-600">
              各参加者が注文したものを入力してください
            </p>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700 mb-2">
              レジ合計金額
            </label>
            <input
              type="number"
              id="totalAmount"
              value={totalAmount}
              onChange={(e) => handleTotalAmountChange(e.target.value)}
              placeholder="10000"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-2 text-xs text-gray-500">
              ※飲み物代は個人負担、食事代は均等割りで計算されます
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {state.persons.map((person) => (
            <PersonCard key={person.id} personId={person.id} personName={person.name} />
          ))}
        </div>

        <div className="flex gap-3 rounded-2xl bg-white p-6 shadow-xl">
          <Link
            href="/members"
            className="flex-1 rounded-lg border border-gray-300 px-6 py-3 text-center font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            戻る
          </Link>
          <button
            onClick={handleCalculate}
            className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            計算する
          </button>
        </div>
      </div>
    </div>
  );
}

function PersonCard({ personId, personName }: { personId: string; personName: string }) {
  const { state, dispatch } = useApp();
  const [category, setCategory] = useState<Category>("drink");
  const [label, setLabel] = useState("");
  const [price, setPrice] = useState("");
  const [isCustomLabel, setIsCustomLabel] = useState(false);

  const person = state.persons.find((p) => p.id === personId);
  if (!person) return null;

  const handlePresetClick = (presetLabel: string) => {
    setLabel(presetLabel);
    setIsCustomLabel(false);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseInt(price);
    if (label.trim() && !isNaN(priceNum) && priceNum > 0) {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          personId,
          item: {
            label: label.trim(),
            price: priceNum,
            category,
          },
        },
      });
      setLabel("");
      setPrice("");
      setIsCustomLabel(false);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { personId, itemId } });
  };

  const handleCopyItem = (itemId: string) => {
    const item = person.items.find((i) => i.id === itemId);
    if (item) {
      dispatch({ type: "COPY_ITEM", payload: { personId, item } });
    }
  };

  const total = person.items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{personName}</h2>
        <div className="text-right">
          <p className="text-sm text-gray-600">小計</p>
          <p className="text-2xl font-bold text-blue-600">{total.toLocaleString()}円</p>
        </div>
      </div>

      <form onSubmit={handleAddItem} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">カテゴリ</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setCategory("drink");
                setLabel("");
                setIsCustomLabel(false);
              }}
              className={`flex-1 rounded-lg px-4 py-2 font-semibold transition-colors ${
                category === "drink"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              飲み物
            </button>
            <button
              type="button"
              onClick={() => {
                setCategory("food");
                setLabel("");
                setIsCustomLabel(false);
              }}
              className={`flex-1 rounded-lg px-4 py-2 font-semibold transition-colors ${
                category === "food"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              食事
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">品目</label>
          <div className="flex flex-wrap gap-2">
            {PRESET_LABELS[category].map((presetLabel) => (
              <button
                key={presetLabel}
                type="button"
                onClick={() => handlePresetClick(presetLabel)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  label === presetLabel && !isCustomLabel
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {presetLabel}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setIsCustomLabel(true);
                setLabel("");
              }}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isCustomLabel
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              その他
            </button>
          </div>
          {isCustomLabel && (
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="品目名を入力"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>

        <div className="flex gap-2">
          <div className="flex-1 space-y-2">
            <label htmlFor={`price-${personId}`} className="block text-sm font-medium text-gray-700">
              金額
            </label>
            <input
              type="number"
              id={`price-${personId}`}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="500"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              追加
            </button>
          </div>
        </div>
      </form>

      {person.items.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">追加済みアイテム</h3>
          <div className="space-y-2">
            {person.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-600">
                    {item.category === "drink" ? "飲み物" : "食事"} ・ {item.price.toLocaleString()}円
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyItem(item.id)}
                    className="rounded bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-300"
                  >
                    コピー
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="rounded bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
