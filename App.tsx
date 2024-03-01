import './src/helper/multiLanguageSetting';

import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';

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

import { store, persistor } from './src/redux/store';

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
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister: asyncStoragePersister }}>
          <NavigationContainer>
            <PaperProvider theme={theme}>
              <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView style={styles.keyboardAvoidingContainer}>
                  <FlowProvider>
                    <View>
                      <Text>App</Text>
                    </View>
                  </FlowProvider>
                </KeyboardAvoidingView>
              </SafeAreaView>
            </PaperProvider>
          </NavigationContainer>
        </PersistQueryClientProvider>
      </PersistGate>
    </Provider>
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
