import React, { useState, useEffect, useContext } from 'react';
import { Text, FlatList, StyleSheet } from 'react-native';
import { obtemMinhasRifasALiberar } from '../../servicos/firestore';
import MinhasRifasALiberarList from '../../componentes/MinhasRifasALiberarList';
import { Background } from './styles';
import { RifasDisponiveisListShimmerEffect } from '../../componentes/RifasDisponiveisListShimmerEffect'
import { AuthContext } from '../../contexts/auth';
 
export default function MinhasRifasALiberar() {
    console.log('MinhasRifasALiberar');
    const [minhasRifasALiberar, setMinhasRifasALiberar] = useState([]);
    const [loading, setLoading] = useState(false);
    const [temRifaALiberar, setTemRifaALiberar] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        console.log('MinhasRifasALiberar-useEffect')
        carregarMinhasRifasALiberar()
    }, [])

    async function carregarMinhasRifasALiberar() {
        console.log('carregarMinhasRifasALiberar');
        setMinhasRifasALiberar([])
        setTemRifaALiberar(false)
        setLoading(true)
        const minhasRifasALiberarFirestore = await obtemMinhasRifasALiberar(user.uid)
        setLoading(false)
        console.log('minhasRifasALiberarFirestore.qtdRifas: ' + minhasRifasALiberarFirestore.qtdRifas)
        if (minhasRifasALiberarFirestore.qtdRifas > 0) {
            setMinhasRifasALiberar(minhasRifasALiberarFirestore.minhasRifasALiberarFirestore)
            setTemRifaALiberar(true)
        } else {
            setTemRifaALiberar(false)
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
                    Minhas rifas a liberar
                </Text>
                {temRifaALiberar ?
                    <FlatList style={styles.lista}
                        showsVerticalScrollIndicator={false}
                        data={minhasRifasALiberar}
                        keyExtractor={item => item.key}
                        renderItem={({ item }) => (<MinhasRifasALiberarList data={item} />)}
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