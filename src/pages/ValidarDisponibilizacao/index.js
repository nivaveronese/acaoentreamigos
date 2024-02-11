import React, { useState,useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import {
    RifaTextTitulo, RifaText, SubmitButton, SubmitText, AreaRifa, AreaTexto,
    AreaBotao
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
    const [generoPix, setGeneroPix] = useState(false);

    useEffect(() => {
        if (route.params?.genero == 'Pix') {
            setGeneroPix(true)
        }
    }, []);

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
            qtdBilhetes: route.params?.qtdBilhetes,
            autorizacao: route.params?.autorizacao,
            vlrPremioPix: route.params?.vlrPremioPix,
            vlrBilhete: route.params?.vlrBilhete,
            percAdministracao: route.params?.percAdministracao,
            percPgtoBilhete: route.params?.percPgtoBilhete,
            vlrTotalBilhetesPrevisto: route.params?.vlrTotalBilhetesPrevisto,
            vlrTotalTaxaAdministracaoPrevisto: route.params?.vlrTotalTaxaAdministracaoPrevisto,
            vlrTotalTaxaBilhetesPrevisto: route.params?.vlrTotalTaxaBilhetesPrevisto,
            vlrLiquidoAReceberResponsavelPrevisto: route.params?.vlrLiquidoAReceberResponsavelPrevisto
        }
        const resultado = await gravaRifaALiberarTransacao(dadosRifa);
        console.log('resultado gravaRifaALiberarTransacao: ' + resultado);
        setLoading(false)
        if (resultado == 'sucesso') {
            setMensagemCadastro('Os dados da Rifa serao analisados. Estando de acordo com a politica da plataforma, ela sera disponibilizada.')
            setGravouRifa(true);
        }
        else {
            setGravouRifa(false);
            setMensagemCadastro(resultado)
            return
        }
    }

    async function voltar() {
        console.log('voltar: ' + route.params?.genero + ' - ' + route.params?.nomeCapa)
        if (route.params?.genero != 'Pix') {
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

    async function sair() {
        console.log('sair ')
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
                        <RifaText> Qtd total bilhetes: {route.params?.qtdBilhetes} Vlr cada bilhete R$: {route.params?.vlrBilhete}</RifaText>
                        <RifaText> Vlr total bilhetes previsto R$: {route.params?.vlrTotalBilhetesPrevisto}</RifaText>
                        <RifaText> Vlr total taxa administração previsto R$: {route.params?.vlrTotalTaxaAdministracaoPrevisto}</RifaText>
                        <RifaText> Vlr total taxa bilhetes previsto R$: {route.params?.vlrTotalTaxaBilhetesPrevisto}</RifaText>
                        <RifaText> Se todos os bilhetes forem vendidos, o ganhador vai receber R$: {route.params?.vlrPremioPix}</RifaText>
                        <RifaText> Se todos os bilhetes forem vendidos, você vai receber R$: {route.params?.vlrLiquidoAReceberResponsavelPrevisto}</RifaText>
                    </AreaRifa>
                    <AreaTexto>
                        <RifaText> </RifaText>
                        <RifaTextTitulo>            Termos para disponibilização da rifa </RifaTextTitulo>
                        <RifaText> </RifaText>
                        <RifaText>
                            Você tem o prazo de 6 meses para finalizar a venda dos bilhetes.
                        </RifaText>
                        <RifaText> </RifaText>
                        <RifaText>
                            Se todos os bilhetes da rifa forem adquiridos dentro do prazo final,
                            a plataforma marcará a data do sorteio para o primeiro sábado, após
                            10 dias úteis do encerramento das vendas.
                        </RifaText>
                        <RifaText> </RifaText>
                    </AreaTexto>
                    {
                        !generoPix ?
                            <AreaTexto>
                                <RifaText>
                                    Se nem todos os bilhetes da rifa forem vendidos
                                    até o prazo final, você deverá definir se será sorteado o prêmio mesmo,
                                    ou o valor arrecadado em PIX.
                                </RifaText>
                                <RifaText> </RifaText>
                                <RifaText>
                                    O valor líquido a receber por você, será creditado na sua conta
                                    corrente, em até 5 dias uteis, contados a partir da confirmacao do sorteado, de que ele recebeu
                                    o premio.
                                </RifaText>
                                <RifaText> </RifaText>
                            </AreaTexto>
                            :
                            <AreaTexto>
                                <RifaText>
                                    O valor líquido a receber por você, será creditado na sua conta
                                    corrente, em até 5 dias uteis.
                                </RifaText>
                                <RifaText> </RifaText>
                            </AreaTexto>
                    }

                    <View style={estilos.areaMensagemCadastro}>
                        <Text style={estilos.textoMensagemCadastro}>
                            {mensagemCadastro}
                        </Text>
                    </View>
                    {
                        gravouRifa ?
                            <AreaBotao>
                                <SubmitButton onPress={sair}>
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