import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

import { MainNavigationParamList } from '../../navigation/MainNavigation';
import { StackNavigationProp } from '@react-navigation/stack';

type MainNavigationProp = StackNavigationProp<MainNavigationParamList>;

const useFlowNavigation = () => {
  const navigation = useNavigation();
  const mainNavigation = useNavigation<MainNavigationProp>();

  const navigateMain = useCallback(
    (screen: keyof MainNavigationParamList) => {
      mainNavigation.navigate(screen);
    },
    [mainNavigation],
  );

  const navigateGoBack = useCallback(() => navigation.goBack(), [navigation]);

  return { navigateMain, navigateGoBack };
};

export default useFlowNavigation;
