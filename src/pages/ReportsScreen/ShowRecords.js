/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Animated,
} from 'react-native';
import {changegreyoutflaginList} from '../../common/actions';
import {THEME_COLOR, THEME_FONT, width, height} from '../../../helper/Constant';
import {connect} from 'react-redux';
import RenderEditOnList from './RenderEditOnList';

export class NextIconComp extends Component {
  render() {
    return (
      <View style={{alignItems: 'center',alignSelf:'center', marginRight: 5}}>
        <TouchableOpacity
          style={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',
          }}
          onPress={() => {
            this.props.navigation.navigate('EmailPage');
          }}>
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 14,
              color: 'white',
              fontFamily:THEME_FONT
            }}>
            EMAIL{' '}
          </Text>         
        </TouchableOpacity>
      </View>
    );
  }
}

class ShowRecords extends Component {
  state = {
    showExtranInfo: false,
    loading: false,
    TotalMiles: '-',
    TotalBlank: '-',
    allreports: [],
    orientation: '',
    height1: 0,
    width1: 0,
    tr1MaxChar: 10,
    tr1Width: 4,
    tr2MaxChar: 10,
    tr2Width: 4,
    tr3MaxChar: 10,
    tr3Width: 4,
  };
  constructor(props) {
    super(props);

    this.headerScrollView = null;
    this.scrollPosition = new Animated.Value(0);
    this.scrollEvent = Animated.event(
      [{nativeEvent: {contentOffset: {x: this.scrollPosition}}}],
      {useNativeDriver: false},
    );

    //fetch All driver
  }

  checkMaxChar(number, type="tr3") {
    if (type == 'tr1') {
      if (number.length > this.state.tr1MaxChar) {
        this.setState({tr1MaxChar: number});
      }
    }else if(type == 'tr2'){
      if (number.length > this.state.tr2MaxChar) {
        this.setState({tr2MaxChar: number});
      }
    }else{
      if (number.length > this.state.tr3MaxChar) {
        this.setState({tr3MaxChar: number});
      }
    }
    
    // if(this.state.tr1MaxChar >= 10 && this.state.tr1MaxChar <= 15){
    //   this.setState({tr1Width: 3.8});
    // }else if(this.state.tr1MaxChar >= 16 && this.state.tr1MaxChar <= 20){
    //   this.setState({tr1Width: 3.5});
    // }else if(this.state.tr1MaxChar >= 21 && this.state.tr1MaxChar <= 25){
    //   this.setState({tr1Width: 3.2});
    // }else if(this.state.tr1MaxChar > 30 ){
    //   this.setState({tr1Width: 3});
    // }


    // if(this.state.tr2MaxChar >= 10 && this.state.tr2MaxChar <= 15){
    //   this.setState({tr2Width: 3.8});
    // }else if(this.state.tr2MaxChar >= 16 && this.state.tr2MaxChar <= 20){
    //   this.setState({tr2Width: 3.5});
    // }else if(this.state.tr2MaxChar >= 21 && this.state.tr2MaxChar <= 25){
    //   this.setState({tr2Width: 3.2});
    // }else if(this.state.tr2MaxChar > 30 ){
    //   this.setState({tr2Width: 3});
    // }


    // if(this.state.tr3MaxChar >= 10 && this.state.tr3MaxChar <= 15){
    //   this.setState({tr3Width: 3.8});
    // }else if(this.state.tr3MaxChar >= 16 && this.state.tr3MaxChar <= 20){
    //   this.setState({tr3Width: 3.5});
    // }else if(this.state.tr3MaxChar >= 21 && this.state.tr3MaxChar <= 25){
    //   this.setState({tr3Width: 3.2});
    // }else if(this.state.tr3MaxChar > 30 ){
    //   this.setState({tr3Width: 3});
    // }
   
  }

  componentDidMount() {
    this.listener = this.scrollPosition.addListener(position => {
      this.headerScrollView.scrollTo({x: position.value, animated: false});
    });
     const data = this.props.allrecords;
     data.forEach(element => {
      this.checkMaxChar(element.macroBody_qhosTrailer1, "tr1") 
      this.checkMaxChar(element.macroBody_qhosTrailer2, "tr2") 
      this.checkMaxChar(element.macroBody_qhosTrailer3, "tr3") 
    });

    
  }
  componentWillUnmount() {}
  componentWillReceiveProps(nextProps) {
    if (nextProps.allrecords != this.props.allrecords) {
      this.calculateMilesandBlank(nextProps.allrecords);
    }
  }

