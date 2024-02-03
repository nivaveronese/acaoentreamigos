import React, { useContext, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import {
    RifaTextTitulo, RifaText, SubmitButton, SubmitText, AreaRifa,
    ContentText
} from './styles';
import { AuthContext } from '../../contexts/auth';
import { useNavigation } from '@react-navigation/native';
import estilos from '../../estilos/estilos';
import { gravaRifaALiberarTransacao } from '../../servicos/firestore';
import { ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function ValidarDisponibilizacao() {
    console.log('ValidarDisponibilizacao: ')
    const route = useRoute();
    const navigation = useNavigation();
    const { user: usuario } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [gravouRifa, setGravouRifa] = useState(false)

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

    function voltar() {
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
                        <ContentText numberOfLines={8}>
                            {route.params?.descricao}
                        </ContentText>
                        <RifaText> Qtd nrs: {route.params?.qtdNrs} Vlr bilhete: {route.params?.vlrBilhete}</RifaText>
                        <RifaText> Vlr total bilhetes: {route.params?.vlrTotalBilhetes}</RifaText>
                        <RifaText> Vlr taxa administracao: {route.params?.vlrTaxaAdministracao}</RifaText>
                        <RifaText> Qtd taxa bilhetes: {route.params?.vlrTaxaBilhetes}</RifaText>
                    </AreaRifa>
                    <RifaText> </RifaText>
                    <RifaTextTitulo> Termos para disponibilizacao da rifa </RifaTextTitulo>
                    <RifaText> </RifaText>
                    <RifaText>
                        - rifa de até 10 bilhetes tem prazo máximo de venda de 3 meses
                        - rifa de até 100 bilhetes tem prazo máximo de venda de 5 meses
                        - rifa de 1000 bilhetes tem prazo máximo de venda de 6 meses
                        - rifa de 10000 bilhetes tem prazo máximo de venda de 9 meses
                        - rifa de 100000 bilhetes tem prazo máximo de venda de 12 meses
                        <RifaText> </RifaText>
                        - se todos os bilhetes da rifa foram adquiridos dentro do prazo final:
                        - sistema marca a data do sorteio para o primeiro sábado, após 10 dias úteis do dia do encerramento das vendas
                        <RifaText> </RifaText>
                        - se nem todos os bilhetes da rifa foram adquiridos dentro do prazo final:
                        - o criador da lista define se vai sortear o prêmio ou o valor arrecadado em pix.
                        <RifaText> </RifaText>
                        - O criador da rifa pode, a qualquer momento, encerrar as vendas dos bilhetes
                        - neste caso, ele define se vai sortear o prêmio ou o valor arrecadado em pix.
                        <RifaText> </RifaText>
                        - Se o criador da rifa, optar pelo sorteio do valor em pix:
                        - O valor a ser sorteado sera o valor total vendido, menos a taxa de administracao
                        e menos a taxa da venda dos bilhetes.
                        Do valor calculado, o criador recebe 50% e o ganhador 50%.
                        O valor a receber do ganhador nao pode ser menor que o valor pago nos seus bilhetes.
                        <RifaText> </RifaText>
                        - Se o sorteio for do premio, o criador vai receber, o valor total da venda dos
                        bilhetes, menos a taxa de administracao e menos a taxa da venda dos bilhetes.
                        - O valor sera creditado na conta do criador, em ate 5 dias uteis, contados a
                        partir da confirmacao do sorteado, de que ele recebeu o premio.
                    </RifaText>
                    {
                        gravouRifa ?
                            <SubmitButton onPress={sair}>
                                <SubmitText>
                                    Ok
                                </SubmitText>
                            </SubmitButton>
                            :
                            <SubmitButton onPress={concordar}>
                                <SubmitText>
                                    Concordo com os termos
                                </SubmitText>
                            </SubmitButton>
                            <TouchableOpacity style={styles.botao} onPress={() => voltar()}>
                                <Text style={estilos.linkText}>Voltar</Text>
                            </TouchableOpacity>
                    }
                    <View style={estilos.areaMensagemCadastro}>
                        <Text style={estilos.textoMensagemCadastro}>
                            {mensagemCadastro}
                        </Text>
                    </View>
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