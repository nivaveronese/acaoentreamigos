import React, { useState, useEffect } from 'react';
import { ContentText, ListaRifas, RifaTextTitulo, RifaText } from './styles';
import { SafeAreaView, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { View, Image } from 'react-native';
import { excluiRifaNaoLiberadaTransacao } from '../../servicos/firestore';
import { excluiImagem } from '../../servicos/storage';

export default function MinhasRifasNaoLiberadasList({ data }) {
    console.log('MinhasRifasNaoLiberadasList')
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        return () => {
            doSomethingOnUnmount();
        }
    }, [])

    async function doSomethingOnUnmount() {
        console.log('doSomethingOnUnmount')
        setLoading(true);
        const resultado = await excluiRifaNaoLiberadaTransacao(data.id);
        console.log('resultado excluiRifaNaoLiberadaTransacao: ' + resultado);
        if (resultado == 'sucesso') {
            excluirImagem();
        }
        setLoading(false);
    }

    async function excluirImagem() {
        console.log('excluirImagem')
        const resultadoE = await excluiImagem(data.nomeCapa);
        console.log('resultado excluirImagem: ' + resultadoE);
        setLoading(false);
        navigation.navigate('Ok')
    }

    if (loading) {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <ActivityIndicator
                    color='#008080'
                    size={40}
                />
            </View>
        )
    } else {
        return (
            <SafeAreaView>
                <View style={styles.card}>
                    <Image source={{ uri: data.imagemCapa }}
                        resizeMode={"cover"}
                        style={styles.capa}
                    />
                    <ListaRifas>
                        <RifaTextTitulo> {data.titulo} </RifaTextTitulo>
                        <ContentText numberOfLines={8}>
                            {data.descricao}
                        </ContentText>
                        <RifaText> Responsável: {data.nome} </RifaText>
                        <RifaText> {data.cepusuario} {data.cidade} {data.uf} {data.bairro} </RifaText>
                        <RifaText> Qtd nrs: {data.qtdNrs} Vlr bilhete: {data.vlrBilhete}</RifaText>
                        <RifaText> Autorizacao: {data.autorizacao} </RifaText>
                        <RifaText> Obs: Rifa nao foi liberada, pois nao atendeu as regras </RifaText>
                    </ListaRifas>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    card: {
        shadowColor: '#000',
        backgroundColor: '#FFF',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        margin: 15,
        shadowRadius: 5,
        borderRadius: 5,
        elevation: 3
    },
    capa: {
        width: '100%',
        height: 400,
        borderRadius: 5
    }
})