/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  Text,
  View,
  Platform,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  ScrollView,
} from 'react-native';
import RadioGroup from 'react-native-radio-buttons-group';
import Logout from '../LoginScreen/Logout';
import {GET_QUTRAC_MESSAGES, THEME_FONT} from '../../../helper/Constant';
import LinearGradient from 'react-native-linear-gradient';
import {saveAllrecords, saveFilters} from '../../common/actions';
//import { Calendar, CalendarList, Agenda } from 'react-native-calendars'
import {CalendarList} from 'react-native-calendars';
import Spinner from '../../common/SpinnerFile';
import {connect} from 'react-redux';
import EmptyIcon from 'react-native-vector-icons/SimpleLineIcons';
export class FilterScreen extends Component {
  state = {
    ResultErr: '',
    vehicleErr: '',
    tripDateErr: '',
    isSpinnerShow: false,
    driver: {
      id: '',
      name: '',
    },
    vehicle: '',
    spotFlag: 'all',
    data: [
      {
        label: 'All',
        value: 'all',
        color: '#000',
        size: 25,
      },
      {
        label: 'Y',
        value: 'y',
        color: '#000',
        size: 25,
      },
      {
        label: 'N',
        value: 'n',
        color: '#000',
        size: 25,
      },
    ],
    calendarstartFlag: false,
    calendraEndFlag: false,
    startDate: '',
    endDate: '',
    trailerNumber: '',
    transid: '',
  };

  setSelectedDriver = Tdriver => {
    this.setState({
      driver: {id: Tdriver.id == 'All' ? '' : Tdriver.id, name: Tdriver.name},
    });
  };
  setSelectedVehicle = Tvehicle => {
    console.log('set', Tvehicle);

    this.setState({vehicle: Tvehicle.id, vehicleErr: ''});
  };
  clearVehicleState = () => {
    this.setState({vehicle: ''});
  };
  clearDriveState = () => {
    this.setState({
      driver: {
        id: '',
        name: '',
      },
    });
  };

  calendarView(type) {}

