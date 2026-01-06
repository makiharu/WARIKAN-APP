"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "../context/AppContext";

export default function MembersPage() {
  const { state, dispatch } = useApp();
  const router = useRouter();
  const [name, setName] = useState("");

  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      dispatch({ type: "ADD_PERSON", payload: { name: name.trim() } });
      setName("");
    }
  };

  const handleRemovePerson = (personId: string) => {
    dispatch({ type: "REMOVE_PERSON", payload: { personId } });
  };

  const handleNext = () => {
    if (state.persons.length > 0) {
      router.push("/items");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <main className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-xl">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">参加者入力</h1>
          <p className="text-sm text-gray-600">
            参加者の名前を入力してください
          </p>
        </div>

        <form onSubmit={handleAddPerson} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              参加者名
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例: 田中さん"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                追加
              </button>
            </div>
          </div>
        </form>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-700">
            参加者リスト ({state.persons.length}名)
          </h2>
          {state.persons.length === 0 ? (
            <p className="rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500">
              まだ参加者が登録されていません
            </p>
          ) : (
            <div className="space-y-2">
              {state.persons.map((person) => (
                <div
                  key={person.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-900">{person.name}</span>
                  <button
                    onClick={() => handleRemovePerson(person.id)}
                    className="text-red-600 hover:text-red-700 font-medium text-sm"
                  >
                    削除
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Link
            href="/"
            className="flex-1 rounded-lg border border-gray-300 px-6 py-3 text-center font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            戻る
          </Link>
          <button
            onClick={handleNext}
            disabled={state.persons.length === 0}
            className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            次へ
          </button>
        </div>
      </main>
    </div>
  );
}
