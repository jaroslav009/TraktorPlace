import React, {Component} from 'react';
import { Text, View, Image, Dimensions, TouchableOpacity, TextInput, Animated, Easing } from 'react-native';

import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

import Fonts from '../../constants/Fonts';

import MapView from 'react-native-maps';
import Driver from '../Driver/Driver';

class MainClient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            region: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.922,
                longitudeDelta: 0.0421
            },
            locationResult: null,
            modalStr: new Animated.Value(-200),
            fonCloseStr: false,
        }
        this.streetSelect = this.streetSelect.bind(this);
        this.closeStr = this.closeStr.bind(this);
    }
    async componentDidMount() {
        console.log('anufe', this.state.modalStr.Value);
        
        await this._getLocationAsync();
        console.log('dwqwqd',this.state.mapRegion)
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
     
        let location = await Location.getCurrentPositionAsync({});
        this.setState({ locationResult: JSON.stringify(location) });
        
        // Center the map on the location we just fetched.
        this.setState({mapRegion: { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }});
            
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

    closeStr() {
        
        Animated.timing(
            // Animate value over time
            this.state.modalStr, // The value to drive
            {
                toValue: -200,
                duration: 500,
                easing: Easing.linear
            },
        ).start();
        this.setState({ fonCloseStr: false });
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Text>Location: {this.state.locationResult} </Text>
                
                <MapView
                    initialRegion={this.state.mapRegion}
                    showsUserLocation={true}
                    showsCompass={true}
                    rotateEnabled={true}
                    style={{flex: 1}}
                >
                    <Driver driver={{
                        uid: 'null',
                        location: {
                            latitude: 49.83500,
                            longitude: 24.040
                        }
                    }}></Driver>
                </MapView>
                <TouchableOpacity style={styles.where} onPress={this.streetSelect}>
                    <Text style={{ color: '#737373', textAlign: 'center' }}>Куда?</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.fon, {
                    display: this.state.fonCloseStr == true ? 'flex' : 'none',
                    position: this.state.fonCloseStr == true ? 'absolute' : 'relative',
                    
                }]} onPress={this.closeStr}>
                    <Text></Text>
                </TouchableOpacity>
                <Animated.View style={[styles.formWhere, {
                    // transform: [
                    //     { translateY: this.state.modalStr },                  
                    // ],
                    bottom: this.state.modalStr
                }]}>
                    <View>
                        <TouchableOpacity onPress={() => console.log('123456')}>
                            <TextInput 
                            style={styles.input} 
                            placeholder="Введите адрес"
                            onFocus={() => console.log('dwqdwqdw123')
                            } />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn} onPress={this.signUp}>
                            <Text style={{color: '#fff'}}>Подтвердить</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
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
        textAlign: 'center',
        color: '#737373',
        fontSize: 21,
        fontFamily: 'TTCommons-Regular'
    },
    btn: {
        width: 238,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3BD88D',
        borderRadius: 27.5,
        fontFamily: 'TTCommons-Regular',
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
    }
}

export default MainClient;