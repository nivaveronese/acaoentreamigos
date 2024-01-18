import React, { useContext, useState, useEffect } from 'react';
import {Text, View, StyleSheet,FlatList } from 'react-native';
import { Background } from './styles';
import { AuthContext } from '../../contexts/auth';
import RifasNaoLiberadasList from '../../componentes/RifasNaoLiberadasList';
import { obtemRifasNaoLiberadas } from '../../servicos/firestore';
import estilos from '../../estilos/estilos';
import { RifasDisponiveisListShimmerEffect } from '../../componentes/RifasDisponiveisListShimmerEffect';

export default function NaoLiberada() { 

    const { user: usuario } = useContext(AuthContext);
    const [rifasNaoLiberadas, setRifasNaoLiberadas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mensagemCadastro, setMensagemCadastro] = useState('');

    useEffect(() => {
        console.log ('useEffect')
        carregarRifasNaoLiberadas()
    }, [])

    async function carregarRifasNaoLiberadas() {
        console.log('carregarRifasNaoLiberadas');
        if(loading) return;
        setLoading(true)
        const rifasNaoLiberadasFirestore = await obtemRifasNaoLiberadas(usuario.uid)
        setRifasNaoLiberadas(rifasNaoLiberadasFirestore.rifasNaoLiberadasFirestore)
        console.log('rifasNaoLiberadasFirestore.qtdRifas: ' + rifasNaoLiberadasFirestore.qtdRifas)
        if (rifasNaoLiberadasFirestore.qtdRifas == 0){
            setMensagemCadastro('Nenhum rifa não liberada')
        }
        setLoading(false)
    }
 
    if (loading) {
        return (
            <RifasDisponiveisListShimmerEffect />
        )
    } else {
        return (
            <Background>
                <Text style={styles.texto}>
                    Rifas não liberados
                </Text>
                <View style={estilos.areaMensagemCadastro}>
                    <Text style={estilos.textoMensagemCadastro}>
                        {mensagemCadastro}
                    </Text>
                </View>
                <FlatList style={styles.lista}
                    showsVerticalScrollIndicator={false}
                    data={rifasNaoLiberadas}
                    keyExtractor={item => item.key}
                    renderItem={({ item }) => (<RifasNaoLiberadasList data={item} />)}
                />
            </Background>
        )
    }
}
const styles = StyleSheet.create({
    lista: {
        paddingTop: 2,
        Background: '#FFFFFF',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    texto:{
        fontSize: 25,
        color: '#000',
        fontFamily: 'roboto',
        marginLeft: 15,
        fontStyle: 'italic',
    },   
}); 