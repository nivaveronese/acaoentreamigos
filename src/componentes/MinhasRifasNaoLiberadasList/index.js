import React from 'react';
import { ContentText, ListaRifas, RifaTextTitulo, RifaText } from './styles';
import { SafeAreaView, StyleSheet, ActivityIndicator } from 'react-native';
import { View, Image } from 'react-native';

export default function MinhasRifasNaoLiberadasList({ data }) {
    console.log('MinhasRifasNaoLiberadasList')

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
                        <RifaText> Data cadastro: {data.dataCadastro}</RifaText>
                        <RifaText> Qtd nrs: {data.qtdNrs} Vlr bilhete: {data.vlrBilhete}</RifaText>
                        <RifaText> Obs: Rifa nao foi liberada, pois nao atendeu as regras </RifaText>
                    </ListaRifas>
                </View>
            </SafeAreaView>
        )
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