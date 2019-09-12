import React, {Component} from 'react';
import { Text, View, Image, StyleSheet, Dimensions, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import * as firebase from 'firebase';

import Back from '../Back';

// Font 
import Fonts from '../../constants/Fonts';
// Font

// Indicator
import LoadIndicator from '../../constants/LoadIndicator';
// Indicator

// Image
import logoReg from '../../assets/images/logoReg.png';
// Image

import validateEmail from '../../functions/validateEmail';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            errEmail: false,
            password: '',
            errPass: false,
            load: false,
            errUser: false
        }
        this.signIn = this.signIn.bind(this);
    }

    signIn() {
        console.log('this.state.', this.state.password)
        console.log('this.email.', this.state.password.length)
        this.setState({ load: true });
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
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
            firebase.auth().onAuthStateChanged(async (user) => {
                if(user){
                    console.log('user logged', user.emailVerified);
                    if(user.emailVerified == true) {
                        this.props.navigation.navigate('MainClient');
                    } else {
                        // await firebase.auth().signOut();
                        this.setState({ errVerifyEmail: true, authentication: false, authErr: false });
                        this.setState({ load: false });
                        return Alert.alert(
                            '',
                            'Подтвердите емеил',
                            [
                              {text: 'OK', onPress: () => console.log('OK Pressed')},
                            ],
                            {cancelable: false},
                        );
                        
                    }
                    
                }
            })
        })
        .catch((err) => {
            console.log('err', err);
            this.setState({ load: false, errUser: true });
        })
    }

    render() {
        if(this.state.load == true) {
            return <LoadIndicator />
        }
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
                        <View>
                        <Text style={[styles.errText, {opacity: this.state.errUser == true ? 1 : 0, width: 238}]}>Почта или пароль неверны</Text>
                        </View>
                        <View style={{ marginTop: 10 }}> 
                            <Text style={[styles.errText, {opacity: this.state.errEmail == true ? 1 : 0}]}>Введите ваш емеил</Text>
                            <Text style={[
                                styles.label,
                                {
                                    opacity: this.state.email == '' ? 0 : 1
                                }
                            ]}>
                                Почта
                            </Text>
                            <TextInput placeholder="Почта" style={styles.itemForm} 
                            onChange={(text) => { 
                                this.setState({ email: text.nativeEvent.text });
                            }}
                            />
                        </View>
                        <View style={{ marginTop: 10 }}> 
                            <Text style={[styles.errText, {opacity: this.state.errPass == true ? 1 : 0, width:  238}]}>Пароль должен быть не менее 6 символов</Text>
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
                                let e = false;
                                if(text.nativeEvent.text.length < 6) e = true
                                this.setState({ password: text.nativeEvent.text, errPass: e });
                            }}
                            />
                            <View style={{
                                justifyContent: 'flex-end',
                                alignItems: 'flex-end',
                                marginTop: 10
                            }}>
                                <Text style={{
                                    color: '#707070',
                                    fontSize: 13
                                }}
                                onPress={() => this.props.navigation.navigate('ResetPassword')} >Забыл пароль</Text>
                            </View>
                            
                        </View>
                    </View>
                    <View style={{ 
                        width: Dimensions.get('window').width, 
                        alignItems: 'center',
                        top: -50,
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
        marginTop: -70,
        width: Dimensions.get('window').width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemForm: {
        borderBottomWidth: 2,
        borderBottomColor: '#3BD88D',
        width: 238,
        // fontFamily: 'TTCommons-Regular',
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
        // fontFamily: 'TTCommons-Regular',
        fontSize: 18,
        marginBottom: 10,
        elevation: 2
        // bottom: 30,
        // position: 'absolute'
    },
    label: {
        // fontFamily: 'TTCommons-Regular',
        fontSize: 14,
        color: '#3BD88D'
    },
    errText: {
        color: 'red',
        // fontFamily: 'TTCommons-Regular',
        fontSize: 14,
    }
})

export default Register