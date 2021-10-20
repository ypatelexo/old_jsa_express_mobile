/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  FlatList,
  Image,
} from 'react-native';
import {THEME_COLOR, width, THEME_FONT} from '../../../helper/Constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SearchBar, CheckBox} from 'react-native-elements';
import Spinner from '../../common/SpinnerFile';
import {connect} from 'react-redux';
import {setDriverList} from '../../common/actions';
import {fetchVehicleDriverList} from './SelectDriver';

const extractKey = ({id}) => id;

class CloseIcon extends Component {
  render() {
    return <Ionicons name="ios-close" size={30} color="#ffffff" />;
  }
}

class SelectVehicle extends Component {
  state = {
    selectedVehicle: '',
    search: '',
    stateVehicleList: [],
    fullVehicleList: [],
    isSpinnerShow: true,
    setSelectedVehicle: undefined,
  };

  static navigationOptions = ({navigation}) => {
    const {params} = navigation.state;

    return {
      title: 'Vehicle',
      headerLeft: () => {
        return (
          <View
            style={{alignItems: 'center', alignSelf: 'center', marginLeft: 5}}>
            <TouchableOpacity
              style={{
                justifyContent: 'flex-end',
                alignItems: 'center',
                flexDirection: 'row',
              }}
              onPress={() => {
                navigation.pop();
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 14,
                  color: 'white',
                  fontFamily: THEME_FONT,
                }}>
                BACK{' '}
              </Text>
            </TouchableOpacity>
          </View>
        );
      },
      headerRight: () => {
        if (params.incoming == 'filters') {
          return (
            <View
              style={{
                alignItems: 'center',
                alignSelf: 'center',
                marginRight: 5,
              }}>
              <TouchableOpacity
                style={{
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
                onPress={() => {
                  params.clearVehicleState();
                  navigation.pop();
                }}>
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 14,
                    color: 'white',
                    fontFamily: THEME_FONT,
                  }}>
                  CLEAR{' '}
                </Text>
              </TouchableOpacity>
            </View>
          );
        } else {
          return null;
        }
      },
      headerStyle: {
        backgroundColor: THEME_COLOR,
        borderBottomWidth: 0,
        shadowOpacity: 0,
        elevation: 0,
        fontStyle: THEME_FONT,
      },
      headerTintColor: '#fff',
    };
  };

  constructor(props) {
    super(props);
    this.getDriverlist();
    //fetch All truck
  }

  componentWillReceiveProps(nextProps) {
    this.setVehicleListState(nextProps);
  }
  setVehicleListState(nextProps) {
    if (this.state.stateVehicleList.length == 0) {
      if (
        nextProps.driverlists.CODE != undefined &&
        nextProps.driverlists.CODE == '1' &&
        nextProps.driverlists.RESPONSE != undefined &&
        nextProps.driverlists.RESPONSE.truck != undefined
      ) {
        this.setState({
          stateVehicleList: nextProps.driverlists.RESPONSE.truck,
          fullVehicleList: nextProps.driverlists.RESPONSE.truck,
        });
      }
    }
  }

  componentWillMount() {
    const {params} = this.props.navigation.state;
    this.setState({selectedVehicle: params.selectedVehicle});
    this.setState({setSelectedVehicle: params.setSelectedVehicle});
  }
  componentDidMount() {
    this.setVehicleListState(this.props);
  }

  getDriverlist = async () => {
    console.warn('props users:', this.props);

    if (this.props.userDetail.customerId != undefined) {
      const {params} = this.props.navigation.state;

      try {
        await fetchVehicleDriverList(this.props);

        this.setState({isSpinnerShow: false});
      } catch (error) {
        this.setState({isSpinnerShow: false});
        /* return (dispatch) => {
                    sendError(dispatch, ErrorTypes.serverError, "Something went wrong, Please try again !");
                } */
      }
    } else {
      this.setState({isSpinnerShow: false});
    }
  };

  renderItem = ({item}) => {
    let makeName = item.id;
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          alignItems: 'center',
        }}>
        <Image
          style={{
            height: 35,
            width: 35,
            marginLeft: 5,
          }}
          source={require('../../Assets/images/truck.png')}
        />
        <CheckBox
          containerStyle={{flex: 1}}
          title={makeName}
          checked={makeName === this.state.selectedVehicle ? true : false}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          onPress={() => {
            this.state.setSelectedVehicle(item);
            this.props.navigation.goBack();
          }}
        />
      </View>
    );
  };

  searchMake = search => {
    // console.log("search",search)
    const searchList = this.state.fullVehicleList.filter(function(item) {
      const itemData = item.id ? item.id : '';
      const textData = search;
      return itemData.indexOf(textData) > -1;
    });
    this.setState({search: search, stateVehicleList: searchList});
  };

  render() {
    console.log('this.state', this.state);

    const {search, stateVehicleList} = this.state;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.mainContainer}>
          <Spinner visible={this.state.isSpinnerShow} />
          <SearchBar
            placeholder="Search"
            onChangeText={this.searchMake}
            value={search}
            inputContainerStyle={{backgroundColor: 'white'}}
            containerStyle={{
              backgroundColor: THEME_COLOR,
              borderBottomColor: 'transparent',
              borderTopColor: 'transparent',
            }}
            returnKeyType="search"
            blurOnSubmit={true}
          />
          <View style={styles.container}>
            {stateVehicleList.length === 0 && search.length != '' ? (
              <Text>No items found.</Text>
            ) : (
              <FlatList
                style={{margin: 4, width: width}}
                data={stateVehicleList}
                renderItem={this.renderItem}
                keyExtractor={extractKey}
                bounces={false}
              />
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 10,
  },
  mainContainer: {
    flex: 1,
  },
});

const mapToStateProps = state => {
  console.log('mTSP', state);

  return {
    userDetail: state.Auth.user,
    driverlists: state.Filter.driverList,
  };
};

export default connect(
  mapToStateProps,
  {setDriverList},
)(SelectVehicle);
