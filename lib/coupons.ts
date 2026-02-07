// Generate 50 coupon codes following format: 3 lowercase letters + 3 digits
export const VALID_COUPONS = [
  'sir123', 'giu143', 'abc456', 'mag101', 'pic555',
  'xyz789', 'def234', 'ghi567', 'jkl890', 'mno123',
  'pqr456', 'stu789', 'vwx012', 'yza345', 'bcd678',
  'efg901', 'hij234', 'klm567', 'nop890', 'qrs123',
  'tuv456', 'wxy789', 'zab012', 'cde345', 'fgh678',
  'ijk901', 'lmn234', 'opq567', 'rst890', 'uvw123',
  'xya456', 'zbc789', 'def012', 'ghi345', 'jkl678',
  'mno901', 'pqr234', 'stu567', 'vwx890', 'yza123',
  'bcd456', 'efg789', 'hij012', 'klm345', 'nop678',
  'qrs901', 'tuv234', 'wxy567', 'zab890', 'cde123'
];

export interface CouponValidation {
  isValid: boolean;
  error?: string;
  discountPercentage?: number;
}

// Validate coupon code format: 3 lowercase letters + 3 digits
export function validateCouponFormat(code: string): boolean {
  const regex = /^[a-z]{3}\d{3}$/;
  return regex.test(code);
}

// Check if coupon is valid and not used
export function validateCoupon(
  code: string,
  usedCoupons: string[] = []
): CouponValidation {
  // Check format first
  if (!validateCouponFormat(code)) {
    return {
      isValid: false,
      error: 'Invalid coupon format. Use 3 lowercase letters + 3 digits (e.g., sis123)'
    };
  }

  // Check if already used
  if (usedCoupons.includes(code)) {
    return {
      isValid: false,
      error: 'Coupon is already used'
    };
  }

  // Check if coupon exists in valid list
  if (!VALID_COUPONS.includes(code)) {
    return {
      isValid: false,
      error: 'Invalid coupon code'
    };
  }

  // Valid coupon - 50% discount
  return {
    isValid: true,
    discountPercentage: 50
  };
}

// Calculate discount amount
export function calculateDiscount(total: number, discountPercentage: number): number {
  return Math.round(total * (discountPercentage / 100));
}
