import React, { useState } from 'react';
import { ActivityIndicator, Image, View, Alert, SafeAreaView, StyleSheet } from 'react-native';
import {
    RifaText, ListaRifas, Container, RifaTextTitulo, ContentText, TextRecebe,
    AreaBotaoConfirmarRecebimento
} from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { gravaRifaLiberadaTransacao, gravaRifaNaoLiberadaTransacao } from '../../servicos/firestore';

export default function RifasALiberarList({ data }) {
    console.log('RifasALiberarList');
    const navigation = useNavigation();
    const [mensagemCadastro, setMensagemCadastro] = useState('');
    const [loading, setLoading] = useState(false);

    const confirmarLiberacaoRifa = () => {
        console.log('confirmarLiberacaoRifa');
        Alert.alert(
            "Olá,",
            "Você conferiu todos os dados do Rifa, e confirma a liberação?",
            [
                {
                    text: "Hum, ainda não. Vou analisar melhor",
                    onPress: () => naoConfirmaLiberacaoRifa(),
                    style: "cancel"
                },
                {
                    text: "Sim. Já conferi e vou liberar.",
                    onPress: () => confirmaLiberacaoRifa(),
                    style: 'default'
                }
            ]
        );
    }

    const confirmarNaoLiberacaoRifa = () => {
        console.log('confirmarNaoLiberacaoRifa');
        Alert.alert(
            "Olá,",
            "Você não vai mesmo liberar esta Rifa?",
            [
                {
                    text: "Não vou liberar esta Rifa",
                    onPress: () => confirmaNaoLiberacao(),
                    style: "cancel"
                },
                {
                    text: "Pensando bem...vou analisar melhor.",
                    onPress: () => naoConfirmaNaoLiberacao(),
                    style: 'default'
                }
            ]
        );
    }

    function naoConfirmaLiberacaoRifa() {
        console.log('naoConfirmaLiberacaoRifa');
        return;
    }

    async function confirmaLiberacaoRifa() {
        console.log('confirmaLiberacaoRifa');
        setMensagemCadastro('')
        setLoading(true);
        const resultado = await gravaRifaLiberadaTransacao(data);
        console.log('resultado confirmaLiberacaoRifa: ' + resultado);
        if (resultado == 'sucesso') {
            setMensagemCadastro('')
            setLoading(false);
            navigation.navigate('OkL')
        } else {
            setMensagemCadastro(resultado)
            setLoading(false);
            return;
        }
    }

    async function confirmaNaoLiberacao() {
        console.log('confirmaNaoLiberacao');
        setMensagemCadastro('')
        setLoading(true);
        const resultado = await gravaRifaNaoLiberadaTransacao(data);
        console.log('resultado confirmaNaoLiberacao: ' + resultado);
        if (resultado == 'sucesso') {
            setMensagemCadastro('')
            setLoading(false);
            navigation.navigate('OkL')
        } else {
            setMensagemCadastro(resultado)
            setLoading(false);
            return;
        }
    }

    function naoConfirmaNaoLiberacao() {
        console.log('naoConfirmaNaoLiberacao');
        return;
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
                        <RifaText> Responsável: {data.nome} </RifaText>
                        <RifaText> {data.cepusuario} {data.cidade} {data.uf} {data.bairro} </RifaText>
                        <RifaText> Qtd nrs: {data.qtdNrs} Vlr bilhete: {data.vlrBilhete}</RifaText>
                        <RifaText> Autorizacao: {data.autorizacao} </RifaText>
                    </ListaRifas>
                    <Container>
                        <TextRecebe>Liberar esta Rifa </TextRecebe>
                        <AreaBotaoConfirmarRecebimento onPress={confirmarLiberacaoRifa}>
                            <Icon
                                name='check-circle-outline' size={30} color='#008080'
                            />
                        </AreaBotaoConfirmarRecebimento>
                    </Container>
                    <Container>
                        <TextRecebe>Não liberar esta Rifa </TextRecebe>
                        <AreaBotaoConfirmarRecebimento onPress={confirmarNaoLiberacaoRifa}>
                            <Icon
                                name='alpha-x-circle-outline' size={30} color='#FF0000'
                            />
                        </AreaBotaoConfirmarRecebimento>
                    </Container>
                    <RifaTextTitulo> {mensagemCadastro} </RifaTextTitulo>
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