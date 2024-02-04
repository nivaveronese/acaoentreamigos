import React, { useContext, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import {
    RifaTextTitulo, RifaText, SubmitButton, SubmitText, AreaRifa,
    ContentText, AreaBotao
} from './styles';
import { useNavigation } from '@react-navigation/native';
import estilos from '../../estilos/estilos';
import { gravaRifaALiberarTransacao } from '../../servicos/firestore';
import { excluiImagem } from '../../servicos/storage';
import { ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function ValidarDisponibilizacao() {
    console.log('ValidarDisponibilizacao: ')
    const route = useRoute();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [gravouRifa, setGravouRifa] = useState(false)
    const [mensagemCadastro, setMensagemCadastro] = useState('');

    async function concordar() {
        console.log('concordar');
        let dadosRifa = {
            titulo: route.params?.titulo,
            descricao: route.params?.descricao,
            imagemCapa: route.params?.imagemCapa,
            genero: route.params?.genero,
            uid: route.params?.uid,
            cep: route.params?.cep,
            cidade: route.params?.cidade,
            uf: route.params?.uf,
            bairro: route.params?.bairro,
            nome: route.params?.nome,
            email: route.params?.email,
            nomeCapa: route.params?.nomeCapa,
            post: route.params?.post,
            qtdNrs: route.params?.qtdNrs,
            autorizacao: route.params?.autorizacao,
            vlrBilhete: route.params?.vlrBilhete,
            dataSolicitacaoExcluir: '',
            percAdministracao: route.params?.percAdministracao,
            percPgtoBilhete: route.params?.percPgtoBilhete,
            vlrTotalBilhetes: route.params?.vlrTotalBilhetes,
            vlrTaxaAdministracao: route.params?.vlrTaxaAdministracao,
            vlrTaxaBilhetes: route.params?.vlrTaxaBilhetes
        }
        const resultado = await gravaRifaALiberarTransacao(dadosRifa);
        console.log('resultado gravaRifaALiberarTransacao: ' + resultado);
        setLoading(false)
        if (resultado == 'sucesso') {
            setMensagemCadastro('Os dados da Rifa serao analisados. Estando de acordo com a politica da plataforma, a Rifa sera disponibilizada.')
            setGravouRifa(true);
        }
        else {
            setGravouRifa(false);
            setMensagemCadastro(resultado)
            return
        }
    }

    async function voltar() {
        console.log('voltar')
        if (!route.params?.genero == 'Pix') {
            setLoading(true);
            const resultadoE = await excluiImagem(route.params?.nomeCapa);
            setLoading(false);
            console.log('resultado excluirImagem: ' + resultadoE);
        }
        setMensagemCadastro('')
        navigation.reset({
            index: 0,
            routes: [{ name: "Home" }]
        })
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
            <GestureHandlerRootView style={{ flex: 1 }}>
                <ScrollView>
                    <AreaRifa>
                        <RifaTextTitulo> {route.params?.titulo} </RifaTextTitulo>
                        <RifaText> </RifaText>
                        <RifaText> Qtd nrs: {route.params?.qtdNrs} Vlr bilhete R$: {route.params?.vlrBilhete}</RifaText>
                        <RifaText> Vlr total bilhetes R$: {route.params?.vlrTotalBilhetes}</RifaText>
                        <RifaText> Vlr taxa administracao R$: {route.params?.vlrTaxaAdministracao}</RifaText>
                        <RifaText> Vlr taxa bilhetes R$: {route.params?.vlrTaxaBilhetes}</RifaText>
                        <RifaText> Se todos os bilhetes forem vendidos, voce vai receber R$: {route.params?.vlrLiquido}</RifaText>
                    </AreaRifa>
                    <RifaText> </RifaText>
                    <RifaTextTitulo> Termos para disponibilizacao da rifa </RifaTextTitulo>
                    <RifaText> </RifaText>
                    <RifaText>
                        Rifa de até 10 bilhetes tem prazo máximo de venda de 3 meses
                    </RifaText>
                    <RifaText>
                        Rifa de até 100 bilhetes tem prazo máximo de venda de 5 meses
                    </RifaText>
                    <RifaText>
                        Rifa de 1000 bilhetes tem prazo máximo de venda de 6 meses
                    </RifaText>
                    <RifaText>
                        Rifa de 10000 bilhetes tem prazo máximo de venda de 9 meses
                    </RifaText>
                    <RifaText>
                        Rifa de 100000 bilhetes tem prazo máximo de venda de 12 meses
                    </RifaText>
                    <RifaText> </RifaText>
                    <RifaText>
                        Se todos os bilhetes da rifa forem adquiridos dentro do prazo final,
                        a plataforma marca a data do sorteio para o primeiro sábado, após
                        10 dias úteis do encerramento das vendas.
                    </RifaText>
                    <RifaText>
                        O criador vai receber o valor total da venda dos bilhetes, menos a
                        taxa de administracao e menos a taxa da venda dos bilhetes.
                    </RifaText>
                    {route.params?.genero == 'Pix' ?
                        <View>
                            <RifaText> </RifaText>
                            <RifaText>
                                Se nem todos os bilhetes da rifa forem adquiridos dentro do prazo final,
                                ou o criador da rifa encerrar as vendas dos bilhetes antecipadamente, o
                                valor a ser sorteado sera o valor total vendido, menos a taxa de
                                administracao e menos a taxa da venda dos bilhetes. Do valor restante,
                                o criador recebe 50% e o ganhador 50%. O valor a receber do ganhador nao
                                pode ser menor que o valor pago nos seus bilhetes.
                            </RifaText>
                        </View>
                        :
                        <View>
                            <RifaText> </RifaText>
                            <RifaText>
                                Se nem todos os bilhetes da rifa forem adquiridos dentro do prazo final,
                                ou o criador da rifa encerrar as vendas dos bilhetes antecipadamente, o
                                criador da rifa define se vai sortear o prêmio ou o valor arrecadado em pix.
                                Se o criador da rifa, optar pelo sorteio do valor em pix, o valor a ser
                                sorteado sera o valor total vendido, menos a taxa de
                                administracao e menos a taxa da venda dos bilhetes. Do valor restante,
                                o criador recebe 50% e o ganhador 50%. O valor a receber do ganhador nao pode
                                ser menor que o valor pago nos seus bilhetes.
                                Se o criador da rifa, optar pelo sorteio do premio, o criador vai receber, o
                                valor total da venda dos bilhetes, menos a taxa
                                de administracao e menos a taxa da venda dos bilhetes.
                            </RifaText>
                        </View>
                    }
                    <View>
                        <RifaText> </RifaText>
                        <RifaText>
                            O valor sera creditado na conta do criador, em ate 5 dias uteis, contados a
                            partir da confirmacao do sorteado, de que ele recebeu o premio.
                        </RifaText>
                    </View>
                    <View style={estilos.areaMensagemCadastro}>
                        <Text style={estilos.textoMensagemCadastro}>
                            {mensagemCadastro}
                        </Text>
                    </View>
                    {
                        gravouRifa ?
                            <AreaBotao>
                                <SubmitButton onPress={voltar}>
                                    <SubmitText>
                                        Ok
                                    </SubmitText>
                                </SubmitButton>
                            </AreaBotao>
                            :
                            <AreaBotao>
                                <SubmitButton onPress={concordar}>
                                    <SubmitText>
                                        Concordo
                                    </SubmitText>
                                </SubmitButton>
                                <TouchableOpacity style={styles.botao} onPress={() => voltar()}>
                                    <Text style={estilos.linkText}>Voltar</Text>
                                </TouchableOpacity>
                            </AreaBotao>
                    }
                </ScrollView>
            </GestureHandlerRootView>
        )
    }
}

const styles = StyleSheet.create({
    botao: {
        marginTop: 15,
        marginLeft: 10,
    },
}) 