import React, { useState, useContext } from 'react';
import {
  ActivityIndicator, Text, View, Keyboard, SafeAreaView, Image,
  StyleSheet, TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/auth';
import Botao from '../../componentes/Botao';
import estilos from '../../estilos/estilos';
import { Texto, Input, AreaSenha } from './styles';
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
import Feather from 'react-native-vector-icons/Feather';

export default function SignIn() {

  console.log('SignIn');

  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loadingAuth, esqueceuSenha } = useContext(AuthContext);
  const [mensagemLogin, setMensagemLogin] = useState('');
  const [visivel, setVisivel] = useState(true);
  const [show, setShow] = useState(false);

  async function handleLogin() {
    console.log('handleLogin');
    setMensagemLogin('');
    Keyboard.dismiss();
    if (!emailRegex.test(email)) {
      setMensagemLogin('Digite corretamente seu email. Verifique também a conexão com a internet. Tente novamente.');
    } else if (password == '') {
      setMensagemLogin('Digite sua senha');
    } else if (password.length < 6) {
      setMensagemLogin('Senha deve ter no mínimo 6 caracteres');
    } else {
      const resultado = await signIn(email, password);
      if (resultado == 'erro') {
        setMensagemLogin('Email ou senha incorretos. Verifique também a conexão com a internet. Tente novamente.')
      } else if (resultado == 'erro-emailnaoverificado') {
        setMensagemLogin('Você ainda não confirmou a validação do seu email. Enviamos para sua caixa de entrada, um email com o título "Verifique seu e-mail do app Acao entre amigos". Se não encontrar, verifique o spam.')
      } else {
        setMensagemLogin('')
      }
    }
  }

  async function esqueciSenha() {
    console.log('esqueciSenha');
    setMensagemLogin('');
    Keyboard.dismiss();
    if (email == '') {
      setMensagemLogin('Digite seu email');
    } else if (!emailRegex.test(email)) {
      setMensagemLogin('Digite corretamente seu email');
    } else {
      const resultado = await esqueceuSenha(email);
      if (resultado == 'sucesso') {
        setMensagemLogin('Email enviado com sucesso')
      } else {
        setMensagemLogin(resultado)
      }
    }
  }

  return (
      <SafeAreaView style={estilos.safeArea}>
        <View style={estilos.areaLogo}>
          <Image style={estilos.logo} source={require('../../assets/acaoentreamigos3.jpeg')} />
        </View>
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
          <TouchableOpacity style={stilo.btnOlho} onPress={
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
        <View style={estilos.areaLink}>
          <TouchableOpacity style={estilos.link} onPress={() => esqueciSenha()}>
            <Text style={estilos.linkText}>Esqueci a senha</Text>
          </TouchableOpacity>
        </View>
        <View style={estilos.areaMensagemLogin}>
          <Text style={estilos.textoMensagemLogin}>
            {mensagemLogin}
          </Text>
        </View>
        <Botao onPress={() => handleLogin()}>
          {loadingAuth ? (
            <ActivityIndicator size={20} color='#FFF' />
          ) : (
            <Text>Acessar</Text>
          )
          }
        </Botao>
        <View style={estilos.areaLink}>
          <TouchableOpacity style={estilos.link} onPress={() => navigation.navigate('TermoDeUso')}>
            <Text style={estilos.linkText}>Criar conta</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
  );
}
const stilo = StyleSheet.create({
  btnOlho: {
    position: 'absolute',
    right: 10,
    top: 10
  }
});