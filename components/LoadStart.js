import React, {Component} from 'react';
import { ActivityIndicator } from 'react-native';
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

class LoadStart extends Component {
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
                    console.log('auth user', user);
                    
                    if(user.emailVerified == true) {
                        this.props.navigation.navigate('MainClient');
                    } else {
                        this.props.navigation.navigate('HeroScreen');
                    }
                } else {
                    this.props.navigation.navigate('HeroScreen');
                }
            }, 1000)
            
        })
        this.setState({ load: false });
    }

    render() {
        return <ActivityIndicator size="large" color="#00ff00" />
   
    }
  
}


export default LoadStart