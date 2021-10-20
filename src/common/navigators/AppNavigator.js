import React from 'react';
import {connect} from 'react-redux';
import {createRootNavigator} from './RootNavigator';
import {checkUserAuth} from '../actions';
import {View} from 'react-native';
import Spinner from '../../common/SpinnerFile';
class AppNav extends React.Component {
  constructor(props) {
    super(props);
    //Firebase uses a timer for some of the requests.
    //This stops the warning from popping up
  }

  componentWillMount() {
    // this.props.logout();
    this.props.checkUserAuth();
  }

  render() {
    const {isLoggedIn, hasCheckedAuthState} = this.props;

    if (!hasCheckedAuthState) {
      return null;
    } else {
      if (isLoggedIn == '') {
        return <View />;
      } else {
        const Layout = createRootNavigator(isLoggedIn);
        return <Layout />;
      }
    }
  }
}

const mapStateToProps = state => {
  console.log('====================================');
  console.log(state);
  console.log('====================================');
  return {
    isLoggedIn: state.Auth.isLoggedIn,
    hasCheckedAuthState: state.Auth.hasCheckedAuthState,
  };
};

export const AppNavigator = connect(
  mapStateToProps,
  {checkUserAuth},
)(AppNav);
