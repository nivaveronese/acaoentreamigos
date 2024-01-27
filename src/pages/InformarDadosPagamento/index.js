import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Image }
    from 'react-native';
import estilos from '../../estilos/estilos';
import {
    AreaBotao, InputAno, Input, Texto,
    RifaTextTitulo, RifaText, SubmitButton, SubmitText, AreaRifa,
    ContentText
} from './styles';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { desgravaPreReservaTransacao, gravaPagamentoPreReservaTransacao } from '../../servicos/firestore';
import { ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function InformarDadosPagamento() {
    console.log('InformarDadosPagamento')
    const [numeroCartaoCredito, setNumeroCartaoCredito] = useState('');
    const [nomeCartaoCredito, setNomeCartaoCredito] = useState('');
    const [mesValidadeCartaoCredito, setMesValidadeCartaoCredito] = useState('');
    const [anoValidadeCartaoCredito, setAnoValidadeCartaoCredito] = useState('');
    const [cvvCartaoCredito, setCvvCartaoCredito] = useState('');
    const [cpfCartaoCredito, setCpfCartaoCredito] = useState('');
    const [mensagemCadastro, setMensagemCadastro] = useState('');
    const [loading, setLoading] = useState(false);
    const [pgtoRealizado, setPgtoRealizado] = useState(false);
    const route = useRoute();
    const navigation = useNavigation();

    async function validarDadosCartao() {
        console.log('validarDadosCartao');

        if (numeroCartaoCredito == '' || numeroCartaoCredito.length === 0) {
            setMensagemCadastro('Digite o número do cartão de crédito');
            return;
        }
        if (mesValidadeCartaoCredito == '' || isNaN(mesValidadeCartaoCredito) || parseInt(mesValidadeCartaoCredito) < 1 || parseInt(mesValidadeCartaoCredito) > 12) {
            setMensagemCadastro('Digite corretamente o mês de validade do cartão de crédito');
            return;
        }
        if (anoValidadeCartaoCredito == '' || isNaN(anoValidadeCartaoCredito) || anoValidadeCartaoCredito.length < 2 || anoValidadeCartaoCredito.length === 3 || anoValidadeCartaoCredito.length > 4) {
            setMensagemCadastro('Digite corretamente o ano de validade do cartão de crédito');
            return;
        }
        if (cvvCartaoCredito == '' || isNaN(cvvCartaoCredito) || cvvCartaoCredito.length < 3 || cvvCartaoCredito.length > 4) {
            setMensagemCadastro('Digite corretamente o cvv do cartão de crédito');
            return;
        }
        if (cpfCartaoCredito == '' || isNaN(cpfCartaoCredito) || cpfCartaoCredito.length != 11) {
            setMensagemCadastro('Digite um cpf com 11 números');
            return;
        } else {
            if (!validarCPF(cpfCartaoCredito)) {
                setMensagemCadastro('Digite cpf válido');
                return;
            }
        }
        if (nomeCartaoCredito == '' || nomeCartaoCredito.length === 0) {
            setMensagemCadastro('Digite o nome impresso no cartão de crédito');
            return;
        }
        console.log('vai gravarPagamento')
        gravarPagamento();
    }

    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf == '') return false;
        if (cpf.length != 11 ||
            cpf == "00000000000" ||
            cpf == "11111111111" ||
            cpf == "22222222222" ||
            cpf == "33333333333" ||
            cpf == "44444444444" ||
            cpf == "55555555555" ||
            cpf == "66666666666" ||
            cpf == "77777777777" ||
            cpf == "88888888888" ||
            cpf == "99999999999")
            return false;
        add = 0;
        for (i = 0; i < 9; i++)
            add += parseInt(cpf.charAt(i)) * (10 - i);
        rev = 11 - (add % 11);
        if (rev == 10 || rev == 11)
            rev = 0;
        if (rev != parseInt(cpf.charAt(9)))
            return false;
        add = 0;
        for (i = 0; i < 10; i++)
            add += parseInt(cpf.charAt(i)) * (11 - i);
        rev = 11 - (add % 11);
        if (rev == 10 || rev == 11)
            rev = 0;
        if (rev != parseInt(cpf.charAt(10)))
            return false;
        return true;
    }

    async function gravarPagamento() {
        console.log('gravarPagamento: ')
        var dadosGravarPagamentoPreReserva = {
            id: route.params?.id,
            vlrBilhete: route.params?.vlrBilhete,
            vlrTotalBilhetes: route.params?.vlrTotalBilhetes,
            usuarioUid: route.params?.usuarioUid,
            usuarioQtdBilhetes: route.params?.usuarioQtdBilhetes,
            usuarioEmail: route.params?.usuarioEmail,
            bilhetesPreReservados: route.params?.bilhetesPreReservados,
            numeroCartaoCredito: numeroCartaoCredito,
            nomeCartaoCredito: nomeCartaoCredito,
            mesValidadeCartaoCredito: mesValidadeCartaoCredito,
            anoValidadeCartaoCredito: anoValidadeCartaoCredito,
            cvvCartaoCredito: cvvCartaoCredito,
            cpfCartaoCredito: cpfCartaoCredito
        }
        setLoading(true)
        const resultado = await gravaPagamentoPreReservaTransacao(dadosGravarPagamentoPreReserva);
        setLoading(false)
        console.log('resultado: ' + resultado)
        if (resultado == 'sucesso') {
            setPgtoRealizado(true)
            console.log('pagamento pre reserva realizado com sucesso ')
            setMensagemCadastro('Pagamento realizado com sucesso.');
            return;
        }
        else {
            setPgtoRealizado(false)
            setMensagemCadastro('Falha gravacao pagamento pre reserva. Tente novamente.');
            return;
        }
    }

    async function voltar() {
        console.log('voltar')
        console.log('route.params?.bilhetesPreReservados.length: ' + route.params?.bilhetesPreReservados.length)
        console.log(route.params?.bilhetesPreReservados)
        var qtdBilhetesDesgravados = 0;
        setLoading(true)
        while (qtdBilhetesDesgravados < route.params?.bilhetesPreReservados.length) {
            console.log('route.params?.bilhetesPreReservados[qtdBilhetesDesgravados]: ' + route.params?.bilhetesPreReservados[qtdBilhetesDesgravados])
            const resultado = await desgravaPreReservaTransacao(route.params?.id, route.params?.bilhetesPreReservados[qtdBilhetesDesgravados]);
            console.log('resultado: ' + resultado)
            if (resultado == 'sucesso') {
                console.log('bilhete pre-reservado desgravado com sucesso: ' + route.params?.bilhetesPreReservados[qtdBilhetesDesgravados])
            }
            else {
                console.log('bilhete pre-reservado nao desgravado: ' + route.params?.bilhetesPreReservados[qtdBilhetesDesgravados])
            }
            qtdBilhetesDesgravados = qtdBilhetesDesgravados + 1;
        }
        setLoading(false)
        navigation.reset({
            index: 0,
            routes: [{ name: "Home" }]
        })
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
                        </AreaRifa>
                    </View>
                    <Texto>
                        Olá {route.params?.usuarioNome},
                    </Texto>
                    <Texto>
                        Voce esta adquirindo {route.params?.usuarioQtdBilhetes} bilhetes, a R$ {route.params?.vlrBilhete} cada um, totalizando R$ {route.params?.vlrTotalBilhetes}
                    </Texto>
                    <Texto>
                        Preencha os dados abaixo, para debitar R$ {route.params?.vlrTotalBilhetes} no seu cartão de crédito.
                    </Texto>
                    <Texto>

                    </Texto>
                    <Texto>
                        Número cartão de crédito
                    </Texto>
                    <Input
                        autoCorrect={false}
                        autoCaptalize='none'
                        placeholder='9999888877776666'
                        keyboardType="numeric"
                        value={numeroCartaoCredito}
                        onChangeText={(text) => setNumeroCartaoCredito(text)}
                    />
                    <Texto>
                        Mês validade cartão de crédito
                    </Texto>
                    <InputAno
                        autoCorrect={false}
                        autoCaptalize='none'
                        keyboardType="numeric"
                        placeholder='01'
                        value={mesValidadeCartaoCredito}
                        onChangeText={(text) => setMesValidadeCartaoCredito(text)}
                    />
                    <Texto>
                        Ano validade cartão de crédito
                    </Texto>
                    <InputAno
                        autoCorrect={false}
                        autoCaptalize='none'
                        keyboardType="numeric"
                        placeholder='99'
                        value={anoValidadeCartaoCredito}
                        onChangeText={(text) => setAnoValidadeCartaoCredito(text)}
                    />
                    <Texto>
                        CVV cartão de crédito
                    </Texto>
                    <InputAno
                        autoCorrect={false}
                        autoCaptalize='none'
                        keyboardType="numeric"
                        value={cvvCartaoCredito}
                        onChangeText={(text) => setCvvCartaoCredito(text)}
                    />
                    <Texto>
                        Cpf do titular do cartão de crédito
                    </Texto>
                    <InputAno
                        autoCorrect={false}
                        autoCaptalize='none'
                        keyboardType="numeric"
                        placeholder='11122233344'
                        value={cpfCartaoCredito}
                        onChangeText={(text) => setCpfCartaoCredito(text)}
                    />
                    <Texto>
                        Nome impresso no cartão de crédito
                    </Texto>
                    <Input
                        autoCorrect={false}
                        autoCaptalize='none'
                        value={nomeCartaoCredito}
                        onChangeText={(text) => setNomeCartaoCredito(text)}
                    />
                    <View style={estilos.areaMensagemCadastro}>
                        <Text style={estilos.textoMensagemCadastro}>
                            {mensagemCadastro}
                        </Text>
                    </View>
                    {
                        pgtoRealizado ?
                            <AreaBotao>
                                <SubmitButton onPress={sair}>
                                    <SubmitText>
                                        Ok
                                    </SubmitText>
                                </SubmitButton>
                            </AreaBotao>
                            :
                            <AreaBotao>
                                <SubmitButton onPress={validarDadosCartao}>
                                    <SubmitText>
                                        Pagar
                                    </SubmitText>
                                </SubmitButton>
                                <TouchableOpacity style={styles.botao} onPress={() => voltar()}>
                                    <Text style={estilos.linkText}>Voltar</Text>
                                </TouchableOpacity>
                            </AreaBotao>
                    }
                </ScrollView>
            </GestureHandlerRootView>
        );
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