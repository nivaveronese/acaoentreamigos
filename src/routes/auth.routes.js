import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from '../pages/SignIn';
import Apresentacao from '../pages/Apresentacao';
import SplashScreen from '../pages/SplashScreen';
import TermoDeUso from '../pages/TermoDeUso';
import CriarConta from '../pages/CriarConta';
import AlterarConta from '../pages/AlterarConta';

const AuthStack = createNativeStackNavigator();

console.log('routes/auth.routes.js');

function AuthRoutes(){
    return(
        <AuthStack.Navigator>
            <AuthStack.Screen
                name='SplashScreen' 
                component={SplashScreen}
                options={{headerShown: false}}
            />             
            <AuthStack.Screen
                name='Apresentacao' 
                component={Apresentacao}
                options={{headerShown: false}}
            />  
            <AuthStack.Screen
                name='TermoDeUso' 
                component={TermoDeUso}
                options={{headerStyle:{
                    backgroundColor: '#008080'
                },
                    headerTintColor: '#FFF',
                    headerBackTitleVisible: false,
                    headerTitle: 'Voltar'
            }}
            /> 
            <AuthStack.Screen
                name='CriarConta' 
                component={CriarConta}
                options={{headerStyle:{
                    backgroundColor: '#008080'
                },
                    headerTintColor: '#FFF',
                    headerBackTitleVisible: false,
                    headerTitle: 'Voltar'
            }}
            /> 
            <AuthStack.Screen
                name='AlterarConta' 
                component={AlterarConta}
                options={{headerStyle:{
                    backgroundColor: '#008080'
                },
                    headerTintColor: '#FFF',
                    headerBackTitleVisible: false,
                    headerTitle: 'Voltar'
            }}
            />             
            <AuthStack.Screen
                name='SignIn' 
                component={SignIn}
                options={{headerShown: false}}
            />        
        </AuthStack.Navigator>
    )
}

export default AuthRoutes;