  setSelectedTripDate = (type, date) => {
    if (type == 'start') {
      this.setState({startDate: date.dateString, tripDateErr: ''});
    } else {
      this.setState({endDate: date.dateString, tripDateErr: ''});
    }

    this.setState({calendarstartFlag: false, calendraEndFlag: false});
  };
  renderView = () => {
    // console.log("this.state", this.state)
    var start =
      this.state.startDate != ''
        ? `${this.state.startDate.split('-')[1]}/${
            this.state.startDate.split('-')[2]
          }/${this.state.startDate.split('-')[0]}`
        : '';

    var end =
      this.state.endDate != ''
        ? `${this.state.endDate.split('-')[1]}/${
            this.state.endDate.split('-')[2]
          }/${this.state.endDate.split('-')[0]}`
        : '';
    return (
      <ImageBackground
        style={styles.cointainerStyle}
        source={require('../../Assets/images/plainBackground.png')}>
        <ScrollView style={styles.transparentViewStyle}>
          <Spinner visible={this.state.isSpinnerShow} />
          <Text style={styles.textStyle}>QTRACS Message</Text>

          <View style={styles.viewStyle}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('SelectVehicle', {
                  setSelectedVehicle: this.setSelectedVehicle,
                  selectedVehicle: this.state.vehicle,
                  clearVehicleState: this.clearVehicleState,
                  incoming:'filters'
                });
              }}
              style={{flex: 1, flexDirection: 'row'}}>
              <TextInput
                editable={false}
                placeholder="Vehicle Number"
                style={styles.inputTextStyle}
                value={this.state.vehicle}
              />
              <View style={styles.iconViewStyle}>
                <Image
                  source={require('../../Assets/images/arrow.png')}
                  style={{width: 20, height: 20}}
                />
              </View>
            </TouchableOpacity>
          </View>
          {this.state.vehicleErr == '' ? null : (
            <Text style={styles.errorMessageStyle}>
              {this.state.vehicleErr}
            </Text>
          )}
          <View style={styles.viewStyle}>
            <TextInput
              enabled={true}
              placeholder="Trailer Number"
              style={[styles.inputTextStyle, {width: '100%'}]}
              onChangeText={text => {
                this.setState({trailerNumber: text});
              }}
              value={this.state.trailerNumber}
            />
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <View style={[styles.viewStyle, {width: '49%', marginRight: '2%'}]}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('SelectDate', {
                    setSelectedTripDate: this.setSelectedTripDate,
                    date: this.state.startDate,
                    type: 'start',
                  });
                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TextInput
                  editable={false}
                  placeholder="Trip Start Date"
                  style={[styles.inputTextStyle, {width: '80%'}]}
                  value={start}
                />
                <View style={[styles.iconViewStyle, {width: '20%'}]}>
                  <Image
                    source={require('../../Assets/images/calendar.png')}
                    style={{width: 25, height: 25}}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={[styles.viewStyle, {width: '49 %'}]}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('SelectDate', {
                    setSelectedTripDate: this.setSelectedTripDate,
                    date: this.state.endDate,
                    type: 'end',
                  });
                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TextInput
                  editable={false}
                  placeholder="Trip End Date"
                  style={[styles.inputTextStyle, {width: '80%'}]}
                  value={end}
                />
                <View style={[styles.iconViewStyle, {width: '20%'}]}>
                  <Image
                    source={require('../../Assets/images/calendar.png')}
                    style={{width: 25, height: 25}}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {this.state.tripDateErr == '' ? null : (
            <Text style={styles.errorMessageStyle}>
              {this.state.tripDateErr}
            </Text>
          )}
          <View style={styles.viewStyle}>
            <TextInput
              enabled={true}
              placeholder="TransId"
              style={[styles.inputTextStyle, {width: '100%'}]}
              onChangeText={text => {
                this.setState({transid: text});
              }}
              value={this.state.transid}
            />
          </View>
          <View style={styles.viewStyle}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('SelectDriver', {
                  setSelectedDriver: this.setSelectedDriver,
                  selectedDriver: this.state.driver.id,
                  incoming: 'filter',
                  clearDriveState:this.clearDriveState
                });
              }}
              style={{flex: 1, flexDirection: 'row'}}>
              <TextInput
                editable={false}
                placeholder="All"
                style={styles.inputTextStyle}
                value={
                  this.state.driver.name != ''
                    ? `${this.state.driver.id} - ${this.state.driver.name}`
                    : ''
                }
              />
              <View style={styles.iconViewStyle}>
                <Image
                  source={require('../../Assets/images/arrow.png')}
                  style={{width: 20, height: 20}}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={{flexDirection: 'row', marginTop: '5%'}}>
            <Text style={styles.textStyle}>Spots</Text>
            <RadioGroup
              radioButtons={this.state.data}
              onPress={this.onPress}
              flexDirection="row"
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: '5%',
            }}>
            <LinearGradient
              colors={['#ff883a', '#ff6b0a', '#994006']}
              style={styles.gradientStyle}>
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={() => {
                  this.setState({
                    ResultErr: '',
                    vehicleErr: '',
                    tripDateErr: '',

                    driver: {
                      id: '',
                      name: '',
                    },
                    vehicle: '',
                    spotFlag: 'all',

                    startDate: '',
                    endDate: '',
                    trailerNumber: '',
                    transid: '',
                  });
                }}>
                <Image
                  source={require('../../Assets/images/reset.png')}
                  style={styles.buttonIconStyle}
                />

                <Text
                  style={[
                    styles.loginButtonStyle,
                    {
                      textAlignVertical: 'center',
                      textAlign: 'center',
                      color: '#000',
                    },
                  ]}>
                  RESET
                </Text>
              </TouchableOpacity>
            </LinearGradient>

            <LinearGradient
              colors={['#666666', '#4c4c4c', '#000000']}
              style={styles.gradientStyle}>
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={() => this.fetchrecords('filterscreen')}>
                <Image
                  source={require('../../Assets/images/search.png')}
                  style={styles.buttonIconStyle}
                />

                <Text
                  style={[
                    styles.loginButtonStyle,
                    {textAlignVertical: 'center', textAlign: 'center'},
                  ]}>
                  SEARCH
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
          {this.state.ResultErr == '' ? null : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                padding: 5,
              }}>
              <Text style={{color: 'white'}}>No Result Found!</Text>
              <EmptyIcon name="social-dropbox" size={100} color="white" />
              <Text style={{color: 'white'}}>Pease try again!</Text>
            </View>
          )}
        </ScrollView>
      </ImageBackground>
    );
  };

  // update state
  onPress = data => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].selected == true) {
        this.setState({spotFlag: data[i].value});
        console.log('^^^^^^^', data[i].label);
      }
    }
    this.setState({data});
  };

  render() {
    return Platform.OS === 'ios' ? (
      <KeyboardAvoidingView style={{flex: 1}} enabled behavior="padding">
        {this.renderView()}
      </KeyboardAvoidingView>
    ) : (
      this.renderView()
    );
  }

  fetchrecords = async incoming => {
    this.setState({isSpinnerShow: true, ResultErr: ''});

    // {"vehicleNo":"119833","driverNo":"","trailorNo":"","tripNo":"","startDate":"4/1/2020","endDate":"4/17/2020","spot":"all","ownerId":"37"}

    //console.warn(`fetchrecords`,incoming);

    if (
      //this.state.vehicle != '' &&
      this.state.startDate != '' &&
      this.state.endDate != ''
    ) {
      console.log('state fetch', this.props.userDetail.customerId);

      const formdata = new FormData();

      let sdate = this.state.startDate.split('-');
      let edate = this.state.endDate.split('-');

      formdata.append(
        'qtracDetails',
        JSON.stringify({
          vehicleNo: this.state.vehicle,
          driverNo: this.state.driver.id,
          trailorNo: this.state.trailerNumber,
          tripNo: this.state.transid,
          startDate: `${sdate[1]}/${sdate[2]}/${sdate[0]}`,
          endDate: `${edate[1]}/${edate[2]}/${edate[0]}`,
          spot: this.state.spotFlag,
          ownerId: this.props.userDetail.customerId,
        }),
      );

      console.log('formdata', formdata);

      await fetch(
        `${GET_QUTRAC_MESSAGES}`,
        {
          method: 'POST',
          headers: {},
          body: formdata,
        },
        20000,
      )
        .then(response => response.json())
        .then(responseJson => {
          this.setState({isSpinnerShow: false});
          console.log('response', responseJson);

          if (
            responseJson.CODE &&
            responseJson.CODE == '1' &&
            responseJson.RESPONSE
          ) {
            if (responseJson.RESPONSE.length > 0 && responseJson.RESPONSE[0]) {
              this.props.saveAllrecords(responseJson.RESPONSE);
              if (incoming == 'filterscreen') {
                try {
                  this.props.saveFilters(this.state);
                } catch (error) {
                  console.warn('err', error);
                }

                this.props.navigation.navigate('ShowRecords', {
                  allrecords: responseJson.RESPONSE,
                  fetchrecords: this.fetchrecords,
                });
              }
            } else {
              //recods length 0
              this.setState({ResultErr: 'no result'});
            }
          } else {
            this.setState({ResultErr: 'no result'});
          }
        })
        .catch(err => {
          console.warn('err', err);
          this.setState({isSpinnerShow: false});
          return;
        });
    } else {
      //fields required

      this.setState({isSpinnerShow: false});
      // if (this.state.vehicle == '') {
      //   this.setState({vehicleErr: 'Vehicle Number is required!'});
      // }
      if (this.state.startDate == '' || this.state.endDate == '') {
        this.setState({tripDateErr: 'Date is required!'});
      }
    }
  };

  static navigationOptions = ({navigation}) => {
    const {params} = navigation.state;

    return {
      headerLeft: () => <View style={{marginLeft: 16}} />,

      headerTitle: () => (
        <Image
          source={require('../../Assets/images/jsa_express-logo1.png')}
          style={{height: 80, width: 150, flex: 1}}
          resizeMode="contain"
        />
      ),
      headerRight: () => <Logout />,
      headerStyle: {
        backgroundColor: '#fff',
      },
      headerTintColor: '#fff',
    };
  };
}
const styles = {
  cointainerStyle: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: 'rgba(255,255,255,.7)',
  },
  textStyle: {
    fontSize: 20,
    color: '#000',
    padding: 10,
    fontWeight: 'bold',
    fontFamily: THEME_FONT,
  },
  viewStyle: {
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    marginTop: '5%',
  },
  transparentViewStyle: {
    margin: '2%',
  },
  inputTextStyle: {
    padding: 5,
    fontSize: 15,
    width: '90%',
    color: '#000',
    fontFamily: THEME_FONT,
  },
  iconViewStyle: {
    backgroundColor: '#999',
    width: '10%',
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonStyle: {
    fontSize: 15,
    color: '#fff',

    fontFamily: THEME_FONT,
  },
  buttonIconStyle: {width: 15, height: 15, alignSelf: 'center', marginRight: 5},
  gradientStyle: {borderRadius: 20, flexDirection: 'row', padding: 12},
};

const mapToStateProps = state => {
  console.log('mTSP', state);

  return {
    userDetail: state.Auth.user,
  };
};

export default connect(
  mapToStateProps,
  {saveAllrecords, saveFilters},
)(FilterScreen);
