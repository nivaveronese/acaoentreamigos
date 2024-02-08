import React, { useState, useContext, useEffect } from 'react';
import { Text, ActivityIndicator, Keyboard, SafeAreaView } from 'react-native';
import Botao from '../../componentes/Botao';
import { Texto, TextoMensagemCadastro, InputQtd } from './styles';
import { obtemParametrosApp, obtemQtdRifasAtivasUsuario, obtemQtdRifasALiberarUsuario } from '../../servicos/firestore';
import estilos from '../../estilos/estilos';
import { AuthContext } from '../../contexts/auth';
import { useNavigation } from '@react-navigation/native';

export default function DisponibilizarRifasPix() {
    console.log('DisponibilizarRifasPix');
    const [mensagemCadastro, setMensagemCadastro] = useState('');
    const [titulo, setTitulo] = useState('');
    const [autorizacao, setAutorizacao] = useState('');
    const [descricao, setdescricao] = useState('');
    const [genero, setGenero] = useState(' Escolha a categoria');
    const [descricaoGenero, setDescricaoGenero] = useState([]);
    const [qtdBilhetes, setQtdBilhetes] = useState('');
    const [vlrBilhete, setVlrBilhete] = useState('');
    const [vlrPremioPix, setVlrPremioPix] = useState('');
    const [imagemCapa, setImagemCapa] = useState('');
    const [load, setLoad] = useState(false);
    const { user: usuario } = useContext(AuthContext);
    const navigation = useNavigation();
    const [percAdministracao, setPercAdministracao] = useState('');
    const [percPgtoBilhete, setPercPgtoBilhete] = useState('');
    const [qtdRifasAtivasUsuario, setQtdRifasAtivasUsuario] = useState('')
    const [qtdRifasALiberarUsuario, setQtdRifasALiberarUsuario] = useState('')
    const [qtdLimiteRifasAtivas, setQtdLimiteRifasAtivas] = useState('');
    const [vlrMinimoTotalRifa, setVlrMinimoTotalRifa] = useState('');
    var qtdBilhetesValidos = [10, 100, 1000];
    var regra = /^[0-9]+$/;
    var vlrTotalBilhetesPrevisto = 0;
    var vlrTotalTaxaAdministracaoPrevisto = 0;
    var vlrTotalTaxaBilhetesPrevisto = 0;
    var vlrLiquidoAReceberResponsavelPrevisto = 0;

    useEffect(() => {
        obterParametros();
    }, []);

    async function obterParametros() {
        console.log('obterParametros');
        setLoad(true)
        const parametrosAppFirestore = await obtemParametrosApp();
        console.log('parametrosAppFirestore.qtdLimiteRifasAtivas: ' + parametrosAppFirestore.qtdLimiteRifasAtivas)
        console.log('parametrosAppFirestore.vlrMinimoTotalRifa: ' + parametrosAppFirestore.vlrMinimoTotalRifa)
        setLoad(false)
        if (!parametrosAppFirestore) {
            console.log('parametrosAppFirestore vazio')
            setQtdLimiteRifasAtivas(5);
            setPercAdministracao(10);
            setPercPgtoBilhete(1);
            setVlrMinimoTotalRifa(100);
        } else {
            setQtdLimiteRifasAtivas(parametrosAppFirestore.qtdLimiteRifasAtivas);
            setPercAdministracao(parametrosAppFirestore.percAdministracao);
            setPercPgtoBilhete(parametrosAppFirestore.percPgtoBilhete);
            setVlrMinimoTotalRifa(parametrosAppFirestore.vlrMinimoTotalRifa);
        }
        setLoad(true)
        console.log('usuario.uid: ' + usuario.uid)
        const qtdRifasAtivasUsuarioFirestore = await obtemQtdRifasAtivasUsuario(usuario.uid);
        console.log('obtemQtdRifasAtivasUsuarioFirestore: ' + qtdRifasAtivasUsuarioFirestore)
        setQtdRifasAtivasUsuario(qtdRifasAtivasUsuarioFirestore)
        const qtdRifasALiberarUsuarioFirestore = await obtemQtdRifasALiberarUsuario(usuario.uid);
        console.log('qtdRifasALiberarUsuarioFirestore: ' + qtdRifasALiberarUsuarioFirestore)
        setQtdRifasALiberarUsuario(qtdRifasALiberarUsuarioFirestore)
        setLoad(false)
    }

    async function disponibilizarRifa() {
        console.log('disponibilizarRifa: ' + qtdBilhetes);
        Keyboard.dismiss();
        setMensagemCadastro('')
        if (typeof vlrPremioPix === "undefined" || isNaN(vlrPremioPix) || vlrPremioPix == 0 || vlrPremioPix < 0) {
            setMensagemCadastro('Informe valor do premio Pix (somente inteiros)')
            return;
        } else if (typeof qtdBilhetes === "undefined" || !qtdBilhetesValidos.includes(parseInt(qtdBilhetes))) {
            setMensagemCadastro('Informe uma quantidade valida de bilhetes da rifa (10,100 ou 1000')
            return;
        } else if (typeof vlrBilhete === "undefined" || isNaN(vlrBilhete) || vlrBilhete == 0 || vlrBilhete < 0 || !vlrBilhete.match(regra)) {
            setMensagemCadastro('Informe valor do bilhete (somente inteiros. Ex: 10, 25, 50')
            return;
        } 
        let vlrTotRifa = (parseInt(qtdBilhetes) * parseInt(vlrBilhete));
        console.log('vlrTotRifa - vlrMinimoTotalRifa: ' + vlrTotRifa + ' - ' + vlrMinimoTotalRifa)
        if (vlrTotRifa < vlrMinimoTotalRifa) {
            setMensagemCadastro('Valor total da rifa: ' + vlrTotRifa + ' , esta menor que o valor minimo aceito: ' + vlrMinimoTotalRifa);
            return;
        }
        let qtdRifasTotalUsuario = qtdRifasAtivasUsuario + qtdRifasALiberarUsuario
        console.log('qtdRifasTotalUsuario: ' + qtdRifasTotalUsuario)
        if (qtdRifasTotalUsuario == qtdLimiteRifasAtivas) {
            setMensagemCadastro('Voce ja atingiu o limite de rifas ativas ' + qtdLimiteRifasAtivas);
            return;
        }
        console.log('percAdministracao: ' + percAdministracao)
        console.log('percPgtoBilhete: ' + percPgtoBilhete)
        vlrTotalBilhetesPrevisto = qtdBilhetes * vlrBilhete;
        console.log('vlrTotalBilhetesPrevisto: ' + vlrTotalBilhetesPrevisto)
        vlrTotalTaxaAdministracaoPrevisto = vlrTotalBilhetesPrevisto * percAdministracao / 100;
        console.log('vlrTotalTaxaAdministracaoPrevisto: ' + vlrTotalTaxaAdministracaoPrevisto)
        vlrTotalTaxaBilhetesPrevisto = vlrTotalBilhetesPrevisto * percPgtoBilhete / 100;
        console.log('vlrTotalTaxaBilhetesPrevisto: ' + vlrTotalTaxaBilhetesPrevisto)
        let vlrTotalPixETaxasPrevisto = parseInt(vlrPremioPix) + vlrTotalTaxaAdministracaoPrevisto + vlrTotalTaxaBilhetesPrevisto;
        if (vlrTotalBilhetesPrevisto < vlrTotalPixETaxasPrevisto) {
            setMensagemCadastro('Valor total vendas, esta menor que a soma do premio Pix mais taxas');
            return;
        }
        gravarRifa();
    }

    async function gravarRifa() {
        console.log('gravarRifa')
        setMensagemCadastro('')
        var nomeImagem = 'pixlogo.jpg';
        var urlImagemCapa = 'https://firebasestorage.googleapis.com/v0/b/niapp100-6a8d8.appspot.com/o/imagensCapa%2Fpixlogo.jpg?alt=media&token=ffaa2efa-3806-43ee-95dd-0925bf891c30'
        vlrLiquidoAReceberResponsavelPrevisto = vlrTotalBilhetesPrevisto - vlrTotalTaxaAdministracaoPrevisto - vlrTotalTaxaBilhetesPrevisto - parseInt(vlrPremioPix);
        let dadosRifa = {
            titulo: 'Pix de R$: ' + vlrPremioPix,
            descricao: 'Um pix de R$: ' + vlrPremioPix,
            imagemCapa: urlImagemCapa,
            genero: 'Pix',
            uid: usuario.uid,
            cep: usuario.cep,
            cidade: usuario.cidade,
            uf: usuario.uf,
            bairro: usuario.bairro,
            nome: usuario.nome,
            email: usuario.email,
            nomeCapa: nomeImagem,
            post: 'imagemRifa',
            qtdBilhetes: parseInt(qtdBilhetes),
            autorizacao: autorizacao,
            vlrPremioPix: parseInt(vlrPremioPix),
            vlrBilhete: parseInt(vlrBilhete),
            percAdministracao: percAdministracao,
            percPgtoBilhete: percPgtoBilhete,
            vlrTotalBilhetesPrevisto: vlrTotalBilhetesPrevisto,
            vlrTotalTaxaAdministracaoPrevisto: vlrTotalTaxaAdministracaoPrevisto,
            vlrTotalTaxaBilhetesPrevisto: vlrTotalTaxaBilhetesPrevisto,
            vlrLiquidoAReceberResponsavelPrevisto: vlrLiquidoAReceberResponsavelPrevisto
        }
        console.log('ir para informar validar disponibilizacao')
        navigation.navigate('ValidarDisponibilizacao', dadosRifa);
    }

    return (
        <SafeAreaView style={estilos.safeArea}>
            <Texto>
                Valor do prêmio pix R$
            </Texto>
            <InputQtd
                autoCorrect={false}
                keyboardType="numeric"
                value={vlrPremioPix}
                onChangeText={(text) => setVlrPremioPix(text)}
            />
            <Texto>
                Qtd de bilhetes da rifa (10, 100 ou 1000)
            </Texto>
            <InputQtd
                autoCorrect={false}
                keyboardType="numeric"
                value={qtdBilhetes}
                onChangeText={(text) => setQtdBilhetes(text)}
            />
            <Texto>
                Valor do bilhete R$
            </Texto>
            <InputQtd
                autoCorrect={false}
                keyboardType="numeric"
                value={vlrBilhete}
                onChangeText={(text) => setVlrBilhete(text)}
            />
            <Texto>
                Autorização
            </Texto>
            <InputQtd
                autoCorrect={false}
                autoCaptalize='none'
                value={autorizacao}
                onChangeText={(text) => setAutorizacao(text)}
            />
            <TextoMensagemCadastro>
                {mensagemCadastro}
            </TextoMensagemCadastro>
            <Botao onPress={disponibilizarRifa}>
                {load ? (
                    <ActivityIndicator size={20} color='#FFF' />
                ) : (
                    <Text>Disponibilizar Rifa</Text>
                )
                }
            </Botao>
        </SafeAreaView>
    );
}
