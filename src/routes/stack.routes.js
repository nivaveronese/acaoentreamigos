import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../pages/Home';
import Ok from '../pages/Ok';
import OkL from '../pages/OkL';
import DisponibilizarRifas from '../pages/DisponibilizarRifas';
import DisponibilizarRifasPremio from '../pages/DisponibilizarRifasPremio';
import DisponibilizarRifasPix from '../pages/DisponibilizarRifasPix';
import LiberarRifas from '../pages/LiberarRifas';
import Chat from '../pages/Chat';
import AlterarConta from '../pages/AlterarConta';
import ExcluirConta from '../pages/ExcluirConta';
import ExcluirRifaDisponibilizada from '../pages/ExcluirRifaDisponibilizada';
import SignIn from '../pages/SignIn';
import SaidaNet from '../pages/SaidaNet';
import ValidarAquisicao from '../pages/ValidarAquisicao';
import ValidarDisponibilizacao from '../pages/ValidarDisponibilizacao';
import InformarDadosPagamento from '../pages/InformarDadosPagamento';
import MinhasRifasAtivas from '../pages/MinhasRifasAtivas';
import MinhasRifasNaoLiberadas from '../pages/MinhasRifasNaoLiberadas';
import MinhasRifasALiberar from '../pages/MinhasRifasALiberar';
import MeusBilhetesAdquiridos from '../pages/MeusBilhetesAdquiridos';
import MinhasRifasDefinirPremio from '../pages/MinhasRifasDefinirPremio';
import MinhasRifasAguardandoSorteio from '../pages/MinhasRifasAguardandoSorteio';
import MinhasRifasSorteadas from '../pages/MinhasRifasSorteadas';
import DefinirPremio from '../pages/DefinirPremio';
import InformarDadosParaRecebimentoPremioPix from '../pages/InformarDadosParaRecebimentoPremioPix';
import VisualizarComprovanteDepositoPixGanhador from '../pages/VisualizarComprovanteDepositoPixGanhador';
import InformarDadosParaRecebimentoPremioProduto from '../pages/InformarDadosParaRecebimentoPremioProduto';
import VisualizarCodigoSegurancaGanhador from '../pages/VisualizarCodigoSegurancaGanhador';
import ConfirmarRecebimentoPremio from '../pages/ConfirmarRecebimentoPremio';
import InformarDadosParaRecebimentoValorResponsavel from '../pages/InformarDadosParaRecebimentoValorResponsavel';
import VisualizarComprovanteDepositoValorResponsavel from '../pages/VisualizarComprovanteDepositoValorResponsavel';

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
                name='DisponibilizarRifasPremio'
                component={DisponibilizarRifasPremio}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name='DisponibilizarRifasPix'
                component={DisponibilizarRifasPix}
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
                name='ValidarDisponibilizacao'
                component={ValidarDisponibilizacao}
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
            <Stack.Screen
                name='MinhasRifasALiberar'
                component={MinhasRifasALiberar}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name='MeusBilhetesAdquiridos'
                component={MeusBilhetesAdquiridos}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name='MinhasRifasDefinirPremio'
                component={MinhasRifasDefinirPremio}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name='MinhasRifasAguardandoSorteio'
                component={MinhasRifasAguardandoSorteio}
                options={{
                    headerShown: false
                }}
            />  
            <Stack.Screen
                name='MinhasRifasSorteadas'
                component={MinhasRifasSorteadas}
                options={{
                    headerShown: false
                }}
            />                        
            <Stack.Screen
                name='DefinirPremio'
                component={DefinirPremio}
                options={{
                    headerShown: false
                }}
            />   
            <Stack.Screen
                name='InformarDadosParaRecebimentoPremioPix'
                component={InformarDadosParaRecebimentoPremioPix}
                options={{
                    headerShown: false
                }}
            />    
            <Stack.Screen
                name='VisualizarComprovanteDepositoPixGanhador'
                component={VisualizarComprovanteDepositoPixGanhador}
                options={{
                    headerShown: false
                }}
            />  
            <Stack.Screen
                name='InformarDadosParaRecebimentoPremioProduto'
                component={InformarDadosParaRecebimentoPremioProduto}
                options={{
                    headerShown: false
                }}
            />   
            <Stack.Screen
                name='VisualizarCodigoSegurancaGanhador'
                component={VisualizarCodigoSegurancaGanhador}
                options={{
                    headerShown: false
                }}
            />     
            <Stack.Screen
                name='ConfirmarRecebimentoPremio'
                component={ConfirmarRecebimentoPremio}
                options={{
                    headerShown: false
                }}
            />   
            <Stack.Screen
                name='InformarDadosParaRecebimentoValorResponsavel'
                component={InformarDadosParaRecebimentoValorResponsavel}
                options={{
                    headerShown: false
                }}
            />  
            <Stack.Screen
                name='VisualizarComprovanteDepositoValorResponsavel'
                component={VisualizarComprovanteDepositoValorResponsavel}
                options={{
                    headerShown: false
                }}
            />                                                                                  
        </Stack.Navigator>
    )
}