  async componentWillMount() {
    const {params} = this.props.navigation.state;

    await this.calculateMilesandBlank(params.allrecords);

    this.setState({
      allreports: params.allrecords,
    });
  }

  calculateMilesandBlank = allrecords => {
    var tTotalMiles = 0,
      tToatalBlank = 0;
    allrecords.map(value => {
      if (value.floatQualcommTotalMiles != '') {
        tTotalMiles = tTotalMiles + parseInt(value.floatQualcommTotalMiles);
      } else {
        tToatalBlank++;
      }
    });
    console.log(
      'finalyyy TotalMiles',
      tTotalMiles,
      'Totalblank:',
      tToatalBlank,
    );

    this.setState({
      TotalMiles: tTotalMiles,
      TotalBlank: tToatalBlank,
    });
  };

  static navigationOptions = ({navigation}) => {
    const {params} = navigation.state;

    return {
      title: 'QTRACS Report',

      headerRight: <NextIconComp navigation={navigation} />,
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

  renderStickyItem = ({index, item}) => {
    let rowColor = item.enumQualcommRowGrayOutStatus === 'Y'?  '#DCDCDC': 'white';

    return (
      <RenderEditOnList
        rowColor={rowColor}
        item={item}
        index={index}
        navigation={this.props.navigation}
      />
    );
  };

  renderItem = ({index, item}) => {
    let rowColor =
    item.enumQualcommRowGrayOutStatus === 'Y'?  '#DCDCDC'
    :
    item.backgroundColorNonContinousFlag === 'Y'
    ? '#FF6EC7'
    :
     'white';

    

     let tr1Width = 4
     let tr2Width = 4
     let tr3Width = 4

     
    
    if(this.state.tr1MaxChar >= 10 && this.state.tr1MaxChar <= 15){
      tr1Width = 3.8;
    }else if(this.state.tr1MaxChar >= 16 && this.state.tr1MaxChar <= 20){
      tr1Width = 3.0;
    }else if(this.state.tr1MaxChar >= 21 && this.state.tr1MaxChar <= 25){
      tr1Width = 2.2;
    }else if(this.state.tr1MaxChar >= 31){
      tr1Width = 1.6;
    }

    if(this.state.tr2MaxChar >= 10 && this.state.tr2MaxChar <= 15){
      tr2Width = 3.8;
    }else if(this.state.tr2MaxChar >= 16 && this.state.tr2MaxChar <= 20){
      tr2Width = 3.0;
    }else if(this.state.tr2MaxChar >= 21 && this.state.tr2MaxChar <= 25){
      tr2Width = 2.2;
    }else if(this.state.tr2MaxChar >= 31 ){
      tr2Width = 1.6;
    }

    if(this.state.tr3MaxChar >= 10 && this.state.tr3MaxChar <= 15){
      tr3Width = 3.8;
    }else if(this.state.tr3MaxChar >= 16 && this.state.tr3MaxChar <= 20){
      tr3Width = 3.0;
    }else if(this.state.tr3MaxChar >= 21 && this.state.tr3MaxChar <= 25){
      tr3Width = 2.2;
    }else if(this.state.tr3MaxChar >= 31 ){
      tr3Width = 1.6;
    } 
    


    return (
      <View style={{flexDirection: 'row', backgroundColor: rowColor}}>
        {/* <ScrollView horizontal={true}> */}

        <View style={{flexDirection: 'column'}}>
          <View style={[styles.itemStyle, {marginLeft:5,width: width/2.28}]}>
            <Text style={styles.listTextStyle}>{item.eventTS1}</Text>
          </View>
        </View>

        <View style={{flexDirection: 'column'}}>
          <View style={[styles.itemStyle, {width: width/5.5}]}>
            <Text style={styles.listTextStyle}>{item.equipment_id}</Text>
          </View>
        </View>

        <View style={{flexDirection: 'column'}}>
          <View style={[styles.itemStyle, {width: width/5.5}]}>
            <Text style={styles.listTextStyle}>
              {item.macroBody_dispatchNum}
            </Text>
          </View>
        </View>

        <View style={{flexDirection: 'column'}}>
          <View style={[styles.itemStyle, {width: width/5.5}]}>
            <Text style={styles.listTextStyle}>
              {item.macroBody_companyCode}
            </Text>
          </View>
        </View>

        <View style={{flexDirection: 'column'}}>
          <View style={[styles.itemStyle, {width: width/5.5}]}>
            <Text style={styles.listTextStyle}>
              {item.floatQualcommTotalMiles}
            </Text>
          </View>
        </View>

        <View style={{flexDirection: 'column'}}>
          <View style={[styles.itemStyle, {width: width/1.45}]}>
            <Text style={styles.listTextStyle}>
              {`${item.varDriverName} (${item.driverID})`}
            </Text>
          </View>
        </View>

        <View style={{flexDirection: 'column'}}>
          <View style={[styles.itemStyle, {width: width / tr1Width}]}>
            <Text style={styles.listTextStyle}>
              {(item.macroBody_qhosTrailer1=='NONE')
              ?
              '-'
              :
              item.macroBody_qhosTrailer1} 
            </Text>
          </View>
        </View>

        <View style={{flexDirection: 'column', flex: 1, flexWrap: 'wrap'}}>
          <View style={[styles.itemStyle, {width: width / tr2Width} ]}>
            <Text style={styles.listTextStyle}>
              {(item.macroBody_qhosTrailer2=='NONE')
              ?
              '-'
              :
              item.macroBody_qhosTrailer2} 
            </Text>
          </View>
        </View>

        <View style={{flexDirection: 'column'}}>
          <View style={[styles.itemStyle, {width: width / tr3Width}]}>
            <Text style={styles.listTextStyle}>
              {(item.macroBody_qhosTrailer3=='NONE')
              ?
              '-'
              :
              item.macroBody_qhosTrailer3}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  renderList() {
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          flex: 1,
          marginBottom: 15,
        }}>
        {/* <View style={{flex:(this.state.orientation=='portrait')?0.4:0.23, flexDirection: 'column'}}> */}
         <View style={{width:width/3.8,flexDirection:'column'}} > 
          <FlatList
            ref={ref => (this.ScroolListref = ref)}
            style={{backgroundColor: 'white'}}
            data={this.props.allrecords}
            renderItem={this.renderStickyItem}
            keyExtractor={(item, index) => `${item.omnitracsId}+${index}`}
          />
        </View>
        <View style={{flex:1}}>
          <FlatList
            horizontal={true}
            contentContainerStyle={{flexDirection: 'column'}}
            style={{backgroundColor: 'white'}}
            data={this.props.allrecords}
            renderItem={this.renderItem}
            onScroll={this.scrollEvent}
            scrollEventThrottle={16}
            keyExtractor={(item, index) => `${item.omnitracsId}+${index}`}
          />
        </View>
      </View>
    );
  }

  formatRowForSheet = section => {
    let {item} = section;

    return item.render;
  };
  renderHeader = () => {

    if(this.state.tr1MaxChar >= 10 && this.state.tr1MaxChar <= 15){
      tr1Width = 3.8;
    }else if(this.state.tr1MaxChar >= 16 && this.state.tr1MaxChar <= 20){
      tr1Width = 3.0;
    }else if(this.state.tr1MaxChar >= 21 && this.state.tr1MaxChar <= 25){
      tr1Width = 2.2;
    }else if(this.state.tr1MaxChar >= 31){
      tr1Width = 1.6;
    }

    if(this.state.tr2MaxChar >= 10 && this.state.tr2MaxChar <= 15){
      tr2Width = 3.8;
    }else if(this.state.tr2MaxChar >= 16 && this.state.tr2MaxChar <= 20){
      tr2Width = 3.0;
    }else if(this.state.tr2MaxChar >= 21 && this.state.tr2MaxChar <= 25){
      tr2Width = 2.2;
    }else if(this.state.tr2MaxChar >= 31 ){
      tr2Width = 1.6;
    }

    if(this.state.tr3MaxChar >= 10 && this.state.tr3MaxChar <= 15){
      tr3Width = 3.8;
    }else if(this.state.tr3MaxChar >= 16 && this.state.tr3MaxChar <= 20){
      tr3Width = 3.0;
    }else if(this.state.tr3MaxChar >= 21 && this.state.tr3MaxChar <= 25){
      tr3Width = 2.2;
    }else if(this.state.tr3MaxChar >= 31 ){
      tr3Width = 1.6;
    } 
    











    return (
      <View style={{flexDirection: 'row'}}>
        <View style={{flexDirection: 'row', width:width/3.8}}>
          <View style={[styles.itemStyle, {marginLeft:5,flex: 3}]}>
            {/* <EditSave name='content-save-edit-outline' size={25}
                         onPress={()=>{this.setState({showExtranInfo:(this.state.showExtranInfo)?false:true})}}/> */}
          </View>

          <View style={[styles.itemStyle, { flex: 7}]}>
            <Text style={[styles.itemHeadingTextStyle,{fontSize:14}]}>TransID</Text>
          </View>
        </View>
        <View style={{flex:1}}>
          <ScrollView
            ref={ref => (this.headerScrollView = ref)}
          
            horizontal={true}
            scrollEnabled={false}
            scrollEventThrottle={16}>
            <View style={[styles.itemStyle, {marginLeft:5,width: width/2.28}]}>
              <Text style={styles.itemHeadingTextStyle}>Tripdate</Text>
            </View>

            <View style={[styles.itemStyle, {width: width/5.5}]}>
              <Text style={styles.itemHeadingTextStyle}>Vehicle</Text>
            </View>

            <View style={[styles.itemStyle, {width: width/5.5}]}>
              <Text style={styles.itemHeadingTextStyle}>Orig</Text>
            </View>

            <View style={[styles.itemStyle, {width: width/5.5}]}>
              <Text style={styles.itemHeadingTextStyle}>Dest</Text>
            </View>

            <View style={[styles.itemStyle, {width: width/5.5}]}>
              <Text style={styles.itemHeadingTextStyle}>Miles</Text>
            </View>

            <View style={[styles.itemStyle, {width: width/1.45}]}>
              <Text style={styles.itemHeadingTextStyle}>Driver1</Text>
            </View>

            <View style={[styles.itemStyle, {width: width/tr1Width}]}>
              <Text style={styles.itemHeadingTextStyle}>Trailer1</Text>
            </View>

            <View style={[styles.itemStyle, {width: width/tr2Width}]}>
              <Text style={styles.itemHeadingTextStyle}>Trailer2</Text>
            </View>

            <View style={[styles.itemStyle, {width: width/tr3Width}]}>
              <Text style={styles.itemHeadingTextStyle}>Dolly</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };
  render() {
    let body = this.renderList();

    let data = [{key: 'body', render: body}];
    return (
      <View 
      style={{flex: 1,
      }}
     
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            marginVertical: 3,
            marginHorizontal: 5,
          }}>
          <View style={[styles.cardstyle, {marginLeft: 10}]}>
            <Text style={styles.HeadingStyle}>Total miles </Text>
            <Text style={styles.textStyles}>{this.state.TotalMiles}</Text>
          </View>
          <View style={[styles.cardstyle, {marginRight: 10}]}>
            <Text style={styles.HeadingStyle}>Total blank </Text>
            <Text style={styles.textStyles}>{this.state.TotalBlank} </Text>
          </View>
        </View>
        {this.renderHeader()}
        <FlatList
          data={data}
          renderItem={this.formatRowForSheet}
          onLayout={event =>
            this.getOrientation(
              event.nativeEvent.layout.width,
              event.nativeEvent.layout.height,
            )}

          //   onEndReached={this.handleScrollEndReached}
          //   onEndReachedThreshold={.005}
        />
        {/* {this.state.loading && <ActivityIndicator />} */}
      </View>
    );
  }
  getOrientation = (width, height) => {
    // console.warn('isLandscape....12212', this.state.orientation, height);
    if (width < height) {
      this.setState({ orientation: 'portrait' },
      console.warn(
        'isLandscape',
        this.state.orientation,
        this.state.width1,
        this.state.height1
      ));
    } else {
      this.setState({ orientation: 'landscape' },
      console.warn(
        'isLandscape',
        this.state.orientation,
        this.state.width1,
        this.state.height1
      ));
    }

    this.setState({ height1: height, width1: width });
   
  };
}

export const styles = {
  itemHeadingTextStyle:{
    color:'#0e4d92',
    fontSize:12.6,
    fontFamily:THEME_FONT
  },

  itemStyle: {
    // alignItems: 'center',
    justifyContent: 'center',
    height: height/23,
    //  borderWidth: 0.4,
    borderColor: 'black',
    paddingVertical: 1,
    
  },

  listTextStyle: {
    fontFamily: THEME_FONT,
    fontSize: 13,
    // alignSelf: 'center',
  },

  cardstyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
  },
  HeadingStyle: {
    fontWeight: '400',
    fontSize: 16,
  },
  textStyles: {
    fontSize: 15,
    color: '#696969',
    fontWeight: '200',
  },
};

const mapToStateProps = state => {
  return {
    userDetail: state.Auth.user,
    allrecords: state.Filter.AllRecords,
  };
};

export default connect(
  mapToStateProps,
  {changegreyoutflaginList},
)(ShowRecords);
