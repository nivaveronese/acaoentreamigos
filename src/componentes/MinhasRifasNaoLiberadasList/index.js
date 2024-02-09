import React from 'react';
import { ContentText, ListaRifas, RifaTextTitulo, RifaText,RifaTextCor } from './styles';
import { SafeAreaView, StyleSheet } from 'react-native';
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
                        <RifaText> Qtd bilhetes: {data.qtdBilhetes} Vlr bilhete: {data.vlrBilhete}</RifaText>
                        <RifaTextCor> Obs: Rifa não foi liberada, pois não atendeu as regras. </RifaTextCor>
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