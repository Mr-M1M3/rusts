import { describe, test, expect } from "vitest";
import { Maybe, Result } from "@/index.js";
type OkData = {
  data: string;
};
type ErrData = {
  status: number;
};
const ok_variant = Result.Ok<OkData, ErrData>({
  data: "ok data",
});
const err_variant = Result.Err<OkData, ErrData>({
  status: 400,
});

describe("Result<T, E>", () => {
  describe(".is_ok()", () => {
    test("should be true", () => {
      expect.soft(ok_variant.is_ok()).toBe(true);
    });
    test("should be false", () => {
      expect.soft(err_variant.is_ok()).toBe(false);
    });
  });

  describe(".is_error()", () => {
    test("should be false", () => {
      expect.soft(ok_variant.is_error()).toBe(false);
    });
    test("should be true", () => {
      expect.soft(err_variant.is_error()).toBe(true);
    });
  });

  describe(".ok_value()", () => {
    test("should be an instance of Maybe<T> containing the expected value", () => {
      const ok_variant_ok_value = ok_variant.ok_value();
      expect.soft(ok_variant_ok_value).toBeInstanceOf(Maybe);
      expect.soft(ok_variant_ok_value.unwrap()).toStrictEqual({
        data: "ok data",
      });
    });
    test("should be an instance of Maybe<T> containing nothing", () => {
      const err_variant_ok_value = err_variant.ok_value();
      expect.soft(err_variant_ok_value).toBeInstanceOf(Maybe);
      expect
        .soft(() => {
          err_variant_ok_value.unwrap();
        })
        .toThrow();
    });
  });

  describe(".err_value()", () => {
    test("should be an instance of Maybe<T> containing the nothing", () => {
      const ok_variant_err_value = ok_variant.err_value();
      expect.soft(ok_variant_err_value).toBeInstanceOf(Maybe);
      expect
        .soft(() => {
          ok_variant_err_value.unwrap();
        })
        .toThrow();
    });
  });
  test("should be an instance of Maybe<T> containing error details", () => {
    const err_variant_err_value = err_variant.err_value();
    expect.soft(err_variant_err_value).toBeInstanceOf(Maybe);
    expect.soft(err_variant_err_value.unwrap()).toStrictEqual({
      status: 400,
    });
  });

  describe(".map()", () => {
    test("should be ok variant of another Result with new calulated ok and error value", () => {
      const mapped_ok_variant = ok_variant.map(
        (ok_data) => "was ok variant",
        (err_data) => "was error variant",
      );
      expect.soft(mapped_ok_variant).toBeInstanceOf(Result);
      expect.soft(mapped_ok_variant.is_ok()).toBe(true);
      expect.soft(mapped_ok_variant.ok_value().unwrap()).toBe("was ok variant")
    });

    test("should be err variant of another Result with new calulated ok and error value", () => {
      const mapped_err_variant = err_variant.map(
        (ok_data) => "was ok variant",
        (err_data) => "was error variant",
      );
      expect.soft(mapped_err_variant).toBeInstanceOf(Result);
      expect.soft(mapped_err_variant.is_error()).toBe(true);
      expect.soft(mapped_err_variant.err_value().unwrap()).toBe("was error variant");
    });
  });

  describe(".map_ok()", () => {
    test("should be ok variant of another Result with new calculated ok value but old error value", () => {
      const map_ok_of_ok_variant = ok_variant.map_ok(
        (ok_data) => "was ok variant",
      );
      expect.soft(map_ok_of_ok_variant).toBeInstanceOf(Result);
      expect.soft(map_ok_of_ok_variant.is_ok()).toBe(true);
      expect.soft(map_ok_of_ok_variant.ok_value().unwrap()).toBe("was ok variant");
    });

    test("should be ok variant of another Result with new calculated error value but old ok value", () => {
      const map_err_of_err_variant = err_variant.map_err(
        (err_data) => "was error variant",
      );
      expect.soft(map_err_of_err_variant).toBeInstanceOf(Result);
      expect.soft(map_err_of_err_variant.is_error()).toBe(true);
      expect.soft(map_err_of_err_variant.err_value().unwrap()).toBe("was error variant");
    });
  });

 describe(".transform()", () => {
    test("should transform the whole Result<T, E> class to type string", () => {
      const tr_maybe_with_val = ok_variant.transform(val => 'success');
      expect.soft(tr_maybe_with_val).toBe('success');
    });

    test("should transform the whole Result<T, E> class to number", () => {
      const tr_maybe_with_no_val = err_variant.transform(val => 500);
      expect.soft(tr_maybe_with_no_val).toBe(500);
    });
  });
});
