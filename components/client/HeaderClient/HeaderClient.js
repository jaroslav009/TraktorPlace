import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, TouchableHighlight, Dimensions, Animated } from 'react-native';
import * as Font from 'expo-font';

import burger from '../../../assets/images/burger.png'

export default class HeaderClient extends Component {

    constructor(props) {
        super(props);
        let today = new Date();
        this.state = {
            date: today.getHours()+':'+today.getMinutes(),
            open: false,
            fadeAnim: new Animated.Value(-500),
            opacBack: new Animated.Value(0),
            dataUser: {},
            loadFont: false,
            // answeUser: '0'
        }
        this._openMenu = this._openMenu.bind(this);
        this._closeMenu = this._closeMenu.bind(this);
    }

    async componentDidMount() {
        console.log('Header ComponentDidMount');
             
    }

    _openMenu() {
        
        Animated.timing(                  // Animate over time
            this.state.fadeAnim,            // The animated value to drive
            {
              toValue: 0,
              duration: 400
            }
        ).start();
        Animated.timing(                  // Animate over time
            this.state.opacBack,            // The animated value to drive
            {
              toValue: 1,
              duration: 400
            }
        ).start();
        this.props.click(true)
        this.setState({ open: true })        
        
    }

    _closeMenu() {
        this.setState({ open: false })
        Animated.timing(                  // Animate over time
            this.state.fadeAnim,            // The animated value to drive
            {
              toValue: -500,                   // Animate to opacity: 1 (opaque)
              duration: 400
            }
        ).start(); 
        Animated.timing(                  // Animate over time
            this.state.opacBack,            // The animated value to drive
            {
              toValue: 0,
              duration: 400
            }
        ).start();
        this.props.click(false)
    }

    render() {
            return (
                <View>
                    <Animated.View style={[styles.menuContainer, { 
                            display: 'flex',
                            elevation: 414141415,
                            backgroundColor: 'rgba(52, 52, 52, 0.0)',
                            transform: [
                                { translateX: this.state.fadeAnim },
                            ],
                            flexDirection: 'row',
                            paddingBottom: 25,
                            borderRadius: 10,
                            height: Dimensions.get('window').height
                        }]}>

                            <View style={{
                                backgroundColor: '#3BD88D',
                                padding: 15,
                                paddingTop: 30,
                                height: 250
                            }}> 
                                <Image source={burger} />
                            </View>

                            <View style={{
                                width: '60%', 
                                backgroundColor: '#fff', 
                                zIndex: 100000,
                                // paddingLeft: 40,
                                height: 250
                                }}>
                                
                                <View style={styles.containerMenu}>
                                    <View style={{
                                        marginTop: 10,
                                        marginBottom: 10
                                    }}>
                                        <Text style={{
                                            color: '#3BD88D',
                                            fontSize: 17,
                                            fontFamily: 'TTCommons-DemiBold'
                                        }}>
                                            +7 (985) 542 5216
                                        </Text>
                                    </View>
                                    <TouchableHighlight 
                                        underlayColor="#fff" 
                                        style={{
                                            zIndex: 100000,
                                        }}
                                        onPress={() => {
                                            this.props.navigation.navigate('Account')
                                        }}
                                        >
                                        <Text style={[styles.darkText, 
                                            {
                                                fontSize: 17,
                                                marginTop: 15,
                                            }]}>Аккаунт</Text>
                                    </TouchableHighlight>

                                    <TouchableHighlight underlayColor="#fff" style={{zIndex: 100000}}
                                    onPress={() => {
                                        this.props.navigation.navigate('MyZakaz')
                                    }}
                                    >
                                        <Text style={[styles.darkText, {
                                            fontSize: 17,
                                            marginTop: 20,
                                            }]}>Мои заказы</Text>
                                    </TouchableHighlight>

                                    <TouchableHighlight underlayColor="#fff" style={{zIndex: 100000}} onPress={() => {
                                            this.props.navigation.navigate('Help')
                                        }}>
                                        <Text style={[styles.darkText, {
                                            fontSize: 17, 
                                            marginTop: 20,
                                            }]}>Помощь</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>
                            <TouchableHighlight onPress={() => this._closeMenu()} style={{
                                    width: '600%', 
                                    height: Dimensions.get('window').height, 
                                    opacity: 0,
                                    position: 'absolute',
                                    backgroundColor: 'transparent'
                                }}
                            >
                                <View></View>
                            </TouchableHighlight>
                            
                    </Animated.View>
                    <View style={styles.header}>
                        <TouchableHighlight style={{ alignSelf: 'center', padding: 15, zIndex: 100000 }} onPress={() => this._openMenu() }>
                            <Image source={burger} style={styles.burger} />
                        </TouchableHighlight>                        
                    </View>
                    
                </View>
            );
    }
}

const styles = StyleSheet.create({
    header: {
        paddingTop: 20,
        paddingBottom: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        elevation: 5,
        backgroundColor: 'transparent',
        position: 'absolute',
        zIndex: 1000000
    },
    burger: {
        width: 19.24,
        height: 13
    },
    styleAddReminder: {
        width: 30,
        height: 30
    },
    timeWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    time: {
        fontSize: 16,
        // marginRight: 10,
        // color: '#3E3F42',
        // marginRight: 40
    },
    menuContainer: {
        width: '100%',
        // paddingLeft: 40,
        // paddingRight: 40,
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#fff',
        zIndex: 1000000000000000000,
        position: 'absolute',
        // left: -10
    },
    darkText: {
        color: '#000',
        fontFamily: 'TTCommons-DemiBold'
    },
    containerMenu: {
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: 40,
        zIndex: 99999999999,
        backgroundColor: '#fff',
        paddingTop: 15
    },
    versionApp: {
        position: 'absolute',
        top: Dimensions.get('window').height - 100,
        left: 40,
        zIndex: 10000000000000000000
    },
    absolute: {
        position: "absolute",
        // top: 0,
        // bottom: 0,
        // left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#333',
        zIndex: 1000000000000000000000,
        opacity: 0.3
      }
})

