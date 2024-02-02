import React, { useState } from 'react';
import { Image, View, SafeAreaView, StyleSheet } from 'react-native';
import {
    RifaText, ListaRifas, RifaTextTitulo, ContentText} from './styles';

export default function MinhasRifasAtivasList({ data }) {
    console.log('MinhasRifasAtivasList');
    const [loading, setLoading] = useState(false);

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
                        <RifaText> Qtd bilhetes pagos: {data.qtdBilhetes} </RifaText>
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
        borderRadius: 5,
    }
})