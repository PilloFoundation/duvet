import { z } from "zod";

const parseDate = z.string().pipe(z.coerce.date());
const parseNumber = z.string().transform<number>((v, ctx) => {
  const n = Number(v);
  if (isNaN(n) || v.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Expected a number but received ${v}`,
    });
    return z.NEVER;
  } else {
    return n;
  }
});

export const shouldBeTrue = ["true", "t", "yes", "y", "1", "on"];
export const shouldBeFalse = ["false", "f", "no", "n", "0", "off"];

const parseBoolean = z.string().transform((v, ctx) => {
  if (shouldBeTrue.includes(v.toLocaleLowerCase())) {
    return true;
  }
  if (shouldBeFalse.includes(v.toLocaleLowerCase())) {
    return false;
  }
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: `Expected 'true' or 'false' but received ${v}`,
  });
  return z.NEVER;
});

export const k = {
  /**
   * @param value - A string to parse as a number.
   */
  number: parseNumber,
  /**
   * @param value - A string to parse as a string.
   */
  string: z.string(),
  /**
   * @param value - A string to parse as a boolean. Accepts 'true', 'false', 't', 'f', 'yes', 'no', 'y', 'n', '1', '0', 'on', 'off'.
   */
  boolean: parseBoolean,
  /**
   * @param value - A string to parse as a date. Accepts any string that can be parsed by the Date constructor.
   */
  date: parseDate,
};
