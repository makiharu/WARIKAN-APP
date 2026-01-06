import { Person } from "../types";

/**
 * 1人の飲み物代を計算
 * @param person 参加者
 * @returns 飲み物代の合計
 */
export const calculateDrinkCost = (person: Person): number => {
  let sum = 0;
  for (let i = 0; i < person.items.length; i++) {
    if (person.items[i].category === "drink") {
      sum += person.items[i].price;
    }
  }
  return sum;
};

export const totalCost = (person: Person):number => {
  let sum=0;
  for(let i=0; i < person.items.length; i++) {
    sum+= person.items[i].price;
  }
  return sum;
}

/**
 * 新しい計算方法：レジ合計金額から各人の支払額を計算
 * 飲み物代は個人負担、食事代は均等割り
 * @param persons 参加者リスト
 * @param totalAmount レジの合計金額
 * @returns personId -> 支払金額のMap
 */
export const calculateWithTotal = (
  persons: Person[],
  totalAmount: number
): Map<string, number> => {
  const result = new Map<string, number>();

  // 全員の飲み物代の合計を計算
  let totalDrinkCost = 0;
  for (let i = 0; i < persons.length; i++) {
    totalDrinkCost += calculateDrinkCost(persons[i]);
  }

  // 食事代を計算
  const foodCost = totalAmount - totalDrinkCost;

  // 食事代の1人分を計算（四捨五入）
  const foodPerPerson = Math.round(foodCost / persons.length);

  // 各人の支払額を計算
  for (let i = 0; i < persons.length; i++) {
    const person = persons[i];
    const drinkCost = calculateDrinkCost(person);
    const payment = drinkCost + foodPerPerson;
    result.set(person.id, payment);
  }

  return result;
};

export const calculateAllTotals = (
    persons: Person[]
  ): Map<string, number> => {
    const totals = new Map<string, number>();

     for (let i = 0; i < persons.length; i++) {
     const person = persons[i];
      const total = totalCost(person);
      totals.set(person.id, total);
     }

     return totals;
   };