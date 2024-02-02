import React, { useContext, useState, useEffect } from 'react';
import { Text, StyleSheet, FlatList } from 'react-native';
import { Background } from './styles';
import { AuthContext } from '../../contexts/auth';
import MinhasRifasNaoLiberadasList from '../../componentes/MinhasRifasNaoLiberadasList';
import { obtemMinhasRifasNaoLiberadas } from '../../servicos/firestore';
import { RifasDisponiveisListShimmerEffect } from '../../componentes/RifasDisponiveisListShimmerEffect';

export default function MinhasRifasNaoLiberadas() {

    const { user: usuario } = useContext(AuthContext);
    const [minhasRifasNaoLiberadas, setMinhasRifasNaoLiberadas] = useState([]);
    const [temRifaNaoLiberada, setTemRifaNaoLiberada] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log('MinhasRifasNaoLiberadas-useEffect')
        carregarMinhasRifasNaoLiberadas()
    }, [])

    async function carregarMinhasRifasNaoLiberadas() {
        console.log('carregarMinhasRifasNaoLiberadas');
        if (loading) return;
        setLoading(true)
        const minhasRifasNaoLiberadasFirestore = await obtemMinhasRifasNaoLiberadas(usuario.uid)
        console.log('minhasRifasNaoLiberadasFirestore.qtdRifas: ' + minhasRifasNaoLiberadasFirestore.qtdRifas)
        if (minhasRifasNaoLiberadasFirestore.qtdRifas == 0) {
            setMinhasRifasNaoLiberadas(minhasRifasNaoLiberadasFirestore.minhasRifasNaoLiberadasFirestore)
            setTemRifaNaoLiberada(true)
        } else {
            setTemRifaNaoLiberada(false)
        }
        setLoading(false)
        return;
    }

    if (loading) {
        return (
            <RifasDisponiveisListShimmerEffect />
        )
    } else {
        return (
            <Background>
                <Text style={styles.texto}>
                    Rifas não liberadas
                </Text>
                {temRifaNaoLiberada ?
                    <FlatList style={styles.lista}
                        showsVerticalScrollIndicator={false}
                        data={minhasRifasNaoLiberadas}
                        keyExtractor={item => item.key}
                        renderItem={({ item }) => (<MinhasRifasNaoLiberadasList data={item} />)}
                    />
                    :
                    null}
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
    texto: {
        fontSize: 25,
        color: '#000',
        fontFamily: 'roboto',
        marginLeft: 15,
        fontStyle: 'italic',
    },
}); 