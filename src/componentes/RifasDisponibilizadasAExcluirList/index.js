import React, { useState } from 'react';
import { ActivityIndicator, Image, View, Alert, SafeAreaView, StyleSheet } from 'react-native';
import {
    RifaText, ListaRifas, RifaTextTitulo, SubmitText, ContentText,
    AreaBotaoExcluir
} from './styles';
import { useNavigation } from '@react-navigation/native';
import { obtemQtdNrsBilhetesRifaDisponivel, marcaRifaDisponibilizadaAExcluirTransacao } from '../../servicos/firestore';
import { excluiImagem } from '../../servicos/storage';

export default function RifasDisponibilizadasAExcluirList({ data }) {
    console.log('RifasDisponibilizadasAExcluirList');
    const navigation = useNavigation();
    const [mensagemCadastro, setMensagemCadastro] = useState('');
    const [loading, setLoading] = useState(false);
    const [exclusaoOk, setExclusaoOk] = useState(false);

    const confirmarExclusaoRifa = () => {
        console.log('confirmarExclusaoRifa');
        Alert.alert(
            "Olá,",
            "Você confirma a exclusão desta Rifa?",
            [
                {
                    text: "Hum, ainda não. Vou pensar melhor",
                    onPress: () => naoConfirmaExclusaoRifa(),
                    style: "cancel"
                },
                {
                    text: "Sim. Vou excluir.",
                    onPress: () => verificarSePodeExcluirRifa(),
                    style: 'default'
                }
            ]
        );
    }

    function naoConfirmaExclusaoRifa() {
        console.log('naoConfirmaExclusaoRifa');
        return;
    }

    async function verificarSePodeExcluirRifa() {
        console.log('verificarSePodeExcluirRifa');
        setLoading(true)
        const qtdNrsBilhetesDisponiveis = await obtemQtdNrsBilhetesRifaDisponivel(data.id);
        console.log('qtdNrsBilhetesDisponiveis: ' + qtdNrsBilhetesDisponiveis)
        console.log('data.qtdNrs: ' + data.qtdNrs)
        if (qtdNrsBilhetesDisponiveis == data.qtdNrs) {
            confirmaExclusaoRifa();
        } else {
            setMensagemCadastro('Rifa nao pode ser excluida, pois tem bilhetes ja adquiridos ou em aquisicao.')
            setLoading(false);
            return;
        }
    }

    async function confirmaExclusaoRifa() {
        console.log('confirmaExclusaoRifa');
        setMensagemCadastro('')
        setLoading(true);
        console.log('data.id: ' + data.id)
        const resultado = await marcaRifaDisponibilizadaAExcluirTransacao(data.id);
        console.log('resultado confirmaExclusaoRifa: ' + resultado);
        if (resultado == 'sucesso') {
            setExclusaoOk(true)
            setMensagemCadastro('Se a rifa nao tiver nenhum bilhete adquirido, ela sera excluida.')
            setLoading(false);
            return;
        } else {
            setMensagemCadastro(resultado)
            setLoading(false);
            return;
        }
    }

    async function sair() {
        console.log('sair')
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
                        <RifaText> {data.cidade} {data.uf} {data.bairro} </RifaText>
                        <RifaText> Qtd nrs: {data.qtdNrs} Vlr bilhete: {data.vlrBilhete}</RifaText>
                        <RifaText> Autorizacao: {data.autorizacao} </RifaText>
                    </ListaRifas>
                    {
                        exclusaoOk ?
                            <AreaBotaoExcluir onPress={sair}>
                                <SubmitText>
                                    Ok
                                </SubmitText>
                            </AreaBotaoExcluir>
                            :
                            <AreaBotaoExcluir onPress={confirmarExclusaoRifa}>
                                <SubmitText>
                                    Excluir esta Rifa
                                </SubmitText>
                            </AreaBotaoExcluir>
                    }
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