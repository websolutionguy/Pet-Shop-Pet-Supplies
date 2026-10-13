import { SubscriptionValidator, validateSubscriptionConfig } from '../src/services/subscriptionValidator';
import { subscriptionService } from '../src/services/subscriptionService';
import { productService } from '../src/services/productService';
import rawConfig from '../src/data/subscription-config.json';
import { SubscriptionConfigData } from '../src/types/data';
import { Product } from '../src/types/product';

async function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING ROWAN & HOUND SUBSCRIPTION SYSTEM TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, details?: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      if (details) console.error(`   Details: ${details}`);
      failed++;
    }
  }

  const baseConfig = JSON.parse(JSON.stringify(rawConfig)) as SubscriptionConfigData;
  const eligibleProduct = await productService.getById('prod-venison-ancient-grains');
  const oneTimeCraftProduct = await productService.getById('prod-bridle-leather-canvas-leash');
  const outOfStockProduct: Product = {
    ...(eligibleProduct as Product),
    id: 'prod-test-out-of-stock',
    inStock: false,
  };

  if (!eligibleProduct) {
    throw new Error('Could not load prod-venison-ancient-grains for testing.');
  }

  // -------------------------------------------------------------------------
  // TEST 1: Baseline Valid Subscription
  // -------------------------------------------------------------------------
  console.log('--- Scenario 0: Baseline Valid Auto-Ship ---');
  const validResult = SubscriptionValidator.validate({
    product: eligibleProduct,
    quantity: 2,
    frequency: '4-weeks',
    config: baseConfig,
  });
  assert(
    validResult.isValid === true && validResult.status === 'SUBSCRIPTION_AVAILABLE',
    'Standard in-stock recipe with valid cadence & quantity is approved',
    `Received: ${validResult.status} (${validResult.shopperMessage})`
  );

  // -------------------------------------------------------------------------
  // TEST 2: Product Not Eligible
  // -------------------------------------------------------------------------
  console.log('\n--- Scenario 1: Product Not Eligible ---');
  const notEligibleResult = SubscriptionValidator.validate({
    product: oneTimeCraftProduct,
    quantity: 1,
    frequency: '4-weeks',
    config: baseConfig,
  });
  assert(
    notEligibleResult.isValid === false &&
      notEligibleResult.errorCode === 'PRODUCT_NOT_ELIGIBLE',
    'One-time artisan leather gear is rejected from recurring auto-ship',
    `Message: "${notEligibleResult.shopperMessage}"`
  );
  assert(
    notEligibleResult.shopperMessage.includes('one-time provision'),
    'Shopper message clearly states item is one-time only',
    `Message: "${notEligibleResult.shopperMessage}"`
  );

  // -------------------------------------------------------------------------
  // TEST 3: Frequency Unavailable
  // -------------------------------------------------------------------------
  console.log('\n--- Scenario 2: Frequency Unavailable ---');
  const invalidFreqResult = SubscriptionValidator.validate({
    product: eligibleProduct,
    quantity: 1,
    frequency: '1-week', // Not in ['2-weeks', '4-weeks', '6-weeks', '8-weeks']
    config: baseConfig,
  });
  assert(
    invalidFreqResult.isValid === false &&
      invalidFreqResult.errorCode === 'FREQUENCY_UNAVAILABLE',
    'Unsupported frequency "1-week" is rejected',
    `Status: ${invalidFreqResult.status}, ErrorCode: ${invalidFreqResult.errorCode}`
  );
  assert(
    invalidFreqResult.shopperMessage.includes("1-week") &&
      invalidFreqResult.shopperMessage.includes("Available frequencies:"),
    'Shopper message names invalid frequency and lists available options',
    `Message: "${invalidFreqResult.shopperMessage}"`
  );

  // -------------------------------------------------------------------------
  // TEST 4: Quantity Invalid
  // -------------------------------------------------------------------------
  console.log('\n--- Scenario 3: Quantity Invalid ---');
  const zeroQtyResult = SubscriptionValidator.validate({
    product: eligibleProduct,
    quantity: 0,
    frequency: '4-weeks',
    config: baseConfig,
  });
  assert(
    zeroQtyResult.isValid === false && zeroQtyResult.errorCode === 'QUANTITY_INVALID',
    'Quantity 0 is rejected as below minimum',
    `Message: "${zeroQtyResult.shopperMessage}"`
  );

  const excessiveQtyResult = SubscriptionValidator.validate({
    product: eligibleProduct,
    quantity: 25, // Maximum is 10
    frequency: '4-weeks',
    config: baseConfig,
  });
  assert(
    excessiveQtyResult.isValid === false &&
      excessiveQtyResult.errorCode === 'QUANTITY_INVALID',
    'Quantity 25 is rejected as exceeding freshness/wholesale limit of 10',
    `Message: "${excessiveQtyResult.shopperMessage}"`
  );
  assert(
    excessiveQtyResult.shopperMessage.includes("between 1 and 10"),
    'Shopper message communicates friendly quantity boundaries',
    `Message: "${excessiveQtyResult.shopperMessage}"`
  );

  // -------------------------------------------------------------------------
  // TEST 5: Product Unavailable (Out of Stock / Uncataloged)
  // -------------------------------------------------------------------------
  console.log('\n--- Scenario 4: Product Unavailable ---');
  const oosResult = SubscriptionValidator.validate({
    product: outOfStockProduct,
    quantity: 1,
    frequency: '4-weeks',
    config: baseConfig,
  });
  assert(
    oosResult.isValid === false && oosResult.errorCode === 'PRODUCT_UNAVAILABLE',
    'Out of stock product is rejected for auto-ship reservation',
    `Message: "${oosResult.shopperMessage}"`
  );
  assert(
    oosResult.shopperMessage.includes('out of stock') ||
      oosResult.shopperMessage.includes('resting between small batches'),
    'Shopper message gently explains stock status without technical jargon',
    `Message: "${oosResult.shopperMessage}"`
  );

  const nullProdResult = SubscriptionValidator.validate({
    product: null,
    quantity: 1,
    frequency: '4-weeks',
    config: baseConfig,
  });
  assert(
    nullProdResult.isValid === false && nullProdResult.errorCode === 'PRODUCT_UNAVAILABLE',
    'Uncataloged/missing product returns clear unavailable error'
  );

  // -------------------------------------------------------------------------
  // TEST 6: Subscription Program Disabled
  // -------------------------------------------------------------------------
  console.log('\n--- Scenario 5: Subscription Disabled ---');
  const disabledConfig: SubscriptionConfigData = {
    ...baseConfig,
    enabled: false,
  };
  const disabledResult = SubscriptionValidator.validate({
    product: eligibleProduct,
    quantity: 1,
    frequency: '4-weeks',
    config: disabledConfig,
  });
  assert(
    disabledResult.isValid === false &&
      disabledResult.errorCode === 'SUBSCRIPTION_DISABLED',
    'Master disabled switch cleanly blocks auto-ship enrollment',
    `Status: ${disabledResult.status}`
  );
  assert(
    disabledResult.shopperMessage.includes('temporarily paused') ||
      disabledResult.shopperMessage.includes('maintenance'),
    'Shopper message offers reassurance and directs shopper to one-time purchase',
    `Message: "${disabledResult.shopperMessage}"`
  );

  // -------------------------------------------------------------------------
  // TEST 7: Invalid Configuration
  // -------------------------------------------------------------------------
  console.log('\n--- Scenario 6: Invalid Configuration ---');
  const malformedConfig = {
    enabled: true,
    allowedFrequencies: [], // Invalid: empty frequencies
    defaultFrequency: 'non-existent',
    minimumQuantity: 5,
    maximumQuantity: 2, // Invalid: min > max
  } as any;

  const configValidation = validateSubscriptionConfig(malformedConfig);
  assert(
    configValidation.isValid === false && configValidation.errors.length >= 2,
    'validateSubscriptionConfig catches malformed config parameters',
    `Detected errors: ${configValidation.errors.join('; ')}`
  );

  const invalidConfigResult = SubscriptionValidator.validate({
    product: eligibleProduct,
    quantity: 1,
    frequency: '4-weeks',
    config: malformedConfig,
  });
  assert(
    invalidConfigResult.isValid === false &&
      invalidConfigResult.errorCode === 'INVALID_CONFIGURATION',
    'Validator rejects operations with malformed config and provides shopper care message',
    `Message: "${invalidConfigResult.shopperMessage}"`
  );

  // -------------------------------------------------------------------------
  // TEST 8: Order Value Bounds
  // -------------------------------------------------------------------------
  console.log('\n--- Scenario 7: Minimum & Maximum Order Values ---');
  const lowValueResult = SubscriptionValidator.validate({
    product: eligibleProduct,
    quantity: 1,
    frequency: '4-weeks',
    config: {
      ...baseConfig,
      minimumOrderValue: 50.0, // base price is $34
    },
    orderTotal: 34.0,
  });
  assert(
    lowValueResult.isValid === false && lowValueResult.errorCode === 'ORDER_VALUE_INVALID',
    'Order below minimum order value ($50) is flagged with clear threshold requirement',
    `Message: "${lowValueResult.shopperMessage}"`
  );

  // -------------------------------------------------------------------------
  // TEST 9: Subscription-Only Product (One-Time Rejection)
  // -------------------------------------------------------------------------
  console.log('\n--- Scenario 8: Subscription-Only Product ---');
  const subOnlyProduct = await productService.getById('prod-chamomile-calming-bites');
  if (subOnlyProduct) {
    const oneTimeCheck = SubscriptionValidator.validateOneTime(subOnlyProduct, baseConfig);
    assert(
      oneTimeCheck.isValid === false && oneTimeCheck.errorCode === 'SUBSCRIPTION_ONLY',
      'Auto-ship exclusive product correctly rejects one-time purchases',
      `Message: "${oneTimeCheck.shopperMessage}"`
    );
  }

  // -------------------------------------------------------------------------
  // TEST 10: Service Layer calculatePrice Integration
  // -------------------------------------------------------------------------
  console.log('\n--- Scenario 9: Service Integration via calculatePrice ---');
  const priceCalculation = await subscriptionService.calculatePrice({
    productId: 'prod-venison-ancient-grains',
    quantity: 2,
    frequency: '4-weeks',
  });
  assert(
    priceCalculation.isEligible === true &&
      priceCalculation.status === 'SUBSCRIPTION_AVAILABLE' &&
      priceCalculation.discountPercentage === 10,
    'subscriptionService.calculatePrice calculates 10% discount and confirms eligibility'
  );

  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS: ${passed} passed, ${failed} failed`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
