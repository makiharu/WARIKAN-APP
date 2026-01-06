import { calculateDrinkCost, totalCost, calculateWithTotal } from '../app/utils/calculations';
import { Person } from '../app/types';

describe('計算ロジックのテスト', () => {
  // テスト用のサンプルデータ
  const person1: Person = {
    id: '1',
    name: 'Aさん',
    items: [
      { id: 'i1', label: 'ビール', price: 500, category: 'drink' },
      { id: 'i2', label: 'ビール', price: 500, category: 'drink' },
      { id: 'i3', label: 'お通し', price: 300, category: 'food' },
    ],
  };

  const person2: Person = {
    id: '2',
    name: 'Bさん',
    items: [
      { id: 'i4', label: 'ハイボール', price: 400, category: 'drink' },
      { id: 'i5', label: 'ハイボール', price: 400, category: 'drink' },
      { id: 'i6', label: 'ハイボール', price: 400, category: 'drink' },
    ],
  };

  const person3: Person = {
    id: '3',
    name: 'Cさん',
    items: [
      { id: 'i7', label: 'ソフトドリンク', price: 300, category: 'drink' },
      { id: 'i8', label: 'ソフトドリンク', price: 300, category: 'drink' },
    ],
  };

  describe('calculateDrinkCost', () => {
    it('飲み物代のみを正しく計算する', () => {
      expect(calculateDrinkCost(person1)).toBe(1000); // ビール500円×2
      expect(calculateDrinkCost(person2)).toBe(1200); // ハイボール400円×3
      expect(calculateDrinkCost(person3)).toBe(600);  // ソフトドリンク300円×2
    });

    it('飲み物がない場合は0を返す', () => {
      const personNoItems: Person = {
        id: '4',
        name: 'Dさん',
        items: [],
      };
      expect(calculateDrinkCost(personNoItems)).toBe(0);
    });

    it('食事のみの場合は0を返す', () => {
      const personFoodOnly: Person = {
        id: '5',
        name: 'Eさん',
        items: [
          { id: 'i9', label: 'お通し', price: 300, category: 'food' },
          { id: 'i10', label: 'フード', price: 500, category: 'food' },
        ],
      };
      expect(calculateDrinkCost(personFoodOnly)).toBe(0);
    });
  });

  describe('totalCost', () => {
    it('全アイテムの合計金額を正しく計算する', () => {
      expect(totalCost(person1)).toBe(1300); // 500+500+300
      expect(totalCost(person2)).toBe(1200); // 400+400+400
      expect(totalCost(person3)).toBe(600);  // 300+300
    });

    it('アイテムがない場合は0を返す', () => {
      const personNoItems: Person = {
        id: '4',
        name: 'Dさん',
        items: [],
      };
      expect(totalCost(personNoItems)).toBe(0);
    });
  });

  describe('calculateWithTotal', () => {
    const persons = [person1, person2, person3];

    it('レジ合計10,000円の場合の計算が正しい', () => {
      // 飲み物合計: 1000 + 1200 + 600 = 2800円
      // 食事代: 10000 - 2800 = 7200円
      // 食事代1人分: 7200 / 3 = 2400円
      const result = calculateWithTotal(persons, 10000);

      expect(result.get('1')).toBe(1000 + 2400); // 3400円
      expect(result.get('2')).toBe(1200 + 2400); // 3600円
      expect(result.get('3')).toBe(600 + 2400);  // 3000円
    });

    it('端数が出る場合は四捨五入される', () => {
      // 飲み物合計: 1000 + 1200 + 600 = 2800円
      // 食事代: 10000 - 2800 = 7200円
      // 食事代1人分: 7200 / 3 = 2400円（端数なし）
      const result1 = calculateWithTotal(persons, 10000);
      expect(result1.get('1')).toBe(3400);

      // 端数が出るケース
      // レジ合計: 10001円
      // 食事代: 10001 - 2800 = 7201円
      // 食事代1人分: 7201 / 3 = 2400.33... → 2400円（四捨五入）
      const result2 = calculateWithTotal(persons, 10001);
      expect(result2.get('1')).toBe(1000 + 2400); // 3400円

      // レジ合計: 10002円
      // 食事代: 10002 - 2800 = 7202円
      // 食事代1人分: 7202 / 3 = 2400.66... → 2401円（四捨五入）
      const result3 = calculateWithTotal(persons, 10002);
      expect(result3.get('1')).toBe(1000 + 2401); // 3401円
    });

    it('飲み物を飲まない人も食事代は払う', () => {
      const personNoDrink: Person = {
        id: '4',
        name: 'Dさん',
        items: [], // 何も注文していない
      };
      const personsWithNoDrink = [...persons, personNoDrink];

      // 飲み物合計: 2800円
      // 食事代: 10000 - 2800 = 7200円
      // 食事代1人分: 7200 / 4 = 1800円
      const result = calculateWithTotal(personsWithNoDrink, 10000);

      expect(result.get('4')).toBe(0 + 1800); // 1800円（飲み物0円 + 食事代1800円）
    });

    it('レジ合計が0円の場合', () => {
      const result = calculateWithTotal(persons, 0);

      // 飲み物合計: 2800円
      // 食事代: 0 - 2800 = -2800円
      // 食事代1人分: -2800 / 3 = -933円（四捨五入）
      expect(result.get('1')).toBe(1000 + (-933)); // 67円
      expect(result.get('2')).toBe(1200 + (-933)); // 267円
      expect(result.get('3')).toBe(600 + (-933));  // -333円
    });

    it('参加者全員が飲み物だけの場合', () => {
      const personsOnlyDrinks = [
        {
          id: '1',
          name: 'Aさん',
          items: [
            { id: 'i1', label: 'ビール', price: 1000, category: 'drink' as const },
          ],
        },
        {
          id: '2',
          name: 'Bさん',
          items: [
            { id: 'i2', label: 'ビール', price: 1000, category: 'drink' as const },
          ],
        },
      ];

      // 飲み物合計: 2000円
      // 食事代: 5000 - 2000 = 3000円
      // 食事代1人分: 3000 / 2 = 1500円
      const result = calculateWithTotal(personsOnlyDrinks, 5000);

      expect(result.get('1')).toBe(1000 + 1500); // 2500円
      expect(result.get('2')).toBe(1000 + 1500); // 2500円
    });
  });
});
