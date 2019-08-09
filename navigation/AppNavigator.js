import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';

// import MainTabNavigator from './MainTabNavigator';
import HeroScreen from '../components/HeroScreen';
import Register from '../components/Auth/Register';
import Login from '../components/Auth/Login';

// Client
import MainClient from '../components/client/Main';
import Account from '../components/client/Account/Account';

export default createAppContainer(
  createStackNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    MainClient: MainClient,
    Account: Account,
    Register: Register,
    
    Login: Login,
    HeroScreen: HeroScreen,
  },
  {
    headerMode: 'none',
  }
  )
);
