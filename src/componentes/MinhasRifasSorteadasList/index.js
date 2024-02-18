import React, { useState } from 'react';
import { Image, View, SafeAreaView, StyleSheet } from 'react-native';
import {
    RifaText, ListaRifas, RifaTextTitulo, ContentText} from './styles';
  
export default function MinhasRifasSorteadasList({ data }) {
    console.log('MinhasRifasSorteadasList');
    console.log(data)
    const [loading, setLoading] = useState(false);
  
    const Premio = ({gen,pre,tit}) => {
        console.log('verifica Premio ');
        if(gen == pre){
            return null;
        } else {
            return <RifaText> Prêmio sorteado: {tit}</RifaText>
        }
    } 

    const Receber = ({gen,recPixV,recPixG,recPre}) => {
        console.log('verifica Receber ');
        if(gen == 'Pix'){
            let conteudo = ''
            conteudo = (
                <View>
                    <RifaText> Ganhador vai receber R$: {recPixG}</RifaText>
                    <RifaText> Você vai receber R$: {recPixV}</RifaText>
                </View>
            )
            return conteudo;    
        } else {
            return <RifaText> Você vai receber R$: {recPre}</RifaText>
        }
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
                        <RifaText> Qtd bilhetes: {data.qtdBilhetes} Vlr bilhete: {data.vlrBilhete}</RifaText>
                        <RifaText> Situação rifa: {data.situacao}</RifaText>
                        <RifaText> </RifaText>
                        <RifaText> Data sorteio: {data.dataSorteio}</RifaText>
                        <Premio gen={data.genero} pre={data.premioDefinido} tit={data.titulo}/>
                        <RifaText> Bilhete primeiro premio loteria federal: {data.bilhetePrimeiroPremioLoteriaFederal}</RifaText>
                        <RifaText> Final bilhete primeiro premio loteria federal: {data.finalBilhetePrimeiroPremioLoteriaFederal}</RifaText>
                        <RifaText> Bilhete premiado: {data.bilhetePremiado}</RifaText>
                        <RifaText> Iniciais nome ganhador: {data.iniciaisNomeGanhador} </RifaText>
                        <RifaText> Cidade/uf ganhador: {data.cidadeUfGanhador} </RifaText>
                        <RifaText> </RifaText>                        
                        <RifaText> Qtd bilhetes pagos: {data.qtdTotalBilhetesPagos}</RifaText>
                        <RifaText> Vlr total bilhetes pagos: {data.vlrTotalBilhetesPagos}</RifaText>
                        <Receber gen={data.genero} recPixV={data.vlrLiquidoAReceberResponsavelPix} recPixG={data.vlrPremioPixSorteio} recPre={data.vlrLiquidoAReceberResponsavelPremio}/>
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