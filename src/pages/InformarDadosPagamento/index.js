import React, { useState } from 'react';
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
import { obtemSituacaoRifa, desgravaPreReservaTransacao, gravaPagamentoPreReservaTransacao } from '../../servicos/firestore';
import { ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CpfValido from '../../componentes/CpfValido';

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

        if (numeroCartaoCredito == '' || isNaN(numeroCartaoCredito) || numeroCartaoCredito.length === 0 || numeroCartaoCredito.length < 13 || numeroCartaoCredito.length > 16) {
            setMensagemCadastro('Digite corretamente o número do cartão de crédito');
            return;
        }
        if (mesValidadeCartaoCredito == '' || isNaN(mesValidadeCartaoCredito) || parseInt(mesValidadeCartaoCredito) < 1 || parseInt(mesValidadeCartaoCredito) > 12) {
            setMensagemCadastro('Digite corretamente o mês de validade do cartão de crédito');
            return;
        }
        if (anoValidadeCartaoCredito == '' || isNaN(anoValidadeCartaoCredito) || anoValidadeCartaoCredito.length < 4 || anoValidadeCartaoCredito.length > 4) {
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
            if (!CpfValido(cpfCartaoCredito)) {
                setMensagemCadastro('Digite cpf válido');
                return;
            }
        } 

        if (nomeCartaoCredito == '' || nomeCartaoCredito.length === 0 || !isNaN(nomeCartaoCredito)) {
            setMensagemCadastro('Digite o nome impresso no cartão de crédito');
            return;
        }

        setLoading(true)
        const situacaoRifa = await obtemSituacaoRifa(route.params?.id);
        setLoading(false)
        console.log('situacaoRifa: ' + situacaoRifa)
        if (situacaoRifa != 'ativa'){
            setMensagemCadastro('Esta rifa não esta mais disponível: ' + situacaoRifa)
            return;
        }

        console.log('vai gravarPagamento')
        gravarPagamento();
    }    
 
    async function gravarPagamento() {
        console.log('gravarPagamento: ')
        console.log('route.params?.nrsBilhetesPreReservados.length: ' + route.params?.nrsBilhetesPreReservados.length) 
        let qt = 0;
        let nrsBilhetesPreReservadosFormatados = '';
        while (qt < route.params?.nrsBilhetesPreReservados.length){
            if (route.params?.qtdBilhetes == 10) {
                nrsBilhetesPreReservadosFormatados = nrsBilhetesPreReservadosFormatados + (('0' + route.params?.nrsBilhetesPreReservados[qt]).slice(-1)) + '  ';
            } else if (route.params?.qtdBilhetes == 100) {
                nrsBilhetesPreReservadosFormatados = nrsBilhetesPreReservadosFormatados + (('00' + route.params?.nrsBilhetesPreReservados[qt]).slice(-2)) + '  ';
            } else if (route.params?.qtdBilhetes == 1000) {
                nrsBilhetesPreReservadosFormatados = nrsBilhetesPreReservadosFormatados + (('000' + route.params?.nrsBilhetesPreReservados[qt]).slice(-3)) + '  ';
            }
           qt = qt + 1
        }
        console.log('nrsBilhetesPreReservadosFormatados: ' + nrsBilhetesPreReservadosFormatados)
        var dadosGravarPagamentoPreReserva = {
            id: route.params?.id,
            imagemCapa: route.params?.imagemCapa,
            titulo: route.params?.titulo,
            descricao: route.params?.descricao,
            nome: route.params?.nome,
            cidade: route.params?.cidade,
            uf: route.params?.uf,
            bairro: route.params?.bairro,
            vlrBilhete: route.params?.vlrBilhete,
            vlrTotalBilhetes: route.params?.vlrTotalBilhetes,
            usuarioUid: route.params?.usuarioUid,
            usuarioQtdBilhetes: route.params?.usuarioQtdBilhetes,
            usuarioEmail: route.params?.usuarioEmail,
            bilhetesPreReservados: route.params?.bilhetesPreReservados,
            nrsBilhetesPreReservados: route.params?.nrsBilhetesPreReservados,
            nrsBilhetesPreReservadosFormatados: nrsBilhetesPreReservadosFormatados,
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
            desgravarPreReserva();
            setPgtoRealizado(false)
            setMensagemCadastro('Falha gravação pagamento. Tente novamente.');
            return;
        }
    }

    async function desgravarPreReserva(){
        console.log('desgravarPreReserva')
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
    }

    async function voltar() {
        console.log('voltar')
        desgravarPreReserva();
        sair();
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
                            <RifaText> {route.params?.cidade} {route.params?.uf} {route.params?.bairro} </RifaText>
                            <RifaText> Qtd bilhetes: {route.params?.qtdBilhetes} Vlr bilhete: {route.params?.vlrBilhete}</RifaText>
                            <RifaText> Autorização: {route.params?.autorizacao} </RifaText>
                        </AreaRifa>
                    </View>
                    <Texto>
                        Olá {route.params?.usuarioNome},
                    </Texto>
                    <Texto>
                        Você está adquirindo {route.params?.usuarioQtdBilhetes} bilhete(s), a R$ {route.params?.vlrBilhete} cada um, totalizando R$ {route.params?.vlrTotalBilhetes}
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
                        Mês validade cartão de crédito (MM)
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
                        Ano validade cartão de crédito (AAAA)
                    </Texto>
                    <InputAno
                        autoCorrect={false}
                        autoCaptalize='none'
                        keyboardType="numeric"
                        placeholder='2024'
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