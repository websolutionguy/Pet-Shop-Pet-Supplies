import { SubscriptionConfigData } from '../types/data';
import { Product, ProductCadence, ProductVariant } from '../types/product';
import { SubscriptionState, SUBSCRIPTION_STATES } from '../types/subscription';

export interface SubscriptionValidationResult {
  isValid: boolean;
  status: SubscriptionState;
  errorCode?:
    | 'PRODUCT_NOT_ELIGIBLE'
    | 'FREQUENCY_UNAVAILABLE'
    | 'QUANTITY_INVALID'
    | 'PRODUCT_UNAVAILABLE'
    | 'SUBSCRIPTION_DISABLED'
    | 'INVALID_CONFIGURATION'
    | 'ORDER_VALUE_INVALID'
    | 'SUBSCRIPTION_ONLY';
  shopperMessage: string;
  details?: Record<string, any>;
}

export interface ValidateSubscriptionInput {
  product: Product | null;
  variant?: ProductVariant | { id: string; price: number; name?: string; inStock?: boolean };
  quantity: number;
  frequency: string;
  config: SubscriptionConfigData;
  orderTotal?: number;
}

/**
 * Validates the raw configuration object from subscription-config.json
 */
export function validateSubscriptionConfig(config: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!config || typeof config !== 'object') {
    return { isValid: false, errors: ['Configuration must be a non-null object.'] };
  }

  if (typeof config.enabled !== 'boolean') {
    errors.push('Configuration "enabled" field must be a boolean.');
  }

  const allowedFrequencies = config.allowedFrequencies || config.supportedFrequencies;
  if (!Array.isArray(allowedFrequencies) || allowedFrequencies.length === 0) {
    errors.push('Configuration "allowedFrequencies" must be a non-empty array of cadence strings.');
  }

  if (
    typeof config.defaultFrequency !== 'string' ||
    (Array.isArray(allowedFrequencies) && !allowedFrequencies.includes(config.defaultFrequency))
  ) {
    errors.push(
      `Configuration "defaultFrequency" ("${config.defaultFrequency}") must be included in allowed frequencies.`
    );
  }

  const discount = config.discount ?? config.defaultDiscountPercentage;
  if (typeof discount !== 'number' || discount < 0 || discount > 100) {
    errors.push('Configuration "discount" must be a number between 0 and 100.');
  }

  if (
    typeof config.minimumQuantity !== 'number' ||
    config.minimumQuantity < 1 ||
    !Number.isInteger(config.minimumQuantity)
  ) {
    errors.push('Configuration "minimumQuantity" must be a positive integer >= 1.');
  }

  if (
    typeof config.maximumQuantity !== 'number' ||
    config.maximumQuantity < (config.minimumQuantity || 1) ||
    !Number.isInteger(config.maximumQuantity)
  ) {
    errors.push('Configuration "maximumQuantity" must be an integer >= minimumQuantity.');
  }

  if (typeof config.minimumOrderValue === 'number' && config.minimumOrderValue < 0) {
    errors.push('Configuration "minimumOrderValue" must be >= 0.');
  }

  if (
    typeof config.maximumOrderValue === 'number' &&
    config.maximumOrderValue < (config.minimumOrderValue || 0)
  ) {
    errors.push('Configuration "maximumOrderValue" must be >= minimumOrderValue.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Helper to interpolate template variables like {frequency}, {allowed}, {min}, {max}
 */
function interpolate(template: string, vars: Record<string, string | number>): string {
  let result = template;
  Object.entries(vars).forEach(([k, v]) => {
    result = result.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
  });
  return result;
}

/**
 * Primary validator for Auto-Ship Subscriptions.
 * Enforces business rules and returns clear, understandable shopper errors.
 */
export class SubscriptionValidator {
  /**
   * Evaluates all subscription rules against product, requested quantity, frequency, and config.
   */
  static validate(input: ValidateSubscriptionInput): SubscriptionValidationResult {
    const { product, variant, quantity, frequency, config, orderTotal } = input;

    // 1. Invalid Configuration Check
    const configCheck = validateSubscriptionConfig(config);
    if (!configCheck.isValid) {
      return {
        isValid: false,
        status: SUBSCRIPTION_STATES.INVALID_CONFIGURATION,
        errorCode: 'INVALID_CONFIGURATION',
        shopperMessage:
          config?.messages?.invalidConfig ||
          'The subscription configuration is invalid or missing essential program parameters. Please contact customer care.',
        details: { configErrors: configCheck.errors },
      };
    }

    // 2. Subscription Disabled Check
    if (config.enabled === false) {
      return {
        isValid: false,
        status: SUBSCRIPTION_STATES.SUBSCRIPTION_DISABLED,
        errorCode: 'SUBSCRIPTION_DISABLED',
        shopperMessage:
          config.messages?.subscriptionDisabled ||
          'Our recurring auto-ship service is temporarily paused for routine pantry maintenance. You can still purchase this provision as a one-time order.',
        details: { enabled: false },
      };
    }

    // 3. Product Existence & In-Stock Availability Check
    if (!product) {
      return {
        isValid: false,
        status: SUBSCRIPTION_STATES.PRODUCT_UNAVAILABLE,
        errorCode: 'PRODUCT_UNAVAILABLE',
        shopperMessage: 'The requested provision could not be found in our catalog.',
        details: { reason: 'Product not cataloged' },
      };
    }

    const matchedVariant = variant
      ? product.variants.find((v) => v.id === variant.id) || variant
      : product.variants?.[0];

    const isVariantInStock =
      matchedVariant && 'inStock' in matchedVariant ? matchedVariant.inStock : true;
    const isProductInStock = product.inStock && isVariantInStock;

    if (config.inventoryAvailability?.requireInStock !== false && !isProductInStock) {
      const behavior = config.outOfStockBehavior || 'notify-swap';
      return {
        isValid: false,
        status: SUBSCRIPTION_STATES.PRODUCT_UNAVAILABLE,
        errorCode: 'PRODUCT_UNAVAILABLE',
        shopperMessage: interpolate(
          config.messages?.productUnavailable ||
            'This recipe is temporarily resting between small batches and is not currently in stock for auto-ship reservation.',
          { behavior }
        ),
        details: {
          inStock: false,
          outOfStockBehavior: behavior,
        },
      };
    }

    // 4. Product Eligibility Check
    // (a) Check if listed in oneTimeOnlyProducts
    if (config.oneTimeOnlyProducts && config.oneTimeOnlyProducts.includes(product.id)) {
      return {
        isValid: false,
        status: SUBSCRIPTION_STATES.SUBSCRIPTION_NOT_AVAILABLE,
        errorCode: 'PRODUCT_NOT_ELIGIBLE',
        shopperMessage:
          config.messages?.productNotEligible ||
          'This handcrafted item is an artisan one-time provision and is not eligible for recurring auto-ship deliveries.',
        details: { productId: product.id, reason: 'Explicitly marked one-time only' },
      };
    }

    // (b) Check product's subscription.eligible flag
    if (product.subscription?.eligible === false) {
      return {
        isValid: false,
        status: SUBSCRIPTION_STATES.SUBSCRIPTION_NOT_AVAILABLE,
        errorCode: 'PRODUCT_NOT_ELIGIBLE',
        shopperMessage:
          config.messages?.productNotEligible ||
          'This handcrafted item is an artisan one-time provision and is not eligible for recurring auto-ship deliveries.',
        details: { productId: product.id, reason: 'Product metadata not subscription eligible' },
      };
    }

    // (c) Check eligibleProducts whitelist if defined and non-empty
    if (
      config.eligibleProducts &&
      config.eligibleProducts.length > 0 &&
      !config.eligibleProducts.includes('*') &&
      !config.eligibleProducts.includes(product.id)
    ) {
      return {
        isValid: false,
        status: SUBSCRIPTION_STATES.SUBSCRIPTION_NOT_AVAILABLE,
        errorCode: 'PRODUCT_NOT_ELIGIBLE',
        shopperMessage:
          config.messages?.productNotEligible ||
          'This handcrafted item is an artisan one-time provision and is not eligible for recurring auto-ship deliveries.',
        details: { productId: product.id, reason: 'Not in eligible products whitelist' },
      };
    }

    // (d) Check eligibleVariants whitelist if defined and non-empty
    if (
      matchedVariant &&
      config.eligibleVariants &&
      config.eligibleVariants.length > 0 &&
      !config.eligibleVariants.includes(matchedVariant.id)
    ) {
      return {
        isValid: false,
        status: SUBSCRIPTION_STATES.SUBSCRIPTION_NOT_AVAILABLE,
        errorCode: 'PRODUCT_NOT_ELIGIBLE',
        shopperMessage: 'The selected size or flavor is not eligible for recurring auto-ship deliveries.',
        details: { variantId: matchedVariant.id, reason: 'Variant not in eligible variants whitelist' },
      };
    }

    // 5. Frequency Availability Check
    const globalAllowedFrequencies = (config.allowedFrequencies ||
      config.supportedFrequencies ||
      []) as ProductCadence[];
    const productCadences =
      product.subscription?.cadenceOptions && product.subscription.cadenceOptions.length > 0
        ? (product.subscription.cadenceOptions as ProductCadence[])
        : globalAllowedFrequencies;

    const effectiveAllowed = productCadences.filter((c) =>
      globalAllowedFrequencies.includes(c)
    );

    if (!effectiveAllowed.includes(frequency as ProductCadence)) {
      return {
        isValid: false,
        status: SUBSCRIPTION_STATES.INVALID_FREQUENCY,
        errorCode: 'FREQUENCY_UNAVAILABLE',
        shopperMessage: interpolate(
          config.messages?.frequencyUnavailable ||
            "The requested delivery frequency '{frequency}' is not available for this provision. Available frequencies: {allowed}.",
          {
            frequency,
            allowed: effectiveAllowed.join(', '),
          }
        ),
        details: {
          requestedFrequency: frequency,
          allowedFrequencies: effectiveAllowed,
        },
      };
    }

    // 6. Quantity Validation
    const minQty = config.minimumQuantity ?? 1;
    const maxQty = config.maximumQuantity ?? 10;

    if (!Number.isInteger(quantity) || quantity < minQty || quantity > maxQty) {
      return {
        isValid: false,
        status: SUBSCRIPTION_STATES.INVALID_QUANTITY,
        errorCode: 'QUANTITY_INVALID',
        shopperMessage: interpolate(
          config.messages?.quantityInvalid ||
            'Auto-ship deliveries require between {min} and {max} units per delivery cycle to ensure small-batch freshness and fair pantry availability.',
          {
            min: minQty,
            max: maxQty,
          }
        ),
        details: {
          quantity,
          minQuantity: minQty,
          maxQuantity: maxQty,
        },
      };
    }

    // 7. Order Value Limits Validation
    const unitPrice = matchedVariant?.price ?? product.basePrice;
    const lineTotal = Number((unitPrice * quantity).toFixed(2));
    const totalToEvaluate = orderTotal !== undefined ? orderTotal : lineTotal;

    const minOrderVal = config.minimumOrderValue ?? 0;
    const maxOrderVal = config.maximumOrderValue ?? Infinity;

    if (totalToEvaluate < minOrderVal || totalToEvaluate > maxOrderVal) {
      return {
        isValid: false,
        status: SUBSCRIPTION_STATES.INVALID_ORDER_VALUE,
        errorCode: 'ORDER_VALUE_INVALID',
        shopperMessage: interpolate(
          config.messages?.orderValueInvalid ||
            'Auto-ship deliveries require an order subtotal between ${min} and ${max}.',
          {
            min: minOrderVal.toFixed(2),
            max: maxOrderVal.toFixed(2),
          }
        ),
        details: {
          evaluatedTotal: totalToEvaluate,
          minimumOrderValue: minOrderVal,
          maximumOrderValue: maxOrderVal,
        },
      };
    }

    // 8. All Valid!
    return {
      isValid: true,
      status: SUBSCRIPTION_STATES.SUBSCRIPTION_AVAILABLE,
      shopperMessage: '',
      details: {
        effectiveDiscount: product.subscription?.discountPercentage ?? config.defaultDiscountPercentage ?? 10,
        frequency,
        quantity,
      },
    };
  }

  /**
   * Validates if a product can be purchased as ONE-TIME.
   * If a product is subscription-only, one-time purchases are rejected.
   */
  static validateOneTime(product: Product, config: SubscriptionConfigData): SubscriptionValidationResult {
    if (config.subscriptionOnlyProducts && config.subscriptionOnlyProducts.includes(product.id)) {
      return {
        isValid: false,
        status: SUBSCRIPTION_STATES.SUBSCRIPTION_ONLY,
        errorCode: 'SUBSCRIPTION_ONLY',
        shopperMessage:
          config.messages?.subscriptionOnly ||
          'This special pantry batch is an auto-ship exclusive and cannot be purchased as a one-time order.',
        details: {
          productId: product.id,
          reason: 'Product is auto-ship exclusive',
        },
      };
    }

    return {
      isValid: true,
      status: SUBSCRIPTION_STATES.SUBSCRIPTION_AVAILABLE,
      shopperMessage: '',
    };
  }
}
