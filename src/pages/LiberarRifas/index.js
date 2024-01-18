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
    const [rifasALiberar, setRifasALiberar] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [temRifaALiberar, setTemRifaALiberar] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        console.log ('useEffect')
        refreshList()
    }, [])

    async function carregarRifasALiberar(shouldRefresh = false) {
        console.log('carregarRifasALiberar');
        if(loading) return;
        setTemRifaALiberar(false)
        setLoading(true)
        const rifasALiberarFirestore = await obtemRifasALiberar()
        setRifasALiberar(shouldRefresh ? rifasALiberarFirestore.rifasALiberarFirestore
            : [...rifasALiberar, ...rifasALiberarFirestore.rifasALiberarFirestore])
        console.log('RifasALiberarFirestore.qtdRifas: ' + rifasALiberarFirestore.qtdRifas)
        if (rifasALiberarFirestore.qtdRifas > 0){
            setTemRifaALiberar(true)
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
                { temRifaALiberar ?
                    <FlatList style={styles.lista}
                        showsVerticalScrollIndicator={false}
                        onRefresh={refreshList}
                        refreshing={refreshing}
                        data={rifasALiberar}
                        keyExtractor={item => item.key}
                        renderItem={({ item }) => (<RifasALiberarList data={item} />)}
                    />
                :
                <Texto> Nenhuma rifa a liberar</Texto>
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