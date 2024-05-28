import { k } from "../../src/index";
import { shouldBeFalse, shouldBeTrue } from "../../src/schemaHelpers";

describe("Zod String Parsing Functions", () => {
  test("Number parsing", () => {
    const number = k.number.parse("123");
    expect(number).toBe(123);

    const number2 = k.number.parse("123.123");
    expect(number2).toBe(123.123);

    const number3 = k.number.parse("0");
    expect(number3).toBe(0);

    const number4 = k.number.parse("-123");
    expect(number4).toBe(-123);

    const number5 = k.number.parse("-123.123");
    expect(number5).toBe(-123.123);

    expect(() => k.number.parse("abc")).toThrow();
    expect(() => k.number.parse("abc123")).toThrow();
    expect(() => k.number.parse("")).toThrow();

    expect(() => k.number.parse("true")).toThrow();
    expect(() => k.number.parse("false")).toThrow();
  });

  test("Date parsing", () => {
    const date = k.date.parse("2021-01-01");
    expect(date).toEqual(new Date("2021-01-01"));

    expect(() => k.date.parse("abc")).toThrow();
    expect(() => k.date.parse("")).toThrow();
    expect(() => k.date.parse("true")).toThrow();
    expect(() => k.date.parse("false")).toThrow();
  });

  test("Boolean parsing", () => {
    for (const value of shouldBeTrue) {
      const bool = k.boolean.parse(value);
      expect(bool).toBe(true);

      const bool2 = k.boolean.parse(value.toUpperCase());
      expect(bool2).toBe(true);

      const bool3 = k.boolean.parse(value[0].toUpperCase() + value.slice(1));
      expect(bool3).toBe(true);
    }

    for (const value of shouldBeFalse) {
      const bool = k.boolean.parse(value);
      expect(bool).toBe(false);

      const bool2 = k.boolean.parse(value.toUpperCase());
      expect(bool2).toBe(false);

      const bool3 = k.boolean.parse(value[0].toUpperCase() + value.slice(1));
      expect(bool3).toBe(false);
    }

    expect(() => k.boolean.parse("abc")).toThrow();
    expect(() => k.boolean.parse("")).toThrow();
    expect(() => k.boolean.parse("123")).toThrow();
  });
});
