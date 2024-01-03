import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { obtemRifasALiberar } from '../../servicos/firestore';
import RifasALiberarList from '../../componentes/RifasALiberarList';
import { Background } from './styles';
import { RifasDisponiveisListShimmerEffect } from '../../componentes/RifasDisponiveisListShimmerEffect';
import { Texto } from '../../pages/LiberarRifas/styles';
import { useNavigation } from '@react-navigation/native';

export default function LiberarRifas() {
    console.log('pages/LiberarRifas');
    const [RifasALiberar, setRifasALiberar] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [temLivroALiberar, setTemLivroALiberar] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        console.log ('useEffect')
        refreshList()
    }, [])

    async function carregarRifasALiberar(shouldRefresh = false) {
        console.log('carregarRifasALiberar');
        if(loading) return;
        setTemLivroALiberar(false)
        setLoading(true)
        const RifasALiberarFirestore = await obtemRifasALiberar()
        setRifasALiberar(shouldRefresh ? RifasALiberarFirestore.RifasALiberarFirestore
            : [...RifasALiberar, ...RifasALiberarFirestore.RifasALiberarFirestore])
        console.log('RifasALiberarFirestore.qtdRifas: ' + RifasALiberarFirestore.qtdRifas)
        if (RifasALiberarFirestore.qtdRifas > 0){
            setTemLivroALiberar(true)
        } else {
            navigation.navigate('Ok')
        }
        setLoading(false)
    } 
 
    async function refreshList(){
        setRefreshing(true)
        await carregarRifasALiberar(true)
        setRefreshing(false)
    } 

    if (loading) {
        return (
            <RifasDisponiveisListShimmerEffect />
        ) 
    } else {
        return (
            <Background>
                { temLivroALiberar ?
                    <FlatList style={styles.lista}
                        showsVerticalScrollIndicator={false}
                        onRefresh={refreshList}
                        refreshing={refreshing}
                        data={RifasALiberar}
                        keyExtractor={item => item.key}
                        renderItem={({ item }) => (<RifasALiberarList data={item} />)}
                    />
                :
                <Texto> Nenhum livro a liberar</Texto>
                }    
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
});