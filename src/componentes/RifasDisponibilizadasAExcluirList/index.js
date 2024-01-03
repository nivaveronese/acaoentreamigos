import React, { useState } from 'react';
import { ActivityIndicator, Image, View, Alert, SafeAreaView, StyleSheet } from 'react-native';
import {
    RifaText, ListaRifas, RifaTextTitulo, SubmitText,ContentText,
    AreaBotaoExcluir
} from './styles';
import { useNavigation } from '@react-navigation/native';
import { excluiRifaDisponibilizadaTransacao } from '../../servicos/firestore';
import { excluiImagem } from '../../servicos/storage';

export default function RifasDisponibilizadasAExcluirList({ data }) {
    console.log('RifasDisponibilizadasAExcluirList');
    const navigation = useNavigation();
    const [mensagemCadastro, setMensagemCadastro] = useState('');
    const [loading, setLoading] = useState(false);

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
                    onPress: () => confirmaExclusaoRifa(),
                    style: 'default'
                }
            ]
        );
    }

    function naoConfirmaExclusaoRifa() {
        console.log('naoConfirmaExclusaoRifa');
        return;
    }

    async function confirmaExclusaoRifa() {
        console.log('confirmaExclusaoRifa');
        setMensagemCadastro('')
        setLoading(true);
        console.log('data.uid: ' + data.uid)
        const resultado = await excluiRifaDisponibilizadaTransacao(data.id, data.uid);
        console.log('resultado confirmaExclusaoRifa: ' + resultado);
        if (resultado == 'sucesso') {
            excluirImagem();
        } else {
            setMensagemCadastro(resultado)
            setLoading(false);
            return;
        }
    }

    async function excluirImagem() {
        console.log('excluirImagem')
        const resultadoE = await excluiImagem(data.nomeCapa);
        console.log('resultado excluirImagem: ' + resultadoE);
        setMensagemCadastro('')
        setLoading(false);
        navigation.navigate('Ok')
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
                        <RifaText> {data.genero} </RifaText>
                        <ContentText numberOfLines={8}>
                            {data.descricao}
                        </ContentText>
                        <RifaText> {data.cepusuario} {data.cidade} {data.uf} {data.bairro} </RifaText>
                    </ListaRifas>
                    <AreaBotaoExcluir onPress={confirmarExclusaoRifa}>
                        <SubmitText>
                            Excluir este Rifa
                        </SubmitText>
                    </AreaBotaoExcluir>
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