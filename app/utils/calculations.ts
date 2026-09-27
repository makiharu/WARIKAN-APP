import { Person, Item, PriceInputMode } from "../types";

export const TAX_RATE = 0.1;

/** 入力方式に応じた品目の税込み価格を返す */
export const calculateItemPrice = (
  item: Item,
  priceInputMode: PriceInputMode = "taxIncluded"
): number => {
  if (priceInputMode === "taxExcluded") {
    return Math.round(item.price * (1 + TAX_RATE));
  }
  return item.price;
};

/**
 * 1人の飲み物代を計算
 * @param person 参加者
 * @returns 飲み物代の合計
 */
export const calculateDrinkCost = (
  person: Person,
  priceInputMode: PriceInputMode = "taxIncluded"
): number => {
  let sum = 0;
  for (let i = 0; i < person.items.length; i++) {
    if (person.items[i].category === "drink") {
      sum += calculateItemPrice(person.items[i], priceInputMode);
    }
  }
  return sum;
};

export const totalCost = (
  person: Person,
  priceInputMode: PriceInputMode = "taxIncluded"
): number => {
  let sum=0;
  for(let i=0; i < person.items.length; i++) {
    sum += calculateItemPrice(person.items[i], priceInputMode);
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
  totalAmount: number,
  priceInputMode: PriceInputMode = "taxIncluded"
): Map<string, number> => {
  const result = new Map<string, number>();

  // 全員の飲み物代の合計を計算
  let totalDrinkCost = 0;
  for (let i = 0; i < persons.length; i++) {
    totalDrinkCost += calculateDrinkCost(persons[i], priceInputMode);
  }

  // 食事代を計算
  const foodCost = totalAmount - totalDrinkCost;

  // 食事代の1人分を計算（四捨五入）
  const foodPerPerson = Math.round(foodCost / persons.length);

  // 各人の支払額を計算
  for (let i = 0; i < persons.length; i++) {
    const person = persons[i];
    const drinkCost = calculateDrinkCost(person, priceInputMode);
    const payment = drinkCost + foodPerPerson;
    result.set(person.id, payment);
  }

  return result;
};

export const calculateAllTotals = (
    persons: Person[],
    priceInputMode: PriceInputMode = "taxIncluded"
  ): Map<string, number> => {
    const totals = new Map<string, number>();

     for (let i = 0; i < persons.length; i++) {
     const person = persons[i];
      const total = totalCost(person, priceInputMode);
      totals.set(person.id, total);
     }

     return totals;
   };
