import React, { useState } from 'react';
import { Image, View, SafeAreaView, StyleSheet } from 'react-native';
import {AreaBotaoReservar, SubmitText,
    RifaText, ListaRifas, RifaTextTitulo, ContentText} from './styles';
  
export default function MinhasRifasDefinirPremioList({ data }) {
    console.log('MinhasRifasDefinirPremioList');
    console.log(data)
    const [loading, setLoading] = useState(false);

    function definirPremio() {
        console.log('definirPremio')
        navigation.navigate('DefinirPremio', data);
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
                        <RifaText> Data cadastro: {data.dataCadastro}</RifaText>
                        <RifaText> Data final venda bilhetes: {data.dataFinalVendas} </RifaText>
                        <RifaText> Qtd bilhetes: {data.qtdBilhetes} Vlr bilhete: {data.vlrBilhete}</RifaText>
                        <RifaText> Qtd bilhetes pagos: {data.qtdTotalBilhetesPagos} Vlr total bilhetes pagos: {data.vlrTotalBilhetesPagos} </RifaText>
                    </ListaRifas>
                    <AreaBotaoReservar onPress={definirPremio}>
                        <SubmitText>
                            Definir prêmio a ser sorteado
                        </SubmitText>
                    </AreaBotaoReservar>                    
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