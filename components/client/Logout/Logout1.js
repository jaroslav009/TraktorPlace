import React, {PureComponent} from 'react';
import { Text, View, Image, Dimensions, TouchableOpacity, TextInput, Animated, StyleSheet, ScrollView } from 'react-native';
import Back from '../../Back';
import * as Font from 'expo-font';
import * as firebase from 'firebase';

class Logout1 extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loadFont: false,
        }
    }

    async componentDidMount() {
        await Font.loadAsync({
          'TTCommons-DemiBold': require('../../../assets/fonts/TTCommons-DemiBold.ttf'),
        })
        .then(() => {
            this.setState({ loadFont: true });
        })
        this.props.fontLoader();
    }
    render() {
        if(this.state.loadFont == true) {

            return (
                <View>
                    <View>
                        <Back nav={this.props.navigation} />
                    </View>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <View>
                            <Text style={{
                                fontFamily: 'TTCommons-DemiBold',
                                marginTop: Dimensions.get('window').height*0.2,
                                width: 262
                            }}>
                                Вы действительно хотите выйти из аккаунта?
                            </Text>
                        </View>

                        <TouchableOpacity style={styles.btn} onPress={() => {
                            firebase.auth().signOut();
                            this.props.navigation.navigate('Logout2');
                        }}>
                            <Text style={{color: '#fff', fontFamily: 'TTCommons-Regular',}}>Да</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
        else {
            return <View></View>
        }
    }
}

const styles = StyleSheet.create({
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
        marginTop: Dimensions.get('window').height*0.15
    },
});

export default Logout1;