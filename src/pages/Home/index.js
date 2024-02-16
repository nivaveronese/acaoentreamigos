import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Text, FlatList, StyleSheet } from 'react-native';
import { obtemUsuario, obtemRifasDisponiveisPaginacao, obtemParametrosApp } from '../../servicos/firestore';
import RifasDisponiveisList from '../../componentes/RifasDisponiveisList';
import { Background } from './styles';
import { RifasDisponiveisListShimmerEffect } from '../../componentes/RifasDisponiveisListShimmerEffect';
import { AuthContext } from '../../contexts/auth';
import messaging from '@react-native-firebase/messaging';
import { db } from '../../config/firebase';
import { doc, writeBatch, Timestamp } from "firebase/firestore";

export default function Home() {
    console.log('Home');
    const [rifasDisponiveis, setRifasDisponiveis] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [viewable, setViewable] = useState([]);
    const [temRifaDisponivel, setTemRifaDisponivel] = useState(false);
    const { user } = useContext(AuthContext);
    const [qtdRifas, setQtdRifas] = useState(0);
    const [rifasDisponiveisPaginacao, setRifasDisponiveisPaginacao] = useState([]);
    const [ultimoRifa, setUltimoRifa] = useState(false);
    const { signOut } = useContext(AuthContext);
    var qtdLimite = 0;
    var token = '';

    async function requestUserPermission() {
        console.log('requestUserPermission')
        setLoading(true)
        var dataLogin = Timestamp.fromDate(new Date());
        const usuarioFirestore = await obtemUsuario(user.uid)
        console.log('usuarioFirestore.situcao: ' + usuarioFirestore.situacao)
        if (!usuarioFirestore) {
            setLoading(false)
            sair();
        } else {
            if (usuarioFirestore.situacao == 'a excluir') {
                setLoading(false)
                sair();
            }
        }
        try {
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;
            if (enabled) {
                console.log('Authorization status: ' + authStatus)
                messaging().onMessage(async mensagem => {
                    console.log('mensagem: ')
                    console.log(mensagem)
                })
            } else {
                console.log('messaging nao autorizado: ' + authStatus)
            }
        } catch (error) {
            console.log('Ops, Algo deu errado em requerer permissao mensagens: ' + error.code);
        }
        // 2 dias = 172800000 milisegundos
        const dataRefUltimoLogin = Timestamp.fromDate(new Date(Date.now() - 172800000));
        console.log('datas login: ' + dataRefUltimoLogin + '-' + usuarioFirestore.dataUltimoLogin)
        console.log('token notificações firestore: ' + usuarioFirestore.tokenNotificacoes)
        if (usuarioFirestore.dataUltimoLogin < dataRefUltimoLogin) {
            console.log('usuarioFirestore.dataUltimoLogin < dataRefUltimoLogin: ' + token + '-' + dataLogin)
            token = usuarioFirestore.tokenNotificacoes;
            try {
                if (enabled) {
                    token = await messaging().getToken();
                    console.log('novo token notificações: ' + token)
                }

            } catch (error) {
                console.log('Ops, Algo deu errado em obter token do Login: ' + error.code);
                setLoading(false)
            }
            const batch = writeBatch(db);
            try {
                const usuarioRef = doc(db, "usuarios", usuarioFirestore.uid);
                batch.update(usuarioRef, {
                    tokenNotificacoes: token,
                    dataUltimoLogin: dataLogin
                });
                await batch.commit();
                setLoading(false)
                return;
            } catch (error) {
                console.log('Ops, Algo deu errado em atualizar token do Login: ' + error.code);
                setLoading(false)
                return;
            }
        }
        setLoading(false)
    }

    useEffect(() => {
        console.log('Home-useEffect')
        requestUserPermission()
        refreshList()
    }, [])

    async function refreshList() {
        console.log('home refreshList')
        setLoading(true)
        const parametrosAppFirestore = await obtemParametrosApp();
        console.log('home parametrosAppFirestore.qtdLimiteConsultaRifas: ' + parametrosAppFirestore.qtdLimiteConsultaRifas)
        if (!parametrosAppFirestore) {
            console.log('home parametrosAppFirestore.qtdLimiteConsultaRifas vazio')
            qtdLimite = 150
        } else {
            qtdLimite = parametrosAppFirestore.qtdLimiteConsultaRifas
        }
        await carregarRifasDisponiveis()
    }

    async function carregarRifasDisponiveis() {
        console.log('home carregarRifasDisponiveis');
        setUltimoRifa(false)
        setRifasDisponiveis([])
        setRifasDisponiveisPaginacao([])
        setTemRifaDisponivel(false)
        setLoading(true)
        console.log('qtdLimite: ' + qtdLimite)
        const rifasDisponiveisFirestore = await obtemRifasDisponiveisPaginacao(qtdLimite, user.cidade, user.uf)
        setLoading(false)
        console.log('qtdRifas home carregarRifasDisponiveis :' + rifasDisponiveisFirestore.qtdRifas)
        if (rifasDisponiveisFirestore.qtdRifas > 0) {
            console.log('rifasDisponiveisFirestore.qtdRifas > 0')
            setQtdRifas(rifasDisponiveisFirestore.qtdRifas)
            setRifasDisponiveisPaginacao(rifasDisponiveisFirestore.rifasDisponiveisFirestore)
            setTemRifaDisponivel(true)
        } else {
            setTemRifaDisponivel(false)
            return
        }
        if (rifasDisponiveisFirestore.qtdRifas > 10) {
            console.log('qtd Rifas > 10: ' + rifasDisponiveisFirestore.qtdRifas)
            var rifasDisponiveisArray = []
            for (var i = 0; i < 10; i++) {
                const rifaDisponivel = rifasDisponiveisFirestore.rifasDisponiveisFirestore[i];
                rifasDisponiveisArray.push(rifaDisponivel)
                console.log('i: ' + i)
            }
            setRifasDisponiveis(rifasDisponiveisArray)
        } else {
            setRifasDisponiveis(rifasDisponiveisFirestore.rifasDisponiveisFirestore)
        }
    }

    const handleViewableChanged = useCallback(({ changed }) => {
        setViewable(changed.map(({ item }) => item.id));
    }, []);

    async function obterMaisRifas() {
        console.log('obterMaisRifas: ' + qtdRifas)
        if (qtdRifas < 11) {
            console.log('obterMaisRifas - menor 11 - 1 a 10')
            return
        }
        if (ultimoRifa) {
            return
        }
        console.log('não é último Rifa')
        var qtdPag = rifasDisponiveis.length + 10;
        console.log('qtdPag: ' + qtdPag)
        var rifasDisponiveisArray = []
        if (qtdRifas > qtdPag) {
            console.log('maior')
            var qtdini = qtdPag - 10
            while (qtdini < qtdPag) {
                console.log('qtdini antes: ' + qtdini)
                const rifaDisponivel = rifasDisponiveisPaginacao[qtdini];
                rifasDisponiveisArray.push(rifaDisponivel)
                console.log('rifaDisponivel: ')
                console.log(rifaDisponivel)
                qtdini = qtdini + 1
                console.log('qtdini depois: ' + qtdini)
            }
            setRifasDisponiveis([...rifasDisponiveis, ...rifasDisponiveisArray])
            console.log('rifasDisponiveis.length: ' + rifasDisponiveis.length)
            return
        } else {
            console.log('menor ou igual: ' + qtdRifas)
            var qtdini = qtdPag - 10
            console.log('qtdini fora while: ' + qtdini)
            var rifasDisponiveisArray = []
            while (qtdini < qtdRifas) {
                console.log('qtdini dentro while antes somar: ' + qtdini)
                const rifaDisponivel = rifasDisponiveisPaginacao[qtdini];
                rifasDisponiveisArray.push(rifaDisponivel)
                qtdini = qtdini + 1
                console.log('qtdini dentro while depois somar: ' + qtdini)
            }
            setRifasDisponiveis([...rifasDisponiveis, ...rifasDisponiveisArray])
            setUltimoRifa(true)
            return
        }
    }

    async function sair() {
        console.log('sair')
        signOut();
    }

    if (loading) {
        return (
            <RifasDisponiveisListShimmerEffect />
        )
    } else {
        return (
            <Background>
                <Text style={styles.texto}>
                    Rifas disponíveis
                </Text>
                {temRifaDisponivel ?
                    <FlatList style={styles.lista}
                        data={rifasDisponiveis}
                        keyExtractor={post => String(post.id)}
                        onViewableItemsChanged={handleViewableChanged}
                        viewabilityConfig={{
                            viewAreaCoveragePercentThreshold: 10.
                        }}
                        showsVerticalScrollIndicator={false}
                        onRefresh={refreshList}
                        refreshing={refreshing}
                        onEndReachedThreshold={0.1}
                        onEndReached={() => obterMaisRifas()}
                        scrollEventThrottle={150}
                        renderItem={({ item }) => (
                            <RifasDisponiveisList
                                data={item}
                                shouldLoad={viewable.includes(item.id)}
                            />
                        )}
                    />
                    :
                    null}
            </Background>
        );
    }
}

const styles = StyleSheet.create({
    lista: {
        paddingTop: 2,
        Background: '#FFFFFF',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        marginTop: 20,
    },
    texto: {
        fontSize: 25,
        color: '#000',
        fontFamily: 'roboto',
        marginLeft: 15,
        fontStyle: 'italic',
    }, 
});