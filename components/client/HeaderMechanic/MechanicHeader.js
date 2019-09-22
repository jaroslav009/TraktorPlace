import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, TouchableHighlight, Dimensions, Animated, TouchableOpacity } from 'react-native';
import * as firebase from 'firebase';

import makeid from '../../../functions/makeId';
import burger from '../../../assets/images/burger.png'

export default class MechanicHeader extends Component {

    constructor(props) {
        super(props);
        let today = new Date();
        this.state = {
            date: today.getHours()+':'+today.getMinutes(),
            open: false,
            fadeAnim: new Animated.Value(-500),
            opacBack: new Animated.Value(0),
            dataUser: {},
            phone: '',
            // answeUser: '0'
        }
        this._openMenu = this._openMenu.bind(this);
        this._closeMenu = this._closeMenu.bind(this);
    }

    async componentDidMount() {
        await firebase.auth().onAuthStateChanged(async (user) => {
            if(user) {
                firebase.database().ref("users").orderByChild("confEmail").equalTo(user.email).once("child_added", (snapshot) => {
                    this.setState({ userKey: snapshot.key })
                    firebase.database().ref("users/"+snapshot.key).on("value", (data) => {
                        console.log('value phone', data);
                        console.log('value phone2', data.toJSON().phone);
                        this.setState({
                            phone: data.toJSON().phone
                        });
                    })
                });
            }
        });
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

                          <TouchableOpacity style={{
                              backgroundColor: '#3BD88D',
                              padding: 30,
                              paddingTop: 50,
                              height: 250,
                              zIndex: 1000000000
                          }}
                          onPress={() => {
                              this._closeMenu();
                          }}
                          >
                              <Image source={burger} />
                          </TouchableOpacity>

                          <View style={{
                              width: Dimensions.get('window').width*0.6,
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
                                          {this.state.phone}
                                      </Text>
                                  </View>
                                  <TouchableHighlight
                                      underlayColor="#fff"
                                      style={{
                                          zIndex: 100000,
                                      }}
                                      onPress={() => {
                                            this.props.navigation.navigate('AccountMechanic')
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
                                    this.props.navigation.navigate('MyJobs', {
                                        id: makeid(5),
                                    })
                                  }}
                                  >
                                      <Text style={[styles.darkText, {
                                          fontSize: 17,
                                          marginTop: 20,
                                          }]}>Моя работа</Text>
                                  </TouchableHighlight>

                                  {/* <TouchableHighlight underlayColor="#fff" style={{zIndex: 100000}} onPress={() => {
                                          this.props.navigation.navigate('PaymentMethod')
                                      }}>
                                      <Text style={[styles.darkText, {
                                          fontSize: 17,
                                          marginTop: 20,
                                          }
                                          ]}>Способ оплаты</Text>
                                  </TouchableHighlight> */}

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
                                  width: 500,
                                  height: Dimensions.get('window').height,
                                  opacity: 0,
                                  position: 'absolute',
                                  backgroundColor: 'transparent'
                              }}
                          >
                              <View></View>
                          </TouchableHighlight>

                  </Animated.View>
                  <View style={[styles.header, {
                      position: this.state.open == false ? 'absolute' : 'relative',
                      display: this.state.open == false ? 'flex' : 'none'
                  }]}>
                      <TouchableHighlight style={{ alignSelf: 'center', padding: 15, zIndex: 100000, backgroundColor: '#3BD88D', borderRadius: 50 }} onPress={() => this._openMenu() }>
                          <Image source={burger} style={styles.burger} />
                      </TouchableHighlight>
                  </View>
            
              </View>
            );
    }
}

const styles = StyleSheet.create({
    header: {
        paddingTop: 50,
        // paddingBottom: 20,
        paddingLeft: 15,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        elevation: 5,
        backgroundColor: 'transparent',
        top: 20,
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
