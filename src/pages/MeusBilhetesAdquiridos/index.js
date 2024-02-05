import React, { useState, useEffect, useContext } from 'react';
import { Text, FlatList, StyleSheet } from 'react-native';
import { obtemMeusBilhetesAdquiridos } from '../../servicos/firestore';
import MeusBilhetesAdquiridosList from '../../componentes/MeusBilhetesAdquiridosList';
import { Background } from './styles';
import { RifasDisponiveisListShimmerEffect } from '../../componentes/RifasDisponiveisListShimmerEffect'
import { AuthContext } from '../../contexts/auth';
 
export default function MeusBilhetesAdquiridos() {
    console.log('MeusBilhetesAdquiridos');
    const [meusBilhetesAdquiridos, setMeusBilhetesAdquiridos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [temBilheteAdquirido, setTemBilheteAdquirido] = useState(false);
    const { user } = useContext(AuthContext);
   
    useEffect(() => {
        console.log('MeusBilhetesAdquiridos-useEffect')
        carregarMeusBilhetesAdquiridos()
    }, [])

    async function carregarMeusBilhetesAdquiridos() {
        console.log('carregarMeusBilhetesAdquiridos');
        setMeusBilhetesAdquiridos([])
        setTemBilheteAdquirido(false)
        setLoading(true)
        const meusBilhetesAdquiridosFirestore = await obtemMeusBilhetesAdquiridos(user.uid)
        console.log(meusBilhetesAdquiridosFirestore)
        setLoading(false)
        console.log(meusBilhetesAdquiridosFirestore.qtdBilhetes)
        if (meusBilhetesAdquiridosFirestore.qtdBilhetes > 0) {
            console.log('meusBilhetesAdquiridosFirestore.qtdBilhetes > 0')
            setMeusBilhetesAdquiridos(meusBilhetesAdquiridosFirestore.meusBilhetesAdquiridosFirestore)
            setTemBilheteAdquirido(true)
        } else {
            setTemBilheteAdquirido(false)
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
                    Meus bilhetes adquiridos
                </Text>
                {temBilheteAdquirido ?
                    <FlatList style={styles.lista}
                        showsVerticalScrollIndicator={false}
                        data={meusBilhetesAdquiridos}
                        keyExtractor={item => item.key}
                        renderItem={({ item }) => (<MeusBilhetesAdquiridosList data={item} />)}
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