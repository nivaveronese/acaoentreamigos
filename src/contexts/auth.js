import React, {useState, createContext, useEffect} from 'react';
import { Keyboard } from 'react-native';
import { auth, db } from "../config/firebase";
import {doc, getDoc} from 'firebase/firestore';
import { sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export const AuthContext = createContext({});

function AuthProvider({children}){

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const navigation = useNavigation();

    var flagErroAcessar = false;
    var flagErroEnviar = false;
 
    console.log('context/auth.js');
 
    useEffect(() => {
        async function loadStorage(){
            console.log('loadStorage');
            const storageUser = await AsyncStorage.getItem('Auth_user');
            if (storageUser){
                setUser(JSON.parse(storageUser));
                setLoading(false);
            }
            setLoading(false);
        }
        loadStorage();
    },[]);

    async function signIn(email,password){
        console.log('signIn - validar login');
        Keyboard.dismiss();
        setLoadingAuth(true);
        const resultado = await signInWithEmailAndPassword(auth, email, password)
        .then(async (value) => {
            let uid = value.user.uid;
            console.log('signIn - then: ' + uid);
            const emailVerificado = value.user.emailVerified;
            if(!emailVerificado){
                await enviarEmailVerificacao()
                setLoadingAuth(false);
                if(flagErroEnviar){
                    console.log('erro enviar email verificação')
                    return 'erro';
                } else {
                    console.log('email verificação enviado com sucesso')
                    return 'erro-emailnaoverificado';
                }
            }
            console.log('vai obterUsuario')
            await obterUsuario(uid);
            console.log('flagErroAcessar' + flagErroAcessar)
            if(flagErroAcessar){
                console.log('erro acessar usuário: ' + uid + '-' + email)
                let dados = {
                    uid: uid,
                    email: email
                }
                navigation.navigate('AlterarConta', dados)
            } else {
                console.log('sucesso acessar usuário')
                return 'sucesso';
            }
        }) 
        .catch((error) => {
            if(error.code === 'auth/invalid-email'){
              console.log('Opsauth-Email inválido');
            } else if(error.code === 'auth/user-not-found'){
                console.log('Opsauth-Email não cadastrado');
            } else if(error.code === 'auth/wrong-password'){
                console.log('Opsauth-Senha inválida');
            } else if(error.code === 'auth/weak-password'){
                console.log('Opsauth-Senha deve ter no mínimo, 6 caracteres');
            } else {
            console.log('Opsauth-Algo deu errado em acessar conta ' + error.code);
                    }
            setLoadingAuth(false);
            console.log('erro catch signIn')
            return 'erro';        
          })
          return resultado;
    }
 
    async function obterUsuario(uid){ 
        console.log('obterUsuario: ' + uid);
        const docRef = doc(db, "usuarios", `${uid}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data().nome);
          let data = {
            uid:  docSnap.data().uid,
            nome: docSnap.data().nome,
            cep: docSnap.data().cep,
            cidade: docSnap.data().cidade,
            uf: docSnap.data().uf, 
            bairro: docSnap.data().bairro,                  
            email: docSnap.data().email,
            anoNascimento: docSnap.data().anoNascimento,
            perfil: docSnap.data().perfil,
            imagemAvatar: docSnap.data().imagemAvatar,
            numeroSorte: docSnap.data().numeroSorte
            }
        setUser(data);
        storageUser(data);
        } else {
          console.log("No such document!");
          setUser(null);
          flagErroAcessar = true;  
         }
        setLoadingAuth(false);
    }
 
        async function enviarEmailVerificacao(){
            console.log('enviarEmailVerificacao')
            await sendEmailVerification(auth.currentUser)
            .then(() => {
                flagErroEnviar = false; 
            })
            .catch((error) => {
                console.log('Ops, Algo deu errado em enviarEmailValidacao ' + error.message);
                flagErroEnviar = true; 
            });
        }

    async function storageUser(data){
        console.log('storageUser');
        await AsyncStorage.setItem('Auth_user', JSON.stringify(data));
        return;
    }

    async function signOut(){
        console.log('signOut');
        await auth.signOut();
        await AsyncStorage.clear()
        .then(() => {
            setUser(null);
        })
        return;
    }

    async function esqueceuSenha(email){
        console.log('auth.js - esqueceuSenha: ' + email);
        Keyboard.dismiss();
        setLoadingAuth(true);
        const resultado = await sendPasswordResetEmail(auth, email)
        .then(async (value) => {
            return 'sucesso';
        })
        .catch((error) => {
            if(error.code === 'auth/invalid-email'){
                return 'Email inválido';
            } else if(error.code === 'auth/user-not-found'){
                return 'Email não cadastrado';
            } else if(error.code === 'auth/wrong-password'){
                return 'Senha inválida';
            } else if(error.code === 'auth/weak-password'){
                return 'Senha deve ter no mínimo, 6 caracteres';
            } else {
            return 'Erro envio email'; 
            }       
          })
          setLoadingAuth(false);
          return resultado;
    }

    return(
        <AuthContext.Provider value={{signed: !!user, user, loading, signIn, signOut, esqueceuSenha,
                                      loadingAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;