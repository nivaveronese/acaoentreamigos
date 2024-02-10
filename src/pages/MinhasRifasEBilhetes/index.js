import React from 'react';
import { Texto, Container }
    from './styles';
import { useNavigation } from '@react-navigation/native';
import { Text, View, TouchableOpacity } from 'react-native';
import estilos from '../../estilos/estilos';

export default function MinhasRifasEBilhetes() {
    console.log('MinhasRifasEBilhetes');
    const navigation = useNavigation();

    function minhasRifasAtivas() {
        console.log('minhasRifasAtivas')
        navigation.navigate('MinhasRifasAtivas')
    }

    function minhasRifasNaoLiberadas() {
        console.log('minhasRifasNaoLiberadas')
        navigation.navigate('MinhasRifasNaoLiberadas')
    }

    function minhasRifasALiberar() {
        console.log('minhasRifasALiberar')
        navigation.navigate('MinhasRifasALiberar')
    }

    function meusBilhetesAdquiridos() {
        console.log('meusBilhetesAdquiridos')
        navigation.navigate('MeusBilhetesAdquiridos')
    }

    function minhasRifasDefinirPremio() {
        console.log('minhasRifasDefinirPremio')
        navigation.navigate('MinhasRifasDefinirPremio')
    }

    function minhasRifasAguardandoSorteio() {
        console.log('minhasRifasAguardandoSorteio')
        navigation.navigate('MinhasRifasAguardandoSorteio')
    }

    function minhasRifasSorteadas() {
        console.log('minhasRifasSorteadas')
        navigation.navigate('MinhasRifasSorteadas')
    }

    return (
        <Container>
            <Texto>Minhas Rifas e Bilhetes Adquiridos</Texto>
            <View>
                <TouchableOpacity style={estilos.linkLeft} onPress={() => minhasRifasAtivas()}>
                    <Text style={estilos.linkText}>Minhas rifas ativas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilos.linkLeft} onPress={() => minhasRifasALiberar()}>
                    <Text style={estilos.linkText}>Minhas rifas a liberar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilos.linkLeft} onPress={() => minhasRifasNaoLiberadas()}>
                    <Text style={estilos.linkText}>Minhas rifas nao liberadas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilos.linkLeft} onPress={() => meusBilhetesAdquiridos()}>
                    <Text style={estilos.linkText}>Meus bilhetes adquiridos</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilos.linkLeft} onPress={() => minhasRifasDefinirPremio()}>
                    <Text style={estilos.linkText}>Minhas rifas que atingiram data final venda. Definir premio</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilos.linkLeft} onPress={() => minhasRifasAguardandoSorteio()}>
                    <Text style={estilos.linkText}>Minhas rifas aguardando sorteio</Text>
                </TouchableOpacity> 
                <TouchableOpacity style={estilos.linkLeft} onPress={() => minhasRifasSorteadas()}>
                    <Text style={estilos.linkText}>Minhas rifas sorteadas</Text>
                </TouchableOpacity>                                
            </View>
        </Container>
    )
}
