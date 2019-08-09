import React, {Component} from 'react';
import { Text, View, Dimensions, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import * as Font from 'expo-font';
import { Avatar } from 'react-native-elements';
import * as firebase from 'firebase';

import Arrow from '../../../assets/images/left-arrow.png';

class MyZakaz extends Component {
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
                        <TouchableOpacity style={{
                            paddingTop: 33,
                            paddingLeft: 16,
                            paddingBottom: 35
                        }} onPress={() => {
                            this.props.navigation.navigate('MainClient');
                        }}>
                            <Image source={Arrow} style={{ width: 15, height: 15 }} />
                        </TouchableOpacity>
                        <Text style={{
                            fontFamily: 'TTCommons-DemiBold',
                            fontSize: 20,
                            marginLeft: 30
                        }}>Мои заказы</Text>
                    </View>                    
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <View style={{
                            width: Dimensions.get('window').width*0.8,
                            backgroundColor: '#EBEBEB',
                            flexDirection: 'row',
                            borderRadius: 5,
                            padding: 10
                        }}>
                            <Avatar
                                size="medium"
                                rounded
                                icon={{name: 'user', type: 'font-awesome'}}
                                activeOpacity={0.7}
                            />
                            <View style={{
                                marginLeft: 5
                            }}>
                                <Text style={{
                                    fontFamily: 'TTCommons-Bold',
                                    fontSize: 16
                                }}>
                                    Джон Рихтер
                                </Text>
                                <View style={{
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-end',
                                }}>
                                    <Text style={{
                                        fontFamily: 'TTCommons-Regular',
                                        fontSize: Dimensions.get('window').width < 330 ? 9 : 13,
                                        marginTop: 15
                                    }}>
                                        Статус
                                    </Text>
                                    {/* <Text style={{
                                        color: '#FFCC47',
                                        fontFamily: 'TTCommons-Medium',
                                        fontSize: 13
                                    }}>Ожидает подтверждения</Text> */}
                                </View>
                            </View>
                            <View style={{
                                justifyContent: 'flex-end',
                                alignItems: 'flex-end'
                            }}>
                                <Text style={{
                                    color: '#FFCC47',
                                    fontFamily: 'TTCommons-Medium',
                                    fontSize: Dimensions.get('window').width < 330 ? 9 : 13
                                }}>Ожидает подтверждения</Text>
                            </View>
                        </View>
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
    wrapperForm: {
        marginTop: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    label: {
        fontFamily: 'TTCommons-Regular',
        fontSize: 14,
        color: '#3BD88D'
    },
    errText: {
        color: 'red',
        fontFamily: 'TTCommons-Regular',
        fontSize: 14,
    },
    itemForm: {
        borderBottomWidth: 2,
        borderBottomColor: '#3BD88D',
        width: 238,
        fontFamily: 'TTCommons-Regular',
        color: '#707070',
        fontSize: 18
    },
    btn: {
        width: Dimensions.get('window').width*70/100,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DC4732',
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
        marginBottom: 20
    },
})

export default MyZakaz;