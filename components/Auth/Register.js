import React, {Component} from 'react';
import { Text, View, Image, ImageBackground, StyleSheet, Dimensions, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import * as firebase from 'firebase';
import * as Font from 'expo-font';

import Back from '../Back';

// Font 
import Fonts from '../../constants/Fonts';
// Font

// Image
import logoReg from '../../assets/images/logoReg.png';
import Arrow from '../../assets/images/left-arrow.png';
// Image

import makeid from '../../functions/makeId';
import validateEmail from '../../functions/validateEmail';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            errName: false,
            surname: '',
            errSurname: false,
            email: '',
            errEmail: false,
            password: '',
            errPass: false,
            fontLoaded: false,
            phone: '',
            errUser: false
        }
        this.signUp = this.signUp.bind(this);
        this._back = this._back.bind(this);
    }

    async componentDidMount() {
        await Font.loadAsync({
            'TTCommons-Regular': require('../../assets/fonts/TTCommons-Regular.ttf'),
            'TTCommons-Thin': require('../../assets/fonts/TTCommons-Thin.ttf'),
        })
        .then(() => {
            console.log('font loadede');
            
            this.setState({ fontLoaded: true });
        });
        
        await firebase.auth().onAuthStateChanged((user) => {
            console.log('user', user);
        });
        
        
    }

    signUp() {
        console.log('this.state.', this.state.password)
        console.log('this.email.', this.state.password.length)
        if(this.state.name == '') {
            return this.setState({ errName: true });
        } else {
            this.setState({ errName: false });
        }
        if(this.state.surname == '') {
            return this.setState({ errSurname: true });
        } else {
            this.setState({ errSurname: false });
        }
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
        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(async () => {
                await firebase.auth().onAuthStateChanged(function(user) {                        
                    user.sendEmailVerification(); 
                });
                
                await firebase.database().ref('users/' + makeid(10)).set({
                    name: this.state.name,
                    surname: this.state.surname,
                    email: this.state.email,
                    phone: this.state.phone,
                    role: 'user',
                    confEmail: this.state.email,
                    avatar: '',
                }, function(error) {
                    if (error) {
                        console.log('err', error);
                    } else {
                        console.log('Saved data user');
                    }
                })
                Alert.alert(
                    '',
                    'Подтвердите почту',
                    [
                      {text: 'OK', onPress: () => console.log('OK Pressed')},
                    ],
                    {cancelable: false},
                );
                this.props.navigation.navigate('Login');
            })
            .catch(err => {
                console.log('err', err);
                this.setState({ errUser: true });
            })
        
        // this.props.navigation.navigate('ConfirmPhone', {
        //     name: this.state.name,
        //     surname: this.state.surname,
        //     email: this.state.email,
        //     password: this.state.password
        // })
    }


    _back() {
        this.props.navigation.goBack()
    }

    render() {
        return (
            <ScrollView style={{ height: Dimensions.get('window').height }}>
                <Back nav={this.props.navigation} />
                <View style={{
                    minHeight: Dimensions.get('window').height*90/100,
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
                            <Text style={[styles.errText, {opacity: this.state.errUser == true ? 1 : 0}]}>Этот пользователь уже существует</Text>
                        </View>
                        <View style={{ marginTop: 30 }}> 
                            <Text style={[styles.errText, {opacity: this.state.errName == true ? 1 : 0}]}>Введите имя</Text>
                            <Text style={[
                                styles.label,
                                {opacity: this.state.name == '' ? 0 : 1}
                            ]}>
                                Имя
                            </Text>
                            <TextInput 
                                placeholder="Имя" 
                                style={[styles.itemForm]} value={this.state.name} 
                                onChange={(text) => { 
                                    let e = false;
                                    if(text.nativeEvent.text == '') e = true
                                    this.setState({ name: text.nativeEvent.text, errName: e });
                                }} 
                            />
                        </View>
                        <View style={{ marginTop: 10 }}> 
                            <Text style={[styles.errText, {opacity: this.state.errSurname == true ? 1 : 0}]}>Введите фамилию</Text>
                            <Text style={[
                                styles.label,
                                {opacity: this.state.surname == '' ? 0 : 1}
                            ]}>
                                Фамилия
                            </Text>
                            <TextInput placeholder="Фамилия" style={[styles.itemForm]} 
                            onChange={(text) => { 
                                let e = false;
                                if(text.nativeEvent.text == '') e = true
                                this.setState({ surname: text.nativeEvent.text, errSurname: e });
                            }} />
                        </View>
                        <View style={{ marginTop: 10 }}> 
                            <Text style={[styles.errText, {opacity: this.state.errEmail == true ? 1 : 0}]}>Введите ваш почта</Text>
                            <Text style={[
                                styles.label,
                                {
                                    opacity: this.state.email == '' ? 0 : 1
                                }
                            ]}>
                                Почта
                            </Text>
                            <TextInput placeholder="Почта" style={[styles.itemForm]} 
                            onChange={(text) => { 
                                this.setState({ email: text.nativeEvent.text });
                            }}
                            />
                        </View>
                        <View style={{ marginTop: 10 }}> 
                            <Text style={[styles.errText, {opacity: this.state.errPass == true ? 1 : 0, width: 238}]}>Пароль должен быть не менее 6 символов</Text>
                            <Text style={[
                                styles.label,
                                {
                                    opacity: this.state.password == '' ? 0 : 1
                                }
                            ]}>
                                Пароль
                            </Text>
                            <TextInput secureTextEntry={true} placeholder="Пароль" style={[styles.itemForm]} 
                            onChange={(text) => { 
                                let e = false;
                                if(text.nativeEvent.text.length < 6) e = true
                                this.setState({ password: text.nativeEvent.text, errPass: e });
                            }}
                            />
                        </View>
                        <View style={{ marginTop: 10 }}>
                        <Text style={[styles.errText, {opacity: this.state.errPass == true ? 1 : 0}]}>Введите телефон</Text>
 
                            <Text style={[
                                styles.label,
                                {
                                    opacity: this.state.phone == '' ? 0 : 1
                                }
                            ]}>
                                Телефон
                            </Text>
                            <TextInput autoCompleteType="tel" placeholder="Телефон" style={[styles.itemForm]} 
                            onChange={(text) => { 
                                this.setState({ phone: text.nativeEvent.text });
                            }}
                            />
                        </View>
                    </View>
                    <View style={{ 
                            width: Dimensions.get('window').width, 
                            alignItems: 'center',
                            top: 0
                        }}>
                        <TouchableOpacity style={[styles.btn]} onPress={this.signUp}>
                            <Text style={{color: '#fff'}}>Подтвердить</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    containerForm: {
        marginTop: 80,
        width: Dimensions.get('window').width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemForm: {
        borderBottomWidth: 2,
        borderBottomColor: '#3BD88D',
        width: 238,
        color: '#707070',
        fontSize: 18
    },
    btn: {
        width: 238,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3BD88D',
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
    },
    containerBack: {
        paddingTop: 33,
        paddingLeft: 16,
        paddingBottom: 35
    }
})

export default Register