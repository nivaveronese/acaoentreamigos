import React from 'react';
import{StatusBar, StyleSheet} from 'react-native';
import Routes from './src/routes/index';
import {NavigationContainer} from '@react-navigation/native';
import AuthProvider from './src/contexts/auth';
import 'react-native-gesture-handler';

export default function App() {

      return (        
        <NavigationContainer style={styles.container} >
            <AuthProvider>
                <StatusBar backgroundColor='#131313' barStyle='light-content'/>          
                <Routes/>
            </AuthProvider>        
        </NavigationContainer>
    );
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        alignItems: 'center'
    }
});