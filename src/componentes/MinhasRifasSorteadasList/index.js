import React, { useState } from 'react';
import { Image, View, SafeAreaView, StyleSheet } from 'react-native';
import {
    RifaTextTaxa,AreaBotao,SubmitText,
    RifaText, ListaRifas, RifaTextTitulo, ContentText
} from './styles';
import { useNavigation } from '@react-navigation/native';

export default function MinhasRifasSorteadasList({ data }) {
    console.log('MinhasRifasSorteadasList');
    console.log(data)
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const Receber = ({ dados }) => {
        console.log('verifica Receber ');
        let conteudo = [];
        let conteudo1 = ''
        let conteudo2 = ''
        let conteudo3 = ''
        let conteudo4 = ''
        let conteudo5 = ''
        let conteudo6 = ''
        if (dados.genero == 'Pix' || dados.premioDefinido == 'Pix') {
            conteudo1 = (
                <View>
                    <RifaText> </RifaText>
                    <RifaText> Ganhador vai receber R$: {dados.vlrPremioPixSorteio}</RifaText>
                    <RifaTextTaxa> Valor taxa administracao R$: {dados.vlrTaxaAdministracao}</RifaTextTaxa>
                    <RifaTextTaxa> Valor taxa bilhetes R$: {dados.vlrTaxaBilhetes}</RifaTextTaxa>
                    <RifaText> Você vai receber R$: {dados.vlrLiquidoAReceberResponsavel}</RifaText>
                </View>
            )
            conteudo.push(conteudo1);
        } else {
            conteudo1 = (
                <View>
                    <RifaText> </RifaText>
                    <RifaTextTaxa> Valor taxa administracao R$: {dados.vlrTaxaAdministracao}</RifaTextTaxa>
                    <RifaTextTaxa> Valor taxa bilhetes R$: {dados.vlrTaxaBilhetes}</RifaTextTaxa>
                    <RifaText> Você vai receber R$: {dados.vlrLiquidoAReceberResponsavel}</RifaText>
                </View>
            )
            conteudo.push(conteudo1);
        }
        if (dados.situacaoRifaSorteadaResponsavel == 'ganhador informou dados para receber o prêmio') {
            conteudo2 = (
                <View>
                    <RifaText> </RifaText>
                    <RifaText> Entre em contato com o ganhador {dados.nomeGanhador}, através do celular {dados.celularGanhadorPremioProduto} para combinar a entrega do prêmio</RifaText>
                    <RifaText> Para você ter certeza que ele foi o ganhador, pergunte a ele qual o código de segurança.</RifaText>
                    <RifaText> Se ele responder {dados.codigoSegurancaGanhador} pode combinar a entrega do prêmio.</RifaText>
                    <RifaText> </RifaText>
                    <RifaText> Atenção: No momento da entrega do prêmio, peça para o ganhador confirmar o recebimento no aplicativo, pois somente assim, você receberá o seu valor.</RifaText>
                    <RifaText> </RifaText>
                    <RifaText> Qualquer dúvida, entre em contato com o email veronesedigital@gmail.com</RifaText>
                </View>
            )
            conteudo.push(conteudo2);
        }
        if (dados.situacaoRifaSorteadaResponsavel == 'prêmio produto entregue' && parseInt(dados.vlrLiquidoAReceberResponsavel) != 0) {
            conteudo3 = (
                <View>
                    <RifaText> </RifaText>
                    <AreaBotao onPress={informarDadosParaRecebimentoValor}>
                        <SubmitText>
                            Informar dados para recebimento do valor
                        </SubmitText>
                    </AreaBotao>
                </View>
            )
            conteudo.push(conteudo3);
        }
        if (dados.situacaoRifaSorteadaResponsavel == 'sorteada' && parseInt(dados.vlrLiquidoAReceberResponsavel) != 0) {
            if (dados.genero == 'Pix' || dados.premioDefinido == 'Pix') {
                conteudo4 = (
                    <View>
                        <RifaText> </RifaText>
                        <AreaBotao onPress={informarDadosParaRecebimentoValor}>
                            <SubmitText>
                                Informar dados para recebimento do valor
                            </SubmitText>
                        </AreaBotao>
                    </View>
                )
                conteudo.push(conteudo4);
            }
        }
        if (dados.situacaoRifaSorteadaResponsavel == 'dados para recebimento valor responsável gravado') {
            conteudo5 = (
                <View>
                    <RifaText> </RifaText>
                    <RifaText>Data da informação dos dados para recebimento valor: {dados.
                        dataGravacaoDadosParaRecebimentoValorResponsavel} </RifaText>
                    <RifaText>Se após 5 dias úteis da data acima, você não recebeu o valor em sua conta, envie um email para veronesedigital@gmail.com, informando o código da rifa: {dados.id} </RifaText>
                </View>
            )
            conteudo.push(conteudo5);
        }
        if (dados.situacaoRifaSorteadaResponsavel == 'valor depositado para responsável') {
            conteudo6 = (
                <View>
                    <RifaText> </RifaText>
                    <RifaText>Data do depósito do valor: {dados.
                        dataGravacaoDadosParaRecebimentoValorResponsavel} </RifaText>
                    <RifaText></RifaText>
                    <AreaBotao onPress={visualizarComprovanteDepositoValorResponsavel}>
                        <SubmitText>
                            Visualizar comprovante depósito valor
                        </SubmitText>
                    </AreaBotao>
                </View>
            )
            conteudo.push(conteudo6);
        }
        return conteudo;
    }

    function informarDadosParaRecebimentoValor() {
        console.log('informarDadosParaRecebimentoValor');
        navigation.navigate('InformarDadosParaRecebimentoValorResponsavel', data);
    }

    function visualizarComprovanteDepositoValorResponsavel() {
        console.log('visualizarComprovanteDepositoValorResponsavel');
        navigation.navigate('VisualizarComprovanteDepositoValorResponsavel', data);
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
                        <RifaText> Bilhete primeiro premio loteria federal: {data.bilhetePrimeiroPremioLoteriaFederal}</RifaText>
                        <RifaText> Final bilhete primeiro premio loteria federal: {data.finalBilhetePrimeiroPremioLoteriaFederal}</RifaText>
                        <RifaText> Bilhete premiado: {data.bilhetePremiado}</RifaText>
                        <RifaText> </RifaText>
                        <RifaText> Qtd bilhetes pagos: {data.qtdTotalBilhetesPagos}</RifaText>
                        <RifaText> Vlr total bilhetes pagos: {data.vlrTotalBilhetesPagos}</RifaText>
                        <Receber dados={data} />
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