// import Exponent from 'exponent';

import CreditCard, {CardImages} from 'react-native-credit-card';
import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    TextInput,
    Image,
    Alert
} from 'react-native';
import Swiper from 'react-native-swiper';
import * as firebase from 'firebase';

const SWIPER_HEIGHT = 180;
const {height, width} = Dimensions.get('window');

export default class AddCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      type: '',
      focused: '',
      number: '',
      name: '',
      expiry: '',
      cvc: '',
    }
    this.addCard = this.addCard.bind(this);
  }

  onNext() {
        this.swiper.scrollBy(1);
    }

  componentDidMount() {
        this.refs['number'].focus();
    }
    onMomentumScrollEnd(e, state, context) {
       var indexMap = [
           'number',
           'name',
           'expiry',
           'cvc',
           'type',
       ];
       this.setState({
           index: state.index,
           focused: indexMap[state.index]
       }, () => {
           try {
               this.refs[indexMap[state.index]].focus();
           } catch(e) {

           }
       });
   }
  async addCard() {
    if(this.state.number.length < 16) {
      console.log('length');
      this.swiper.scrollBy(1);
      return Alert.alert('Введите номер карты')
    } else if(this.state.name == '') {
      this.swiper.scrollBy(1);
      return Alert.alert('Введите имя')
    } else if(this.state.expiry.length < 4) {
      this.swiper.scrollBy(1);
      return Alert.alert('Введите дату карты')
    } else if(this.state.cvc.length < 3) {
      this.swiper.scrollBy(1);
      return Alert.alert('Введите CVC код')
    }
    await firebase.auth().onAuthStateChanged(async (user) => {
        if(user) {
            console.log(`user ${user}`);
            console.log(`email ${user.email}`);
            firebase.database().ref("users").orderByChild("confEmail").equalTo(user.email).once("child_added", (snapshot) => {
                console.log('snapshot', snapshot.key);
                this.setState({ userKey: snapshot.key })
                firebase.database().ref("users/"+snapshot.key).update({
                    card: {
                        [this.state.number]: {
                            number: this.state.number,
                            name: this.state.name,
                            expiry: this.state.expiry,
                            cvc: this.state.cvc
                        }
                    }
                });
                this.props.navigation.navigate('PaymentMethod')
            });
        }
    });
  }

  render() {
    var cardTypes = [];
        for (var key in CardImages) {
            cardTypes.push({type: key, image: CardImages[key]});
        }
        if (this.state.restoring) {
            return null;
        }
    return (
      <View style={styles.container}>
                <Image style={styles.background} source={require('../../../assets/images/background.png')} resizeMode={'cover'} />
                <View style={{
                  top: '35%',
                  left: '10%'
                }}>
                <CreditCard
                  type={this.state.type}
                  shiny={false}
                  bar={false}
                  imageFront={require('../../../assets/images/card-front.png')}
                  imageBack={require('../../../assets/images/card-back.png')}
                  focused={this.state.focused}
                  name={this.state.name}
                  expiry={this.state.expiry}
                  cvc={this.state.cvc}/>
                  </View>
                <Swiper
                    style={styles.wrapper}
                    height={SWIPER_HEIGHT}
                    showsButtons={false}
                    onMomentumScrollEnd = {this.onMomentumScrollEnd.bind(this)}
                    ref={(swiper) => {this.swiper = swiper}}
                    index={this.state.index}>
                    <View style={styles.slide}>
                        <View style={styles.card}>
                            <Text style={styles.textNumber}>CARD NUMBER</Text>
                            <TextInput keyboardType="numeric" maxLength={16} ref="number" autoFocus={true} value={this.state.number} onChangeText={(number) => this.setState({number})}/>
                        </View>
                    </View>
                    <View style={styles.slide}>
                        <View style={styles.card}>
                            <Text style={styles.textName}>CARD HOLDER'S NAME</Text>
                            <TextInput ref="name" value={this.state.name} onChangeText={(name) => this.setState({name})}/>
                        </View>
                    </View>
                    <View style={styles.slide}>
                        <View style={styles.card}>
                            <Text style={styles.textName}>EXPIRY</Text>
                            <TextInput keyboardType="numeric" ref="expiry" maxLength={4} value={this.state.expiry} onChangeText={(expiry) => this.setState({expiry})}/>
                        </View>
                    </View>
                    <View style={styles.slide}>
                        <View style={styles.card}>
                            <Text style={styles.textCvc}>CVV/CVC NUMBER</Text>
                            <TextInput keyboardType="numeric" ref="cvc" maxLength={3} value={this.state.cvc} onChangeText={(cvc) => this.setState({cvc})}/>
                        </View>
                    </View>
                    <View style={styles.slide}>
                        <View style={styles.card}>
                            <Text style={styles.textNumber}>CARD TYPE</Text>
                            <View style={{flexDirection: 'row'}}>
                                {cardTypes.map((cardType) => {
                                    return (
                                        <TouchableOpacity key={cardType.type} onPress={() => this.setState({type: cardType.type})}>
                                            <View>
                                                <Image source={{uri: cardType.image}} style={{width: 57, height: 35, marginHorizontal: 5}} />
                                            </View>

                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                        </View>
                        <TouchableOpacity style={{
                          width: Dimensions.get('window').width*60/100,
                          paddingTop: 10,
                          paddingBottom: 10,
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
                        }}
                        onPress={() => {
                          this.addCard();
                        }}
                        >
                          <Text style={{
                            color: '#fff'
                          }}>Завершить</Text>
                        </TouchableOpacity>
                    </View>
                </Swiper>
                <TouchableOpacity onPress={this.onNext.bind(this)}>
                    <View style={styles.button}>
                        <Text style={styles.textButton}>NEXT</Text>
                    </View>
                </TouchableOpacity>
            </View>

    )
  }
}

const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: width,
        height: height
    },
    container: {
        backgroundColor: '#f2f2f2',
        flex: 1,
        paddingTop: 30,
        justifyContent: 'center',
    },
    wrapper: {
        height: SWIPER_HEIGHT,
        top: '40%'
    },
    slide: {
        height: SWIPER_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {

    },
    card: {
        marginHorizontal: 10,
        marginBottom: 30,
        backgroundColor: '#fff',
        borderRadius: 3,
        elevation: 3,
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderColor: '#ddd',
        padding: 10,
    },
    button: {
        height: 50,
        backgroundColor: '#1ba549',
        justifyContent: 'center',
    },
    textButton: {
        textAlign: 'center',
        color: '#fff'
    }

});

// function cacheImages(images) {
//     return images.map(image => Exponent.Asset.fromModule(image).downloadAsync());
// }
// Exponent.registerRootComponent(RNCreditCard);
