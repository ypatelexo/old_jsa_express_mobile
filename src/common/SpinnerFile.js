import React from 'react';
import {View, ActivityIndicator,ImageBackground,Platform,Text, StatusBar} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Loader from 'react-native-spinkit';

import { getStatusBarHeight } from 'react-native-status-bar-height';
import { THEME_COLOR } from '../../helper/Constant';

const SpinnerFile = ({visible}) => {
  console.log("height",getStatusBarHeight(),visible);

  return (
    <Spinner visible={visible}>
      <View style={{alignItems:'center',justifyContent:'center',flex:1}}>
      <View style={{alignItems:'center',justifyContent:'center',flex:1}}>
      {/* <Text style={{
        color:THEME_COLOR,
        textShadowColor: 'white', 
        textShadowRadius: 1, 
        textShadowOffset: { 
          width: 0.3,
          height: 0.3
        }, 
         elevation:3,
        shadowColor:'white',
        fontSize:24,
        fontWeight:'bold'
        }}>JSA</Text> */}
      </View>
      <View style={styles.overlay}>
      <Loader
            style={{fontWeight: 'bold'}}
            isVisible={visible}
            size={(Platform.OS == 'ios') ? 70 :120}
            type="FadingCircleAlt"
            color="#3d3d3d"
          ></Loader>
      </View>
      </View>
    </Spinner>
  );
};
// ChasingDots,FadingCircleAlt,ThreeBounce,WanderingCubes

const styles = {
  spinnerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent:'center',
    padding: 5,
    backgroundColor: 'rgba(1,1,1,.4)'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    elevation: 0,
    justifyContent:'center',
    alignItems:'center'
  }
};

export default SpinnerFile;