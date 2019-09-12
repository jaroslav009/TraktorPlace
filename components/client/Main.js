import React, {Component} from 'react';
import { AppState, Text, View, Image, Dimensions, TouchableOpacity, TextInput, Animated, Easing, ScrollView, DatePickerIOS, UIManager, Keyboard } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import * as firebase from 'firebase';
import * as Font from 'expo-font';
import { Avatar, CheckBox } from 'react-native-elements';
import { Notifications } from 'expo';
import DateTimePicker from "react-native-modal-datetime-picker";

import SuccessPopUp from '../SuccessPopUp/SuccessPopUp';
import LoadIndicator from '../../constants/LoadIndicator';
import HeaderClient from './HeaderClient/HeaderClient';
import MechanicHeader from './HeaderMechanic/MechanicHeader';

import downArrow from '../../assets/images/down-arrow.png';
import rating from '../../assets/images/rating.png';
import car from '../../assets/images/car.png'
const { State: TextInputState } = TextInput;

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

class MainClient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locationResult: null,
            modalStr: new Animated.Value(-300),
            modalData: new Animated.Value(Dimensions.get('window').height+90),
            fonCloseStr: false,
            drivers: [],
            load: true,
            uid: null,
            address: '',
            errAddress: 'none',
            addressForm: false,
            dataForm: false,
            marka: '',
            errMarka: 'none',
            confirmAddress: '',
            model: '',
            typeWork: '',
            errModel: 'none',
            yearRel: '',
            errYearRel: 'none',
            happened: '',
            checked: false,
            checkedZap: false,
            openSelect: false,
            time: '',
            chooseMechanic: false,
            latitude: 0,
            longitude: 0,
            drivers: [
                {
                    latitude: 1,
                    longitude: 23
                }
            ],
            clickHeader: false,
            loadFont: false,
            dataDriver: false,
            description: '',
            timeWork: null,
            priceWork: null,
            rating: null,
            showDesc: '',
            showTimeWork: null,
            showPriceWork: null,
            showRating: null,
            acceptBtn: false,
            avatar: '',
            shift: new Animated.Value(0),
            selectMechanic: new Animated.Value(0),
            popSuccess: false,
            showDatePicker: false,
            chosenDate: new Date()
        }
        this.streetSelect = this.streetSelect.bind(this);
        this.closeStr = this.closeStr.bind(this);
        this.addressBtn = this.addressBtn.bind(this);
        this.dataSelect = this.dataSelect.bind(this);
        this.dataBtn = this.dataBtn.bind(this);
        this.handleClickHeader = this.handleClickHeader.bind(this);
        this.pressDriver = this.pressDriver.bind(this);
        this.chooseDriver = this.chooseDriver.bind(this);
        this.handleAppStateChange = this.handleAppStateChange.bind(this);
        this.showDatePicker = this.showDatePicker.bind(this);
        this.setDate = this.setDate.bind(this);
    }

    async componentDidMount() {

        this.registerForPushNotificationsAsync();
            
        // Notifications.addListener(this.listenerNotific)

        AppState.addEventListener('change', this.handleAppStateChange);
        const { navigation } = this.props;
        console.log('navigation.getParam', navigation.getParam('userLatitude')+1);
        this.setState({
            userLatitude: navigation.getParam('userLatitude')+1,
            userLongitude: navigation.getParam('userLongitude')+1
        });
        console.log('anufe', Dimensions.get('window').height);
        await Font.loadAsync({
          'TTCommons-DemiBold': require('../../assets/fonts/TTCommons-DemiBold.ttf'),
          'TTCommons-Regular': require('../../assets/fonts/TTCommons-Regular.ttf'),
          'TTCommons-Medium': require('../../assets/fonts/TTCommons-Medium.ttf'),
          'TTCommons-Black': require('../../assets/fonts/TTCommons-Black.ttf'),
          'TTCommons-Bold': require('../../assets/fonts/TTCommons-Bold.ttf'),
        })
        .then(() => {
            this.setState({ loadFont: true });
        })
        .catch(err => {
            console.log('err', err);
        });



        // Driver
        await firebase.auth().onAuthStateChanged( async (user) => {

            if(user) {
                
                console.log('user', user.uid);
                this.setState({ uid: user.uid, email: user.email, uidDriverUser: user.uid });
                
                await firebase.database().ref("users").orderByChild("confEmail").equalTo(this.state.email).once("child_added", async (snapshot) => {
                    console.log('snapshotUser', snapshot.key);
                    this.setState({ userKey: snapshot.key });
                    
                    await firebase.database().ref("users/"+this.state.userKey).once("value", async (data) => {
                        this.setState({
                            description: data.toJSON().description,
                            role: data.toJSON().role,
                            timeWork: data.toJSON().timeWork,
                            priceWork: data.toJSON().priceWork,
                            uidDriver: data.toJSON().uidDriver,
                            avatar: data.toJSON().avatar,
                            rating: data.toJSON().rating,
                            advanced: data.toJSON().advanced,
                            expeirence: data.toJSON().expeirence,
                        });
                        console.log('log1233213213 role', data.toJSON().role);
                        
                        if(data.toJSON().role == 'mechanic') {
                            await this._getLocationAsync();
                        }
                        
                    });
                })
            } else {
                this.props.navigation.navigate('HomeScreen');
            }
        });
        await this._getLocationAsync();
        
        await firebase.database().ref('positionDriver/').on('value', (snapshot) => {
            console.log('snapshot ', snapshot.val());
            
            if(snapshot.val() == null) {
                return;
            }
            let keySnappshot = Object.keys(snapshot.val());
            let arrBoof = [];
            let count = 0;
            let name = '';
            keySnappshot.map((value, key) => {
                console.log('descroiption:', snapshot.val()[value].description);

                arrBoof.push(snapshot.val()[value]);
                name = 'openDrive'+count;
                this.setState({ [name]: false });
                count++;
            });
            this.setState({ drivers: arrBoof });
            console.log(this.state.drivers);
        });
        this.setState({ load: false });
        // Driver
    }
    
    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                locationResult: 'Permission to access location was denied',
            });
        } else {
            this.setState({ hasLocationPermissions: true });
        }
        await firebase.auth().onAuthStateChanged( async (user) => {
            if(user) {

                await Location.watchPositionAsync({}, async (dataLoc) => {

                    await firebase.database().ref("users").orderByChild("confEmail").equalTo(this.state.email).once("child_added", async (snapshot) => {
                        console.log('snapshot', snapshot.key);
                        console.log('dataloc', dataLoc);
                        if(this.state.latitudeMechanic != dataLoc.coords.latitude && this.state.longitudeMechanic != dataLoc.coords.longitude) {
                            if(this.state.role == 'mechanic') {
                                this.setState({ latitudeMechanic: dataLoc.coords.latitude, longitudeMechanic: dataLoc.coords.longitude });
                                firebase.database().ref('positionDriver/' + snapshot.key).set({
                                    latitude: dataLoc.coords.latitude,
                                    longitude: dataLoc.coords.longitude,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                    description: this.state.description,
                                    priceWork: this.state.priceWork,
                                    timeWork: this.state.timeWork,
                                    uidDriver: snapshot.key,
                                    driverId: snapshot.key,
                                    avatar: this.state.avatar,
                                    rating: this.state.rating == undefined ? 2.5 : this.state.rating,
                                    expeirence: this.state.expeirence == undefined ? '' : this.state.expeirence,
                                    advanced: this.state.advanced == undefined ? '' : this.state.advanced,
                                }, (error) => {
                                    if (error) {
                                        console.log('err', error);
                                    } else {
                                        console.log('Data saved positon');
                                    }
                                });
                            }
                        }
                        this.setState({ latitude: dataLoc.coords.latitude, longitude: dataLoc.coords.longitude })
                        this.setState({mapRegion: { latitude: dataLoc.coords.latitude, longitude: dataLoc.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }});
                    })

                });
              }
            })
        // let location = await Location.getCurrentPositionAsync({});

    }

    streetSelect() {
        Animated.timing(
            // Animate value over time
            this.state.modalStr, // The value to drive
            {
                toValue: 0,
                duration: 500,
                easing: Easing.linear
            },
        ).start();
        this.setState({ fonCloseStr: true });
    }

    dataSelect() {
        Animated.timing(
            // Animate value over time
            this.state.modalData, // The value to drive
            {
                toValue: 0,
                duration: 500,
                easing: Easing.linear
            },
        ).start();
        this.setState({ fonCloseStr: true });
    }

    addressBtn() {
        if(this.state.address == '') {
            return this.setState({ errAddress: 'flex' });
        } else {
            this.setState({ errAddress: 'none' });
        }
        Animated.timing(
            // Animate value over time
            this.state.modalStr, // The value to drive
            {
                toValue: -300,
                duration: 500,
                easing: Easing.linear
            },
            this.state.modalData, // The value to drive
            {
                toValue: Dimensions.get('window').height+90,
                duration: 500,
                easing: Easing.linear
            },
        ).start();
        Animated.timing(
            // Animate value over time
            this.state.modalData, // The value to drive
            {
                toValue: 0,
                duration: 500,
                easing: Easing.linear
            },
        ).start();
        this.setState({ addressForm: true, confirmAddress: this.state.address, dataForm: false });
    }

    dataBtn() {
        const latitude = this.state.mapRegion.latitude;
        const longitude = this.state.mapRegion.longitude;
        this.setState({mapRegion: { latitude: latitude, longitude: longitude, latitudeDelta: 1.003, longitudeDelta: 1.0 }});
        
        
        if(this.state.marka == '') {
            return this.setState({ errMarka: 'flex' });
        } else {
            this.setState({ errMarka: 'none' });
        }
        if(this.state.model == '') {
            return this.setState({ errModel: 'flex' });
        } else {
            this.setState({ errModel: 'none' });
        }
        if(this.state.errYearRel == '') {
            return this.setState({ errYearRel: 'flex' });
        } else {
            this.setState({ errYearRel: 'none' });
        }
        Animated.timing(
            this.state.modalData,
            {
                toValue: Dimensions.get('window').height+90,
                duration: 500,
                easing: Easing.linear
            },
        ).start();
        this.setState({ chooseMechanic: true, dataForm: true, acceptBtn: true, });
        
    }

    closeStr() {

        Animated.timing(
            // Animate value over time
            this.state.modalStr, // The value to drive
            {
                toValue: -200,
                duration: 500,
                easing: Easing.linear
            },
            this.state.modalData, // The value to drive
            {
                toValue: -200,
                duration: 500,
                easing: Easing.linear
            },
        ).start();
        this.setState({ fonCloseStr: false });
    }

    handleClickHeader = (value) => {
        this.setState({clickHeader: value});
    }

    pressDriver(value) {
      this.setState({ dataDriver: !this.state.dataDriver });
      console.log('key driver ', value);
      console.log('key driver', this.state.drivers[value]);
      this.setState({
        showDesc: this.state.drivers[value].description,
        showTimeWork: this.state.drivers[value].timeWork,
        showPriceWork: this.state.drivers[value].priceWork,
        avatar: this.state.drivers[value].avatar,
        advanced: this.state.drivers[value].advanced,
        expeirence: this.state.drivers[value].expeirence,
        rating: this.state.drivers[value].rating
      })
    }

    async chooseDriver() {
      
      let id = makeid(10);

      const latitude = this.state.mapRegion.latitude;
      const longitude = this.state.mapRegion.longitude;
      this.setState({mapRegion: { latitude: latitude, longitude: longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }});
      
      
      await firebase.database().ref('zakaz/' + id).set({
          uidDriver: this.state.drivers[this.state.keyDriver].driverId,
          address: this.state.address,
          marka: this.state.marka,
          model: this.state.model,
          yearRel: this.state.yearRel,
          happened: this.state.happened,
          typeWork: this.state.typeWork,
          time: this.state.time,
          checked: this.state.checked,
          checkedZap: this.state.checkedZap,
          user: this.state.userKey,
          publish: new Date(),
          latitude: this.state.latitude,
          longitude: this.state.longitude

        }, (error) => {
          if (error) {
              console.log('err', error);
          } else {
              console.log('Data saved positon');
          }
      })
      .then(() => {
          console.log('popup open');
          
            this.setState({ popSuccess: true });
            setTimeout(() => {
                this.setState({ popSuccess: false });
                this.props.navigation.navigate('MyZakaz');
            }, 1000)
      })
      .catch(err => {
          console.log('err', err);
          
      })

      await firebase.database().ref('users/' + this.state.drivers[this.state.keyDriver].driverId + '/zakaz/' + id).update({
          zakaz: id,
          idUser: this.state.userKey,
          publish: new Date(),
          latitude: this.state.latitude,
          longitude: this.state.longitude
        }, (error) => {
          if (error) {
              console.log('err', error);
          } else {
              console.log('Data saved positon');
          }
      });

      await firebase.database().ref('users/' + this.state.drivers[this.state.keyDriver].driverId).once("value", (data) => {
        
        fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "to": data.toJSON().expoToken,
                "title": "Новый заказ",
                "sound": "default",
                "body": ""
            }),
        })
        .then(() => {
            console.log('push notififaction send');
            
        })
      });

      await firebase.database().ref('users/' + this.state.userKey + '/myZakaz/' + id).update({
          zakaz: id,
          idUser: this.state.drivers[this.state.keyDriver].driverId,
          publish: new Date(),
          latitude: this.state.latitude,
          longitude: this.state.longitude
        }, (error) => {
          if (error) {
              console.log('err', error);
          } else {
              console.log('Data saved positon');
          }
      });

      this.setState({
        chooseMechanic: false,
        dataDriver: false,
        acceptBtn: false,
        addressForm: false,
        confirmAddress: ''
      })
    }

    // KeyBoard
    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
        this.keyboardDidShowSub.remove();
        this.keyboardDidHideSub.remove();
    }
    componentWillMount() {
        this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
        this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
    }

    handleKeyboardDidShow = (event) => {
          console.log('didShow');
          
        const { height: windowHeight } = Dimensions.get('window');
        const keyboardHeight = event.endCoordinates.height;
        const currentlyFocusedField = TextInputState.currentlyFocusedField();
        UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
          const fieldHeight = height;
          const fieldTop = pageY;
          const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
          if (gap >= 0) {
            return;
          }
          Animated.timing(
            this.state.shift,
            {
              toValue: gap,
              duration: 500,
              useNativeDriver: true,
            }
          ).start();
          Animated.timing(
            this.state.selectMechanic,
            {
              toValue: gap,
              duration: 500,
              useNativeDriver: true,
            }
          ).start();
        });
    }
    
    handleKeyboardDidHide = () => {
        console.log('hidden key');
        
      Animated.timing(
        this.state.shift,
        {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }
      ).start();
      Animated.timing(
        this.state.selectMechanic,
        {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }
      ).start();
    }
    // KeyBoard

    handleAppStateChange = (nextAppState) => {
        firebase.database().ref("positionDriver/"+this.state.userKey).remove();  
    }

    async registerForPushNotificationsAsync() {
        const { status: existingStatus } = await Permissions.getAsync(
          Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;
      
        // only ask if permissions have not already been determined, because
        // iOS won't necessarily prompt the user a second time.
        if (existingStatus !== 'granted') {
          // Android remote notification permissions are granted during the app
          // install, so this will only ask on iOS
          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
          finalStatus = status;
        }
      
        // Stop here if the user did not grant permissions
        if (finalStatus !== 'granted') {
          return;
        }
      
        // Get the token that uniquely identifies this device
        let token = await Notifications.getExpoPushTokenAsync();
        console.log('tokenExpo', token);
        
        firebase.database().ref("users/"+this.state.userKey).update({
            expoToken: token,
        })
    }

    setDate(newDate) {
        console.log('newdate', newDate);
        
        this.setState({time: newDate});
    }

    showDatePicker() {
        this.setState({ showDatePicker: true, })
    }

    render() {
        const { shift } = this.state;
        const { selectMechanic } = this.state;
        const { navigation } = this.props;
        let countTime = 0;
        let count = 0;
        let name = '';
        if(this.state.load == true || this.state.loadFont == false) {
            return <LoadIndicator />
        }
        return (
            <View style={{flex: 1, height: 200, width: Dimensions.get('window').width}}>
                {/* Success */}
                <View style={{
                    position: this.state.popSuccess == false ? 'relative' : 'absolute',
                    display: this.state.popSuccess == false ? 'none' : 'flex',
                    right: 0,
                    top: 50,
                    zIndex: 1000000000000
                }}>
                    <SuccessPopUp text="Информация о заявке находится в Мои заказы" color="#EBEBEB" />
                </View>
                {/* Success */}
                <View style={{
                    position: 'absolute',
                    // top: 50,
                    // left: 50,
                    zIndex: 100000,
                    elevation: 1000
                }}>
                    
                    {
                        this.state.role == 'mechanic' ? <MechanicHeader 
                        navigation={this.props.navigation} page="Dashboard"
                        click={this.handleClickHeader}
                        style={{ width: '100%', height: this.state.clickHeader == false ? 50 : '100%', position: 'absolute' }} />
                        : <HeaderClient navigation={this.props.navigation} page="Dashboard"
                        click={this.handleClickHeader}
                        style={{ width: '100%', height: this.state.clickHeader == false ? 50 : '100%', position: 'absolute' }} />
                    }

                </View>
                
                

                <View style={{
                    position: 'absolute',
                    top: 50,
                    
                    zIndex: 1000,
                }}>
                    {
                        this.state.acceptBtn == true ? <Text style={{
                            alignItems: 'center',
                            fontSize: 20,
                            justifyContent: 'center',
                            left: '40%',
                        }}>
                            Выберите механика
                        </Text>
                        :
                        <Text style={{
                            fontSize: 20,
                            left: '160%',
                        }}>
                            {this.state.confirmAddress}
                        </Text>
                    }
                
                </View>
                <MapView
                    // initialRegion={this.state.mapRegion}
                    region={this.state.mapRegion}
                    showsUserLocation={true}
                    showsCompass={true}
                    rotateEnabled={true}
                    style={{flex: 1}}
                >
                    {
                        navigation.getParam('userLatitude') != null ? <Polyline
                        coordinates={[
                            { latitude: this.state.latitude, longitude: this.state.longitude},
                            { latitude: navigation.getParam('userLatitude'), longitude: navigation.getParam('userLongitude') },
                        ]}
                        strokeColor="#3BD88D" // fallback for when `strokeColors` is not supported by the map-provider
                        strokeColors={[
                            '#3BD88D',
                        ]}
                        strokeWidth={2}
                    /> : <Polyline
                    coordinates={[
                { latitude: 37.7896386, longitude: -122.421646 },
                { latitude: 37.7665248, longitude: -122.4161628 },
                { latitude: 37.7734153, longitude: -122.4577787 },
                { latitude: 37.7948605, longitude: -122.4596065 },
                { latitude: 37.8025259, longitude: -122.4351431 }
                    ]}
                    strokeColor="#3BD88D" // fallback for when `strokeColors` is not supported by the map-provider
                    strokeColors={[
                        '#3BD88D',
                    ]}
                    strokeWidth={3}
                />
                    }
                
                    {
                        this.state.drivers.map((value, key) => {
                            name = 'openDrive'+count;
                            count++;

                            return <TouchableOpacity style={{
                                width: 100,
                                height: 50,
                                position: 'absolute' }}
                                key={key} >
                                    <MapView.Marker.Animated
                                        coordinate={
                                            new MapView.AnimatedRegion({
                                                latitude: value.latitude,
                                                longitude: value.longitude,
                                                latitudeDelta: 0.045,
                                                longitudeDelta: 0.045
                                            })
                                        }
                                        anchor={{ x: 0.35, y: 0.32 }}
                                        ref={marker => { this.marker = marker }}
                                        styles={{
                                            width: 50,
                                            height: 50,
                                            position: 'absolute' }}
                                        onPress={() => {
                                            this.setState({ [name]: !this.state[name], keyDriver: key });
                                            console.log(this.state[name]);
                                            this.pressDriver(key)
                                        }}
                                    >
                                        {/* <Image source={car} style={{
                                            width: 20,
                                            height: 20
                                        }} /> */}
                                        <View style={{
                                            width: 17,
                                            height: 17,
                                            borderRadius: 100,
                                            backgroundColor: '#ED5565'
                                        }}>

                                        </View>


                                    </MapView.Marker.Animated>

                            </TouchableOpacity>
                        })
                    }



                </MapView>

                {/* Data driver */}
                {
                    this.state.role == 'mechanic' ? <View></View> 
                    :
                    <View style={{
                        display: this.state.dataDriver == false ? 'none' : 'flex',
                        position: this.state.dataDriver == false ? 'relative' : 'absolute',
                        // top: 80,
                        width: Dimensions.get('window').width,
                        height: Dimensions.get('window').height*0.5,
                        justifyContent: 'center',
                        alignItems: 'center',
                        top: 80,
                        zIndex: 10000000,
                        elevation: 1000000
                    }}>
                        <View style={{
                            backgroundColor: '#fff',
                            width: Dimensions.get('window').width*0.8,
                            padding: 12,
                            zIndex: 1000000,
                            elevation: 10000,
                            position: 'absolute'
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <View>
                                { 
                                    this.state.drivers[this.state.keyDriver] == undefined ? <Avatar rounded title="TP" size="medium" /> :
                                    this.state.drivers[this.state.keyDriver].avatar == '' ? <Avatar rounded title="TP" size="medium" /> : <Avatar
                                        rounded
                                        size="medium"
                                        source={{
                                        uri:
                                            this.state.avatar,
                                        }}
                                    />
                                }
                                </View>
                                <View>
                                    <View style={{
                                        width: Dimensions.get('window').width*0.4,
                                        marginLeft: 10,
                                    }}>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            borderBottomColor: '#DEDEDE',
                                            borderBottomWidth: 1,
                                            paddingBottom: 5
                                        }}>
        
                                            <Text style={{
                                                fontSize: 14,
                                                opacity: this.state.expeirence == undefined || this.state.expeirence == '' ? 0 : 1
                                            }}>Стаж<Text style={{
                                                fontSize: 14,
                                                color: '#3BD88D',
                                                fontFamily: 'TTCommons-Medium'
        
                                            }}> {this.state.expeirence} года</Text></Text>
                                            <View style={{
                                                flexDirection: 'row',
                                                fontFamily: 'TTCommons-Medium'
                                            }}>
                                                <Text style={{
                                                    marginRight: 5,
                                                    fontSize: 14,
                                                    color: '#FFC850',
                                                    fontFamily: 'TTCommons-Regular'
                                                }}>{this.state.rating == undefined || this.state.rating == '' ? '2.5' : this.state.rating}</Text>
                                                <Image source={rating} style={{
                                                    width: 14,
                                                    height: 14
                                                }} />
                                            </View>
                                        </View>
                                        <View style={{
                                            marginTop: 7,
                                            opacity: this.state.advanced == undefined || this.state.advanced == '' ? 0 : 1
                                        }}>
                                            <Text style={{
                                                fontFamily: 'TTCommons-Medium',
                                                fontSize: 11,
                                                color: '#000'
                                            }}>{this.state.advanced}</Text>
                                        </View>
                                        <View style={{
                                            marginTop: 7
                                        }}>
                                            <Text style={{
                                                fontFamily: 'TTCommons-Regular',
                                                fontSize: 11,
                                                color: '#464646'
                                            }}>{this.state.showDesc}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
        
                            }}>
                                <View style={{
                                    justifyContent: 'center'
                                }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginTop: 15
                                    }}>
                                        <Text style={{
                                            fontSize: 9,
                                            fontFamily: 'TTCommons-Medium',
                                        }}>Примерное время работы:</Text>
                                        <Text style={{
                                            fontSize: 9,
                                            fontFamily: 'TTCommons-DemiBold',
                                            marginLeft: 5
                                        }}>{this.state.showTimeWork} ч.</Text>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginTop: 15,
                                    }}>
                                        <Text style={{
                                            fontSize: 9,
                                            fontFamily: 'TTCommons-Medium',
                                        }}>Примерная цена работы:</Text>
                                        <Text style={{
                                            fontSize: 9,
                                            fontFamily: 'TTCommons-DemiBold',
                                            marginLeft: 5
                                        }}>{this.state.showPriceWork} р.</Text>
                                    </View>
                                </View>
                                <View style={{
                                opacity: this.state.acceptBtn == true ? 1 : 0
                                }}>
                                <TouchableOpacity style={[styles.btn, {
                                    height: 60,
                                    width: 90,
                                    padding: 0,
                                    borderRadius: 10,
                                    display: this.state.acceptBtn == true ? 'flex' : 'none',
                                    zIndex: 1000000000
                                }]}
                                onPress={() => {
                                    console.log('driver choose');
                                    this.chooseDriver();
                                }}
                                >
                                    <Text style={{color: '#fff', fontFamily: 'TTCommons-Black', fontSize: 18, margin: 0}}>Выбрать</Text>
                                </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity 
                        onPress={() => {
                            this.setState({
                                dataDriver: false,
                            })
                        }}
                        style={{
                            width: Dimensions.get('window').width,
                            height: Dimensions.get('window').height,
                            zIndex: 100,
                            position: 'absolute',
                            // backgroundColor: '#333'
                        }}>

                        </TouchableOpacity>
                    </View>
                }
                
                {/* Data driver */}

                {/* Fon close modal */}
                <TouchableOpacity style={[styles.fon, {
                    display: this.state.fonCloseStr == true ? 'flex' : 'none',
                    position: this.state.fonCloseStr == true ? 'absolute' : 'relative',

                }]} onPress={this.closeStr}>
                    <Text></Text>
                </TouchableOpacity>
                {/* Fon close modal */}

                {/* Address form */}
                {
                    this.state.role == 'mechanic' ? <View></View> : <TouchableOpacity style={[styles.where, {
                        display: this.state.addressForm == true ? 'none' : 'flex',
                        position: this.state.addressForm == true ? 'relative' : 'absolute'
                    }]} onPress={this.streetSelect}>
                        <Text style={{ color: '#737373', textAlign: 'center' }}>Заказать механика</Text>
                    </TouchableOpacity>
                }
                
                
                <Animated.View style={[styles.formWhere, {bottom: this.state.modalStr,}]}>
                    <Animated.View style={[styles.container, { transform: [{translateY: shift}], backgroundColor: '#fff' }]}>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>

                        <Text style={[styles.errText, { display: this.state.errAddress }]}>Введите адрес</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Введите адрес"
                            onChange={(text) => {
                                if(text == '') {
                                    this.setState({ errAddress: 'flex' });
                                } else {
                                    this.setState({ errAddress: 'none' });
                                }
                                text2 = text.nativeEvent.text;
                                this.setState({ address: text.nativeEvent.text })

                            }}
                            value={this.state.address} />
                        <TouchableOpacity style={styles.btn} onPress={this.addressBtn}>
                            <Text style={{color: '#fff'}}>Подтвердить</Text>
                        </TouchableOpacity>
                    </View>
                    </Animated.View>
                </Animated.View>
                {/* Address form */}

                {/* Data */}
                {/* <TouchableOpacity style={[styles.where, {
                    display: this.state.addressForm == true && this.state.dataForm == false ? 'flex' : 'none',
                    position: this.state.addressForm == true && this.state.dataForm == false ? 'absolute' : 'relative'
                }]} onPress={this.dataSelect}>
                    <Text style={{ color: '#737373', textAlign: 'center' }}>Выбор механика</Text>
                </TouchableOpacity> */}

                <Animated.View style={[styles.formWhere, {
                    top: this.state.modalData,
                    height: '100%',
                    zIndex: 1000000,
                    width: Dimensions.get('window').width,
                }]}>
                    <Animated.View style={[styles.container, { transform: [{translateY: selectMechanic}], backgroundColor: '#fff' }]}>
                        <ScrollView>
                            <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            width: Dimensions.get('window').width,
                        }}>
                            <Text style={{
                                    fontSize: 20,
                                    textAlign: 'center',
                                    marginTop: 25
                                }}>{this.state.address}</Text>
                            <View style={[styles.containerInput, {
                                marginTop: 20
                            }]}>

                                <Text style={[styles.label, {
                                    display: this.state.marka == '' ? 'none' : 'flex',
                                }]}>
                                    Марка
                                </Text>
                                <Text style={[styles.errText, { display: this.state.errMarka }]}>Марка</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Марка"
                                    onChange={(text) => {
                                        if(text == '') {
                                            this.setState({ errMarka: 'flex' });
                                        } else {
                                            this.setState({ errMarka: 'none' });
                                        }
                                        this.setState({ marka: text.nativeEvent.text })
                                    }} />
                            </View>
                            <View style={styles.containerInput}>
                                <Text style={[styles.label, {
                                    display: this.state.model == '' ? 'none' : 'flex',

                                }]}>
                                    Модель
                                </Text>
                                <Text style={[styles.errText, { display: this.state.errModel }]}>Модель</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Модель"
                                    onChange={(text) => {
                                        if(text == '') {
                                            this.setState({ errModel: 'flex' });
                                        } else {
                                            this.setState({ errModel: 'none' });
                                        }
                                        this.setState({ model: text.nativeEvent.text })
                                    }} />
                            </View>
                            <View style={styles.containerInput}>
                                <Text style={[styles.label, {
                                    display: this.state.yearRel == '' ? 'none' : 'flex',

                                }]}>
                                    Год выпуска
                                </Text>
                                <Text style={[styles.errText, { display: this.state.errYearRel }]}>Год выпуска</Text>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    placeholder="Год выпуска"
                                    onChange={(text) => {
                                        if(text == '') {
                                            this.setState({ errYearRel: 'flex' });
                                        } else {
                                            this.setState({ errYearRel: 'none' });
                                        }
                                        this.setState({ yearRel: text.nativeEvent.text })
                                    }} />
                            </View>
                            <View style={styles.containerInput}>
                                <Text style={[styles.label, {
                                    display: this.state.typeWork == '' ? 'none' : 'flex',

                                }]}>
                                    Тип работ
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Тип работ"
                                    onChange={(text) => {
                                        this.setState({ typeWork: text.nativeEvent.text })
                                    }} />
                            </View>
                            
                            <View style={[styles.containerInput, {
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]}>
                                <Text style={{
                                    marginRight: 20,
                                    width: '50%'
                                }}>Свои запчасти</Text>
                                <CheckBox
                                        centers
                                        checked={this.state.checkedZap}
                                        checkedColor='#3BD88D'
                                        uncheckedColor='#3BD88D'
                                        onPress={() => {
                                            this.setState({ checkedZap: !this.state.checkedZap });
                                        }}
                                        />
                            </View>
                            
                            <View style={[styles.containerInput, {
                                flexDirection: 'row',
                                zIndex: 1000000,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]}>
                                <Text style={{
                                    marginRight: 20,
                                    width: '50%' }}>Во сколько приехать механику</Text>
                                    {/* Select */}
                                    <TouchableOpacity style={styles.containerSelect} onPress={() => {
                                        this.setState({ openSelect: !this.state.openSelect })
                                    }}>
                                        <Text style={{
                                            color: '#fff',
                                            marginRight: 5
                                        }}>
                                            БВ
                                        </Text>
                                        <Image source={downArrow} />
                                    </TouchableOpacity>


                                    {/* Select */}
                            </View>
                            
                            {/* Select */}
                            <View style={{
                                position: this.state.openSelect == true ? 'absolute' : 'relative',
                                display: this.state.openSelect == true ? 'flex' : 'none',
                                bottom: Dimensions.get('window').height < 600 ? Dimensions.get('window').height*0.30 : Dimensions.get('window').height*0.20,
                                right: Dimensions.get('window').width<350 ? Dimensions.get('window').width*0.2 : Dimensions.get('window').width*0.2,
                                zIndex: 100000000000000,
                                elevation: 1000,
                            }}>
                                <View style={styles.triangle}></View>
                                <View style={styles.contentSelect}>

                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        zIndex: 100000000,
                                    }}
                                    >
                                        <View>
                                            <Text>
                                                Ближайшое время
                                            </Text>
                                        </View>
                                        
                                        <CheckBox
                                        center
                                        checkedIcon='dot-circle-o'
                                        uncheckedIcon='circle-o'
                                        checked={this.state.checked}
                                        checkedColor='#3BD88D'
                                        uncheckedColor='#3BD88D'
                                        onPress={() => {
                                            this.setState({ checked: !this.state.checked });
                                        }}
                                        />

                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        zIndex: 1000000000,
                                        height: 50,
                                    }}
                                    >
                                        <View>
                                            <Text>
                                                Определенное время
                                            </Text>
                                        </View>
                                        <TextInput style={{
                                                width: 70,
                                                borderColor: '#3BD88D',
                                                borderWidth: 1,
                                                fontSize: 9,
                                                height: 30
                                            }}
                                            keyboardType="phone-pad"
                                            placeholder="Дата Время"
                                            value={this.state.time}
                                            onChange={(text) => {
                                                
                                                if(text != '') {
                                                    this.setState({ checked: false });
                                                }
                                                if(text.nativeEvent.text.length <= 16) {
                                                    this.setState({ time: text.nativeEvent.text });
                                                }
                                                
                                                if(text.nativeEvent.text == 0) {
                                                    if(countTime == 1) {
                                                        this.setState({ time: '' });
                                                        // countTime = 0;
                                                    }
                                                    
                                                }
                                                if(text.nativeEvent.text.length == 2) {
                                                    
                                                    console.log('time', countTime);
                                                    if(countTime != 5) {
                                                        let changeDot = text.nativeEvent.text + '.'
                                                        this.setState({ time: changeDot });
                                                        countTime = 1;
                                                    } else {
                                                        countTime = 1;
                                                    }
                                                }
                                                if(text.nativeEvent.text.length == 5) {
                                                    console.log('count 5!! ', text.nativeEvent.text.length);
                                                    // if(countTime != 6) {
                                                        let changeDot = text.nativeEvent.text + '.'
                                                        this.setState({ time: changeDot });
                                                        countTime = 5;
                                                    // } else {
                                                        // countTime = 5;
                                                    // }
                                                }
                                                if(text.nativeEvent.text.length == 10) {
                                                    console.log('11');
                                                    
                                                    this.setState({ time: text.nativeEvent.text + ' ' });
                                                    countTime = 6
                                                }
                                                if(text.nativeEvent.text.length == 13) {
                                                    this.setState({ time: text.nativeEvent.text + ':' });
                                                }
                                            }}
                                        />
                                        {/* <TouchableOpacity onPress={() => this.showDatePicker()}>
                                            <Text style={{
                                                fontFamily: 'TTCommons-DemiBold',
                                                fontSize: 9,
                                                alignItems: 'center'
                                            }}>Выберите время</Text>
                                        </TouchableOpacity> */}
                                        
                                    </View>
                                </View>
                            </View>
                                {/* Select */}
                            <View style={[styles.containerInput]}>
                                <Text style={[styles.label, {
                                    display: this.state.happened == '' ? 'none' : 'flex',

                                }]}>
                                    Что случилось?
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Что случилось?"
                                    onChange={(text) => {
                                        this.setState({ happened: text.nativeEvent.text })
                                    }} />
                            </View>
                            <TouchableOpacity style={styles.btn} onPress={this.dataBtn}>
                                <Text style={{color: '#fff'}}>Подтвердить</Text>
                            </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </Animated.View>
                </Animated.View>
                {/* Data */}
            </View>
        );
    }
}

