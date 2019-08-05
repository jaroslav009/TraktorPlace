import React, {Component} from 'react';
import { Text, View, Image, ImageBackground, StyleSheet, Dimensions, TouchableOpacity, TextInput, ScrollView } from 'react-native';

import Back from '../Back';

// Font 
import Fonts from '../../constants/Fonts';
// Font

// Image
import logoReg from '../../assets/images/logoReg.png';
import Arrow from '../../assets/images/left-arrow.png';

// Image

function validateEmail(email) {
    var pattern  = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern .test(email);
}

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
        }
        this.signUp = this.signUp.bind(this);
        this._back = this._back.bind(this);
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
        this.props.navigation.navigate('ConfirmPhone', {
            name: this.state.name,
            surname: this.state.surname,
            email: this.state.email,
            password: this.state.password
        })
    }


    _back() {
        this.props.navigation.goBack()
    }

    render() {
        return (
            <ScrollView>
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
                                style={styles.itemForm} value={this.state.name} 
                                onChange={(text) => { 
                                    console.log('text', text.nativeEvent.text)
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
                            <TextInput placeholder="Фамилия" style={styles.itemForm} 
                            onChange={(text) => { 
                                console.log('text', text.nativeEvent.text)
                                let e = false;
                                if(text.nativeEvent.text == '') e = true
                                this.setState({ surname: text.nativeEvent.text, errSurname: e });
                            }} />
                        </View>
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
        marginTop: 80,
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
        marginTop: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3BD88D',
        borderRadius: 27.5,
        fontFamily: 'TTCommons-Regular',
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
        fontFamily: 'TTCommons-Regular',
        fontSize: 14,
        color: '#3BD88D'
    },
    errText: {
        color: 'red',
        fontFamily: 'TTCommons-Regular',
        fontSize: 14,
    },
    containerBack: {
        paddingTop: 33,
        paddingLeft: 16,
        paddingBottom: 35
    }
})

export default Register