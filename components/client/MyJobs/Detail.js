import React, {Component} from 'react';
import { Text, View, Image, Dimensions, TouchableOpacity, TextInput, StyleSheet, Easing, ScrollView } from 'react-native';
import { Avatar, CheckBox } from 'react-native-elements';
import downArrow from '../../../assets/images/down-arrow.png';
import * as Font from 'expo-font';
import * as firebase from 'firebase';

import Back from '../../Back';

import LoadIndicator from '../../../constants/LoadIndicator';

export default class Detal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            errAddress: 'none',
            addressForm: false,
            dataForm: false,
            marka: '',
            errMarka: 'none',
            confirmAddress: '',
            model: '',
            errModel: 'none',
            yearRel: '',
            errYearRel: 'none',
            happened: '',
            checked: false,
            checkedZap: false,
            openSelect: false,
            time: '',
            chooseMechanic: false,
            loadFont: false,
            load: false,
        }
    }
    async componentDidMount() {
        const { navigation } = this.props;
        console.log(navigation.getParam('id'));
        await firebase.database().ref("zakaz/"+navigation.getParam('id')).on("value", async (data) => {
            console.log('data', data.toJSON());
            
            this.setState({
                address: data.toJSON().address,
                checked: data.toJSON().checked,
                checkedZap: data.toJSON().checkedZap,
                happened: data.toJSON().happened,
                marka: data.toJSON().marka,
                model: data.toJSON().model,
                time: data.toJSON().time,
                typeWork: data.toJSON().typeWork,
                yearRel: data.toJSON().yearRel
            })
        });
        await firebase.auth().onAuthStateChanged(async (user) => {
            if(user) {
                firebase.database().ref("users").orderByChild("confEmail").equalTo(user.email).once("child_added", (snapshot) => {
                    this.setState({ userKey: snapshot.key })
                    firebase.database().ref("users/"+snapshot.key).on("value", (data) => {
                        console.log('value', data.toJSON().name);
                        this.setState({ 
                            name: data.toJSON().name,
                            surname: data.toJSON().surname,
                            avatar: data.toJSON().avatar,
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
            'TTCommons-Medium': require('../../../assets/fonts/TTCommons-Medium.ttf'),
            'TTCommons-Black': require('../../../assets/fonts/TTCommons-Black.ttf'),
            'TTCommons-Bold': require('../../../assets/fonts/TTCommons-Bold.ttf'),
          })
          .then(() => {
              this.setState({ loadFont: true });
          })
          .catch(err => {
              console.log('err', err);            
          });
    }
    render() {
        if(this.state.loadFont == true && this.state.load == true) { 
            return (
                <ScrollView>
                    <Back nav={this.props.navigation} />
                    <View style={{
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                    }}>
                        {
                            this.state.avatar == '' ? <Avatar rounded title="TP" size="medium" /> : <Avatar
                                rounded
                                size="medium"
                                source={{
                                uri:
                                    this.state.avatar,
                                }}
                            />
                        }
                        <Text style={{
                            fontSize: 24,
                            fontFamily: 'TTCommons-Bold',
                            color: '#000',
                            marginTop: 10
                        }}>{this.state.name} {this.state.surname}</Text>
                    </View>
                    <View style={{
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginTop: 40
                }}>
                    <View style={[[styles.containerInput, {marginTop: 10}]]}>
                        
                        <Text style={[styles.label, {
                            display: this.state.address == '' ? 'none' : 'flex',
                        }]}>
                            Адрес
                        </Text>
                        <Text style={[styles.errText, { display: this.state.errMarka }]}>Адрес</Text>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Адрес"
                            value={this.state.address}
                            onChange={(text) => { 
                                this.setState({ address: text.nativeEvent.text }) 
                            }} />
                    </View>
                    <View style={[[styles.containerInput, {marginTop: 10}]]}>
                        
                        <Text style={[styles.label, {
                            display: this.state.time == '' ? 'none' : 'flex',
                        }]}>
                            Время
                        </Text>
                        <Text style={[styles.errText, { display: this.state.errMarka }]}>Время</Text>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Время"
                            value={this.state.time}
                            onChange={(text) => { 
                                this.setState({ time: text.nativeEvent.text }) 
                            }} />
                    </View>
                    <View style={styles.containerInput}>
                        
                        <Text style={[styles.label, {
                            display: this.state.marka == '' ? 'none' : 'flex',
                        }]}>
                            Марка
                        </Text>
                        <Text style={[styles.errText, { display: this.state.errMarka }]}>Марка</Text>
                        <TextInput 
                            style={styles.input} 
                            value={this.state.marka}
                            placeholder="Марка"
                            onChange={(text) => { 
                                if(text == '') {
                                    this.setState({ errMarka: 'flex' });
                                } else {
                                    this.setState({ errMarka: 'none' });
                                }
                                this.setState({ marka: text.nativeEvent.text }) 
                            }} />
                    </View>
                    <View style={styles.containerInput}>
                        <Text style={[styles.label, {
                            display: this.state.model == '' ? 'none' : 'flex',

                        }]}>
                            Модель
                        </Text>
                        <Text style={[styles.errText, { display: this.state.errModel }]}>Модель</Text>
                        <TextInput 
                            style={styles.input}
                            value={this.state.model}
                            placeholder="Модель"
                            onChange={(text) => { 
                                if(text == '') {
                                    this.setState({ errModel: 'flex' });
                                } else {
                                    this.setState({ errModel: 'none' });
                                }
                                this.setState({ model: text.nativeEvent.text }) 
                            }} />
                    </View>
                    <View style={styles.containerInput}>
                        <Text style={[styles.label, {
                            display: this.state.yearRel == '' ? 'none' : 'flex',

                        }]}>
                            Год выпуска
                        </Text>
                        <Text style={[styles.errText, { display: this.state.errYearRel }]}>Год выпуска</Text>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Год выпуска"
                            value={this.state.yearRel}
                            onChange={(text) => { 
                                if(text == '') {
                                    this.setState({ errYearRel: 'flex' });
                                } else {
                                    this.setState({ errYearRel: 'none' });
                                }
                                this.setState({ yearRel: text.nativeEvent.text }) 
                            }} />
                    </View>
                    <View style={[styles.containerInput, {
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: Dimensions.get('window').width*70/100,
                    }]}>
                        <Text style={{
                            marginRight: 20,
                            width: '50%',
                            fontSize: 18,
                            fontFamily: 'TTCommons-Regular'
                        }}>Свои запчасти</Text>
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
                     {/* <View style={[styles.containerInput, {
                        flexDirection: 'row',
                        zIndex: 1000000,
                    }]}>
                        <Text style={{ 
                            marginRight: 20, 
                            width: '50%' }}>Во сколько приехать механику</Text>
                            <TouchableOpacity style={styles.containerSelect} onPress={() => {
                                this.setState({ openSelect: !this.state.openSelect })
                            }}>
                                <Text style={{
                                    color: '#fff',
                                    marginRight: 5
                                }}>
                                    БВ
                                </Text>
                                <Image source={downArrow} />
                            </TouchableOpacity>
                        
                            
                    </View> */}
                    {/* Select */}
                    <View style={{
                        position: this.state.openSelect == true ? 'absolute' : 'relative',
                        display: this.state.openSelect == true ? 'flex' : 'none',
                        bottom: Dimensions.get('window').height*0.20,
                        right: Dimensions.get('window').width*0.09,
                        
                    }}>
                        <View style={styles.triangle}></View>
                        <View style={styles.contentSelect}> 
                            
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                zIndex: 100000000
                            }}
                            >
                                <View>
                                    <Text>
                                        Ближайшое время
                                    </Text>
                                </View>
                                <CheckBox
                                center
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                                checked={this.state.checked}
                                checkedColor='#3BD88D'
                                uncheckedColor='#3BD88D'
                                onPress={() => {
                                    this.setState({ checked: !this.state.checked });
                                }}
                                />
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                zIndex: 1000,
                                height: 50
                            }}
                            >
                                <View>
                                    <Text>
                                        Определенное время
                                    </Text>
                                </View>
                                <TextInput style={{
                                    width: 46,
                                    borderColor: '#3BD88D',
                                    borderWidth: 1
                                }} 
                                onChange={(text) => {
                                    if(text != '') {
                                        this.setState({ checked: false });
                                    }
                                    this.setState({ time: text.nativeEvent.text });
                                }}
                                />
                            </View>
                        </View>
                    </View>
                    {/* Select */}
                    <View style={[styles.containerInput]}>
                        <Text style={[styles.label, {
                            display: this.state.happened == '' ? 'none' : 'flex',

                        }]}>
                            Что случилось?
                        </Text>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Что случилось?"
                            value={this.state.happened}
                            onChange={(text) => { 
                                this.setState({ happened: text.nativeEvent.text }) 
                            }} />
                    </View>
                    </View>
                </ScrollView>
            );
        } else {
            return <LoadIndicator />
        }
    }
}

const styles = StyleSheet.create({
    label: {
        // fontFamily: 'TTCommons-Regular',
        fontSize: 14,
        color: '#3BD88D',
        textAlign: 'left'
    },
    containerInput: {
        marginBottom: 50,
        flexDirection: 'column', 
        justifyContent: 'flex-start', 
        alignItems: 'flex-start',
        position: 'relative',
        width: Dimensions.get('window').width*70/100,
        zIndex: 100
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#3BD88D',
        width: Dimensions.get('window').width*70/100,
        textAlign: 'left',
        color: '#737373',
        fontSize: 21,
        fontFamily: 'TTCommons-Regular'
    },
    triangle: {
        backgroundColor: '#3BD88D',
        width: 30,
        height: 30,
        transform: [{
            rotate: '45deg'
        }],
        position: 'absolute',
        right: 20,
        top: -10
    },
    containerSelect: {
        padding: 10,
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: '#3BD88D',
        width: 76,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        borderRadius: 10,
        flexDirection: 'row',
        
    },
})