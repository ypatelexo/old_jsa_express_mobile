import {createAppContainer, createSwitchNavigator} from 'react-navigation';

import AuthNavigator from './AuthNavigator';
import SignedInNavigator from './SignedInNavigator';

export const createRootNavigator = signedIn => {
  return createAppContainer(
    createSwitchNavigator(
      {
        SignedIn: SignedInNavigator,
        SignedOut: AuthNavigator,
      },
      {
        initialRouteName: signedIn == 'true' ? 'SignedIn' : 'SignedOut',
      },
    ),
  );
};
