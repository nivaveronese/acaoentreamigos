import React, { useContext, useState, useEffect } from 'react';
import { View, Image, SafeAreaView, Alert, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import {
    ViewTitulo, RifaTextTitulo, RifaText, SubmitButton, SubmitText, AreaRifa,
    AreaBotao, ContentText, InputQtd, TextoQtd, AreaInput
} from './styles';
import { AuthContext } from '../../contexts/auth';
import { useNavigation } from '@react-navigation/native';
import estilos from '../../estilos/estilos';
import { obtemBilhetesJaAdquiridos, obtemBilhetesEmAquisicao, obtemParametrosApp }
    from '../../servicos/firestore';
import { Timestamp } from "firebase/firestore";

export default function ValidarAquisicao() {
    console.log('ValidarAquisicao: ')
    const route = useRoute();
    const navigation = useNavigation();
    const { user: usuario } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [mensagemCadastro, setMensagemCadastro] = useState('');
    const [qtdBilhetes, setQtdBilhetes] = useState(0);
    const [qtdMaximaBilhetesPorCpf, setQtdMaximaBilhetesPorCpf] = useState(0);

    useEffect(() => {
        console.log('ValidarAquisicao-useEffect')
        carregarParametrosApp()
    }, [])

    async function carregarParametrosApp() {
        console.log('carregarParametrosApp')
        setLoading(true)
        const parametrosAppFirestore = await obtemParametrosApp();
        setLoading(false)
        if (!parametrosAppFirestore) {
            console.log('nao encontrou parametros')
            setQtdMaximaBilhetesPorCpf(5);
        } else {
            setQtdMaximaBilhetesPorCpf( parametrosAppFirestore.qtdMaximaBilhetesParaCompraPorCpfPorRifa );
        }
        console.log('carregarParametrosApp - qtdMaximaBilhetesPorCpf: ' + qtdMaximaBilhetesPorCpf);
    }

    async function verSePodeAdquirir() {
        console.log('verSePodeAdquirir');
        console.log(usuario.uid + '-' + route.params?.uid);
        if (!qtdBilhetes || isNaN(qtdBilhetes) || parseInt(qtdBilhetes) == 0) {
            setMensagemCadastro('Informe a quantidade de bilhetes que deseja adquirir');
            return;
        }
        if (usuario.uid == route.params?.uid) {
            setMensagemCadastro('Você não pode adquirir bilhetes de uma rifa disponibilizada por você')
            return
        }
        setLoading(true);
        const bilhetesJaAdquiridosFirestore = await obtemBilhetesJaAdquiridos(usuario.uid, route.params?.id)
        if (!bilhetesJaAdquiridosFirestore) {
            setLoading(false);
            setMensagemCadastro('Ops, não consegui verificar se pode adquirir bilhetes (ja adquiridos). Tente novamente')
            return
        }
        const bilhetesEmAquisicaoFirestore = await obtemBilhetesEmAquisicao(usuario.uid, route.params?.id)
        if (!bilhetesEmAquisicaoFirestore) {
            setLoading(false);
            setMensagemCadastro('Ops, não consegui verificar se pode adquirir bilhetes (em aquisicao). Tente novamente')
            return
        }
        let qtdTotalBilhetesJaEmAquisicao = (parseFloat(bilhetesJaAdquiridosFirestore.length) + parseFloat(bilhetesEmAquisicaoFirestore.length));
        let qtdBilhetesPodeAdquirir = qtdMaximaBilhetesPorCpf - qtdTotalBilhetesJaEmAquisicao;
        if (qtdBilhetesPodeAdquirir == 0) {
            setLoading(false);
            setMensagemCadastro('Voce ja adquiriu, ou tem em processo de aquisicao, a quantidade maxima de bilhetes: ' + qtdMaximaBilhetesPorCpf)
            return;
        }
        if (qtdBilhetes > qtdBilhetesPodeAdquirir) {
            setLoading(false);
            setMensagemCadastro('Voce pode adquirir no maximo:  ' + qtdBilhetesPodeAdquirir + ' bilhetes')
            return;
        }
        console.log('ir para solicitar dados pagamento')
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
            <SafeAreaView style={{ backgroundColor: '#FFFFFF' }}>

                <View style={styles.card}>
                    <Image source={{ uri: route.params?.imagemCapa }}
                        style={styles.capa}
                    />
                    <AreaRifa>
                        <ViewTitulo>
                            <RifaTextTitulo> {route.params?.titulo} </RifaTextTitulo>
                        </ViewTitulo>
                        <ContentText numberOfLines={8}>
                            {route.params?.descricao}
                        </ContentText>
                        <RifaText> Responsável: {route.params?.nome} </RifaText>
                        <RifaText> {route.params?.cepusuario} {route.params?.cidade} {route.params?.uf} {route.params?.bairro} </RifaText>
                        <RifaText> Permitida a aquisicao maxima de {qtdMaximaBilhetesPorCpf} bilhetes por cpf </RifaText>                    
                    </AreaRifa>
                </View>
                <View style={estilos.areaMensagemCadastro}>
                    <TextoQtd>
                        Informe a quantidade de bilhetes que deseja adquirir
                    </TextoQtd>
                </View>
                <AreaInput>
                    <InputQtd
                        autoCorrect={false}
                        keyboardType="numeric"
                        value={qtdBilhetes}
                        onChangeText={(text) => setQtdBilhetes(text)}
                    />
                    <SubmitButton onPress={verSePodeAdquirir}>
                        <SubmitText>
                            Adquirir
                        </SubmitText>
                    </SubmitButton>
                    <TouchableOpacity style={styles.botao} onPress={() => voltar()}>
                        <Text style={estilos.linkText}>Voltar</Text>
                    </TouchableOpacity>
                </AreaInput>
                <View style={estilos.areaMensagemCadastro}>
                    <Text style={estilos.textoMensagemCadastro}>
                        {mensagemCadastro}
                    </Text>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    card: {
        shadowColor: '#000',
        backgroundColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        margin: 15,
        shadowRadius: 5,
        borderRadius: 5,
        elevation: 3
    },
    capa: {
        width: '100%',
        height: 350,
        borderRadius: 5
    },
    botao: {
        marginTop: 15,
        marginLeft: 10,
    },
}) 