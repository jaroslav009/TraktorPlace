import React, {Component} from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';

import Arrow from '../assets/images/left-arrow.png';

class Back extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        // console.log('this.props.style', this.props.style.top);
        
        if(this.props.style != undefined) {
            return (
                <TouchableOpacity style={[styles.containerBack, {top: this.props.style.top != undefined ? this.props.style.top : 23, justifyContent: 'center'}]} onPress={() => this.props.nav.goBack()}>
                    <Image source={Arrow} style={{ width: 15, height: 15, }} />
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity style={[styles.containerBack, {top: 23, justifyContent: 'center'}]} onPress={() => this.props.nav.goBack()}>
                    <Image source={Arrow} style={{ width: 15, height: 15, }} />
                </TouchableOpacity>
            )
        }

        
    }
}

const styles = StyleSheet.create({
    containerBack: {
        
        left: 25,
        paddingBottom: 35
    }
})

export default Back;