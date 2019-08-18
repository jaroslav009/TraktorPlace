import React, {Component} from 'react';
import { Text, View, Image, ImageBackground, StyleSheet, Dimensions, Share, TouchableOpacity } from 'react-native';
import * as firebase from 'firebase';
import { Constants } from 'expo';

// Image
import HeroLogo from '../assets/images/LogoHero.png';
import fonHero from '../assets/images/fonHero.png';
import google from '../assets/images/googlePlus.png'
import vk from '../assets/images/vk.png'
import facebook from '../assets/images/facebook.png'
// Image

// Font 
import Fonts from '../constants/Fonts';
// Font

import LoadIndicator from '../constants/LoadIndicator';

class HeroScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            load: true,
        }
    }
    async componentDidMount() {
        await firebase.auth().onAuthStateChanged(async (user) => {
            setTimeout(() => {
                if(user){
                    if(user.emailVerified == true) {
                        this.props.navigation.navigate('MainClient');
                    }
                }
            }, 1000)
            
        })
        this.setState({ load: false });
    }
    _shareFacebook() {
        console.log('dwqwqddqw');
        
        Share.share({
          message: 'TraktorPlace is a gigant for you',
          url: 'http://facebook.github.io/react-native/',
          title: 'React Native'
        }, {
          dialogTitle: 'Share React Native website',
      
          tintColor: 'green'
        })
        .then(this._showResult)
        .catch((error) => this.setState({result: 'error: ' + error.message}));
    }
    render() {
        if(this.state.load == true) {
            return <LoadIndicator />
        }
        return (
            <ImageBackground source={fonHero} style={{width: '100%', height: '100%'}}>
                <View style={styles.wrapperHero}>
                    <Image source={HeroLogo} style={{ marginTop: (Dimensions.get('window').height * 20)/100 }} />
                    <View style={styles.containerSign}>
                        <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'TTCommons-Thin' }} onPress={() => this.props.navigation.navigate('Login')}>Войти</Text>
                        <View style={styles.registrationText}>
                            <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'TTCommons-Thin' }} onPress={() => this.props.navigation.navigate('Register')}>Регистрация</Text>
                        </View>
                        <View style={styles.socIcon}>
                            <TouchableOpacity style={styles.wrapperIcon} onPress={() => this._shareFacebook() }>
                                <Image source={google} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.wrapperIcon} onPress={() => this._shareFacebook() }>
                                <Image source={vk} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.wrapperIcon} onPress={() => this._shareFacebook() }>
                                <Image source={facebook}  />
                            </TouchableOpacity>
                            
                        </View>
                    </View>
                    

                </View>
                
            </ImageBackground>
        );
    }
  
}

const styles = StyleSheet.create({
    wrapperHero: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: Dimensions.get('window').height,
        justifyContent: 'space-between'
    },
    registrationText: {
        borderWidth: 1,
        borderColor: '#3BD88D',
        padding: 10,
        borderRadius: 50,
        marginTop: 10,
        paddingLeft: 30,
        paddingRight: 30,
        marginTop: 18
    },
    containerSign: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    socIcon: {
        marginTop: 18,
        flexDirection: 'row'
    },
    wrapperIcon: {
        marginRight: 10,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: '#3BD88D',
        width: 39,
        height: 39
    }
})

export default HeroScreen