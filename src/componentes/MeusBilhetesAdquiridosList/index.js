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
            console.log('dados.situacao: ' + dados.situacao)
            let conteudo = [];
            let conteudo1 = '';
            let conteudo2 = '';
            let conteudo3 = '';
            let conteudo4 = '';
            let conteudo5 = '';
            conteudo1 = (
                <View>
                    <RifaText> </RifaText>
                    <RifaText> Data sorteio: {dados.dataSorteio}</RifaText>
                    <RifaText> Bilhete primeiro prêmio loteria federal: {dados.bilhetePrimeiroPremioLoteriaFederal}</RifaText>
                    <RifaText> Final bilhete primeiro prêmio loteria federal: {dados.finalBilhetePrimeiroPremioLoteriaFederal}</RifaText>
                    <RifaText> Bilhete premiado: {dados.bilhetePremiado}</RifaText>
                </View>
            );
            conteudo.push(conteudo1)
            if (dados.genero == 'Pix') {
                conteudo2 = (
                    <View>
                        <RifaText> Valor do prêmio sorteado: {dados.vlrPremioPixSorteio}</RifaText>
                    </View>
                )
            } else {
                if (dados.prêmioDefinido == 'Pix') {
                    conteudo2 = (
                        <View>
                            <RifaText> Prêmio sorteado: {dados.prêmioDefinido}</RifaText>
                            <RifaText> Valor do prêmio sorteado: {dados.vlrPremioPixSorteio}</RifaText>
                        </View>
                    )
                }
            }
            conteudo.push(conteudo2)
            if (dados.uidGanhador == user.uid) {
                conteudo3 = (
                    <View>
                        <RifaText> </RifaText>
                        <RifaTextGanhador> Parabéns, você foi o ganhador!!!</RifaTextGanhador>
                    </View>
                )
            } else {
                conteudo3 = (
                    <View>
                        <RifaText> </RifaText>
                        <RifaTextGanhador> Infelizmente, você não foi o ganhador.</RifaTextGanhador>
                    </View>
                )
            }
            conteudo.push(conteudo3);
            if (dados.uidGanhador == user.uid) {
                if (dados.situacaoRifaSorteadaGanhador == 'sorteada') {
                    conteudo4 = (
                        <View>
                            <RifaText> </RifaText>
                            <AreaBotao onPress={informarDadosParaRecebimentoPremio}>
                                <SubmitText>
                                    Informar dados para recebimento do prêmio
                                </SubmitText>
                            </AreaBotao>
                        </View>
                    )
                    conteudo.push(conteudo4);
                }
                if (dados.situacaoRifaSorteadaGanhador == 'dados para recebimento prêmio pix gravado') {
                    conteudo4 = (
                        <View>
                            <RifaText> </RifaText>
                            <RifaText>Data da informação dos dados para recebimento prêmio: {dados.
                                dataGravacaoDadosParaRecebimentoPremioPix} </RifaText>
                            <RifaText>Se após 5 dias úteis da data acima, você não recebeu o Pix do prêmio em sua conta, envie um email para veronesedigital@gmail.com, informando o código da rifa: {dados.id} </RifaText>
                        </View>
                    )
                    conteudo.push(conteudo4);
                }
                if (dados.situacaoRifaSorteadaGanhador == 'dados para recebimento prêmio produto gravado') {
                    conteudo4 = (
                        <View>
                            <RifaText> </RifaText>
                            <RifaText>Data da informação dos dados para recebimento prêmio: {dados.
                                dataGravacaoDadosParaRecebimentoPremioProduto} </RifaText>
                            <RifaText>Se após 5 dias úteis da data acima, o responsável pelo prêmio {dados.nome}, ainda não entrou em contato com você, envie um email para veronesedigital@gmail.com, informando o código da rifa: {dados.id} </RifaText>
                            <RifaText></RifaText>
                            <AreaBotao onPress={reverCodigoSegurancaGanhador}>
                                <SubmitText>
                                    Rever código segurança
                                </SubmitText>
                            </AreaBotao>
                            <AreaBotao onPress={confirmarRecebimentoPremio}>
                                <SubmitText>
                                    Confirmar recebimento do prêmio
                                </SubmitText>
                            </AreaBotao>
                        </View>
                    )
                    conteudo.push(conteudo4);
                }
                if (dados.situacaoRifaSorteadaGanhador == 'pix depositado para ganhador') {
                    conteudo5 = (
                        <View>
                            <RifaText> </RifaText>
                            <RifaText>Data do depósito do pix: {dados.
                                dataComprovantePixGanhador} </RifaText>
                            <RifaText></RifaText>
                            <AreaBotao onPress={visualizarComprovanteDepositoPixGanhador}>
                                <SubmitText>
                                    Visualizar comprovante depósito Pix
                                </SubmitText>
                            </AreaBotao>
                        </View>
                    )
                    conteudo.push(conteudo5);
                }
            }
            return conteudo;
        }
    }

    function informarDadosParaRecebimentoPremio() {
        console.log('informarDadosParaRecebimentoPremio');
        if (data.rifaDisponivel.genero == 'Pix') {
            navigation.navigate('InformarDadosParaRecebimentoPremioPix', data);
        } else {
            if (rifaDisponivel.prêmioDefinido == 'Pix') {
                navigation.navigate('InformarDadosParaRecebimentoPremioPix', data);
            } else {
                navigation.navigate('InformarDadosParaRecebimentoPremioProduto', data);
            }
        }
    }

    function visualizarComprovanteDepositoPixGanhador() {
        console.log('visualizarComprovanteDepositoPixGanhador');
        navigation.navigate('VisualizarComprovanteDepositoPixGanhador', data);
    }

    function reverCodigoSegurancaGanhador() {
        console.log('reverCodigoSegurancaGanhador');
        navigation.navigate('VisualizarCodigoSegurancaGanhador', data);
    }

    function confirmarRecebimentoPremio() {
        console.log('confirmarRecebimentoPremio');
        navigation.navigate('ConfirmarRecebimentoPremio', data);
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