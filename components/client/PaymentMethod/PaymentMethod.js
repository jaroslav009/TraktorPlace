import React, {Component} from 'react';
import { Text, View, Dimensions, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import * as Font from 'expo-font';
import { Avatar } from 'react-native-elements';
import * as firebase from 'firebase';

import Back from '../../Back';

import rightAngle from '../../../assets/images/right-angle.png';

import creditCard from '../../../assets/images/credit-card.png';
import hand from '../../../assets/images/hand.png';

class Help extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadFont: false,
        }
    }
    async componentDidMount() {
        console.log('width', Dimensions.get('window').width);

        await Font.loadAsync({
          'TTCommons-Bold': require('../../../assets/fonts/TTCommons-Bold.ttf'),
          'TTCommons-Regular': require('../../../assets/fonts/TTCommons-Regular.ttf'),
          'TTCommons-Medium': require('../../../assets/fonts/TTCommons-Medium.ttf'),
          'TTCommons-DemiBold': require('../../../assets/fonts/TTCommons-DemiBold.ttf'),
        })
        .then(() => {
            this.setState({ loadFont: true });
        })
        this.props.fontLoader();
    }
    render() {
        if(this.state.loadFont == true) {
            return (
                <ScrollView style={{
                    paddingBottom: 20
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingBottom: 20
                    }}>
                        <Back nav={this.props.navigation} />
                        <Text style={{
                            fontFamily: 'TTCommons-DemiBold',
                            fontSize: 20,
                            marginLeft: 30
                        }}>Способ оплаты</Text>
                    </View>

                    <View style={{
                        paddingLeft: 40,
                        paddingRight: 40
                    }}>

                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            width: '100%',
                            marginTop: 35
                        }}
                        onPress={() => this.props.navigation.navigate('AddCard') }
                        >
                            <Image source={creditCard} style={{
                                width: 43,
                                height: 44
                            }} />

                            <Text style={{
                                fontFamily: 'TTCommons-Medium',
                                color: '#000',
                                fontSize: 19,
                                marginLeft: 15
                            }}>
                                Добавить карту
                            </Text>
                        </TouchableOpacity>


                    </View>

                </ScrollView>
            )
        }
        else {
            return <View></View>
        }
    }
}

const styles = StyleSheet.create({

})

export default Help;
