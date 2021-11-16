import React, { Component } from 'react';
import {
  Text,
  View,
  ImageBackground,
  TextInput,
  Platform,
  Button,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  Alert,
  PermissionsAndroid,
  AsyncStorage
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from "react-redux";
import Spinner from 'react-native-spinkit';
import Icons from 'react-native-vector-icons/FontAwesome';
import { SIGN_IN_URL, RESET_PASSWORD_LINK } from '../../../helper/Constant';
import {
  THEME_FONT
} from '../../../helper/Constant';
//import {THEME_COLOR, THEME_FONT, URL} from '../helper/CommonVariable';

import {

  updateLoginFlag,

} from '../../common/actions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


export class Login extends Component {
  successReset="Password reset link sent,please check your mail!";
  state = {
    username: '',
    password: '',
    btnDisable: false,
    loading: false,
    NotMatchFlag: false,
    errorMsg: '',
    orientation: '',
    height1: 0,
    width1: 0,
    usernameErr: '',
    passwordErr: '',
    ResetPwdView: false
  };

  static navigationOptions = {
    header: null
  }
  //For storing data in AsyncStorage
  storeData = async data => {
    console.log('imageinlogin', data);

    try {
      //for storing into reducer state
      //this.props.getUserDetail(data);
      this.props.updateLoginFlag('true',data);

      await AsyncStorage.setItem('LoginFlag', 'true');

      //Storing Images in asyncstorage and in global variable

      await AsyncStorage.setItem('userData', JSON.stringify(data));

      this.props.navigation.navigate('FilterScreen');
    } catch (error) {
      // Error saving data
    }
  };

  //For empty check in username and password

  //lOGIN CALL
  userLogin() {


    //alert("hi")
    //return;
    const formdata = new FormData(this);

    formdata.append('loginDetails', JSON.stringify({
      email: this.state.username,
      password: this.state.password
    }));

    console.log("formdata", formdata, SIGN_IN_URL);

    this.setState({ loading: true });
    fetch(`${SIGN_IN_URL}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: formdata,
    }, 20000)
      .then(response => response.json())
      .then(responseJson => {
        console.log('responsejson', responseJson);
        this.setState({ loading: false });
        if (responseJson.CODE === "1") {
          this.setState({
            NotMatchFlag: false,
          });

          if (responseJson.RESPONSE) {
            this.storeData(responseJson.RESPONSE);
          }
        } else {
          console.log('error', responseJson.msg);
          this.setState({
            NotMatchFlag: true,
            errorMsg: "User does not exists!",
          });
        }
      })
      .catch(error => {
        this.setState({ loading: false });
        console.log('error', error);
      });
  }

  resetPassword = () => {

    const formdata = new FormData(this);

    formdata.append('emailDetail', JSON.stringify({
      email: this.state.username
    }));

    console.log("formdata", formdata);

    this.setState({ loading: true });
    fetch(`${RESET_PASSWORD_LINK}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',

      },
      body: formdata,
    }, 20000)
      .then(response => response.json())
      .then(responseJson => {
        console.log('responsejson', responseJson);
        this.setState({ loading: false });
        if (responseJson.CODE === "1") {
          this.setState({
            NotMatchFlag: true,
            errorMsg: this.successReset

          });



        } else {
          console.log('error', responseJson.msg);
          this.setState({
            NotMatchFlag: true,
            errorMsg: "User does not exists!",
          });
        }
      })
      .catch(error => {
        this.setState({ loading: false });
        console.log('error', error);
      });




  }
  getOrientation = (width, height) => {
    console.log('isLandscape....12212', this.state.orientation, height);
    if (width < height) {
      this.setState({ orientation: 'portrait' });
    } else {
      this.setState({ orientation: 'landscape' });
    }

    this.setState({ height1: height, width1: width });
    console.log(
      'isLandscape',
      this.state.orientation,
      this.state.istablet
    );
  };

  renderView() {
    return (
      <ImageBackground
        source={require('../../Assets/images/login-Screen-background.png')}
        style={styles.backgroundImage}
        onLayout={event =>
          this.getOrientation(
            event.nativeEvent.layout.width,
            event.nativeEvent.layout.height,
          )
        }>
        <KeyboardAwareScrollView scrollEnabled={false}>
          <View
            style={[
              styles.containerViewStyle,
              {
                height:
                  this.state.orientation == 'landscape'
                    ? '100%'
                    : this.state.height1,
                width:
                  this.state.orientation == 'landscape'
                    ? '100%'
                    : this.state.width1,
              },
            ]}>

            {/* Text Views */}
            <View style={styles.formStyle}>
              {/* View for username textinput */}
              <View
                style={[
                  styles.viewStyle,
                  {
                    marginBottom:0,
                  },
                ]}>
                <Text style={styles.labelTextStyle}>Username</Text>
                <TextInput
                  ref={input => {
                    this.usernameTextInput = input;
                  }}
                  style={styles.textInputStyle}
                  onChangeText={text =>
                    this.setState({ username: text, usernameErr: '', errorMsg: '' })
                  }
                  onEndEditing={() => {
                    if(this.state.ResetPwdView==false){
                    this.passwordTextInput.focus();
                  }
                  }}
                  value={this.state.username}
                  keyboardType={'email-address'}
                  autoCapitalize={'none'}
                />
                <Text style={styles.errorMessageStyle}>
                  {this.state.usernameErr}
                </Text>
              </View>

              {/* View for password textinput */}
              {(this.state.ResetPwdView) ? null :
                <View
                  style={[
                    styles.viewStyle,
                    {
                      marginBottom:0,
                    },
                  ]}>
                  <Text style={styles.labelTextStyle}>Password</Text>
                  <TextInput
                    ref={input => {
                      this.passwordTextInput = input;
                    }}
                    style={styles.textInputStyle}
                    onChangeText={text =>
                      this.setState({ password: text, passwordErr: '', errorMsg: '' })
                    }
                    value={this.state.password}
                    secureTextEntry={true}
                    returnKeyType="done"
                  />
                  <Text style={styles.errorMessageStyle}>
                    {this.state.passwordErr}
                  </Text>
                </View>
              }
              <View style={{ alignItems: 'flex-start', width: '90%' }}>
                {this.state.NotMatchFlag == true ? (
                  <Text style={[styles.errorMessageStyle,{textShadowColor:(this.state.errorMsg==this.successReset)?'green':'white'}]}>
                    {this.state.errorMsg}
                  </Text>
                ) : null}
              </View>

              {/* view for login button */}
             
               
              <TouchableOpacity
                style={{ marginTop: '2%', width: '90%', backgroundColor: 'grey'}}
                onPress={() => {
                  if (this.state.loading == false) {
                    let success = true;

                    if (this.state.username == '') {
                      success = false
                      this.setState({ usernameErr: 'Username is required!' })

                    }

                    if (this.state.password == '' && this.state.ResetPwdView == false) {
                      success = false
                      this.setState({ passwordErr: 'Password is required!' })

                    }

                    if (success)
                      (this.state.ResetPwdView) ?
                        this.resetPassword()

                        :
                        this.userLogin();

                  }
                  //For Navigating to Home page
                }}>
                  {this.state.loading === false ? (
                  <LinearGradient colors={["#666666", '#4c4c4c', '#000000']} style={{padding:10,justifyContent:'center',alignItems:'center'}}>
            
                    <Text style={styles.loginButtonStyle}>{(this.state.ResetPwdView) ? `Reset Password` : `Login`}</Text>
              </LinearGradient>
                                    
                                  ) : (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        
                      }}>
                      <Spinner
                        style={{ fontWeight: 'bold', alignSelf: 'center' }}
                        isVisible={true}
                        size={30}
                        type="ThreeBounce"
                        color="#fff"
                      />
                    </View>
                  )}
                  </TouchableOpacity>
                  
          

              <View style={{ padding: 10 }}>
                <TouchableOpacity onPress={() => {
                  if (this.state.loading == false) {
                    this.setState({
                      ResetPwdView: !this.state.ResetPwdView,
                      username: '',
                      NotMatchFlag: false,
                      errorMsg: '',
                      usernameErr: ''
                    })
                  }
                  
                }}>
                  <Text>{(this.state.ResetPwdView) ? `Go to Login->` : `Reset the Password?`}</Text>
                </TouchableOpacity>

              </View>
            </View>
          </View>

        </KeyboardAwareScrollView>
        </ImageBackground>

    );
  }
  render() {
    return this.renderView();
  }
}

