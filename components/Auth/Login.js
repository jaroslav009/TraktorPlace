import React, {Component} from 'react';
import { Text, View, Image, StyleSheet, Dimensions, TouchableOpacity, TextInput, ScrollView } from 'react-native';

import Back from '../Back';

// Font 
import Fonts from '../../constants/Fonts';
// Font

// Image
import logoReg from '../../assets/images/logoReg.png';
// Image

function validateEmail(email) {
    var pattern  = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern .test(email);
}

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            errEmail: false,
            password: '',
            errPass: false,
        }
        this.signIn = this.signIn.bind(this);
    }

    signIn() {
        console.log('this.state.', this.state.password)
        console.log('this.email.', this.state.password.length)

        if(validateEmail(this.state.email) == false) {
            return this.setState({ errEmail: true });
        } else {
            this.setState({ errEmail: false });
        }
        if(this.state.password.length < 6) {
            return this.setState({ errPass: true });
        } else {
            this.setState({ errPass: false });
        }
    }

    render() {
        return (
            <ScrollView>
                <Back nav={this.props.navigation} />
                <View style={{
                    minHeight: Dimensions.get('window').height*72/100,
                    justifyContent: 'space-between',
                }}>
                    
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: Dimensions.get('window').width
                    }}>
                        <Image source={logoReg} style={{ width: 238, height: 54 }} />
                    </View>
                    <View style={styles.containerForm}>
                        <View style={{ marginTop: 10 }}> 
                            <Text style={[styles.errText, {opacity: this.state.errEmail == true ? 1 : 0}]}>Введите ваш емеил</Text>
                            <Text style={[
                                styles.label,
                                {
                                    opacity: this.state.email == '' ? 0 : 1
                                }
                            ]}>
                                Емеил
                            </Text>
                            <TextInput placeholder="Почта" style={styles.itemForm} 
                            onChange={(text) => { 
                                console.log('text', text.nativeEvent.text)
                                this.setState({ email: text.nativeEvent.text });
                            }}
                            />
                        </View>
                        <View style={{ marginTop: 10 }}> 
                            <Text style={[styles.errText, {opacity: this.state.errPass == true ? 1 : 0}]}>Пароль должен быть не менее 6 символов</Text>
                            <Text style={[
                                styles.label,
                                {
                                    opacity: this.state.password == '' ? 0 : 1
                                }
                            ]}>
                                Пароль
                            </Text>
                            <TextInput secureTextEntry={true} placeholder="Пароль" style={styles.itemForm} 
                            onChange={(text) => { 
                                console.log('text', text.nativeEvent.text)
                                console.log('length', text.nativeEvent.text.length)
                                let e = false;
                                if(text.nativeEvent.text.length < 6) e = true
                                this.setState({ password: text.nativeEvent.text, errPass: e });
                            }}
                            />
                        </View>
                    </View>
                    <View style={{ 
                        width: Dimensions.get('window').width, 
                        alignItems: 'center',
                        top: 0,
                    }}>
                        <TouchableOpacity style={styles.btn} onPress={this.signIn}>
                            <Text style={{color: '#fff'}}>Войти</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    containerForm: {
        marginTop: 0,
        width: Dimensions.get('window').width,
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
        marginBottom: 10,
        elevation: 2
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

export default Register