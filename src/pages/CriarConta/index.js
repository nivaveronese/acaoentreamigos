import React, { useState } from 'react';
import { Image, StyleSheet, View, Text, ActivityIndicator, Keyboard, TouchableOpacity, KeyboardAvoidingView, Platform }
    from 'react-native';
import { TextoCep, AreaCep, Texto, Input, InputAno, AreaSenha, AreaAvatar } from './styles';
import apicep from '../../servicos/apicep';
import { auth, db } from '../../config/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import estilos from '../../estilos/estilos';
import Feather from 'react-native-vector-icons/Feather';
import Botao from '../../componentes/Botao';
import { TextInputMask } from 'react-native-masked-text';
import avatar from '../../assets/avatar.jpg';
import { salvaImagemAvatar } from '../../servicos/storage';
import ImagePicker from 'react-native-image-crop-picker';
import { ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';

export default function CriarConta({ navigation }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmada, setPasswordConfirmada] = useState('');
    const [cep, setCep] = useState('');
    const [anoNascimento, setAnoNascimento] = useState('');
    const [mensagemCadastro, setMensagemCadastro] = useState('');
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const [loading, setLoading] = useState(false);
    const [emailEnviado, setEmailEnviado] = useState(false);
    const [visivel, setVisivel] = useState(true);
    const [show, setShow] = useState(false);
    const [imagemAvatar, setImagemAvatar] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [distrito, setDistrito] = useState('');
    const [cepNumerico, setCepNumerico] = useState(0);
    const [urlImagemAvatar, setUrlImagemAvatar] = useState('');
    const [cepValido, setCepValido] = useState(false);
    const dataAtual = new Date();
    const anoAtual = dataAtual.getFullYear();
    const menorAnoNascimento = parseInt(anoAtual) - 18;
    const maiorAnoNascimento = parseInt(anoAtual) - 99;

    var localidade = '';
    var uf = '';
    var bairro = '';
    var urlImagemAvatarNova = '';
    var token = '';

    console.log('CriarConta');

    async function obterAvatarGaleria() {
        console.log('obterAvatarGaleria')
        setMensagemCadastro('')
        setImagemAvatar('')
        ImagePicker.openPicker({
            width: 400,
            height: 400,
            cropping: true,
            compressImageQuality: 0.9
        }).then(image => {
            console.log(image);
            if (image.size > 614488) {
                setMensagemCadastro('Tamanho da foto maior que o permitido')
                return
            }
            setImagemAvatar(image.path);
        })
            .catch(error => {
                console.log(error)
                setMensagemCadastro('Ops, erro ao selecionar foto do perfil')
            });
    }

    async function validarCriacaoConta() {
        console.log('validarCriacaoConta: ' + localidade);
        Keyboard.dismiss();
        setMensagemCadastro('')
        if (!emailRegex.test(email)) {
            setMensagemCadastro('Digite corretamente seu email');
            return;
        } else if (password == '') {
            setMensagemCadastro('Digite sua senha');
            return;
        } else if (password.length < 6) {
            setMensagemCadastro('Senha deve ter no mínimo 6 caracteres');
            return;
        } else if (password != passwordConfirmada) {
            setMensagemCadastro('Senha confirmada deve ser igual a senha');
            return;
        } else if (nome == '' || nome.length === 0) {
            setMensagemCadastro('Digite seu nome');
            return;
        } else if (!cep || cep == 0) {
            console.log('validarCriacaoConta-cep nao informado ou zero')
            setMensagemCadastro('Digite corretamente seu cep')
            setCidade('')
            setEstado('')
            setDistrito('')
            return;
        } else if (!cepValido) {
            console.log('validarCriacaoConta-cep invalido')
            setMensagemCadastro('Digite corretamente seu cep')
            setCidade('')
            setEstado('')
            setDistrito('')
            return;
        } else if (!anoNascimento || isNaN(anoNascimento) || parseInt(anoNascimento) < parseInt(maiorAnoNascimento) || parseInt(anoNascimento) > parseInt(menorAnoNascimento)) {
            setMensagemCadastro('Digite corretamente ano nascimento (idade deve estar entre 18 e 99)');
            return;
        } else { criarContaUsuario(); }
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
            console.log('obterCep-cep numerico aux invalido')
            setMensagemCadastro('Digite seu cep');
            setCidade('')
            setEstado('')
            setDistrito('')
            return
        }
        try {
            console.log('cepNumericoAux no try: ' + cepNumericoAux)
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
            setMensagemCadastro('Falha consultar cep-informe corretamente. Verifique sua conexão de internet');
            setCidade('')
            setEstado('')
            setDistrito('')
            setLoading(false)
            return;
        }
    }

    async function criarContaUsuario() {
        console.log('criarContaUsuario')
        var dataLogin = Timestamp.fromDate(new Date());
        if (!cepValido) {
            console.log('criarContaUsuario-cep invalido')
            setMensagemCadastro('Digite corretamente seu cep')
            setCidade('')
            setEstado('')
            setDistrito('')
            return;
        }
        setUrlImagemAvatar('')
        setLoading(true)
        await createUserWithEmailAndPassword(auth, email, password)
            .then(async (value) => {
                if (imagemAvatar) {
                    let nomeAvatar = email;
                    urlImagemAvatarNova = await salvaImagemAvatar(imagemAvatar, nomeAvatar);
                    if (!urlImagemAvatarNova) {
                        setMensagemCadastro('Ops, foto do perfil não conseguiu ser gravada. Tente novamente')
                        setLoading(false)
                        return
                    } else {
                        setUrlImagemAvatar(urlImagemAvatarNova)
                    }
                }
                console.log('fim salvar imagem')
                let uid = value.user.uid;
                console.log('urlImagemAvatar: ' + urlImagemAvatar);
                try {
                    const authStatus = await messaging().requestPermission();
                    const enabled =
                        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
                    if (enabled) {
                        token = await messaging().getToken();
                    }
                 }
                catch (error) {
                    console.log('Ops, Algo deu errado em requerer permissao mensagens/obter token ' + error.message);
                }
                let numero_sorte = Math.floor(Math.random() * (99999 - 0 + 1)) + 0;
                let data = {
                    uid: uid,
                    nome: nome,
                    anoNascimento: anoNascimento,
                    cep: cepNumerico,
                    cidade: cidade,
                    uf: estado,
                    bairro: distrito,
                    email: email,
                    perfil: 'usu',
                    imagemAvatar: urlImagemAvatarNova,
                    situacao: 'ativo',
                    dataUltimoLogin: dataLogin,
                    tokenNotificacoes: token,
                    numeroSorte: numero_sorte
                }
                await criarUsuario(data);
            })
            .catch((error) => {
                setLoading(false);
                if (error.code === 'auth/invalid-email') {
                    setMensagemCadastro('Email inválido');
                    return
                }
                if (error.code === 'auth/email-already-in-use') {
                    setMensagemCadastro('Email já cadastrado');
                    return
                }
                if (error.code === 'auth/wrong-password') {
                    setMensagemCadastro('Senha inválida');
                    return
                }
                if (error.code === 'auth/weak-password') {
                    setMensagemCadastro('Senha deve ter no mínimo 6 dígitos');
                    return
                } else {
                    console.log('Erro createUserWithEmailAndPassword: ' + error.message)
                    setMensagemCadastro('Falha criar conta email');
                    return
                }
            })
    }

    async function criarUsuario(data) {
        console.log('criarUsuario: ' + data.uid);
        let uid = data.uid;
        try {
            await setDoc(doc(db, "usuarios", `${uid}`), data);
        } catch (error) {
            console.log('Ops, Algo deu errado em criarUsuario ' + error.message);
            setMensagemCadastro('Falha criar usuário');
            setLoading(false)
            return;
        }
        await enviarEmailVerificacao();
    }

    async function enviarEmailVerificacao() {
        console.log('enviarEmailVerificacao')
        await sendEmailVerification(auth.currentUser)
            .then(() => {
                setEmailEnviado(true)
                setNome('')
                setAnoNascimento('')
                setEmail('')
                setPassword('')
                setPasswordConfirmada('')
                setCep('')
                setCidade('')
                setEstado('')
                setDistrito('')
                setMensagemCadastro('Enviamos um email com o título "Verifique seu e-mail do app Acao entre amigos". Se não encontrar, verifique o spam.');
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false)
                console.log('Ops, Algo deu errado em enviarEmailValidacao ' + error.code);
                setMensagemCadastro('Falha enviar email de verificação');
            });
    }

    async function sair() {
        console.log('sair')
        setLoading(true)
        await auth.signOut();
        setLoading(false)
        navigation.navigate('SignIn');
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={80}
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
                    <Texto>
                        Email
                    </Texto>
                    <Input
                        autoCorrect={false}
                        autoCaptalize='none'
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        keyboardType="email-address"
                    />
                    <Texto>
                        Senha
                    </Texto>
                    <AreaSenha>
                        <Input
                            autoCorrect={false}
                            autoCaptalize='none'
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry={visivel}
                            maxLength={20}
                        />
                        <TouchableOpacity style={styles.btnOlho} onPress={
                            () => {
                                setVisivel(!visivel)
                                setShow(!show)
                            }
                        }>
                            <Feather
                                name={show === false ? 'eye' : 'eye-off'}
                                size={25}
                                color='#DCDCDC'
                            />
                        </TouchableOpacity>
                    </AreaSenha>
                    <Texto>
                        Confirme sua senha
                    </Texto>
                    <AreaSenha>
                        <Input
                            autoCorrect={false}
                            autoCaptalize='none'
                            value={passwordConfirmada}
                            onChangeText={(text) => setPasswordConfirmada(text)}
                            secureTextEntry={visivel}
                            maxLength={20}
                        />
                        <TouchableOpacity style={styles.btnOlho} onPress={
                            () => {
                                setVisivel(!visivel)
                                setShow(!show)
                            }
                        }>
                            <Feather
                                name={show === false ? 'eye' : 'eye-off'}
                                size={25}
                                color='#DCDCDC'
                            />
                        </TouchableOpacity>
                    </AreaSenha>
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
                        Ano de nascimento
                    </Texto>
                    <InputAno
                        autoCorrect={false}
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
                        emailEnviado ?
                            <Botao onPress={sair}>
                                <Text>Ok</Text>
                            </Botao>
                            :
                            <Botao onPress={validarCriacaoConta}>
                                {loading ? (
                                    <ActivityIndicator size={20} color='#FFF' />
                                ) : (
                                    <Text>Criar conta</Text>
                                )
                                }
                            </Botao>
                    }
                </ScrollView>
            </KeyboardAvoidingView>
        </GestureHandlerRootView>
    );
}
const styles = StyleSheet.create({
    inputMascaradosCep: {
        width: '40%',
        borderWidth: 1,
        borderColor: '#D3D3D3',
        fontSize: 15,
        marginBottom: 5,
        padding: 10,
        borderRadius: 5,
        color: '#333',
        fontFamily: 'roboto',
    },
    btnOlho: {
        position: 'absolute',
        right: 18,
        top: 3
    }
});