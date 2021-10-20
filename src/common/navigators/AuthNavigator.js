import {createStackNavigator} from 'react-navigation-stack';

import Login from '../../pages/LoginScreen/Login';

export default createStackNavigator(
  {
    LogIn: {
      screen: Login,
    },
  },
  {
    navigationOptions: ({navigation}) => ({
      title: '',
    }),
    animationEnabled: false,
    swipeEnabled: false,
    headerMode: 'screen',
    headerLayoutPreset: 'center',
  },
);
