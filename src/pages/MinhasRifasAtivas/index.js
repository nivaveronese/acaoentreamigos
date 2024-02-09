import React, { useState, useEffect, useContext } from 'react';
import { Text, FlatList, StyleSheet } from 'react-native';
import { obtemMinhasRifasAtivas } from '../../servicos/firestore';
import MinhasRifasAtivasList from '../../componentes/MinhasRifasAtivasList';
import { Background } from './styles';
import { RifasDisponiveisListShimmerEffect } from '../../componentes/RifasDisponiveisListShimmerEffect'
import { AuthContext } from '../../contexts/auth';
 
export default function MinhasRifasAtivas() {
    console.log('MinhasRifasAtivas');
    const [minhasRifasAtivas, setMinhasRifasAtivas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [temRifaAtiva, setTemRifaAtiva] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        console.log('MinhasRifasAtivas-useEffect')
        carregarMinhasRifasAtivas()
    }, [])
 
    async function carregarMinhasRifasAtivas() {
        console.log('carregarMinhasRifasAtivas');
        setMinhasRifasAtivas([])
        setTemRifaAtiva(false)
        setLoading(true)
        const minhasRifasAtivasFirestore = await obtemMinhasRifasAtivas(user.uid)
        console.log(minhasRifasAtivasFirestore)
        setLoading(false)
        console.log(minhasRifasAtivasFirestore.qtdRifas)
        if (minhasRifasAtivasFirestore.qtdRifas > 0) {
            console.log('minhasRifasAtivasFirestore.qtdRifas > 0')
            setMinhasRifasAtivas(minhasRifasAtivasFirestore.minhasRifasAtivasFirestore)
            setTemRifaAtiva(true)
        } else {
            setTemRifaAtiva(false)
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
                    Minhas rifas ativas
                </Text>
                {temRifaAtiva ?
                    <FlatList style={styles.lista}
                        showsVerticalScrollIndicator={false}
                        data={minhasRifasAtivas}
                        keyExtractor={item => item.key}
                        renderItem={({ item }) => (<MinhasRifasAtivasList data={item} />)}
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