const styles = {
    where: {
        position: 'absolute',
        bottom: 20,
        width: Dimensions.get('window').width*70/100,
        backgroundColor: '#fff',
        borderRadius: 25,
        padding: 11,
        justifyContent: 'center',
        alignItems: 'center',
        left: '15%'
    },
    formWhere: {
        width: '100%',
        position: 'absolute',
        bottom: Dimensions.get('window').height - (Dimensions.get('window').height*90/100),
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        zIndex: 100,
        borderTopRadius: 25,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#3BD88D',
        width: Dimensions.get('window').width*70/100,
        textAlign: 'left',
        color: '#737373',
        fontSize: 21,
        // fontFamily: 'TTCommons-Regular'
    },
    btn: {
        width: Dimensions.get('window').width*70/100,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3BD88D',
        borderRadius: 27.5,
        // fontFamily: 'TTCommons-Regular',
        fontSize: 18,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 1,
    },
    fon: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        zIndex: 10
    },
    errText: {
        color: 'red',
        fontSize: 16
    },
    containerInput: {
        marginBottom: 50,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        position: 'relative',
        width: Dimensions.get('window').width*70/100,
        zIndex: 100
    },
    label: {
        // fontFamily: 'TTCommons-Regular',
        fontSize: 14,
        color: '#3BD88D',
        textAlign: 'left'
    },
    // Select
    containerSelect: {
        padding: 10,
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: '#3BD88D',
        width: 76,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        borderRadius: 10,
        flexDirection: 'row',

    },
    triangle: {
        backgroundColor: '#3BD88D',
        width: 30,
        height: 30,
        transform: [{
            rotate: '45deg'
        }],
        position: 'absolute',
        right: 20,
        top: -10
    },
    contentSelect: {
        width: Dimensions.get('window').width*70/100,
        height: 100,
        backgroundColor: '#fff',
        position: 'absolute',
        right: 0,
        zIndex: 10000000000000,
        elevation: 1000000,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 10
    },
    // Select
    dataDriver: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 5,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    topUser: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 1000
    },
    container: {
        flex: 1,
    },
}

export default MainClient;
