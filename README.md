# Rust like utils fro typescript

Rust is famous for its exceptional design choices that helps reduce some class of bugs beforehand. It also force us to wrtite good code. You can now taste these features in typesriupt too.

## Installation

```bash
npm i @mr-m1m3/rusts
```

## Usage

Basically rusts exports classes that implements spceific rust standard library modules.

Currently rusts exports following classes:

* [Maybe](#Maybe) (`Option<T>` equivalent of rust)
* [Result](#Result)

#### Maybe`<T>`

Basically a wrapper around `null`. Use it when a value can either be something or nothing.

```typescript

import {Maybe} from "@mr-m1m3/rusts";

// contains some value
const maybe_a_number = new Maybe(100);

// doesn't contain value
const or_maybe_not = new Maybe(null);

// methods
/*
 * .is_value() -> returns `true` because it contains a value otherwise resturns false
 */
maybe_a_number.is_value(); // true
or_maybe_not.is_value(); //false

/*
 * is_not_a_value() -> opposite of .is_value()
 */
or_maybe_not.is_not_a_value(); // true
maybe_a_number.is_not_a_value(); // false

/*
 * .unwrap() -> returns the value if it contains any or throws if it doesn't
 */
maybe_a_number.unwrap(); // 100
or_maybe_not.unwrap(); // throws


/*
 * .expect(msg: string) -> same as .unwrap() but you can specify a message to be displayed as error
 */
maybe_a_number.expect('oops!'); // logs: 100
or_maybe_not.expect('oops!'); // throws an error showing: oops!


/*
 * .unwrap_or(default: T) -> returns the value if it contains any; provided default if it doesn't
 */
maybe_a_number.unwrap_or(420); // 100
or_maybe_not.unwrap_or(420); // 420

/*
 * .unwrap_or_else(fn: () => T) -> same as .unwrap_or() but takes a function calulate the default value
 */
maybe_a_number.unwrap_or_else(() => Math.random() * 15); // 100
or_maybe_not.unwrap_or_else(() => Math.random() * 15); // a random number

/*
 * .map() -> converts `Maybe` of one type to Maybe of another type.
 */
maybe_a_number.map((n) => `number is one hundred`); // Maybe<string>
or_maybe_not.map((n) => `contains null`); // Maybe<string>


/*
 * .transform(fn: (T) => U) -> transform the whole Maybe<T> to another type
 */

maybe_a_number.transform((val) => {
    if(val.is_value()){
        return {
            is_value: true
        }
    }else{
        return {
            is_value: false
        }
    }
}); // {is_value: true}
```

#### Result  `<T, E>`

typescript equivalent of rust `Result<T, E>`. It is use extensively in error handling. If a function can fail, it should always return `Result<T, E>` instead of throwing. Whoever calling the function should be the one to decide what to do with it. This approach also helps easily type a function that can fail. It takes advantage of typescript\'s discriminated union. Here, `T` represents the expected value and `E` represent the value if something happens really bad.

You can call two static methods from this function. 

- `Result.Ok(expected_val)` returns an instance that contains the value we expect when all went well.
- `Result.Err(err_val)` returns an instance that contains the value that will be returned when an error happens.

Imagine, you have a function that looks like this:

```typescript
function could_fail(): Data{
    //..//
    if(condition){
        return {/*...*/}
    }
    throw Error(/**/);
}
```

However, the caller can't really tell beforehand that this function can throw. Also, it is now difficult to return organized error details to the caller. What we can do now is use `Result<Data, ErrMsg>`. What we are expressing is that the function can return either of type `Data` or `ErrMsg` and the caller must check explicitely before using the value. Now, inside the function body, we return `Result.Ok(data: Data)` and instead of throwing, we return `Result.Err(err_msg: ErrMsg)`.

```typescript
function could_fail(): Result<Data, ErrMsg>{
    //..//
    if(condition){
        return Result.Ok({/*...*/});
    }
    throw Result.Err({/**/});
}
```

The instance comes with some useful methods:

```typescript
import Result from "@mr-m1m3/rusts/result";

type Data = {
  name: string;
  age: number;
};
type ErrMsg = {
  msg: string;
  status: number;
};

//                        +-------> ok variant or the value of a successfull operation
//                        |  +-----> error variant or the value of a failed operation
//                        |  |
//                Result<T, E>

const ok_variant: Result<Data, ErrMsg> = Result.Ok({
  name: "John Doe",
  age: 30,
});

const err_variant: Result<Data, ErrMsg> = Result.Err({
  msg: "oops!",
  status: 500,
});

/**
 * .is_ok() -> returns true if the instance contains the value of a successfull operation aka if it was instantiated with Result.Ok();
 */
ok_variant.is_ok(); // true
err_variant.is_ok(); // false

/**
 * .is_error() -> returns true if the instance contains the value of a failed operation aka if it was instantiated with Result.Err();
 */
ok_variant.is_error(); // false
err_variant.is_error(); // true

/*
 * .ok_value() -> returns Maybe<T>.
 */
ok_variant.ok_value();
err_variant.ok_value();

/*
 * .err_value() -> returns Maybe<E>.
 */
ok_variant.err_value();
err_variant.err_value();

/*
* .map<U, Q>(
    ok_mapper: (ok_val: T) => U,
    err_mapper: (err_val: E) => Q,
  ) -> converts to another instcance of Result that has `U` as Ok variant and `Q` as Error variant
       calls first callback with the ok value to get the new ok value if exists otherwise calls second callback with error value to get the new error value.
       returned Result variant will be an ok variant if it itself is the ok variant.
*/
ok_variant.map(
  (ok_val) => "mission passed",
  (error_val) => 0,
); // Result<string, number>
err_variant.map(
  (ok_val) => new Date(),
  (error_val) => "aura ---",
); // Result<Date, string>

/**
 * .map_ok<U>((ok_val) => U) -> same as .map() but only takes in one callback that is called with ok value to get the new ok value
                                returned Result contains the same error value as it itself contains
 */
ok_variant.map_ok((ok_val) => "mission passed"); // Result<string, ErrMsg>
err_variant.map_ok((ok_val) => "mission passed"); // Result<string, ErrMsg>

/**
 * .map_err<Q>((ok_val) => Q) -> same as .map() but only takes in one callback that is called with error value to get the new error value
                                returned Result contains the same ok value as it itself contains
 */
ok_variant.map_err((err_val) => "mission failed"); // Result<Data, string>
err_variant.map_err((err_val) => "mission failed"); // Result<Data, string>

/*
 * .transform(callback) -> transformsthe entire Result instance to another type and returns. applies the provided callback on the instance to get the new type.
 */

ok_variant.transform((result_instnce) => {
  return {
    is_ok: result_instnce.is_ok(),
    is_error: result_instnce.is_error(),
  };
}); // {is_ok: true, is_error: false}

```
