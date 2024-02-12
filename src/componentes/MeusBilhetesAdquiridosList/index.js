import React, { useState, useContext } from 'react';
import { Image, View, SafeAreaView, StyleSheet } from 'react-native';
import {
    RifaTextGanhador, AreaBotao, SubmitText,
    RifaText, ListaRifas, RifaTextTitulo, ContentText
} from './styles';
import { AuthContext } from '../../contexts/auth';
import { useNavigation } from '@react-navigation/native';

export default function MeusBilhetesAdquiridosList({ data }) {
    console.log('MeusBilhetesAdquiridosList');
    console.log(data)
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const navigation = useNavigation();
    const [souGanhador, setSouGanhador] = useState(false);

    const Sorteio = ({ dados }) => {
        console.log('verifica sorteio ');
        if (dados.situacao == 'aguardandosorteio') {
            return <RifaText> Data sorteio: {dados.dataSorteio}</RifaText>
        }
        if (dados.situacao == 'sorteada') {
            let conteudo = '';
            if (dados.genero == 'Pix') {
                conteudo = (
                    <View>
                        <RifaText> </RifaText>
                        <RifaText> Data sorteio: {dados.dataSorteio}</RifaText>
                        <RifaText> Bilhete primeiro prêmio loteria federal: {dados.bilhetePrimeiroPremioLoteriaFederal}</RifaText>
                        <RifaText> Final bilhete primeiro premio loteria federal: {dados.finalBilhetePrimeiroPremioLoteriaFederal}</RifaText>
                        <RifaText> Bilhete premiado: {dados.bilhetePremiado}</RifaText>
                        <RifaText> Iniciais nome ganhador: {dados.iniciaisNomeGanhador} </RifaText>
                        <RifaText> Cidade/uf ganhador: {dados.cidadeUfGanhador} </RifaText>
                    </View>
                )
                return conteudo;
            } else {
                conteudo = (
                    <View>
                        <RifaText> </RifaText>
                        <RifaText> Data sorteio: {dados.dataSorteio}</RifaText>
                        <RifaText> Prêmio sorteado: {dados.premioDefinido}</RifaText>
                        <RifaText> Bilhete primeiro prêmio loteria federal: {dados.bilhetePrimeiroPremioLoteriaFederal}</RifaText>
                        <RifaText> Final bilhete primeiro prêmio loteria federal: {dados.finalBilhetePrimeiroPremioLoteriaFederal}</RifaText>
                        <RifaText> Bilhete premiado: {dados.bilhetePremiado}</RifaText>
                        <RifaText> Iniciais nome ganhador: {dados.iniciaisNomeGanhador} </RifaText>
                        <RifaText> Cidade/uf ganhador: {dados.cidadeUfGanhador} </RifaText>
                    </View>
                )
                return conteudo;
            }
        }
    }

    const Ganhador = ({ dados }) => {
        if (dados.situacao == 'sorteada') {
            if (dados.uidGanhador == user.uid) {
                setSouGanhador(true);
                return <RifaTextGanhador> Parabéns, você foi o ganhador!!!</RifaTextGanhador>
            } else {
                setSouGanhador(false)
                return <RifaText> Infelizmente, você nao foi o ganhador.</RifaText>
            }
        }
    }

    function recebimentoPremio() {
        console.log('recebimentoPremio');
        if (data.genero == 'Pix') {
            navigation.navigate('RecebimentoPremioPix', data);
        } else {
            //navigation.navigate('RecebimentoPremio', data);
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
                        <RifaText> Situação rifa: {data.rifaDisponivel.situacao}</RifaText>
                        <Sorteio dados={data.rifaDisponivel} />
                        <Ganhador dados={data.rifaDisponivel} />
                        <RifaText> </RifaText>
                        <RifaText> Data pagamento: {data.meuBilheteAdquirido.dataPagamento}</RifaText>
                        <RifaText> Qtd bilhetes adquiridos: {data.meuBilheteAdquirido.qtdBilhetes} Vlr bilhete: {data.rifaDisponivel.vlrBilhete}</RifaText>
                        <RifaText> Vlr pagamento: {data.meuBilheteAdquirido.vlrTotalBilhetes}</RifaText>
                        <RifaText> Bilhete(s): {data.meuBilheteAdquirido.nrsBilhetesPreReservadosFormatados}</RifaText>
                    </ListaRifas>
                    {souGanhador ?
                        (
                            <AreaBotao onPress={recebimentoPremio}>
                                <SubmitText>
                                    Recebimento do prêmio
                                </SubmitText>
                            </AreaBotao>
                        )
                        :
                        (null)
                    }
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