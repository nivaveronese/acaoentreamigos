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
 
    const Sorteio = ({ dados }) => {
        console.log('verifica sorteio ');
        if (dados.situacao == 'aguardando sorteio') {
            return <RifaText> Data sorteio: {dados.dataSorteio}</RifaText>
        }
        if (dados.situacao == 'sorteada') {
            let conteudo = '';
            if (dados.genero == 'Pix') {
                if (dados.uidGanhador == user.uid) {
                    conteudo = (
                        <View> 
                            <RifaText> </RifaText>
                            <RifaText> Data sorteio: {dados.dataSorteio}</RifaText>
                            <RifaText> Bilhete primeiro prêmio loteria federal: {dados.bilhetePrimeiroPremioLoteriaFederal}</RifaText>
                            <RifaText> Final bilhete primeiro premio loteria federal: {dados.finalBilhetePrimeiroPremioLoteriaFederal}</RifaText>
                            <RifaText> Bilhete premiado: {dados.bilhetePremiado}</RifaText>
                            <RifaText> Iniciais nome ganhador: {dados.iniciaisNomeGanhador} </RifaText>
                            <RifaText> Cidade/uf ganhador: {dados.cidadeUfGanhador} </RifaText>
                            <RifaTextGanhador> Parabéns, você foi o ganhador!!!</RifaTextGanhador>   
                            <RifaText> </RifaText>
                            <AreaBotao onPress={informarDadosParaRecebimentoPremio}>
                                <SubmitText>
                                    Recebimento do prêmio
                                </SubmitText>
                            </AreaBotao>                        
                       </View>
                    )
                    return conteudo;
                } else {
                    conteudo = (
                        <View>
                            <RifaText> </RifaText>
                            <RifaText> Data sorteio: {dados.dataSorteio}</RifaText>
                            <RifaText> Bilhete primeiro prêmio loteria federal: {dados.bilhetePrimeiroPremioLoteriaFederal}</RifaText>
                            <RifaText> Final bilhete primeiro premio loteria federal: {dados.finalBilhetePrimeiroPremioLoteriaFederal}</RifaText>
                            <RifaText> Bilhete premiado: {dados.bilhetePremiado}</RifaText>
                            <RifaText> Iniciais nome ganhador: {dados.iniciaisNomeGanhador} </RifaText>
                            <RifaText> Cidade/uf ganhador: {dados.cidadeUfGanhador} </RifaText>
                            <RifaTextGanhador> Infelizmente, você nao foi o ganhador.</RifaTextGanhador>
                        </View>
                    )
                    return conteudo;
                }
            } else {
                if (dados.uidGanhador == user.uid) {
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
                            <RifaTextGanhador> Parabéns, você foi o ganhador!!!</RifaTextGanhador>
                            <AreaBotao onPress={informarDadosParaRecebimentoPremio}>
                                <SubmitText>
                                    Recebimento do prêmio
                                </SubmitText>
                            </AreaBotao>                        
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
                            <RifaTextGanhador> Infelizmente, você nao foi o ganhador.</RifaTextGanhador>
                        </View>
                    )
                    return conteudo;
                }
            }
        }
        if (dados.situacao == 'dados para recebimento prêmio pix gravado') {
            let conteudo = '';
                conteudo = (
                    <View> 
                    <RifaTextGanhador> Parabéns, você foi o ganhador!!!</RifaTextGanhador>   
                    <RifaText> </RifaText>
                    <RifaText>Data da informação dos dados para recebimento prêmio: {dados.
                    dataGravacaoDadosParaRecebimentoPremioPix} </RifaText>  
                    <RifaText>Se após 5 dias úteis da data acima, você nao recebeu o Pix do prêmio em sua conta, envie um email para veronesedigital@gmail.com, informando o codigo da rifa: {dados.id} </RifaText>                   
                    <RifaText></RifaText> 
               </View>
                )
                return conteudo;
        }
        if (dados.situacao == 'pix depositado para ganhador') {
            let conteudo = '';
                conteudo = (
                    <View> 
                    <RifaTextGanhador> Parabéns, você foi o ganhador!!!</RifaTextGanhador>   
                    <RifaText> </RifaText>
                    <RifaText>Data do depósito do pix: {dados.
                    dataComprovantePixGanhador} </RifaText>  
                    <RifaText></RifaText> 
                    <AreaBotao onPress={visualizarComprovanteDepositoPix}>
                                <SubmitText>
                                    Visualizar comprovante depósito Pix
                                </SubmitText>
                            </AreaBotao> 
               </View>
                )
                return conteudo;
        }                
    }

    function informarDadosParaRecebimentoPremio() {
        console.log('informarDadosParaRecebimentoPremio');
        if (data.rifaDisponivel.genero == 'Pix') {
            navigation.navigate('InformarDadosParaRecebimentoPremioPix', data);
        } else {
            navigation.navigate('InformarDadosParaRecebimentoPremioProduto', data);
        }
    }

    function visualizarComprovanteDepositoPix() {
        console.log('visualizarComprovanteDepositoPix');
        navigation.navigate('VisualizarComprovanteDepositoPixGanhador', data);
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
                        <RifaText> </RifaText>
                        <RifaText> Data pagamento: {data.meuBilheteAdquirido.dataPagamento}</RifaText>
                        <RifaText> Qtd bilhetes adquiridos: {data.meuBilheteAdquirido.qtdBilhetes} Vlr bilhete: {data.rifaDisponivel.vlrBilhete}</RifaText>
                        <RifaText> Vlr pagamento: {data.meuBilheteAdquirido.vlrTotalBilhetes}</RifaText>
                        <RifaText> Bilhete(s): {data.meuBilheteAdquirido.nrsBilhetesPreReservadosFormatados}</RifaText>
                        <Sorteio dados={data.rifaDisponivel} />
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