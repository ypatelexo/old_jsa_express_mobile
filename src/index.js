import React, {Component} from 'react';
import {View, StyleSheet, StatusBar, Platform} from 'react-native';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers from './common/reducers';
import {AppNavigator} from './common/navigators/AppNavigator';
import {THEME_COLOR} from '../helper/Constant';
import FlashMessage from 'react-native-flash-message';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
    return (
      <Provider store={store}>
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
          <AppNavigator />
          <FlashMessage position="top" />
        </View>
      </Provider>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBarUnderlay: {
    height: 1,
    backgroundColor: THEME_COLOR,
  },
});
export default App;
