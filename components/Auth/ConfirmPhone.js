import React, {Component} from 'react';
import { Text, View, Image, ImageBackground, StyleSheet, Dimensions, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import * as Font from 'expo-font';

// Font 
import Fonts from '../../constants/Fonts';
// Font

// Image
import logoReg from '../../assets/images/logoReg.png';
// Image

class ConfirmPhone extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            errPhone: false,
        }
        this.signUp = this.signUp.bind(this);
    }

    componentDidMount() {
        Font.loadAsync({
            'TTCommons-Regular': require('../../assets/fonts/TTCommons-Regular.ttf'),
            'TTCommons-Thin': require('../../assets/fonts/TTCommons-Thin.ttf'),
        });
    }

    signUp() {
        console.log('this.state.', this.state.phone)
        console.log('this.phone.', this.state.phone.length)

        if(this.state.phone < 4) {
            return this.setState({ errPhone: true });
        } else {
            this.setState({ errPhone: false });

        }
    }

    render() {
        return (
            <ScrollView>
                <View style={{
                    height: Dimensions.get('window').height,
                    justifyContent: 'space-around',
                }}>
                    
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: Dimensions.get('window').width
                        // minHeight: Dimensions.get('window').height,
                    }}>
                        <Image source={logoReg} style={{ width: 238, height: 54 }} />
                    </View>
                    <View style={styles.containerForm}>
                        <View style={{ marginTop: 10 }}> 
                            <Text style={[styles.errText, {opacity: this.state.errPhone == true ? 1 : 0}]}>Введите свой телефон</Text>
                            <Text style={[
                                styles.label,
                                {
                                    opacity: this.state.phone == '' ? 0 : 1
                                }
                            ]}>
                                Телефон
                            </Text>
                            <TextInput secureTextEntry={true} placeholder="Телефон" style={styles.itemForm} 
                            onChange={(text) => { 
                                console.log('text', text.nativeEvent.text)
                                console.log('length', text.nativeEvent.text.length)
                                let e = false;
                                if(text.nativeEvent.text.length == '') e = true
                                this.setState({ phone: text.nativeEvent.text, errPhone: e});
                            }}
                            />
                        </View>
                    </View>
                    <View style={{ 
                        width: Dimensions.get('window').width, 
                        alignItems: 'center',
                        top: 0
                    }}>
                        <TouchableOpacity style={styles.btn} onPress={this.signUp}>
                            <Text style={{color: '#fff'}}>Далее</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    containerForm: {
        // marginTop: 80,
        // width: Dimensions.get('window').width,
        justifyContent: 'center',
        alignItems: 'center',
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
        width: 238,
        paddingTop: 10,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3BD88D',
        borderRadius: 27.5,
        fontFamily: 'TTCommons-Regular',
        fontSize: 18,
        // bottom: 30,
        // position: 'absolute'
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
    }
})

export default ConfirmPhone