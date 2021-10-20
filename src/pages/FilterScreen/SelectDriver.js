/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
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
import { THEME_COLOR, width, GET_DRIVER_LIST, THEME_FONT } from '../../../helper/Constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SearchBar, CheckBox } from 'react-native-elements';
import Spinner from '../../common/SpinnerFile';
import { connect } from 'react-redux';
import { setDriverList } from '../../common/actions';

const extractKey = ({ id }) => id;

class CloseIcon extends Component {
  render() {
    return <Ionicons name="ios-close" size={30} color="#ffffff" />;
  }
}

class SelectDriver extends Component {
  state = {
   
    incoming:'',
    selectedDriver: '',
    search: '',
    stateDriverList: [],
    fullDriverList: [],
    isSpinnerShow: true,
    setSelectedDriver: undefined,
  };

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: 'Drivers',
      headerLeft:()=> {return(
        <View style={{alignItems: 'center',alignSelf:'center', marginLeft: 5}}>
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
              fontFamily:THEME_FONT
            }}>
            BACK{' '}
          </Text>
         
        </TouchableOpacity>
      </View>
      )},
      headerRight:()=> {
       
        return(
        <View style={{alignItems: 'center',alignSelf:'center', marginRight: 5}}>
        <TouchableOpacity
          style={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',
          }}
          onPress={() => {
            if(params.incoming=='filter')
            {
           navigation.state.params.clearDriveState();
            }
           navigation.pop()

          }}>
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 14,
              color: 'white',
              fontFamily:THEME_FONT
            }}>
            CLEAR{' '}
          </Text>
         
        </TouchableOpacity>
      </View>
      )
    
    
    
    
    },
      headerStyle: {
        backgroundColor: THEME_COLOR,
        borderBottomWidth: 0,
        shadowOpacity: 0,
        elevation: 0,
        fontStyle: THEME_FONT
      },
      headerTintColor: '#fff',
    };
  };

  constructor(props) {
    super(props);
    this.getDriverlist();
    //fetch All driver
  }

 

  componentWillReceiveProps(nextProps) {
    this.setDriverListState(nextProps);
  }
  setDriverListState(nextProps) {
    if (this.state.stateDriverList.length == 0) {
      if (
        nextProps.driverlists.CODE != undefined &&
        nextProps.driverlists.CODE == '1' &&
        nextProps.driverlists.RESPONSE != undefined &&
        nextProps.driverlists.RESPONSE.driver != undefined
      ) {
        this.setState({
          stateDriverList: nextProps.driverlists.RESPONSE.driver,
          fullDriverList: nextProps.driverlists.RESPONSE.driver,
        });
      }
    }
  }

  componentWillMount() {
    const { params } = this.props.navigation.state;
    this.setState({ selectedDriver: params.selectedDriver,
      setSelectedDriver: params.setSelectedDriver,
    incoming:params.incoming
    });
    
  }
  componentDidMount() {
    this.setDriverListState(this.props);
    
  }

  getDriverlist = async () => {
    console.log('props users:', this.props);

    if (this.props.userDetail.customerId != undefined) {
      const { params } = this.props.navigation.state;

      try {
        await fetchVehicleDriverList(this.props);

        this.setState({ isSpinnerShow: false });
      } catch (error) {
        this.setState({ isSpinnerShow: false });
        /* return (dispatch) => {
                    sendError(dispatch, ErrorTypes.serverError, "Something went wrong, Please try again !");
                } */
      }
    } else {
      this.setState({ isSpinnerShow: false });
    }
  };

  renderItem = ({ item }) => {
    let itemName = `${item.id} - ${item.name.replace(',', ' ')}`;
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
          source={require('../../Assets/images/driver.png')}
        />
        <CheckBox
          containerStyle={{ flex: 1 }}
          title={itemName}
          // checked={(makeName === this.state.selectedDriver) ? true : false}
          checked={
            ( this.state.selectedDriver == '') ?
            true
            :
            (this.state.selectedDriver == item.id) ?
              true
              : false
          }
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          onPress={() => {
            this.state.setSelectedDriver(item);
            this.props.navigation.goBack();
          }}
        />
      </View>
    );
  };

  searchMake = search => {
    // console.log("search",search)
    const searchList = this.state.fullDriverList.filter(function (item) {
      const itemData = item.name
        ? `${item.id} - ${item.name.toUpperCase()}`
        : ''.toUpperCase();
      const textData = search.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({ search: search, stateDriverList: searchList });
  };

  render() {
    console.log('this.state', this.state);

    const { search, stateDriverList } = this.state;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.mainContainer}>
          <Spinner visible={this.state.isSpinnerShow} />
          <SearchBar
            placeholder="Search"
            onChangeText={this.searchMake}
            value={search}
            inputContainerStyle={{ backgroundColor: 'white' }}
            containerStyle={{
              backgroundColor: THEME_COLOR,
              borderBottomColor: 'transparent',
              borderTopColor: 'transparent',
            }}
            returnKeyType="search"
            blurOnSubmit={true}
          />
          <View style={styles.container}>
            {stateDriverList.length === 0 && search.length != '' ? (
              <Text>No items found.</Text>
            ) : (

                <View>
                  {(this.state.incoming=='filter')?
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
                    source={require('../../Assets/images/driver.png')}
                  />
                  <CheckBox
                    containerStyle={{ flex: 1 }}
                    title={'All'}
                    // checked={(makeName === this.state.selectedDriver) ? true : false}
                    checked={( this.state.selectedDriver == '') ?
                      true
                      :false
                    }
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    onPress={() => {
                      this.state.setSelectedDriver({id:'All',name:''});
                      this.props.navigation.goBack();
                    }}
                  />
                </View>
                
                  :null}
                

                  <FlatList
                    style={{ margin: 4, width: width }}
                    data={stateDriverList}
                    renderItem={this.renderItem}
                    keyExtractor={extractKey}
                    bounces={false}
                  />
                </View>
              )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
export const fetchVehicleDriverList = async props => {
  try {
    console.log('customerId fetch api driverlists', props);
    if (
      props.driverlists.RESPONSE == undefined ||
      props.driverlists.RESPONSE.driver == undefined ||
      props.driverlists.RESPONSE.truck == undefined
    ) {
      console.log('state fetch');

      const formdata = new FormData();

      formdata.append(
        'customerID',
        JSON.stringify({
          customerId: props.userDetail.customerId,
        }),
      );

      console.log('formdata', formdata);

      await fetch(
        `${GET_DRIVER_LIST}`,
        {
          method: 'POST',
          headers: {},
          body: formdata,
        },
        20000,
      )
        .then(response => response.json())
        .then(responseJson => {
          console.log('response', responseJson);

          if (
            responseJson.RESPONSE != undefined &&
            responseJson.RESPONSE.driver != undefined &&
            responseJson.RESPONSE.truck != undefined
          ) {
            console.log('set list to props');

            props.setDriverList(responseJson);
          }
          return responseJson;
        })
        .catch(err => {
          return;
        });
    } else {
      console.log('return by global state');

      return props.driverlists;
    }
  } catch (error) {
    console.log('err', error);
    return;
  }
};
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
  { setDriverList },
)(SelectDriver);
