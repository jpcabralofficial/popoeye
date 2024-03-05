import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

/* SCREENS*/
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import ScanMembershipScreen from '../screens/scan-membership/ScanMembershipScreen';
import FulfillmentScreen from '../screens/fulfillment/FulfillmentScreen';
import ProductScreen from '../screens/product/ProductScreen';
import CancelOrderScreen from '../screens/cancel-order/CancelOrderScreen';
import TypeOfPaymentScreen from '../screens/type-of-payment/TypeOfPaymentScreen';
import ModeOfPaymentScreen from '../screens/mode-of-payment/ModeOfPaymentScreen';
import CashlessPaymentScreen from '../screens/cashless/CashlessPaymentScreen';
import InstructionPaymentScreen from '../screens/instruction-payment/InstructionPaymentScreen';
import OrderSuccessfulScreen from '../screens/order-sucessful/OrderSuccessfulScreen';
import MyBagScreen from '../screens/my-bag/MyBagScreen';

/* STACK NAVIGATIONS */
import {
  ONBOARDING_NAV,
  SCAN_MEMBERSHIP_NAV,
  FULFILLMENT_NAV,
  PRODUCT_NAV,
  CANCEL_ORDER,
  TYPE_OF_PAYMENT,
  MODE_OF_PAYMENT,
  CASHLESS_PAYMENT,
  INSTRUCTION_PAYMENT,
  ORDER_SUCCESSFUL,
  MY_BAG,
} from '../utils/navigation';

const Stack = createStackNavigator();

const MainNavigation = () => {
  return (
    <Stack.Navigator initialRouteName={ONBOARDING_NAV}>
      <Stack.Screen
        name={ONBOARDING_NAV}
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={SCAN_MEMBERSHIP_NAV}
        component={ScanMembershipScreen}
        options={{ headerShown: false, presentation: 'transparentModal' }}
      />

      <Stack.Screen
        name={FULFILLMENT_NAV}
        component={FulfillmentScreen}
        options={{ headerShown: false, presentation: 'modal' }}
      />

      <Stack.Screen
        name={PRODUCT_NAV}
        component={ProductScreen}
        options={{ headerShown: false, presentation: 'modal' }}
      />

      <Stack.Screen
        name={MY_BAG}
        component={MyBagScreen}
        options={{ headerShown: false, presentation: 'modal' }}
      />

      <Stack.Screen
        name={CANCEL_ORDER}
        component={CancelOrderScreen}
        options={{ headerShown: false, presentation: 'modal' }}
      />

      <Stack.Screen
        name={TYPE_OF_PAYMENT}
        component={TypeOfPaymentScreen}
        options={{ headerShown: false, presentation: 'transparentModal' }}
      />

      <Stack.Screen
        name={MODE_OF_PAYMENT}
        component={ModeOfPaymentScreen}
        options={{ headerShown: false, presentation: 'transparentModal' }}
      />

      <Stack.Screen
        name={CASHLESS_PAYMENT}
        component={CashlessPaymentScreen}
        options={{ headerShown: false, presentation: 'transparentModal' }}
      />

      <Stack.Screen
        name={INSTRUCTION_PAYMENT}
        component={InstructionPaymentScreen}
        options={{ headerShown: false, presentation: 'modal' }}
      />

      <Stack.Screen
        name={ORDER_SUCCESSFUL}
        component={OrderSuccessfulScreen}
        options={{ headerShown: false, presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
};
export default MainNavigation;
