import React, { useState, useEffect, useContext } from 'react';
import { Text, FlatList, StyleSheet } from 'react-native';
import { obtemMinhasRifasAguardandoSorteio } from '../../servicos/firestore';
import MinhasRifasAguardandoSorteioList from '../../componentes/MinhasRifasAguardandoSorteioList';
import { Background } from './styles';
import { RifasDisponiveisListShimmerEffect } from '../../componentes/RifasDisponiveisListShimmerEffect'
import { AuthContext } from '../../contexts/auth';
 
export default function MinhasRifasAguardandoSorteio() {
    console.log('MinhasRifasAguardandoSorteio');
    const [minhasRifasAguardandoSorteio, setMinhasRifasAguardandoSorteio] = useState([]);
    const [loading, setLoading] = useState(false);
    const [temRifaAguardandoSorteio, setTemRifaAguardandoSorteio] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        console.log('MinhasRifasAguardandoSorteio-useEffect')
        carregarMinhasRifasAguardandoSorteio()
    }, [])

    async function carregarMinhasRifasAguardandoSorteio() {
        console.log('carregarMinhasRifasAguardandoSorteio');
        setMinhasRifasAguardandoSorteio([])
        setTemRifaAguardandoSorteio(false)
        setLoading(true)
        const minhasRifasAguardandoSorteioFirestore = await obtemMinhasRifasAguardandoSorteio(user.uid)
        console.log(minhasRifasAguardandoSorteioFirestore)
        setLoading(false)
        console.log(minhasRifasAguardandoSorteioFirestore.qtdRifas)
        if (minhasRifasAguardandoSorteioFirestore.qtdRifas > 0) {
            console.log('minhasRifasAguardandoSorteioFirestore.qtdRifas > 0')
            setMinhasRifasAguardandoSorteio(minhasRifasAguardandoSorteioFirestore.minhasRifasAguardandoSorteioFirestore)
            setTemRifaAguardandoSorteio(true)
        } else {
            setTemRifaAguardandoSorteio(false)
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
                    Minhas rifas aguardando sorteio
                </Text>
                {temRifaAguardandoSorteio ?
                    <FlatList style={styles.lista}
                        showsVerticalScrollIndicator={false}
                        data={minhasRifasAguardandoSorteio}
                        keyExtractor={item => item.key}
                        renderItem={({ item }) => (<MinhasRifasAguardandoSorteioList data={item} />)}
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