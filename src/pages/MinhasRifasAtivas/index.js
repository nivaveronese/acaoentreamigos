import React, { useState, useEffect, useContext } from 'react';
import { Text, FlatList, StyleSheet } from 'react-native';
import { obtemMinhasRifasAtivas } from '../../servicos/firestore';
import MinhasRifasAtivasList from '../../componentes/MinhasRifasAtivasList';
import { Background } from './styles';
import { RifasDisponiveisListShimmerEffect } from '../../componentes/RifasDisponiveisListShimmerEffect'
import { AuthContext } from '../../contexts/auth';
 
export default function MinhasRifasAtivas() {
    console.log('MinhasRifasAtivas');
    const [rifasAtivas, setRifasAtivas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [temRifaAtiva, setTemRifaAtiva] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        console.log('MinhasRifasAtivas-useEffect')
        carregarMinhasRifasAtivas()
    }, [])

    async function carregarMinhasRifasAtivas() {
        console.log('carregarMinhasRifasAtivas');
        setRifasAtivas([])
        setTemRifaAtiva(false)
        setLoading(true)
        const minhasRifasAtivasFirestore = await obtemMinhasRifasAtivas(user.uid)
        console.log(minhasRifasAtivasFirestore)
        console.log(minhasRifasAtivasFirestore.minhasRifasAtivasFirestore[0].minhaRifaAtiva.bairro)
        console.log(minhasRifasAtivasFirestore.minhasRifasAtivasFirestore[0].qtdBilhetes)
        setLoading(false)
        console.log(minhasRifasAtivasFirestore.minhasRifasAtivasFirestore.length)
        if (minhasRifasAtivasFirestore.minhasRifasAtivasFirestore.length > 0) {
            console.log('minhasRifasAtivasFirestore.minhasRifasAtivasFirestore.length > 0')
            setRifasAtivas(minhasRifasAtivasFirestore.minhasRifasAtivasFirestore)
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
                        data={rifasAtivas}
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