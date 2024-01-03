import React, { useState, useEffect, useContext } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { obtemRifasDisponibilizadasAExcluir } from '../../servicos/firestore';
import RifasDisponibilizadasAExcluirList from '../../componentes/RifasDisponibilizadasAExcluirList';
import { Background } from './styles';
import { RifasDisponiveisListShimmerEffect } from '../../componentes/RifasDisponiveisListShimmerEffect';
import { Texto } from '../../pages/ExcluirRifaDisponibilizada/styles';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/auth';

export default function ExcluirRifaDisponibilizada() {
    console.log('pages/ExcluirRifaDisponibilizada ');
    const [RifasAExcluir, setRifasAExcluir] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [temRifaAExcluir, setTemRifaAExcluir] = useState(false);
    const navigation = useNavigation();
    const { user } = useContext(AuthContext);
 
    useEffect(() => {
        console.log ('useEffect')
        refreshList()
    }, [])

    async function carregarRifasAExcluir(shouldRefresh = false) {
        console.log('carregarRifasAExcluir');
        if(loading) return;
        setTemRifaAExcluir(false)
        setLoading(true)
        const RifasAExcluirFirestore = await obtemRifasDisponibilizadasAExcluir(user.uid)
        setRifasAExcluir(shouldRefresh ? RifasAExcluirFirestore.RifasAExcluirFirestore
            : [...RifasAExcluir, ...RifasAExcluirFirestore.RifasAExcluirFirestore])
        console.log('RifasAExcluirFirestore.qtdRifas: ' + RifasAExcluirFirestore.qtdRifas)
        if (RifasAExcluirFirestore.qtdRifas > 0){
            setTemRifaAExcluir(true)
        } else {
            navigation.navigate('Ok')
        }
        setLoading(false)
    } 
 
    async function refreshList(){
        setRefreshing(true)
        await carregarRifasAExcluir(true)
        setRefreshing(false)
    } 

    if (loading) {
        return (
            <RifasDisponiveisListShimmerEffect />
        ) 
    } else {
        return (
            <Background>
                { temRifaAExcluir ?
                    <FlatList style={styles.lista}
                        showsVerticalScrollIndicator={false}
                        onRefresh={refreshList}
                        refreshing={refreshing}
                        data={RifasAExcluir}
                        keyExtractor={item => item.key}
                        renderItem={({ item }) => (<RifasDisponibilizadasAExcluirList data={item} />)}
                    />
                :
                <Texto> Nenhum Rifa a excluir</Texto>
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