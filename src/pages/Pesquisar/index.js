import React, { useState, useEffect, useContext } from 'react';
import { View, Keyboard, FlatList, StyleSheet } from 'react-native';
import {
    Input, Background, AreaBotaoPesquisa, TextoMensagemCadastro,
    ContainerPesquisa, AreaPesquisa
} from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RadioPesquisar from '../../componentes/RadioPesquisar';
import RifasPesquisarList from '../../componentes/RifasPesquisarList';
import {
    obtemGeneros, obtemRifasDisponiveisCepPaginacao, obtemRifasDisponiveisTituloPaginacao,
    obtemRifasDisponiveisResponsavelPaginacao, obtemRifasDisponiveisGeneroPaginacao, obtemParametrosApp
} from '../../servicos/firestore';
import { useIsFocused } from "@react-navigation/native";
import apicep from '../../servicos/apicep';
import ModalDropdown from 'react-native-modal-dropdown';
import { AuthContext } from '../../contexts/auth';
import {RifasDisponiveisListShimmerEffect} from '../../componentes/RifasDisponiveisListShimmerEffect';

export default function Pesquisar() {
    console.log('pages/pesquisar.index.js');
    const [argPesquisa, setArgPesquisa] = useState('');
    const [selected, setSelected] = useState(0);
    const [rifasDisponiveisPesquisa, setRifasDisponiveisPesquisa] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mensagemError, setMensagemError] = useState('');
    const [genero, setGenero] = useState(' Escolha a categoria');
    const [descricaoGenero, setDescricaoGenero] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useContext(AuthContext);
    const focus = useIsFocused();
    const [qtdRifas, setQtdRifas] = useState(0);
    const [rifasDisponiveisPaginacao, setRifasDisponiveisPaginacao] = useState([]);
    const [ultimoRifa, setUltimoRifa] = useState(false);
    const [temRifaDisponivel, setTemRifaDisponivel] = useState(false);
    var localidade = '';
    var uf = '';

    useEffect(() => {
        async function inicioEffect() {
            console.log('inicioEffect-Pesquisar')
            if (focus == true) {
                setArgPesquisa('')
                setRifasDisponiveisPesquisa([])
                setMensagemError('');
                carregaGenerosList();
                setUltimoRifa(false)
                setTemRifaDisponivel(false)
            }
        }
        inicioEffect()
    }, [focus])

    async function carregaGenerosList() {
        console.log('carregaGenerosList');
        setLoading(true)
        const generosRifasFirestore = await obtemGeneros()
        var descricaoGeneroArray = []
        for (var g = 0; g < generosRifasFirestore.length; g++) {
            const descrGenero = generosRifasFirestore[g].genero;
            descricaoGeneroArray.push(descrGenero);
        }
        setDescricaoGenero(descricaoGeneroArray)
        setLoading(false)
    }

    async function pesquisarRifas() {
        console.log('pesquisar- pesquisaRifas: ' + selected + '-' + argPesquisa + '-' + genero);
        setMensagemError('');
        setRifasDisponiveisPesquisa([])
        setUltimoRifa(false)
        setTemRifaDisponivel(false)
        if (selected != 3) {
            setGenero(' Escolha a categoria')
            if (argPesquisa == '' || argPesquisa.length === 0) {
                console.log('argPesquisa: ' + argPesquisa);
                setMensagemError('Digite o argumento para pesquisa ou escolha a categoria');
                return
            }
        }
        if (selected === 3) {
            console.log('categoria: ' + genero)
            setArgPesquisa('')
            if (genero === ' Escolha a categoria' || typeof genero === "undefined") {
                setMensagemError('Escolha a categoria');
                return
            }
        }
        //  selected === 0: titulo, 1: responsavel, 2:cep 3:genero
        setMensagemError('')
        if (selected === 2) {
            Keyboard.dismiss();
            carregarRifasDisponiveisCep()
        } else if (selected === 0) {
            Keyboard.dismiss();
            carregarRifasDisponiveisTitulo()
        } else if (selected === 1) {
            Keyboard.dismiss();
            carregarRifasDisponiveisResponsavel()
        } else if (selected === 3) {
            Keyboard.dismiss();
            carregarRifasDisponiveisGenero()
        }
    }

    async function carregarRifasDisponiveisCep() {
        console.log('carregarRifasDisponiveisCep');
        setLoading(true)
        try {
            const response = await apicep.get(`/${argPesquisa}/json`);
            if (response.data.erro) {
                localidade = '';
                uf = '';
                setMensagemError('Cep não localizado');
                setLoading(false)
                return;
            }
            localidade = response.data.localidade;
            uf = response.data.uf;
        } catch (error) {
            console.log('erro cep: ' + error.code);
            localidade = '';
            uf = '';
            setMensagemError('Falha consultar cep. Verifique sua conexão de internet');
            setLoading(false)
            return;
        }
        setUltimoRifa(false)
        setTemRifaDisponivel(false)
        setRifasDisponiveisPesquisa([])
        setRifasDisponiveisPaginacao([])
        const parametrosAppFirestore = await obtemParametrosApp();
        if (typeof parametrosAppFirestore.qtdLimiteConsultaRifas === "undefined" || parametrosAppFirestore.qtdLimiteConsultaRifas === 0) {
            var qtdLimite = 150
        } else {
            var qtdLimite = parametrosAppFirestore.qtdLimiteConsultaRifas
        }
        const rifasDisponiveisFirestore = await obtemRifasDisponiveisCepPaginacao(localidade, uf, qtdLimite)
        setLoading(false)
        console.log('pesquisar rifasDisponiveisFirestore.qtdRifas cep: ' + rifasDisponiveisFirestore.qtdRifas)
        if (rifasDisponiveisFirestore.qtdRifas > 0) {
            setQtdRifas(rifasDisponiveisFirestore.qtdRifas)
            setRifasDisponiveisPaginacao(rifasDisponiveisFirestore.rifasDisponiveisFirestore)
            setTemRifaDisponivel(true)
        } else {
            setTemRifaDisponivel(false)
            return
        }
        if (rifasDisponiveisFirestore.qtdRifas > 10) {
            var rifasDisponiveisArray = []
            for (var i = 0; i < 10; i++) {
                const rifaDisponivel = rifasDisponiveisFirestore.rifasDisponiveisFirestore[i];
                rifasDisponiveisArray.push(rifaDisponivel)
            }
            setRifasDisponiveisPesquisa(rifasDisponiveisArray)
        } else {
            setRifasDisponiveisPesquisa(rifasDisponiveisFirestore.rifasDisponiveisFirestore)
        }
    }

    async function carregarRifasDisponiveisGenero() {
        console.log('carregarRifasDisponiveisGenero: ' + genero);
        setUltimoRifa(false)
        setTemRifaDisponivel(false)
        setRifasDisponiveisPesquisa([])
        setRifasDisponiveisPaginacao([])
        setLoading(true)
        const parametrosAppFirestore = await obtemParametrosApp();
        if (!parametrosAppFirestore) {
            console.log('home parametrosAppFirestore.qtdLimiteConsultaRifas vazio')
            qtdLimite = 150
        } else {
            qtdLimite = parametrosAppFirestore.qtdLimiteConsultaRifas
        }
        const rifasDisponiveisFirestore = await obtemRifasDisponiveisGeneroPaginacao(qtdLimite, user.cidade, user.uf, genero)
        setLoading(false)
        console.log('pesquisar rifasDisponiveisFirestore.qtdRifas genero: ' + rifasDisponiveisFirestore.qtdRifas)
        if (rifasDisponiveisFirestore.qtdRifas > 0) {
            setTemRifaDisponivel(true)
            setQtdRifas(rifasDisponiveisFirestore.qtdRifas)
            setRifasDisponiveisPaginacao(rifasDisponiveisFirestore.rifasDisponiveisFirestore)
        } else {
            setTemRifaDisponivel(false)
            return
        }
        if (rifasDisponiveisFirestore.qtdRifas > 10) {
            var rifasDisponiveisArray = []
            for (var i = 0; i < 10; i++) {
                const rifaDisponivel = rifasDisponiveisFirestore.rifasDisponiveisFirestore[i];
                rifasDisponiveisArray.push(rifaDisponivel)
            }
            setRifasDisponiveisPesquisa(rifasDisponiveisArray)
        } else {
            setRifasDisponiveisPesquisa(rifasDisponiveisFirestore.rifasDisponiveisFirestore)
        }
    }

    async function carregarRifasDisponiveisTitulo() {
        console.log('carregarRifasDisponiveisTitulo');
        setUltimoRifa(false)
        setTemRifaDisponivel(false)
        setRifasDisponiveisPesquisa([])
        setRifasDisponiveisPaginacao([])
        setLoading(true);
        const parametrosAppFirestore = await obtemParametrosApp();
        if (typeof parametrosAppFirestore.qtdLimiteConsultaRifas === "undefined" || parametrosAppFirestore.qtdLimiteConsultaRifas === 0) {
            var qtdLimite = 150
        } else {
            var qtdLimite = parametrosAppFirestore.qtdLimiteConsultaRifas
        }
        const rifasDisponiveisFirestore = await obtemRifasDisponiveisTituloPaginacao(qtdLimite, user.cidade, user.uf, argPesquisa)
        setLoading(false)
        console.log('pesquisar rifasDisponiveisFirestore.qtdRifas titulo: ' + rifasDisponiveisFirestore.qtdRifas)
        if (rifasDisponiveisFirestore.qtdRifas > 0) {
            console.log('rifasDisponiveisFirestore.qtdRifas > 0')
            setTemRifaDisponivel(true)
            setQtdRifas(rifasDisponiveisFirestore.qtdRifas)
            setRifasDisponiveisPaginacao(rifasDisponiveisFirestore.rifasDisponiveisFirestore)
        } else {
            setTemRifaDisponivel(false)
            return
        }
        if (rifasDisponiveisFirestore.qtdRifas > 10) {
            var rifasDisponiveisArray = []
            for (var i = 0; i < 10; i++) {
                const rifaDisponivel = rifasDisponiveisFirestore.rifasDisponiveisFirestore[i];
                rifasDisponiveisArray.push(rifaDisponivel)
            }
            setRifasDisponiveisPesquisa(rifasDisponiveisArray)
        } else {
            setRifasDisponiveisPesquisa(rifasDisponiveisFirestore.rifasDisponiveisFirestore)
        }
    }

    async function carregarRifasDisponiveisResponsavel() {
        console.log('carregarRifasDisponiveisResponsavel');
        setUltimoRifa(false)
        setTemRifaDisponivel(false)
        setRifasDisponiveisPesquisa([])
        setRifasDisponiveisPaginacao([])
        setLoading(true)
        const parametrosAppFirestore = await obtemParametrosApp();
        if (typeof parametrosAppFirestore.qtdLimiteConsultaRifas === "undefined" || parametrosAppFirestore.qtdLimiteConsultaRifas === 0) {
            var qtdLimite = 150
        } else {
            var qtdLimite = parametrosAppFirestore.qtdLimiteConsultaRifas
        }
        const rifasDisponiveisFirestore = await obtemRifasDisponiveisResponsavelPaginacao(qtdLimite, user.cidade, user.uf, argPesquisa)
        setLoading(false)
        console.log('pesquisar rifasDisponiveisFirestore.qtdRifas responsavel: ' + rifasDisponiveisFirestore.qtdRifas)
        if (rifasDisponiveisFirestore.qtdRifas > 0) {
            setTemRifaDisponivel(true)
            setQtdRifas(rifasDisponiveisFirestore.qtdRifas)
            setRifasDisponiveisPaginacao(rifasDisponiveisFirestore.rifasDisponiveisFirestore)
        } else {
            setTemRifaDisponivel(false)
            return
        }
        if (rifasDisponiveisFirestore.qtdRifas > 10) {
            var rifasDisponiveisArray = []
            for (var i = 0; i < 10; i++) {
                const rifaDisponivel = rifasDisponiveisFirestore.rifasDisponiveisFirestore[i];
                rifasDisponiveisArray.push(rifaDisponivel)
            }
            setRifasDisponiveisPesquisa(rifasDisponiveisArray)
        } else {
            setRifasDisponiveisPesquisa(rifasDisponiveisFirestore.rifasDisponiveisFirestore)
        }
    }

    async function obterMaisRifas() {
        console.log('obterMaisRifas: ' + qtdRifas)
        if (qtdRifas < 11) {
            console.log('obterMaisRifas - menor 11 - 1 a 10')
            return
        }
        if (ultimoRifa) {
            return
        }
        console.log('não é último rifa')
        var qtdPag = rifasDisponiveisPesquisa.length + 10;
        console.log('qtdpag: ' + qtdPag)
        var rifasDisponiveisArray = []
        if (qtdRifas > qtdPag) {
            console.log('maior')
            var qtdini = qtdPag - 10
            while (qtdini < qtdPag) {
                const rifaDisponivel = rifasDisponiveisPaginacao[qtdini];
                rifasDisponiveisArray.push(rifaDisponivel)
                qtdini = qtdini + 1
            }
            setRifasDisponiveisPesquisa([...rifasDisponiveisPesquisa, ...rifasDisponiveisArray])
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
            setRifasDisponiveisPesquisa([...rifasDisponiveisPesquisa, ...rifasDisponiveisArray])
            setUltimoRifa(true)
            return
        }
    }

    async function refreshList() {
        console.log('home refreshList')
        if (selected === 2) {
            await carregarRifasDisponiveisCep()
        }
    }

    const handleOptionSelect = (index, value) => {
        setGenero(value);
    };

    if (loading) {
        return (
            <RifasDisponiveisListShimmerEffect />
        )
    } else {
        return (
            <Background>
                <AreaPesquisa>
                    <Input
                        autoCorrect={false}
                        autoCaptalize='none'
                        value={argPesquisa}
                        onChangeText={(text) => setArgPesquisa(text)}
                        maxLength={40}
                    />
                    <AreaBotaoPesquisa onPress={pesquisarRifas}>
                        <Icon
                            name='book-search-outline' size={30} color='#333'
                        />
                    </AreaBotaoPesquisa>
                </AreaPesquisa>
                <ContainerPesquisa>
                    <RadioPesquisar
                        selected={selected}
                        options={['título', 'responsavel', 'cep', 'categoria']}
                        horizontal={true}
                        onChangeSelect={(opt, i) => {
                            setSelected(i);
                        }}
                    />
                </ContainerPesquisa>
                <View style={styles.container}>
                    <ModalDropdown
                        options={descricaoGenero}
                        defaultValue={genero}
                        onSelect={handleOptionSelect}
                        style={styles.dropdown}
                        textStyle={styles.dropdownText}
                        dropdownStyle={styles.dropdownDropdown}
                        dropdownTextStyle={styles.dropdownDropdownText}
                    />
                </View>
                <TextoMensagemCadastro>
                    {mensagemError}
                </TextoMensagemCadastro>
                {temRifaDisponivel ?
                    <FlatList style={styles.lista}
                        data={rifasDisponiveisPesquisa}
                        keyExtractor={post => String(post.id)}
                        showsVerticalScrollIndicator={false}
                        onRefresh={refreshList}
                        refreshing={refreshing}
                        onEndReachedThreshold={0}
                        onEndReached={() => obterMaisRifas()}
                        scrollEventThrottle={150}
                        renderItem={({ item }) => (
                            <RifasPesquisarList
                                data={item}
                            />
                        )}
                    />
                    :
                    null
                }
            </Background>
        )
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
    container: {
        justifyContent: 'top',
        alignItems: 'center',
        height: 40,
    },
    dropdown: {
        width: 200,
        borderWidth: 1,
        borderColor: '#D3D3D3',
        padding: 5,
        borderRadius: 5,
    },
    dropdownText: {
        fontSize: 12,
    },
    dropdownDropdown: {
        width: 200,
        height: 200,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
    },
    dropdownDropdownText: {
        fontSize: 12,
    },
});