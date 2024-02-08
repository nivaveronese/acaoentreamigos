import React, { useState, useContext, useEffect } from 'react';
import { Platform, Keyboard, ScrollView, Image, StyleSheet, View, Text, ActivityIndicator, KeyboardAvoidingView, TouchableOpacity }
    from 'react-native';
import { AreaCep, TextoCep, TextoPerfil, Texto, Input, InputAno, AreaAvatar } from '../../pages/CriarConta/styles';
import apicep from '../../servicos/apicep';
import { db } from '../../config/firebase';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import estilos from '../../estilos/estilos';
import Botao from '../../componentes/Botao';
import { TextInputMask } from 'react-native-masked-text';
import avatar from '../../assets/avatar.jpg';
import { salvaImagemAvatar } from '../../servicos/storage';
import ImagePicker from 'react-native-image-crop-picker';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/auth';
//import messaging from '@react-native-firebase/messaging';

export default function AlterarConta() {
    console.log('AlterarConta')
    const [nome, setNome] = useState('');
    const [nomeAnterior, setNomeAnterior] = useState('');
    const [anoNascimento, setAnoNascimento] = useState('')
    const [cep, setCep] = useState('');
    const [cepAnterior, setCepAnterior] = useState('');
    const [mensagemCadastro, setMensagemCadastro] = useState('');
    const [loading, setLoading] = useState(false);
    const [imagemAvatar, setImagemAvatar] = useState('');
    const [imagemNovaAvatar, setImagemNovaAvatar] = useState('');
    const route = useRoute();
    const navigation = useNavigation();
    const [contaAlterada, setContaAlterada] = useState(false);
    const { user, signOut } = useContext(AuthContext);
    const [uid, setUid] = useState('');
    const [email, setEmail] = useState('');
    const [perfil, setPerfil] = useState('');
    const [numeroSorte, setNumeroSorte] = useState(0);
    const [situacao, setSituacao] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [distrito, setDistrito] = useState('');
    const [cepNumerico, setCepNumerico] = useState(0);
    const [cepValido, setCepValido] = useState(false);
    const dataAtual = new Date();
    const anoAtual = dataAtual.getFullYear();
    const menorAnoNascimento = parseInt(anoAtual) - 18;
    const maiorAnoNascimento = parseInt(anoAtual) - 99;
    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
    );

    var localidade = '';
    var uf = '';
    var bairro = '';
    var token = '';


    console.log('AlterarConta:' + user.email);

    useEffect(() => {
        async function carregarDadosConta() {
            console.log('carregarDadosConta')
            setContaAlterada(false)
            setLoading(true)
            if (user) {
                const docRef = doc(db, "usuarios", `${user.uid}`);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setPerfil(docSnap.data().perfil)
                    setSituacao(docSnap.data().situacao)
                    if (typeof docSnap.data().numeroSorte === "undefined") {
                        let numero_sorte = Math.floor(Math.random() * (99999 - 0 + 1)) + 0;
                        setNumeroSorte(numero_sorte);
                    } else {
                        setNumeroSorte(docSnap.data().numeroSorte)
                    }
                }
                setNome(user.nome)
                setNomeAnterior(user.nome)
                setCep(user.cep)
                setCepAnterior(user.cep)
                setAnoNascimento(user.anoNascimento)
                setCepNumerico(user.cep)
                setCidade(user.cidade)
                setEstado(user.uf)
                setDistrito(user.bairro)
                setImagemAvatar(user.imagemAvatar)
                setUid(user.uid)
                setEmail(user.email)
                setCepValido(true)
            } else {
                setUid(route.params?.uid)
                setEmail(route.params?.email)
            }
            setLoading(false)
        }
        carregarDadosConta()
    }, [])

    async function obterAvatarGaleria() {
        console.log('obterAvatarGaleria')
        setMensagemCadastro('')
        ImagePicker.openPicker({
            width: 400,
            height: 400,
            cropping: true,
            compressImageQuality: 0.9
        }).then(image => {
            if (image.size > 614488) {
                setMensagemCadastro('Tamanho da foto maior que o permitido')
                return
            }
            setImagemNovaAvatar(image.path);
            setImagemAvatar(image.path);
        })
            .catch(error => {
                setMensagemCadastro('Ops, erro ao selecionar foto do perfil')
            });
    }

    async function validarAlteracaoConta() {
        console.log('validarAlteracaoConta');
        setContaAlterada(false)
        Keyboard.dismiss();
        setMensagemCadastro('')
        if (nome == '' || nome.length === 0) {
            setMensagemCadastro('Digite seu nome');
        } else if (!cep) {
            setMensagemCadastro('Digite corretamente seu cep')
            setCidade('')
            setEstado('')
            setDistrito('')
        } else if (parseInt(anoNascimento) < parseInt(maiorAnoNascimento) || parseInt(anoNascimento) > parseInt(menorAnoNascimento)) {
            setMensagemCadastro('Idade deve estar entre 18 e 99');
        } else {
            CriarUsuario();
        }
    }

    async function obterCep() {
        console.log('obterCep: ' + cep)
        setMensagemCadastro('')
        setCepValido(false)
        if (cep == 0 || cep.length == 0) {
            console.log('obterCep-cep zero ou tamanho zero')
            setMensagemCadastro('Digite corretamente seu cep')
            setCidade('')
            setEstado('')
            setDistrito('')
            return;
        }
        let cepNumericoAux = cep.replace(/[^0-9]/g, "")
        localidade = '';
        uf = '';
        bairro = '';
        console.log('cepNumericoAux: ' + cepNumericoAux)
        if (!cepNumericoAux) {
            setMensagemCadastro('Digite seu cep');
            setCidade('')
            setEstado('')
            setDistrito('')
            return
        }
        try {
            setLoading(true)
            const response = await apicep.get(`/${cepNumericoAux}/json`);
            if (response.data.erro) {
                localidade = '';
                uf = '';
                bairro = '';
                setMensagemCadastro('Cep não localizado');
                setCidade('')
                setEstado('')
                setDistrito('')
                setLoading(false)
                return;
            }
            setCepValido(true)
            localidade = response.data.localidade;
            uf = response.data.uf;
            bairro = response.data.bairro;
            if (!bairro) {
                bairro = 'Centro';
            }
            console.log('localidade: ' + localidade)
            setCepNumerico(cepNumericoAux)
            setCidade(localidade)
            setEstado(uf)
            setDistrito(bairro)
            setLoading(false)
        } catch (error) {
            console.log('erro cep: ' + error.code);
            localidade = '';
            uf = '';
            bairro = '';
            setMensagemCadastro('Falha consultar cep-digite corretamente. Verifique sua conexão de internet');
            setCidade('')
            setEstado('')
            setDistrito('')
            setLoading(false)
            return;
        }
    }

    async function CriarUsuario() {
        console.log('CriarUsuario: ' + email + '-' + uid)
        var dataLogin = Timestamp.fromDate(new Date());
        if (!cepValido) {
            console.log('CriarUsuario-cep invalido')
            setMensagemCadastro('Digite corretamente seu cep')
            setCidade('')
            setEstado('')
            setDistrito('')
            return;
        }
        if (email == 'ni.veronese@gmail.com') {
            setPerfil('adm')
        } else {
            setPerfil ('usu')
        }
        //try {
        //    const authStatus = await messaging().requestPermission();
        //    const enabled =
        //        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        //        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        //    if (enabled) {
        //        token = await messaging().getToken();
        //    }
        //} catch (error) {
        //    console.log('Ops, Algo deu errado em requerer permissao mensagens/obter token ' + error.message);
        //}
        if (imagemNovaAvatar) {
            console.log('nova imagem avatar')
            setLoading(true)
            const urlImagemAvatar = await salvaImagemAvatar(imagemAvatar, email);
            if (!urlImagemAvatar) {
                setMensagemCadastro('Ops, foto do perfil não conseguiu ser gravada. Verifique sua conexão de internet')
                setLoading(false)
                return
            }
            const data = {
                uid: uid,
                nome: nome,
                cep: cepNumerico,
                cidade: cidade,
                uf: estado,
                bairro: distrito,
                email: email,
                anoNascimento: anoNascimento,
                imagemAvatar: urlImagemAvatar,
                perfil: perfil,
                situacao: situacao,
                dataUltimoLogin: dataLogin,
                tokenNotificacoes: token,
                numeroSorte: numeroSorte
            }
            try {
                await setDoc(doc(db, "usuarios", `${uid}`), data)
                if (cepAnterior !== cep || nomeAnterior !== nome) {
                    alterarCepLivrosDisponiveis(data)
                } else {
                    setMensagemCadastro('Ao término da atualização, você será direcionado para o login')
                    await delay(3000);
                    setLoading(false)
                    sair();
                }
            } catch (error) {
                console.log('Ops, Algo deu errado em criarUsuarioImagem ' + error.message);
                setMensagemCadastro('Falha alterar usuário (novo avatar). Verifique sua conexão de internet');
                setLoading(false)
                return;
            }
        } else {
            setLoading(true)
            console.log('nao alterou imagem avatar')
            const data = {
                uid: uid,
                nome: nome,
                cep: cepNumerico,
                cidade: cidade,
                uf: estado,
                bairro: distrito,
                email: email,
                anoNascimento: anoNascimento,
                imagemAvatar: imagemAvatar,
                perfil: perfil,
                situacao: situacao,
                dataUltimoLogin: dataLogin,
                tokenNotificacoes: token,
                numeroSorte: numeroSorte
            }
            try {
                console.log(data)
                await setDoc(doc(db, "usuarios", `${uid}`), data)
                if (cepAnterior !== cep || nomeAnterior !== nome) {
                    alterarCepLivrosDisponiveis(data)
                } else {
                    setMensagemCadastro('Ao término da atualização, você será direcionado para o login')
                    await delay(3000);
                    setLoading(false)
                    sair();
                }
            } catch (error) {
                console.log('Ops, Algo deu errado em criarUsuario-sem alterar avatar ' + error.message);
                setMensagemCadastro('Falha alterar usuário (mesmo avatar). Verifique sua conexão de internet');
                setLoading(false)
                return;
            }
        }
    }

    async function sair() {
        console.log('sair')
        signOut();
        navigation.navigate('SignIn');
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={90}
            style={estilos.safeArea}>
            <ScrollView>
                <AreaAvatar>
                    <TouchableOpacity style={estilos.imagemAvatar}
                        onPress={() => obterAvatarGaleria()}>
                        <Image source={imagemAvatar ? { uri: imagemAvatar } : avatar}
                            resizeMode={"cover"}
                            style={estilos.imagemAvatar} />
                    </TouchableOpacity>
                </AreaAvatar>
                <TextoPerfil>
                    {email}
                </TextoPerfil>
                <Texto>
                    Nome
                </Texto>
                <Input
                    autoCorrect={false}
                    autoCaptalize='none'
                    value={nome}
                    onChangeText={(text) => setNome(text)}
                />
                <Texto>
                    Cep
                </Texto>
                <AreaCep>
                    <TextInputMask
                        style={styles.inputMascaradosCep}
                        type={'zip-code'}
                        placeholder='Ex: 14400-600'
                        keyboardType="numeric"
                        value={cep}
                        onChangeText={(text) => setCep(text)}
                        onBlur={obterCep}
                    />
                    <TextoCep> {cidade} {estado} {distrito} </TextoCep>
                </AreaCep>
                <Texto>
                    Ano nascimento
                </Texto>
                <InputAno
                    autoCorrect={false}
                    autoCaptalize='none'
                    keyboardType="numeric"
                    value={anoNascimento}
                    onChangeText={(text) => setAnoNascimento(text)}
                />
                <View style={estilos.areaMensagemCadastro}>
                    <Text style={estilos.textoMensagemCadastro}>
                        {mensagemCadastro}
                    </Text>
                </View>
                {
                    contaAlterada ?
                        <Botao onPress={sair}>
                            <Text>Ok</Text>
                        </Botao>
                        :
                        <Botao onPress={validarAlteracaoConta}>
                            {loading ? (
                                <ActivityIndicator size={20} color='#FFF' />
                            ) : (
                                <Text>Alterar conta</Text>
                            )
                            }
                        </Botao>
                }
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({
    inputMascaradosCep: {
        width: '35%',
        borderWidth: 1,
        borderColor: '#D3D3D3',
        fontSize: 15,
        marginBottom: 5,
        padding: 10,
        borderRadius: 5,
        color: '#333',
        fontFamily: 'roboto',
    },
});