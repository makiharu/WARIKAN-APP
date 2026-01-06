"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "../context/AppContext";
import { calculateDrinkCost, calculateWithTotal } from "../utils/calculations";

export default function ResultPage() {
  const { state, resetApp } = useApp();
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  if (state.persons.length === 0) {
    router.push("/members");
    return null;
  }

  // 新しい計算方法で各人の支払額を計算
  const paymentMap = calculateWithTotal(state.persons, state.totalAmount);

  // 全員の飲み物代の合計を計算
  const totalDrinkCost = state.persons.reduce((sum, person) => sum + calculateDrinkCost(person), 0);

  // 食事代を計算
  const foodCost = state.totalAmount - totalDrinkCost;
  const foodPerPerson = Math.round(foodCost / state.persons.length);

  const handleCopyPerson = async (personId: string, personName: string, amount: number) => {
    const text = `${personName}：${amount.toLocaleString()}円`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(personId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error("コピーに失敗しました:", error);
    }
  };

  const handleCopyAll = async () => {
    const lines = state.persons.map((person) => {
      const amount = paymentMap.get(person.id) || 0;
      return `${person.name}：${amount.toLocaleString()}円`;
    });
    const text = lines.join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (error) {
      console.error("コピーに失敗しました:", error);
    }
  };

  const handleReset = () => {
    resetApp();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-xl">
          <h1 className="text-3xl font-bold text-gray-900">計算結果</h1>
          <p className="mt-2 text-sm text-gray-600">
            飲み物代は個人負担、食事代は均等割りで計算されています
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg bg-blue-50 p-3">
              <p className="text-gray-600">レジ合計</p>
              <p className="text-xl font-bold text-gray-900">{state.totalAmount.toLocaleString()}円</p>
            </div>
            <div className="rounded-lg bg-green-50 p-3">
              <p className="text-gray-600">食事代（1人分）</p>
              <p className="text-xl font-bold text-gray-900">{foodPerPerson.toLocaleString()}円</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {state.persons.map((person) => {
            const drinkCost = calculateDrinkCost(person);
            const payment = paymentMap.get(person.id) || 0;
            const drinkItems = person.items.filter(item => item.category === "drink");

            return (
              <div
                key={person.id}
                className="rounded-2xl bg-white p-6 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">{person.name}</h2>
                    <p className="mt-1 text-sm text-gray-600">
                      飲み物 {drinkItems.length}品
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-600">
                      {payment.toLocaleString()}円
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs font-semibold text-gray-600 mb-2">飲み物代（個人負担）</p>
                    {drinkItems.length > 0 ? (
                      <div className="space-y-1">
                        {drinkItems.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-700">{item.label}</span>
                            <span className="font-medium text-gray-900">
                              {item.price.toLocaleString()}円
                            </span>
                          </div>
                        ))}
                        <div className="flex justify-between text-sm font-bold border-t border-gray-200 pt-1 mt-1">
                          <span>小計</span>
                          <span>{drinkCost.toLocaleString()}円</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">なし</p>
                    )}
                  </div>

                  <div className="rounded-lg bg-green-50 p-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">食事代（均等割り）</span>
                      <span className="font-medium text-gray-900">
                        {foodPerPerson.toLocaleString()}円
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleCopyPerson(person.id, person.name, payment)}
                  className="mt-4 w-full rounded-lg border-2 border-blue-600 px-4 py-2 font-semibold text-blue-600 transition-colors hover:bg-blue-50"
                >
                  {copiedId === person.id ? "コピーしました！" : "この人の結果をコピー"}
                </button>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-xl">
          <button
            onClick={handleCopyAll}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            {copiedAll ? "コピーしました！" : "全員分まとめてコピー"}
          </button>
        </div>

        <div className="flex gap-3 rounded-2xl bg-white p-6 shadow-xl">
          <Link
            href="/items"
            className="flex-1 rounded-lg border border-gray-300 px-6 py-3 text-center font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            修正する
          </Link>
          <button
            onClick={handleReset}
            className="flex-1 rounded-lg bg-gray-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-700"
          >
            最初に戻る
          </button>
        </div>
      </div>
    </div>
  );
}
