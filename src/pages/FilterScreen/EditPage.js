/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {THEME_FONT , THEME_COLOR ,TEXT_COLOR} from '../../../helper/Constant';
import {UPDATE_RECORDS} from '../../../helper/Constant';
import Spinner from '../../common/SpinnerFile';
import {connect} from 'react-redux';
import {showMessage} from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export class EditPage extends Component {
  state = {
    vehicle: '',
    origID: '',
    destId: '',
    miles: '',
    driver1: '',
    driver2: '',
    trailer1: '',
    trailer2: '',
    loading: false,
    Dolly:''
  };

  // {---stack navigation options---}
  static navigationOptions = ({navigation}) => {
    const {params} = navigation.state;

    return {
      title: 'Edit Records',
      headerLeft: (
        <TouchableOpacity
          onPress={() => {
            navigation.pop();
          }}>
          <Text style={[styles.headerTextStyle, {marginLeft: 10}]}>BACK</Text>
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity
          onPress={() => {
            params.updateRecord(navigation);
          }}>
          <Text style={[styles.headerTextStyle, {marginRight: 10}]}>SAVE</Text>
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: '#fff',
        borderBottomWidth: 0,
        shadowOpacity: 0,
        elevation: 0,
        fontStyle:THEME_FONT
      },
      // headerTintColor: "#fff"
    };
  };

  componentWillMount() {
    const {params} = this.props.navigation.state;
    console.log('datawill', params);

    if (params != undefined && params.data != undefined) {
      this.setState({
        vehicle: params.data.equipment_id,
        origID: params.data.macroBody_dispatchNum,
        destId: params.data.macroBody_companyCode,
        miles: params.data.floatQualcommTotalMiles,
        driver1: params.data.driverID,
        driver2: params.data.macroBody_driverId,
        trailer1: (params.data.macroBody_qhosTrailer1=="NONE")?
        ''
        :
        params.data.macroBody_qhosTrailer1,

        trailer2: (params.data.macroBody_qhosTrailer2=="NONE")?
        ''
        :
        params.data.macroBody_qhosTrailer2,
        
        Dolly: (params.data.macroBody_qhosTrailer3=="NONE")?
        ''
        :
        params.data.macroBody_qhosTrailer3
      });
    }
  }

  setSelectedDriver1 = Tdriver => {
    this.setState({driver1: Tdriver.id});
  };

  setSelectedDriver2 = Tdriver => {
    this.setState({driver2: Tdriver.id});
  };

  setSelectedVehicle = Tvehicle => {
    this.setState({vehicle: Tvehicle.id});
  };

  updateRecords = navigation => {
   
    const {params} = navigation.state;

    if(this.state.trailer2 !=""){
      if(this.state.Dolly == ""){        
          showMessage({
            message: 'Please enter dolly no.',
            type: 'info',
            animated: 'true',
            floating: 'true',
            icon: 'info',
          });
          return;
      }      
    } 

    this.setState({loading: true});   

    const formdata = new FormData(this);

    formdata.append(
      'editQualcommData',
      JSON.stringify({
        vehicleNumber: this.state.vehicle,
        origID: this.state.origID,
        destID: this.state.destId,
        miles: this.state.miles,
        driver1Edit: this.state.driver1,
        driver2Edit: this.state.driver2,
        trailer1Edit: (this.state.trailer1=='')?
        (params.data.macroBody_qhosTrailer1=="NONE")?
        'NONE':
        ''
        :
        this.state.trailer1
        ,
        trailer2Edit: (this.state.trailer2=='')?
        (params.data.macroBody_qhosTrailer2=="NONE")?
        'NONE':
        ''
        :
        this.state.trailer2
        ,
        macroBody_qhosTrailer3:(this.state.Dolly=='')?
        (params.data.macroBody_qhosTrailer3=="NONE")?
        'NONE':
        ''
        :
        this.state.Dolly
        ,
        loginIdOfUser: this.props.user.customerId,
        omnitracsId: params.omnitracs_id,
        ownerId: this.props.user.customerId,
      }),
    );

    console.log('formdata', formdata);

    fetch(
      `${UPDATE_RECORDS}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formdata,
      },
      20000,
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log('responsejson.....', responseJson);
        this.setState({loading: false});

        if (responseJson.CODE === '1') {
          try {
            this.setState({loading: false});
            showMessage({
              message: 'Update Successfully ',
              type: 'success',
              animated: 'true',
              floating: 'true',
              icon: 'success',
            });
            navigation.pop();
            params.getRecords(params.omnitracs_id);
            params.fetchrecords('EditScreen');
          } catch (error) {
            this.setState({loading: false});
            console.warn(error);
          }
        } else {
          this.setState({loading: false});
        }
      })
      .catch(error => {
        this.setState({loading: false});
        console.log('error', error);
      });
  };

  componentDidMount() {
    this.props.navigation.setParams({
      updateRecord: this.updateRecords,
    });
  }

  renderView() {
    return (
      <Animatable.View
        style={[
          DownContenStyle.ContentStyle,
          {
            flexDirection: 'column',
            flex: 1,
            marginTop: '1%',
            marginBottom: '1%',
            marginLeft: '3%',
            marginRight: '3%',
            padding: 5,
            paddingBottom: 20
          },
        ]}
        animation="fadeInUp">
        <Spinner visible={this.state.loading} />
        <ScrollView>
          <View style={styles.ContentTextStyle}>
            <Text style={styles.TextStyle}>Vehicles #:</Text>
            <View style={styles.viewStyle}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('SelectVehicle', {
                    setSelectedVehicle: this.setSelectedVehicle,
                    selectedVehicle: this.state.vehicle,
                    incoming:'edit'
                  });
                }}
                style={{ flex: 1, flexDirection: 'row' }}>
                <Text style={styles.inputTextStyle}>
                  {this.state.vehicle}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.ContentTextStyle}>
            <Text style={styles.TextStyle}>Orig ID:</Text>
            <View style={styles.viewStyle}>
              <TextInput
                style={styles.inputTextStyle}
                onChangeText={text => {
                  this.setState({ origID: text });
                }}
                value={this.state.origID}
              />
            </View>
          </View>
          <View style={styles.ContentTextStyle}>
            <Text style={styles.TextStyle}>Dest ID:</Text>
            <View style={styles.viewStyle}>
              <TextInput
                style={styles.inputTextStyle}
                onChangeText={text => {
                  this.setState({ destId: text });
                }}
                value={this.state.destId}
              />
            </View>
          </View>
          <View style={styles.ContentTextStyle}>
            <Text style={styles.TextStyle}>Miles:</Text>
            <View style={styles.viewStyle}>
              <TextInput
                style={styles.inputTextStyle}
                onChangeText={text => {
                  this.setState({ miles: text });
                }}
                keyboardType="numeric"
                value={this.state.miles}
              />
            </View>
          </View>
          <View style={styles.ContentTextStyle}>
            <Text style={styles.TextStyle}>Driver 1#:</Text>
            <View style={styles.viewStyle}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('SelectDriver', {
                    setSelectedDriver: this.setSelectedDriver1,
                    selectedDriver: this.state.driver1,
                    incoming: 'edit'
                  });
                }}
                style={{ flex: 1, flexDirection: 'row' }}>
                <Text style={styles.inputTextStyle}>{this.state.driver1}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.ContentTextStyle}>
            <Text style={styles.TextStyle}>Driver 2#:</Text>
            <View style={styles.viewStyle}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('SelectDriver', {
                    setSelectedDriver: this.setSelectedDriver2,
                    selectedDriver: this.state.driver2,
                    incoming: 'edit'
                  });
                }}
                style={{ flex: 1, flexDirection: 'row' }}>
                <Text style={styles.inputTextStyle}>{this.state.driver2}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.ContentTextStyle}>
            <Text style={styles.TextStyle}>Trailer 1#:</Text>
            <View style={styles.viewStyle}>
              <TextInput
                style={styles.inputTextStyle}
                onChangeText={text => {
                  this.setState({ trailer1: text });
                }}
                value={this.state.trailer1}
              />
            </View>
          </View>
          <View style={styles.ContentTextStyle}>
            <Text style={styles.TextStyle}>Trailer 2#:</Text>
            <View style={styles.viewStyle}>
              <TextInput
                style={styles.inputTextStyle}
                onChangeText={text => {
                  this.setState({ trailer2: text });
                }}
                value={this.state.trailer2}
              />
            </View>
          </View>
          <View style={styles.ContentTextStyle}>
            <Text style={styles.TextStyle}>Dolly:</Text>
            <View style={styles.viewStyle}>
              <TextInput
                style={styles.inputTextStyle}
                onChangeText={text => {
                  this.setState({ Dolly: text });
                }}
                value={this.state.Dolly}
              />
            </View>
          </View>
        </ScrollView>
      </Animatable.View>
    )
  }
  render() {
    console.log("this.state.Dolly", this.state.Dolly)
    const isAndroid = Platform.OS === "android";

    if (isAndroid) {
      return <View style={styles.container}>{this.renderView()}</View>;
    } else {
      return (
        <KeyboardAwareScrollView
          style={styles.container}>
          {this.renderView()}
        </KeyboardAwareScrollView>
      );
    }
  }
}
const DownContenStyle = {
  ContentStyle: {
    marginHorizontal: 10,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    flex: 0.96,
    backgroundColor: '#fff',
  },
};
const styles = {
  container: {
    flex: 1
  },
  TextStyle: {
    fontSize: 15,
    alignSelf: 'center',
    color:TEXT_COLOR,
    flex: 0.25,
    fontWeight: '800',
    fontFamily: THEME_FONT,
  },
  SubTextStyle: {
    alignSelf: 'flex-start',
    fontSize: 15,
    textAlign: 'left',
    color: 'black',

    fontFamily: THEME_FONT,
  },

  ContentTextStyle: {
    flexDirection: 'row',
    marginBottom: 10,
    alignContent: 'center',
    borderRadius: 1,
  },
  headerTextStyle: {
    color: TEXT_COLOR,
    fontSize: 15,
    fontFamily: THEME_FONT
  },
  inputTextStyle: {
    padding: 5,
    fontSize: 15,
    flex: 1,
    color: '#000',
    fontFamily: THEME_FONT,
  },
  viewStyle: {
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 0.8,
    borderRadius: 10,
    flexDirection: 'row',
    marginTop: 5,
    flex: 0.75,
  },
};

const mapStateToProps = state => {
  return {
    user: state.Auth.user,
  };
};
export default connect(
  mapStateToProps,
  {},
)(EditPage);
