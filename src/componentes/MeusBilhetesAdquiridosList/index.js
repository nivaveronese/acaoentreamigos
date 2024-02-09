import React, { useState } from 'react';
import { Image, View, SafeAreaView, StyleSheet } from 'react-native';
import {
    RifaText, ListaRifas, RifaTextTitulo, ContentText} from './styles';
  
export default function MeusBilhetesAdquiridosList({ data }) {
    console.log('MeusBilhetesAdquiridosList');
    console.log(data)
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
                    <Image source={{ uri: data.rifaDisponivel.imagemCapa }}
                        resizeMode={"cover"}
                        style={styles.capa}
                    />
                    <ListaRifas>
                        <RifaTextTitulo> {data.rifaDisponivel.titulo} </RifaTextTitulo>
                        <ContentText numberOfLines={8}>
                            {data.rifaDisponivel.descricao}
                        </ContentText>
                        <RifaText> Responsável: {data.rifaDisponivel.nome} </RifaText>
                        <RifaText> {data.rifaDisponivel.cidade} {data.rifaDisponivel.uf} {data.rifaDisponivel.bairro} </RifaText>
                        <RifaText> Situacao rifa: {data.rifaDisponivel.situacao}</RifaText>
                        <RifaText> Data sorteio: {data.rifaDisponivel.dataSorteio}</RifaText>
                        <RifaText> </RifaText>
                        <RifaText> Data pagamento: {data.meuBilheteAdquirido.dataPagamento}</RifaText>
                        <RifaText> Qtd bilhetes adquiridos: {data.meuBilheteAdquirido.qtdBilhetes} Vlr bilhete: {data.rifaDisponivel.vlrBilhete}</RifaText>
                        <RifaText> Vlr pagamento: {data.meuBilheteAdquirido.vlrTotalBilhetes}</RifaText>
                        <RifaText> Bilhete(s): {data.meuBilheteAdquirido.nrsBilhetesPreReservadosFormatados}</RifaText>
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