import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../pages/Home';
import Ok from '../pages/Ok';
import OkL from '../pages/OkL';
import DisponibilizarRifas from '../pages/DisponibilizarRifas';
import LiberarRifas from '../pages/LiberarRifas';
import Chat from '../pages/Chat';
import AlterarConta from '../pages/AlterarConta';
import ExcluirConta from '../pages/ExcluirConta';
import ExcluirRifaDisponibilizada from '../pages/ExcluirRifaDisponibilizada';
import SignIn from '../pages/SignIn';
import SaidaNet from '../pages/SaidaNet';
import ValidarAquisicao from '../pages/ValidarAquisicao';
import InformarDadosPagamento from '../pages/InformarDadosPagamento';
import MinhasRifasAtivas from '../pages/MinhasRifasAtivas';
import MinhasRifasNaoLiberadas from '../pages/MinhasRifasNaoLiberadas';

const Stack = createNativeStackNavigator();

console.log('routes/stack.routes.js');

export default function StackRoutes() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name='Home'
                component={Home}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name='Ok'
                component={Ok}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name='OkL'
                component={OkL}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name='DisponibilizarRifas'
                component={DisponibilizarRifas}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name='LiberarRifas'
                component={LiberarRifas}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name='SignIn'
                component={SignIn}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name='Chat'
                component={Chat}
                options={{
                    headerStyle: {
                        backgroundColor: '#008080'
                    },
                    headerTintColor: '#FFF',
                    headerBackTitleVisible: false,
                    headerTitle: 'Voltar'
                }}
            />
            <Stack.Screen
                name='AlterarConta'
                component={AlterarConta}
                options={{
                    headerStyle: {
                        backgroundColor: '#008080'
                    },
                    headerTintColor: '#FFF',
                    headerBackTitleVisible: false,
                    headerTitle: 'Voltar'
                }}
            />
            <Stack.Screen
                name='ExcluirConta'
                component={ExcluirConta}
                options={{
                    headerStyle: {
                        backgroundColor: '#008080'
                    },
                    headerTintColor: '#FFF',
                    headerBackTitleVisible: false,
                    headerTitle: 'Voltar'
                }}
            />
            <Stack.Screen
                name='ExcluirRifaDisponibilizada'
                component={ExcluirRifaDisponibilizada}
                options={{
                    headerStyle: {
                        backgroundColor: '#008080'
                    },
                    headerTintColor: '#FFF',
                    headerBackTitleVisible: false,
                    headerTitle: 'Voltar'
                }}
            />
            <Stack.Screen
                name='SaidaNet'
                component={SaidaNet}
                options={{
                    headerStyle: {
                        backgroundColor: '#008080'
                    },
                    headerTintColor: '#FFF',
                    headerBackTitleVisible: false,
                    headerTitle: 'Voltar'
                }}
            />
            <Stack.Screen
                name='ValidarAquisicao'
                component={ValidarAquisicao}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name='InformarDadosPagamento'
                component={InformarDadosPagamento}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name='MinhasRifasAtivas'
                component={MinhasRifasAtivas}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name='MinhasRifasNaoLiberadas'
                component={MinhasRifasNaoLiberadas}
                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
}