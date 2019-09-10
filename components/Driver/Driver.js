import React, {Component} from 'react';
import { Text, View, Image, StyleSheet, Dimensions, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import MapView from 'react-native-maps';

class Driver extends Component {
    constructor(props) {
        super(props);
        const driver = this.props.driver ? 
            this.props.driver : { uid: "noDriverPassed", 
            location: { latitude: 0, longitude: 0 } 
        }
        const coordinate = new MapView.AnimatedRegion({
            latitude: driver.location.latitude,
            longitude: driver.location.longitude,
            latitudeDelta: 0.045,
            longitudeDelta: 0.045
        });
        this.state = {
            driver: driver,
            coordinate: coordinate,
            bearing: 0
        }
    }
    render() {
        return(
            <MapView.Marker.Animated
                coordinate={this.state.coordinate}
                anchor={{ x: 0.35, y: 0.32 }}
                ref={marker => { this.marker = marker }}
                styles={{ width: 50, height: 50 }}
            >
                <View style={{
                    height: 12,
                    width: 12,
                    borderRadius: 50,
                    backgroundColor: '#1C1C1C',
                    position: 'absolute',

                }}></View>
            </MapView.Marker.Animated>
        )
    }
}

const styles = StyleSheet.create({

})

export default Driver;