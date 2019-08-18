import React, {PureComponent} from 'react';
import { Text, View, TextInput, Dimensions, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Back from '../../Back';
import * as Font from 'expo-font';
import { Avatar } from 'react-native-elements';
import * as firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';

import LoadIndicator from '../../../constants/LoadIndicator'
import SuccessPopUp from '../../SuccessPopUp/SuccessPopUp';

import makeid from '../../../functions/makeId';

class AccountMechanic extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loadFont: false,
            load: false,
            description: '',
            timeWork: '',
            priceWork: '',
            popSuccess: false,
            advanced: '',
            expeirence: '',
        }
        this.changeAvatar = this.changeAvatar.bind(this);
        this.changeData = this.changeData.bind(this);
    }

    async componentDidMount() {
        this.setState({ load: false });
        await firebase.auth().onAuthStateChanged(async (user) => {
            if(user) {
                console.log(`user ${user}`);
                console.log(`email ${user.email}`);
                firebase.database().ref("users").orderByChild("confEmail").equalTo(user.email).once("child_added", (snapshot) => {
                    this.setState({ userKey: snapshot.key })
                    firebase.database().ref("users/"+snapshot.key).on("value", (data) => {
                        this.setState({ 
                            name: data.toJSON().name,
                            surname: data.toJSON().surname,
                            avatar: data.toJSON().avatar,
                            description: data.toJSON().description == undefined ? '' : data.toJSON().description,
                            timeWork: data.toJSON().timeWork == undefined ? '' : data.toJSON().timeWork,
                            priceWork: data.toJSON().priceWork == undefined ? '' : data.toJSON().priceWork,
                            phone: data.toJSON().phone,
                            advanced: data.toJSON().advanced,
                            expeirence: data.toJSON().expeirence,
                        });
                        this.setState({load: true});
                    })
                });
            }
        });
        await Font.loadAsync({
            'TTCommons-Bold': require('../../../assets/fonts/TTCommons-Bold.ttf'),
            'TTCommons-Regular': require('../../../assets/fonts/TTCommons-Regular.ttf'),
            'TTCommons-Medium': require('../../../assets/fonts/TTCommons-Medium.ttf'),
            'TTCommons-DemiBold': require('../../../assets/fonts/TTCommons-DemiBold.ttf'),
            'TTCommons-Bold': require('../../../assets/fonts/TTCommons-Bold.ttf'),
        })
        .then(() => {
            this.setState({ loadFont: true });
        })
        this.props.fontLoader();
    }

    async changeAvatar() {
        let result = await ImagePicker.launchImageLibraryAsync();
        console.log('result', result);
        this.setState({ load: false });
        if(!result.canceled) {
            console.log('result.uri', result.uri);
            let idAva = makeid(20);
            this.uploadImage(result.uri, idAva)
            .then(() => {
                this.setState({ load: true });
            })
            .catch((err) => {
                console.log('err', err);
                this.setState({ load: true });
            });
        }
    }

    async uploadImage(uri, imageName) {
        const response = await fetch(uri);
        const blob = await response.blob();
        let ref = firebase.storage().ref('avatar').child(imageName);
        await ref.put(blob)
        .then((res) => {
            console.log('res', res);
        });

        await ref.getDownloadURL().then((url) => {
            console.log('url', url)
            this.setState({ avatar: url });
        })

        return await firebase.database().ref("users/" + this.state.userKey).update({
            avatar: this.state.avatar,
        })
        .then(() => {
            console.log('avatar cahnge!!!');
            
        })
    }

    async changeData() {
        this.setState({ load: false });
        console.log('about', this.state.description);
        console.log('about', this.state.timeWork);
        await firebase.database().ref("users/" + this.state.userKey).update({
            description: this.state.description,
            timeWork: this.state.timeWork,
            priceWork: this.state.priceWork,
            advanced: this.state.advanced,
            expeirence: this.state.expeirence
        })
        .then(() => {
            this.setState({load: true, popSuccess: true});
            setTimeout(() => {
                this.setState({ popSuccess: false })
            }, 2000)
        });

    }

    render() {
        if(this.state.loadFont == true && this.state.load == true) {

            return (
                <ScrollView>
                    <Back nav={this.props.navigation} />

                    {/* Success */}
                    <View style={{
                        position: this.state.popSuccess == false ? 'relative' : 'absolute',
                        display: this.state.popSuccess == false ? 'none' : 'flex',
                        right: 0,
                        top: 50
                    }}>
                        <SuccessPopUp text="Обновлено" color="#EBEBEB" />
                    </View>
                    {/* Success */}

                    <TouchableOpacity style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 0
                    }}
                    onPress={() => {
                        this.changeAvatar();
                    }}>
                        {
                            this.state.avatar == '' ? <Avatar rounded title="TP" size="xlarge" /> : <Avatar
                                rounded
                                size="xlarge"
                                source={{
                                uri:
                                    this.state.avatar,
                                }}
                            />
                        }
                        <Text style={{
                            color: '#000',
                            fontFamily: 'TTCommons-Bold',
                            marginTop: 15,
                            fontSize: 19
                        }}>{this.state.name + ' ' + this.state.surname}</Text>
                        <Text style={{
                            color: '#000',
                            fontFamily: 'TTCommons-Regular',
                            marginTop: 5,
                            fontSize: 16
                        }}>{this.state.phone}</Text>
                    </TouchableOpacity>
                    
                    <View style={{
                        alignItems: 'center',
                    }}>
                        <TextInput style={{
                            borderRadius: 10,
                            fontFamily: 'TTCommons-Regular',
                            width: 284,
                            height: 120,
                            backgroundColor: '#EDEDED',
                            marginTop: 15,
                            padding: 10
                        }} 
                        placeholder="Расскажите о себе"
                        onChange={(text) => { 
                            this.setState({ description: text.nativeEvent.text })
                        }}
                        value={this.state.description} />
                    </View>

                    <View style={{
                        alignItems: 'center',
                    }}>
                        <TextInput style={{
                            borderRadius: 10,
                            fontFamily: 'TTCommons-Regular',
                            width: 284,
                            height: 50,
                            backgroundColor: '#EDEDED',
                            marginTop: 15,
                            padding: 10
                        }} 
                        keyboardType="numeric"
                        placeholder="Примерное время работы (в часах)"
                        onChange={(text) => { 
                            this.setState({ timeWork: text.nativeEvent.text })
                        }}
                        value={this.state.timeWork} />
                    </View>

                    <View style={{
                        alignItems: 'center',
                    }}>
                        <TextInput style={{
                            borderRadius: 10,
                            fontFamily: 'TTCommons-Regular',
                            width: 284,
                            height: 50,
                            backgroundColor: '#EDEDED',
                            marginTop: 15,
                            padding: 10
                        }} 
                        keyboardType="numeric"
                        placeholder="Примерная цена работы (в рублях)"
                        onChange={(text) => { 
                            this.setState({ priceWork: text.nativeEvent.text })
                        }}
                        value={this.state.priceWork} />
                    </View>
                    <View style={{
                        alignItems: 'center',
                    }}>
                        <TextInput style={{
                            borderRadius: 10,
                            fontFamily: 'TTCommons-Regular',
                            width: 284,
                            height: 50,
                            backgroundColor: '#EDEDED',
                            marginTop: 15,
                            padding: 10
                        }} 
                        keyboardType="numeric"
                        placeholder="Стаж (в годах)"
                        onChange={(text) => { 
                            this.setState({ expeirence: text.nativeEvent.text })
                        }}
                        value={this.state.expeirence} />
                    </View>
                    <View style={{
                        alignItems: 'center',
                    }}>
                        <TextInput style={{
                            borderRadius: 10,
                            fontFamily: 'TTCommons-Regular',
                            width: 284,
                            height: 50,
                            backgroundColor: '#EDEDED',
                            marginTop: 15,
                            padding: 10
                        }} 
                        placeholder="Хорошие качество"
                        onChange={(text) => { 
                            this.setState({ advanced: text.nativeEvent.text })
                        }}
                        value={this.state.advanced} />
                    </View>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity style={styles.btn} onPress={() => this.changeData()}>
                            <Text style={{color: '#fff', fontFamily: 'TTCommons-DemiBold', fontSize: 18}}>Отправить</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity style={[styles.btn, {
                            backgroundColor: '#DC4732',
                        }]} onPress={() => {
                            
                            this.props.navigation.navigate('Logout1');
                        }}>
                            <Text style={{color: '#fff', fontFamily: 'TTCommons-DemiBold', fontSize: 18}}>Выход</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )
        }
        else {
            return <LoadIndicator />
        }
    }
}

const styles = StyleSheet.create({
    btn: {
        width: Dimensions.get('window').width*60/100,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 20,
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
        marginBottom: 20
    },
})

export default AccountMechanic;