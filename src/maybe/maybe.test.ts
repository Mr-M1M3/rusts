import { describe, test, expect } from "vitest";
import { Maybe } from "@/index.js";

const has_value = new Maybe("value");
const not_a_value = new Maybe<string>(null);
describe("Maybe<T>", () => {
  describe(".is_value()", () => {
    test("should be true", () => {
      expect.soft(has_value.is_value()).toBe(true);
    });
    test("should be false", () => {
      expect.soft(not_a_value.is_value()).toBe(false);
    });
  });

  describe(".is_not_a_value()", () => {
    test("should be false", () => {
      expect.soft(has_value.is_not_a_value()).toBe(false);
    });
    test("should be true", () => {
      expect.soft(not_a_value.is_not_a_value()).toBe(true);
    });
  });

  describe(".expect.soft(msg: string)", () => {
    test("should be the actual value it holds", () => {
      expect.soft(has_value.expect("doesn't hold a value")).toBe("value");
    });
    test("should throw with the message passed", () => {
      expect.soft(() => not_a_value.expect("error msg")).toThrow("error msg");
    });
  });

  describe(".unwrap()", () => {
    test("should be the actual value it holds", () => {
      expect.soft(has_value.unwrap()).toBe("value");
    });
    test("should throw with default message: `Expected a value but didnt get one.`", () => {
      expect.soft(() => {
        not_a_value.unwrap();
      }).toThrow("Expected a value but didnt get one.");
    });
  });

  describe(".unwrap_or()", () => {
    test("should be the actual value it holds", () => {
      expect.soft(has_value.unwrap_or("default")).toBe("value");
    });
    test("should be the provided default value`", () => {
      expect.soft(not_a_value.unwrap_or("default")).toBe("default");
    });
  });

  describe(".unwrap_or_else()", () => {
    test("should be the actual value it holds", () => {
      expect.soft(has_value.unwrap_or_else(() => "calulated default")).toBe("value");
    });
    test("should be the return value of the provided function`", () => {
      expect.soft(not_a_value.unwrap_or_else(() => "calulated default")).toBe(
        "calulated default",
      );
    });
  });

  describe(".map()", () => {
    test("should be a new instance of Maybe holding the returned value of the provided function", () => {
      const new_maybe_with_val = has_value.map<number>((val) => val.length);
      expect.soft(new_maybe_with_val).toBeInstanceOf(Maybe);
      expect.soft(new_maybe_with_val.unwrap()).toBe(5 /*length*/);
    });
    test("should be the a new instance of maybe that holds no value`", () => {
      const new_maybe_with_no_val = not_a_value.map((val) => val.length);
      expect.soft(new_maybe_with_no_val).toBeInstanceOf(Maybe);
      expect.soft(() => {
        new_maybe_with_no_val.unwrap();
      }).toThrow();
    });
  });

  describe(".transform()", () => {
    test("should transform the whole Maybe<T> class to boolean", () => {
      const tr_maybe_with_val = has_value.transform(val => true);
      expect.soft(tr_maybe_with_val).toBe(true);
    });

    test("should transform the whole Maybe<T> class to Date object", () => {
      const tr_maybe_with_no_val = not_a_value.transform(val => new Date());
      expect.soft(tr_maybe_with_no_val).toBeInstanceOf(Date);
    });
  });
});
