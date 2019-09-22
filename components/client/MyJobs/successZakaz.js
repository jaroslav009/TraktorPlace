import React, {PureComponent} from 'react';
import { Text, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import * as Font from 'expo-font';
import * as firebase from 'firebase';

import cancel from '../../../assets/images/cancel.png';

class successZakaz extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loadFont: false,
            latitude: null,
            longitude: null
        }
    }

    async componentDidMount() {
        const { navigation } = this.props;
        await firebase.database().ref("zakaz/"+navigation.getParam('id')).on("value", async (data) => {
            console.log('data', data.toJSON().latitude);
            this.setState({
                latitude: data.toJSON().latitude,
                longitude: data.toJSON().longitude
            })
            
        });
        await Font.loadAsync({
          'TTCommons-Black': require('../../../assets/fonts/TTCommons-Black.ttf'),
        })
        .then(() => {
            this.setState({ loadFont: true });
        })
    }
    render() {
        if(this.state.loadFont == true) {

            return (
                <View>
                    <TouchableOpacity style={{
                        paddingTop: 50,
                        paddingLeft: 16,
                        paddingBottom: 35
                    }}
                    onPress={() => {
                        console.log('userLatitude', this.state.latitude);
                        
                        this.props.navigation.navigate('MainClient', {
                            userLatitude: this.state.latitude,
                            userLongitude: this.state.longitude
                        });
                    }}>
                        <Image source={cancel} style={{ width: 15, height: 15 }} /> 
                    </TouchableOpacity>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <View>
                            <Text style={{
                                fontFamily: 'TTCommons-Black',
                                marginTop: Dimensions.get('window').height*0.3,
                                color: '#3BD88D',
                                fontSize: 24,
                                textAlign: 'center',
                                width: 275
                            }}>
                                Ваш заказ принят
                            </Text>
                        </View>
                    </View>
                </View>
            )
        }
        else {
            return <View></View>
        }
    }
}

export default successZakaz;