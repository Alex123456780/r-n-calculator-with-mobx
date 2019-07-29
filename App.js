import React from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView
} from "react-native";
import { Provider as MobXProvider } from 'mobx-react/native';

import {
  CalculatorStore
} from './src/stores';

import { Calculator } from './src/components';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const App = () => (
  <MobXProvider calc_store={CalculatorStore}>
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Calculator/>
      </View>
    </SafeAreaView>
  </MobXProvider>
)

export default App;