//Syles for view used above
export const styles = {
  //main View
  containerViewStyle: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'rgba(1,1,1,.1)',
  },
  headingTextStyle: {
    fontSize: 30,
    color: '#0097e8',
    fontFamily: THEME_FONT,
    alignSelf: 'center',
  },
  labelTextStyle: {
    fontSize: 15,
    color: '#fff',
    marginBottom: 8,
    fontFamily: THEME_FONT,
    fontWeight:'bold'
  },
  textInputStyle: {
    paddingLeft:10,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: '#fff',
    color: '#000',
    padding: 5,
    borderRadius: 5,
    fontSize: 15,
    fontFamily: THEME_FONT,
  },
  loginButtonStyle: {
    fontSize: 15,
    color: '#fff',
   
    fontFamily: THEME_FONT,
    
  },
  formStyle: {
    flexDirection: 'column',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop:20,
 
  },
  touchableOpacityStyle: {
    borderRadius: 5,

    backgroundColor: 'grey',
    flexDirection: 'row',
    height: '12%',
    width: '90%',
    alignItems: 'center',
    alignContent: 'center',
  },
  errorMessageStyle: {
    color: 'white',
    textShadowRadius:50,
    fontFamily: THEME_FONT,
    textShadowColor:'red'

  },
  viewStyle: {
   
    width: '90%',
  },
  backgroundImage: {
    height: '100%',
    width: '100%',
    // backgroundColor:'#000aaa',
    // or 'stretch'
  },
};

const mapStateToProps = state => {
  return {}
}

export default Login = connect(mapStateToProps, {
  updateLoginFlag
})(Login);
