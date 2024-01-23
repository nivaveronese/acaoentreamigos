import React, { useContext, useState, useEffect } from 'react';
import { View, Image, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import {
    RifaTextTitulo, RifaText, SubmitButton, SubmitText, AreaRifa,
    ContentText, InputQtd, TextoQtd, AreaInput
} from './styles';
import { AuthContext } from '../../contexts/auth';
import { useNavigation } from '@react-navigation/native';
import estilos from '../../estilos/estilos';
import {
    obtemBilhetesJaAdquiridos, obtemBilhetesEmAquisicao, obtemParametrosApp,
    obtemBilhetesDisponiveisParaReserva, gravaPreReservaTransacao
}
    from '../../servicos/firestore';
import { Timestamp } from "firebase/firestore";
import { ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function ValidarAquisicao() {
    console.log('ValidarAquisicao: ')
    const route = useRoute();
    const navigation = useNavigation();
    const { user: usuario } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [mensagemCadastro, setMensagemCadastro] = useState('');
    const [qtdBilhetes, setQtdBilhetes] = useState('');
    const [qtdMaximaBilhetesPorUsuario, setQtdMaximaBilhetesPorUsuario] = useState('');

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
            setQtdMaximaBilhetesPorUsuario(5);
        } else {
            setQtdMaximaBilhetesPorUsuario(parametrosAppFirestore.qtdMaximaBilhetesParaCompraPorUsuarioPorRifa);
        }
        console.log('carregarParametrosApp - qtdMaximaBilhetesPorUsuario: ' + qtdMaximaBilhetesPorUsuario);
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
        let qtdBilhetesPodeAdquirir = qtdMaximaBilhetesPorUsuario - qtdTotalBilhetesJaEmAquisicao;
        if (qtdBilhetesPodeAdquirir == 0) {
            setLoading(false);
            setMensagemCadastro('Voce ja adquiriu, ou tem em processo de aquisicao, a quantidade maxima de bilhetes: ' + qtdMaximaBilhetesPorUsuario)
            return;
        }
        if (qtdBilhetes > qtdBilhetesPodeAdquirir) {
            setLoading(false);
            setMensagemCadastro('Voce pode adquirir no maximo:  ' + qtdBilhetesPodeAdquirir + ' bilhetes')
            return;
        }

        let dadosObtemBilhetes = {
            id: route.params?.id,
            usuarioQtdBilhetes: qtdBilhetes,
        }

        const bilhetesDisponiveisParaReservaFirestore = await obtemBilhetesDisponiveisParaReserva(dadosObtemBilhetes);
        if (bilhetesDisponiveisParaReservaFirestore.qtdBilhetesDisponiveis == 0) {
            setLoading(false);
            setMensagemCadastro('No momento, todos os bilhetes ja foram adquiridos ou estao em processo de aquisicao. Tente novamente mais tarde, pois pode ser que alguem desista.')
            return;
        }
        if (bilhetesDisponiveisParaReservaFirestore.qtdBilhetesDisponiveis < qtdBilhetes) {
            setLoading(false);
            setMensagemCadastro('No momento, temos apenas ' + bilhetesDisponiveisParaReservaFirestore.qtdBilhetesDisponiveis + 'bilhetes disponiveis. Altere a quantidade que deseja adquirir, e tente novamente.')
            return;
        }

        let dadosPreReserva = {
            id: route.params?.id,
            usuarioUid: usuario.uid,
            usuarioNome: usuario.nome,
            usuarioEmail: usuario.email,
            usuarioQtdBilhetes: qtdBilhetes,
            vlrBilhete: route.params?.vlrBilhete,
            vlrvlrTotalBilhetes: (parseInt(qtdBilhetes) * parseInt(route.params?.vlrBilhete)),
            dataPreReserva: Timestamp.fromDate(new Date())
        }

        var qtdBilhetesProcessados = 0;
        var bilhetesPreReservados = [];
        while (qtdBilhetes > qtdBilhetesProcessados) {
            let dadosBilhetePreReserva = {
                idBilhete: bilhetesDisponiveisParaReservaFirestore.bilhetesDisponiveisParaReservaFirestore[qtdBilhetesProcessados].idBilhete,
                nroBilhete: bilhetesDisponiveisParaReservaFirestore.bilhetesDisponiveisParaReservaFirestore[qtdBilhetesProcessados].nroBilhete
            }
            const resultado = await gravaPreReservaTransacao(dadosPreReserva, dadosBilhetePreReserva);
            if (resultado == 'sucesso') {
                console.log('bilhete reservado com sucesso: ' + dadosBilhetePreReserva.idBilhete + ' - ' + dadosBilhetePreReserva.nroBilhete)
                bilhetesPreReservados.push(dadosBilhetePreReserva.idBilhete);
            }
            else {
                console.log('bilhete nao reservado: ' + dadosBilhetePreReserva.idBilhete + ' - ' + dadosBilhetePreReserva.nroBilhete)
            }
            qtdBilhetesProcessados = qtdBilhetesProcessados + 1;
        }
        setLoading(false)
        if (bilhetesPreReservados.length == 0) {
            console.log('nenhum reservado')
        }
        if (bilhetesPreReservados.length < qtdBilhetes) {
            console.log('reservado menos')
        }
        if (bilhetesPreReservados.length == qtdBilhetes) {
            console.log('reservado ok')
        }

        var dadosRifa = {
            id: route.params?.id,
            cep: route.params?.cep,
            cidade: route.params?.cidade,
            uf: route.params?.uf,
            bairro: route.params?.bairro,
            nome: route.params?.nome,
            email: route.params?.email,
            titulo: route.params?.titulo,
            descricao: route.params?.descricao,
            genero: route.params?.genero,
            imagemCapa: route.params?.imagemCapa,
            nomeCapa: route.params?.nomeCapa,
            post: route.params?.post,
            vlrBilhete: route.params?.vlrBilhete,
            vlrTotalBilhetes: (parseInt(qtdBilhetes) * parseInt(route.params?.vlrBilhete)),
            usuarioUid: usuario.uid,
            usuarioQtdBilhetes: qtdBilhetes,
            usuarioNome: usuario.nome,
            usuarioEmail: usuario.email
        }
        console.log('ir para informar dados pagamento')
        navigation.navigate('InformarDadosPagamento', dadosRifa);
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
                    <View style={styles.card}>
                        <Image source={{ uri: route.params?.imagemCapa }}
                            style={styles.capa}
                        />
                        <AreaRifa>
                            <RifaTextTitulo> {route.params?.titulo} </RifaTextTitulo>
                            <ContentText numberOfLines={8}>
                                {route.params?.descricao}
                            </ContentText>
                            <RifaText> Responsável: {route.params?.nome} </RifaText>
                            <RifaText> {route.params?.cepusuario} {route.params?.cidade} {route.params?.uf} {route.params?.bairro} </RifaText>
                            <RifaText> Qtd nrs: {route.params?.qtdNrs} Vlr bilhete: {route.params?.vlrBilhete}</RifaText>
                            <RifaText> Autorizacao: {route.params?.autorizacao} </RifaText>
                            <RifaText> Permitida a aquisicao maxima de {qtdMaximaBilhetesPorUsuario} bilhetes por usuario </RifaText>
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
                </ScrollView>
            </GestureHandlerRootView>
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