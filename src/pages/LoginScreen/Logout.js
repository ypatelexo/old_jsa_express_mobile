import React, { Component } from 'react'
import { Text, View, TouchableOpacity, AsyncStorage, Alert } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import LogoutIcon from 'react-native-vector-icons/AntDesign'
import { updateLoginFlag } from '../../common/actions';
import { connect } from 'react-redux';
import { StackActions, NavigationActions } from 'react-navigation';
export class Logout extends Component {
  render() {
    return (
      <View style={{ marginRight: 16 }}>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "Sign Out",
              "Are you sure you want to sign out?",
              [
                {
                  text: "Cancel",
                  onPress: () => { },
                  style: "cancel"
                },
                {
                  text: "Sign out",
                  onPress: async () => {
                    await AsyncStorage.clear();
                    this.props.updateLoginFlag('false',{});
                    const resetAction = StackActions.reset({
                      index: 0,
                      actions: [
                        NavigationActions.navigate({
                          routeName: "LogIn"
                        }),

                      ]
                    });
                    this.props.navigation.dispatch(resetAction);
                  }
                }
              ],
              { cancelable: true }
            );

          }}
        >
          <LogoutIcon name="poweroff" size={25} color="black" />
        </TouchableOpacity>
      </View>
    )
  }
}

export default Logout = connect(()=>{return{}}, { updateLoginFlag })(Logout);
