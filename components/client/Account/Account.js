import React, {Component} from 'react';
import { Text, View, Image, Dimensions, TouchableOpacity, TextInput, Animated, StyleSheet, ScrollView } from 'react-native';
import * as Font from 'expo-font';
import { Avatar } from 'react-native-elements';

import Back from '../../Back';

// Image
import settingsWorkTool from '../../../assets/images/settings-work-tool.png';
// Image

class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadFont: false,
            name: '',
            errName: false,
            surname: '',
            errSurname: false,
            email: '',
            errEmail: false,
            password: '',
            errPass: false,
        }
    }
    async componentDidMount() {
        await Font.loadAsync({
          'TTCommons-DemiBold': require('../../../assets/fonts/TTCommons-DemiBold.ttf'),
          'TTCommons-Regular': require('../../../assets/fonts/TTCommons-Regular.ttf'),
        })
        .then(() => {
            this.setState({ loadFont: true });
        })
        this.props.fontLoader();
    }
    render() {
        if(this.state.loadFont == true) {
            return (
                <ScrollView>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <Back nav={this.props.navigation} />
                        <Text style={{
                            fontFamily: 'TTCommons-DemiBold',
                            fontSize: 20,
                            marginLeft: 30
                        }}>Аккаунт</Text>
                    </View>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Avatar rounded title="TP" size="xlarge" />
                        <Text style={{
                            fontFamily: 'TTCommons-Regular',
                            fontSize: 16,
                            color: '#DBDBDB',
                            marginTop: 8
                        }}>Сменить фото</Text>
                    </View>
                    <View style={styles.wrapperForm}>
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
                            <TouchableOpacity style={{
                                position: 'absolute',
                                right: 0,
                                bottom: 5

                            }}>
                                <Image source={settingsWorkTool} />
                            </TouchableOpacity>
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
                            <TouchableOpacity style={{
                                position: 'absolute',
                                right: 0,
                                bottom: 5

                            }}>
                                <Image source={settingsWorkTool} />
                            </TouchableOpacity>
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
                            <TouchableOpacity style={{
                                position: 'absolute',
                                right: 0,
                                bottom: 5

                            }}>
                                <Image source={settingsWorkTool} />
                            </TouchableOpacity>
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
                            <TouchableOpacity style={{
                                position: 'absolute',
                                right: 0,
                                bottom: 5

                            }}>
                                <Image source={settingsWorkTool} />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Text>Уведомления</Text>
                            
                        </View>
                    </View>
                </ScrollView>
            )
        }
        else {
            return <View></View>
        }
    }
}

const styles = StyleSheet.create({
    wrapperForm: {
        marginTop: 0,
        justifyContent: 'center',
        alignItems: 'center'
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
    itemForm: {
        borderBottomWidth: 2,
        borderBottomColor: '#3BD88D',
        width: 238,
        fontFamily: 'TTCommons-Regular',
        color: '#707070',
        fontSize: 18
    },
})

export default Account;