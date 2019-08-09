import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, TouchableHighlight, Dimensions, Animated } from 'react-native';

import burger from '../../../assets/images/burger.png'

export default class HeaderClient extends Component {

    constructor(props) {
        super(props);
        let today = new Date();
        this.state = {
            date: today.getHours()+':'+today.getMinutes(),
            open: false,
            fadeAnim: new Animated.Value(-1000),
            opacBack: new Animated.Value(0),
            dataUser: {},
            // answeUser: '0'
        }
        this._itemMenu = this._itemMenu.bind(this);
        this._openMenu = this._openMenu.bind(this);
        this._logOut = this._logOut.bind(this);
        this._closeMenu = this._closeMenu.bind(this);
    }

    componentDidMount() {
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
              toValue: -1000,                   // Animate to opacity: 1 (opaque)
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
                        height:  Dimensions.get('window').height,
                        elevation: 414141415,
                        backgroundColor: 'rgba(52, 52, 52, 0.6)',
                        transform: [
                            { translateX: this.state.fadeAnim },
                        ]
                    }]}>

                        <View style={{
                            width: '80%', 
                            backgroundColor: '#fff', 
                            zIndex: 100000,
                            // paddingLeft: 40,
                            }}>
                            
                            <View style={styles.containerMenu}>
                            <View style={{paddingTop: 50, paddingBottom: 50}}>
                                <Text style={{fontSize: 24, color: '#3E3F42', fontFamily: 'SFUIText-Semibold'}}>
                                {this.state.dataUser.nickname}
                                </Text>
                                <Text style={[styles.greyText, {fontSize: 16}]}>{this.state.answeUser} Correct Answers</Text>
                            </View>
                                <TouchableHighlight underlayColor="#fff" style={{
                                        zIndex: 100000,
                                    }}>
                                    <Text style={[styles.greyText, 
                                        {
                                            fontSize: 24,
                                            marginTop: 15,
                                            color: this.props.page == 'Dashboard' ? '#333' : '#9EA0A5' 
                                        }]}>Dashboard</Text>
                                </TouchableHighlight>

                                <TouchableHighlight underlayColor="#fff" style={{zIndex: 100000}}>
                                    <Text style={[styles.greyText, {
                                        fontSize: 24,
                                        marginTop: 20,
                                        color: this.props.page == 'Leadboard' ? '#333' : '#9EA0A5' 
                                        }]}>Leadboard</Text>
                                </TouchableHighlight>

                                <TouchableHighlight underlayColor="#fff" style={{zIndex: 100000}}>
                                    <Text style={[styles.greyText, {
                                        fontSize: 24, 
                                        marginTop: 20,
                                        color: this.props.page == 'ProfileStudents' ? '#333' : '#9EA0A5' 
                                        }]}>Perfomance</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                        <TouchableHighlight onPress={() => this._closeMenu()} style={{
                            width: '600%', 
                            height: '100%', 
                            opacity: 0,
                            backgroundColor: '#333',
                            position: 'absolute',
                            }}
                        >
                            <View></View>
                        </TouchableHighlight>
                        
                </Animated.View>
                <View style={styles.header}>
                
                    <TouchableHighlight style={{ alignSelf: 'center', padding: 15 }} onPress={() => this._openMenu() } underlayColor="#fff">
                        <Image source={burger} style={styles.burger} />
                    </TouchableHighlight>
                    {/* <Image source={logoImg} style={{width: 80, height: 23, alignSelf: 'center'}} /> */}
                    
                    <View style={[styles.timeWrapper, {opacity:1}]}>
                        <Text style={styles.time}>{this.state.date}</Text>
                        {/* <Image 
                        source={addReminder} 
                        style={styles.styleAddReminder} 
                        /> */}
                    </View>
                    
                </View>
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingBottom: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        elevation: 5,
    },
    burger: {
        width: 24,
        height: 18
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
    greyText: {
        color: '#9EA0A5',
        fontFamily: 'SFUIText-Semibold'
    },
    containerMenu: {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        // top: Dimensions.get('window').height/4,
        // left: -20,
        paddingLeft: 40,
        zIndex: 99999999999,
        backgroundColor: '#fff'
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

