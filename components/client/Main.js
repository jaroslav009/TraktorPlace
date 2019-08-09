import React, {Component} from 'react';
import { Text, View, Image, Dimensions, TouchableOpacity, TextInput, Animated, Easing, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import * as firebase from 'firebase';
import { CheckBox } from 'react-native-elements'
import { Avatar } from 'react-native-elements';

import Fonts from '../../constants/Fonts';
import LoadIndicator from '../../constants/LoadIndicator';

import downArrow from '../../assets/images/down-arrow.png';

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
            ]
        }
        this.streetSelect = this.streetSelect.bind(this);
        this.closeStr = this.closeStr.bind(this);
        this.addressBtn = this.addressBtn.bind(this);
        this.dataSelect = this.dataSelect.bind(this);
        this.dataBtn = this.dataBtn.bind(this);
    }
    async componentDidMount() {
        console.log('anufe', this.state.modalStr.Value);
        await firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                console.log('user', user.uid);
                this.setState({ uid: user.uid });
            }
            
        });

        await this._getLocationAsync();

        firebase.database().ref('positionDriver/').on('value', (snapshot) => {
            let keySnappshot = Object.keys(snapshot.val());
            let arrBoof = [];
            let count = 0;
            let name = ''
            keySnappshot.map((value, key) => {
                arrBoof.push(snapshot.val()[value]);
                name = 'openDrive'+count;
                this.setState({ [name]: false });
                count++;
            });
            this.setState({ drivers: arrBoof });
            console.log(`drivers
                        ${this.state.openDrive1}`);
            console.log(this.state.drivers);
            

        });        
        this.setState({ load: false });
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
        let location = await Location.watchPositionAsync({}, (dataLoc) => {
            console.log('dataloc', dataLoc);
            
            firebase.database().ref('positionDriver/' + this.state.uid).set({
                latitude: dataLoc.coords.latitude,
                longitude: dataLoc.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
              }, function(error) {
                if (error) {
                    console.log('err', error);
                } else {
                    console.log('Data saved positon');
                }
            });
            this.setState({ latitude: dataLoc.coords.latitude, longitude: dataLoc.coords.longitude })
            this.setState({mapRegion: { latitude: dataLoc.coords.latitude, longitude: dataLoc.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }});
        });
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
        this.setState({ addressForm: true, confirmAddress: this.state.address });
    }

    dataBtn() {
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
        this.setState({ chooseMechanic: true, dataForm: true });
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

    render() {
        let text2 = '';
        let count = 0;
        let name = '';
        console.log('render', this.state.drivers[0].latitude);
        if(this.state.load == true) {
            return <LoadIndicator />
        }
        return (
            <View style={{flex: 1, height: '100%'}}>
                {/* <Text>Location: {this.state.latitude} </Text> */}
                <Text style={{
                    position: 'absolute',
                    top: 50,
                    left:'40%',
                    zIndex: 1000,
                    fontSize: 20
                }}>{this.state.confirmAddress}</Text>
                <MapView
                    initialRegion={this.state.mapRegion}
                    showsUserLocation={true}
                    showsCompass={true}
                    rotateEnabled={true}
                    style={{flex: 1}}
                >
                    
                    {
                        this.state.drivers.map((value, key) => {
                            name = 'openDrive'+count;
                            count++;
                            return <TouchableOpacity style={{ 
                                width: Dimensions.get('window').width, 
                                height: Dimensions.get('window').height,
                                position: 'absolute' }}
                                key={key}>
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
                                        width: 600, 
                                        height: 600,
                                        position: 'absolute' }}
                                    onPress={() => {
                                        this.setState({ [name]: !this.state[name] });
                                        console.log(this.state[name]);
                                    }}
                                >
                                    <TouchableOpacity style={{
                                        height: 12,
                                        width: 12,
                                        borderRadius: 50,
                                        backgroundColor: '#1C1C1C',
                                        position: 'absolute',
                                        zIndex: 123123123123
                                    }}
                                    ></TouchableOpacity>
                                    
                                    
                                </MapView.Marker.Animated>
                                
                            </TouchableOpacity>
                        })
                    }
                    
                    {
                        this.state.drivers.map((value, key) => {
                            name = 'openDrive'+count;
                            count++;
                            return <MapView.Marker.Animated 
                            coordinate={
                                new MapView.AnimatedRegion({
                                    latitude: value.latitude+0.0001,
                                    longitude: value.longitude,
                                    latitudeDelta: 0.045,
                                    longitudeDelta: 0.045
                                })
                            }
                            anchor={{ x: 0.35, y: 0.32 }}
                            ref={marker => { this.marker = marker }}
                            styles={{ 
                                width: 1000, 
                                height: 1000,
                                position: 'relative',
                            right: -800 }}
                            onPress={() => {
                                this.setState({ [name]: !this.state[name] });
                                console.log(this.state[name]);
                            }}
                            >
                                <View style={[styles.dataDriver,
                                {
                                    position: 'absolute',
                                    width: 1000,
                                    height: 1000
                                    //    TO DO
                                    //    position: this.state[name] == true ? 'absolute' : 'relative',
                                    //    display: this.state[name] == true ? 'flex' : 'none'
                                    //    TO DO
                                }

                                ]}>
                                    <View style={styles.topUser}>
                                        {/* <Avatar rounded title="MD" /> */}
                                            <Text style={{
                                                color: '#333'
                                            }}>Стаж <Text style={{
                                                color: '#3BD88D'
                                            }}>2 года</Text> </Text>
                                            <Text>4.8</Text>
                                    </View>
                                </View>
                            </MapView.Marker.Animated>

                        })
                    }

                </MapView>

                {/* Fon close modal */}
                <TouchableOpacity style={[styles.fon, {
                    display: this.state.fonCloseStr == true ? 'flex' : 'none',
                    position: this.state.fonCloseStr == true ? 'absolute' : 'relative',
                    
                }]} onPress={this.closeStr}>
                    <Text></Text>
                </TouchableOpacity>
                {/* Fon close modal */}

                {/* Address form */}
                <TouchableOpacity style={[styles.where, {
                    display: this.state.addressForm == true ? 'none' : 'flex',
                    position: this.state.addressForm == true ? 'relative' : 'absolute'
                }]} onPress={this.streetSelect}>
                    <Text style={{ color: '#737373', textAlign: 'center' }}>Куда?</Text>
                </TouchableOpacity>
                
                <Animated.View style={[styles.formWhere, {
                    bottom: this.state.modalStr,
                }]}>
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
                                console.log('text2', text.nativeEvent.text);
                                
                            }}
                            value={this.state.address} />
                        <TouchableOpacity style={styles.btn} onPress={this.addressBtn}>
                            <Text style={{color: '#fff'}}>Подтвердить</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
                {/* Address form */}

                {/* Data */}
                <TouchableOpacity style={[styles.where, {
                    display: this.state.addressForm == true && this.state.dataForm == false ? 'flex' : 'none',
                    position: this.state.addressForm == true && this.state.dataForm == false ? 'absolute' : 'relative'
                }]} onPress={this.dataSelect}>
                    <Text style={{ color: '#737373', textAlign: 'center' }}>Выбор механика</Text>
                </TouchableOpacity>

                <Animated.View style={[styles.formWhere, {
                    top: this.state.modalData,
                    height: '100%'
                }]}>
                    <ScrollView>
                        <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%'
                    }}>
                        <Text style={{
                                fontSize: 20,
                                textAlign: 'center'
                            }}>{this.state.address}</Text>
                        <View style={styles.containerInput}>
                            
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
                        <View style={[styles.containerInput, {
                            flexDirection: 'row'
                        }]}>
                            <Text style={{
                                marginRight: 20,
                                width: '50%'
                            }}>Свои запчасти</Text>
                            <CheckBox
                                    center
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
                            bottom: Dimensions.get('window').height*0.30,
                            right: Dimensions.get('window').width*0.09,
                            
                        }}>
                            <View style={styles.triangle}></View>
                            <View style={styles.contentSelect}> 
                                
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    zIndex: 100000000
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
                                    zIndex: 1000,
                                    height: 50
                                }}
                                >
                                    <View>
                                        <Text>
                                            Определенное время
                                        </Text>
                                    </View>
                                    <TextInput style={{
                                        width: 46,
                                        borderColor: '#3BD88D',
                                        borderWidth: 1
                                    }} 
                                    onChange={(text) => {
                                        if(text != '') {
                                            this.setState({ checked: false });
                                        }
                                        this.setState({ time: text.nativeEvent.text });
                                    }}
                                    />
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
        backgroundColor: '#fff',
        position: 'absolute',
        right: 0,
        
        zIndex: 10000000,
        elevation: 2,
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
    }
}

export default MainClient;