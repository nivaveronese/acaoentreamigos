import React, { useState, useEffect, useContext } from 'react';
import { Text, FlatList, StyleSheet } from 'react-native';
import { obtemMinhasRifasDefinirPremio } from '../../servicos/firestore';
import MinhasRifasDefinirPremioList from '../../componentes/MinhasRifasDefinirPremioList';
import { Background } from './styles';
import { RifasDisponiveisListShimmerEffect } from '../../componentes/RifasDisponiveisListShimmerEffect'
import { AuthContext } from '../../contexts/auth';
 
export default function MinhasRifasDefinirPremio() {
    console.log('MinhasRifasDefinirPremio');
    const [minhasRifasDefinirPremio, setMinhasRifasDefinirPremio] = useState([]);
    const [loading, setLoading] = useState(false);
    const [temRifaDefinirPremio, setTemRifaDefinirPremio] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        console.log('MinhasRifasDefinirPremio-useEffect')
        carregarMinhasRifasDefinirPremio()
    }, [])

    async function carregarMinhasRifasDefinirPremio() {
        console.log('carregarMinhasRifasDefinirPremio');
        setMinhasRifasDefinirPremio([])
        setTemRifaDefinirPremio(false)
        setLoading(true)
        const minhasRifasDefinirPremioFirestore = await obtemMinhasRifasDefinirPremio(user.uid)
        console.log(minhasRifasDefinirPremioFirestore)
        setLoading(false)
        console.log(minhasRifasDefinirPremioFirestore.qtdRifas)
        if (minhasRifasDefinirPremioFirestore.qtdRifas > 0) {
            console.log('minhasRifasDefinirPremioFirestore.qtdRifas > 0')
            setMinhasRifasDefinirPremio(minhasRifasDefinirPremioFirestore.minhasRifasDefinirPremioFirestore)
            setTemRifaDefinirPremio(true)
        } else {
            setTemRifaDefinirPremio(false)
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
                    Minhas rifas para definir prêmio
                </Text>
                {temRifaDefinirPremio ?
                    <FlatList style={styles.lista}
                        showsVerticalScrollIndicator={false}
                        data={minhasRifasDefinirPremio}
                        keyExtractor={item => item.key}
                        renderItem={({ item }) => (<MinhasRifasDefinirPremioList data={item} />)}
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