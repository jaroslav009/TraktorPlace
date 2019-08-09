import React, {Component} from 'react';
import { Text, View, Image, Dimensions, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import * as Font from 'expo-font';
import { Avatar, CheckBox } from 'react-native-elements';
import * as firebase from 'firebase';

import Back from '../../Back';

// Image
import settingsWorkTool from '../../../assets/images/settings-work-tool.png';
// Image

class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadFont: false,
            load: false,
            name: '',
            errName: false,
            surname: '',
            errSurname: false,
            email: '',
            errEmail: false,
            password: '',
            errPass: false,
            checkedZap: false,
            nameConf: '',
            surnameConf: '',
            emailConf: '',
            phoneConf: '',
            confPass: '',
        }
        this.changeData = this.changeData.bind(this);
        this.reauthenticate = this.reauthenticate.bind(this);
    }
    async componentDidMount() {
        await firebase.auth().onAuthStateChanged(async (user) => {
            if(user) {
                console.log(`user ${user}`);
                console.log(`email ${user.email}`);
                firebase.database().ref("users").orderByChild("confEmail").equalTo(user.email).once("child_added", (snapshot) => {
                    console.log('snapshot', snapshot.key);
                    this.setState({ userKey: snapshot.key })
                    firebase.database().ref("users/"+snapshot.key).on("value", (data) => {
                        console.log('value', data.toJSON().name);
                        this.setState({ 
                            name: data.toJSON().name,
                            surname: data.toJSON().surname,
                            email: data.toJSON().email,
                            nameConf: data.toJSON().name,
                            surnameConf: data.toJSON().surname,
                            emailConf: data.toJSON().email
                        });
                        console.log('name', this.state.name);
                        console.log('surname', this.state.surname);
                        this.setState({load: true});
                        
                    })
                });
            }
        });
        await Font.loadAsync({
          'TTCommons-DemiBold': require('../../../assets/fonts/TTCommons-DemiBold.ttf'),
          'TTCommons-Regular': require('../../../assets/fonts/TTCommons-Regular.ttf'),
        })
        .then(() => {
            this.setState({ loadFont: true });
        });
    }

    reauthenticate = (currentPassword) => {
        var user = firebase.auth().currentUser;
        var cred = firebase.auth.EmailAuthProvider.credential(
            user.email, this.state.changePassword);
        return user.reauthenticateWithCredential(cred);
     }

    async changeData(act) {
        this.setState({ load: false });
        if(act == 'name') {
            if(this.state.name != '') {
                await firebase.database().ref("users/" + this.state.userKey).update({
                    name: this.state.name,
                })
                .then(() => {
                    this.setState({load: true});
                })
            }
        }
        else if(act == 'surname') {
            if(this.state.surname != '') {
                await firebase.database().ref("users/" + this.state.userKey).update({
                    surname: this.state.surname,
                })
                .then(() => {
                    this.setState({load: true});
                })
            }
        } 
        else if(act == 'email') {
            if(this.state.email != '') {
                await firebase.database().ref("users/" + this.state.userKey).update({
                    email: this.state.email,
                })
                .then(() => {
                    this.setState({load: true});
                })
            }
        }
        else if(act == 'password') {
            await this.reauthenticate(this.state.password)
            .then(() => {
                console.log('password change');
                
                var user = firebase.auth().currentUser;
                user.updatePassword(this.state.password)
                .then(() => {
                    
                    console.log("Password updated!");
                    this.setState({
                        errorNewPassword: true,
                        render: false,
                    });
                    this.props.navigation.navigate('Login', { signOut: true });
                })
                .catch((error) => {
                    this.setState({
                        errorNewPassword: true,
                    });
                    console.log(error);
                });
            })
            .catch((error) => {
                this.setState({
                    errorNewPassword: false,
                    infiniteLoad: false,
                })
                console.log(error);
            });
        }

        
    }

    render() {
        if(this.state.loadFont == true && this.state.load == true) {
            return (
                <ScrollView style={{
                    paddingBottom: 20
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingBottom: 20
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
                                value={this.state.name}
                            />
                            <TouchableOpacity style={{
                                position: 'absolute',
                                right: 0,
                                bottom: 5
                                
                            }}
                            onPress={() => {
                                this.changeData('name');
                            }}
                            >
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
                            }}
                            value={this.state.surname} />
                            <TouchableOpacity style={{
                                position: 'absolute',
                                right: 0,
                                bottom: 5

                            }}
                            onPress={() => {
                                this.changeData('surname');
                            }}
                            >
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
                            value={this.state.email}
                            />
                            <TouchableOpacity style={{
                                position: 'absolute',
                                right: 0,
                                bottom: 5

                            }}
                            onPress={() => {
                                this.changeData('email');
                            }}
                            >
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
                                Старый пароль
                            </Text>
                            <TextInput secureTextEntry={true} placeholder="Старый пароль" style={styles.itemForm} 
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

                            }}
                            onPress={() => {
                                this.changeData('password')
                            }}
                            >
                                <Image source={settingsWorkTool} />
                            </TouchableOpacity>
                        </View>

                        <View style={{ marginTop: 10 }}> 
                            <Text style={[
                                styles.label,
                                {
                                    opacity: this.state.confPass == '' ? 0 : 1
                                }
                            ]}>
                                Новый пароль
                            </Text>
                            <TextInput secureTextEntry={true} placeholder="Новый пароль" style={styles.itemForm} 
                            onChange={(text) => { 
                                this.setState({ confPass: text.nativeEvent.text });
                                console.log('confPass', this.state.confPass);
                                
                            }}
                            />
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 10,
                            alignItems: 'center',
                            width: 238
                        }}>
                            <Text style={{
                                fontFamily: 'TTCommons-Regular',
                            }}>Уведомления</Text>
                            <CheckBox
                                center
                                checked={this.state.checkedZap}
                                checkedColor='#3BD88D'
                                uncheckedColor='#3BD88D'
                                onPress={() => {
                                    this.setState({ checkedZap: !this.state.checkedZap });
                                }}
                            />
                        </View>
                        <TouchableOpacity style={styles.btn} onPress={() => {
                            
                            this.props.navigation.navigate('Logout1');
                        }}>
                            <Text style={{color: '#fff', fontFamily: 'TTCommons-DemiBold', fontSize: 18}}>Выход</Text>
                        </TouchableOpacity>
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
    btn: {
        width: Dimensions.get('window').width*70/100,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DC4732',
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
        marginBottom: 20
    },
})

export default Account;