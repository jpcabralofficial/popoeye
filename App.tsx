import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import './src/common/helpers/multiLanguageSetting';

import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';

import { Provider as PaperProvider } from 'react-native-paper';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import { NavigationContainer } from '@react-navigation/native';

import { theme } from './src/theme/theme';

import { FlowProvider } from './src/context/flow';

import { store, persistor } from './src/common/redux/store';

import MainNavigation from './src/navigation/MainNavigation';
import { NativeBaseProvider } from 'native-base';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24,
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

const App = () => {
  SystemNavigationBar.navigationHide();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar backgroundColor={theme.colors.background} hidden />
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister: asyncStoragePersister }}>
            <NavigationContainer>
              <NativeBaseProvider>
                <PaperProvider theme={theme}>
                  <SafeAreaView style={styles.container}>
                    <KeyboardAvoidingView
                      style={styles.keyboardAvoidingContainer}>
                      <FlowProvider>
                        <MainNavigation />
                      </FlowProvider>
                    </KeyboardAvoidingView>
                  </SafeAreaView>
                </PaperProvider>
              </NativeBaseProvider>
            </NavigationContainer>
          </PersistQueryClientProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingContainer: {
    flexGrow: 1,
  },
});

export default App;
