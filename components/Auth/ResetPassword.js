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

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            errEmail: false,
            load: false
        }
        this.signIn = this.signIn.bind(this);
    }

    signIn() {
        this.setState({ load: true });
        if(validateEmail(this.state.email) == false) {
            return this.setState({ errEmail: true });
        } else {
            this.setState({ errEmail: false });
        }
        firebase.auth().sendPasswordResetEmail(this.state.email)
        .then((user) => {
            alert('Проверьте пошту');
        }).catch((e) => {
            alert('Такого пользователя не существует');
        });
        this.props.navigation.navigate('Login');
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
                            <TextInput placeholder="Почта" style={styles.itemForm} 
                            onChange={(text) => { 
                                console.log('text', text.nativeEvent.text)
                                this.setState({ email: text.nativeEvent.text });
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
                            <Text style={{color: '#fff'}}>Отправить код</Text>
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
        marginBottom: 30,
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

export default ResetPassword