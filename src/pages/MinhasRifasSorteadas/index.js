import React, { useState, useEffect, useContext } from 'react';
import { Text, FlatList, StyleSheet } from 'react-native';
import { obtemMinhasRifasSorteadas } from '../../servicos/firestore';
import MinhasRifasSorteadasList from '../../componentes/MinhasRifasSorteadasList';
import { Background } from './styles';
import { RifasDisponiveisListShimmerEffect } from '../../componentes/RifasDisponiveisListShimmerEffect'
import { AuthContext } from '../../contexts/auth';
 
export default function MinhasRifasSorteadas() {
    console.log('MinhasRifasSorteadas');
    const [minhasRifasSorteadas, setMinhasRifasSorteadas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [temRifasSorteadas, setTemRifasSorteadas] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        console.log('MinhasRifasSorteadas-useEffect')
        carregarMinhasRifasSorteadas()
    }, [])

    async function carregarMinhasRifasSorteadas() {
        console.log('carregarMinhasRifasSorteadas');
        setMinhasRifasSorteadas([])
        setTemRifasSorteadas(false)
        setLoading(true)
        const minhasRifasSorteadasFirestore = await obtemMinhasRifasSorteadas(user.uid)
        console.log(minhasRifasSorteadasFirestore)
        setLoading(false)
        console.log(minhasRifasSorteadasFirestore.qtdRifas)
        if (minhasRifasSorteadasFirestore.qtdRifas > 0) {
            console.log('minhasRifasSorteadasFirestore.qtdRifas > 0')
            setMinhasRifasSorteadas(minhasRifasSorteadasFirestore.minhasRifasSorteadasFirestore)
            setTemRifasSorteadas(true)
        } else {
            setTemRifasSorteadas(false)
            return
        }
    }

    if (loading) {
        return (
            <RifasDisponiveisListShimmerEffect />
        )
    } else {
        return (
            <Background>
                <Text style={styles.texto}>
                    Minhas rifas sorteadas
                </Text>
                {temRifasSorteadas ?
                    <FlatList style={styles.lista}
                        showsVerticalScrollIndicator={false}
                        data={minhasRifasSorteadas}
                        keyExtractor={item => item.key}
                        renderItem={({ item }) => (<MinhasRifasSorteadasList data={item} />)}
                    />
                    :
                    null}
            </Background>
        );
    }
}

const styles = StyleSheet.create({
    lista: {
        paddingTop: 2,
        Background: '#FFFFFF',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        marginTop: 20,
    },
    texto: {
        fontSize: 25,
        color: '#000',
        fontFamily: 'roboto',
        marginLeft: 15,
        fontStyle: 'italic',
    },
})