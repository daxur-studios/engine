export class Meth {
  /**
   * Adds two numbers together
   * @param a - The first number to add
   * @param b  - The second number to add
   * @returns - The sum of the two numbers
   */
  static add(a: number, b: number): number {
    return a + b;
  }
  static subtract(a: number, b: number): number {
    return a - b;
  }
  static multiply(a: number, b: number): number {
    return a * b;
  }
  static divide(a: number, b: number): number {
    return a / b;
  }
  static modulo(a: number, b: number): number {
    return a % b;
  }
  static power(a: number, b: number): number {
    return a ** b;
  }
  static squareRoot(a: number): number {
    return Math.sqrt(a);
  }
  static absolute(a: number): number {
    return Math.abs(a);
  }
  /**
   * Rounds a number to a specified number of digits after the decimal point
   * @param a - The number to round
   * @param digits - How many digits after the decimal point to round to
   * @returns - The rounded number
   */
  static round(a: number, digits: number = 0): number {
    return Math.round(a * 10 ** digits) / 10 ** digits;
  }

  /**
   * Clamps a number between a minimum and maximum value
   * @param a - The number to clamp
   * @param min - The minimum value
   * @param max - The maximum value
   * @returns - The clamped number
   */
  static clamp(a: number, min: number, max: number): number {
    return Math.min(Math.max(a, min), max);
  }
}
