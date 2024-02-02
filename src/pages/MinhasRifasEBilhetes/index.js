import React, { useContext, useEffect, useState } from 'react';
import { Texto, Container }
    from './styles';
import { AuthContext } from '../../contexts/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { Text, View,TouchableOpacity } from 'react-native';
import estilos from '../../estilos/estilos';

export default function MinhasRifasEBilhetes() {
    console.log('MinhasRifasEBilhetes');
    const { user, signOut } = useContext(AuthContext);
    const navigation = useNavigation();
    const [imagemAvatar, setImagemAvatar] = useState('');

    useEffect(() => {
        async function carregarDadosConta() {
            console.log('carregarDadosConta')
            if (user) {
                //                //console.log('user: ' + user.imagemAvatar)
                setImagemAvatar(user.imagemAvatar)
            }
        }
        carregarDadosConta()
    }, [])
  
    function minhasRifasAtivas() {
        console.log('minhasRifasAtivas')
        navigation.navigate('MinhasRifasAtivas')
    }
 
    function minhasRifasNaoAprovadas() {
        console.log('minhasRifasNaoAprovadas')
        navigation.navigate('MinhasRifasNaoAprovadas')
    }

    return (
        <Container>
            <Texto>Minhas Rifas e Bilhetes Adquiridos</Texto>
            <View>
                <TouchableOpacity style={estilos.linkLeft} onPress={() => minhasRifasAtivas()}>
                    <Text style={estilos.linkText}>Minhas rifas ativas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilos.linkLeft} onPress={() => minhasRifasNaoAprovadas()}>
                    <Text style={estilos.linkText}>Minhas rifas nao aprovadas</Text>
                </TouchableOpacity>
            </View>
        </Container>
    )
}
