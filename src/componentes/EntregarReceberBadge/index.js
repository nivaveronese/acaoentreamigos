import React, {useContext, useEffect, useState } from 'react';
import {Text,View,TouchableOpacity, StyleSheet,Image} from 'react-native';
import { obtemQtdRifasNaoLiberadas } from '../../servicos/firestore';
import { AuthContext } from '../../contexts/auth';
import { useNavigation } from '@react-navigation/native';
import Icone from 'react-native-vector-icons/MaterialCommunityIcons';

export default function EntregarReceberBadge() {
     console.log('EntregarReceberBadge')
    const [badgeCountNaoLiberada,setBadgeCountNaoLiberada] = useState(0);
    const { user: usuario } = useContext(AuthContext);
    const navigation = useNavigation();
 
    useEffect(() => {
        async function qtdRifasAEntregarReceber() {
            console.log('qtdRifasAEntregarReceber')
            const qtdRifasNaoLiberadas = await obtemQtdRifasNaoLiberadas(usuario.uid)
            setBadgeCountNaoLiberada(qtdRifasNaoLiberadas);            
        }
        qtdRifasAEntregarReceber()
    }, []) 
  
    function RifasNaoLiberadas() {
        console.log('navega NaoLiberada')
        //navigation.navigate('NaoLiberada');
    }    
 
    return (
            <View style={styles.areaEntregarReceber}>
                <Text style={styles.texto}>
                    Rifas disponíveis
                </Text>
                { badgeCountNaoLiberada > 0 ?
                    <TouchableOpacity style={styles.botaoAEntregar} onPress={RifasNaoLiberadas}>
                        <View style={styles.dot}>
                            <Text style={styles.dotTexto}>
                                {badgeCountNaoLiberada}
                            </Text>
                        </View>
                        <Icone name="book-remove-outline" size={20} color="#000" />
                    </TouchableOpacity>     
                :
                    null    
                }                
            </View>
      )
  } 
 
const styles = StyleSheet.create({
    areaEntregarReceber:{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 5
     },
    botaoAEntregar:{ 
        marginTop: 10,
        marginLeft: 40,
    },
    dot:{
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor: '#7FFF00',
        width: 13,
        height: 13,
        borderRadius: 10,
        position: 'absolute',
        zIndex: 99, 
        bottom: 18,    
        left: 15,
    },
    dotTexto:{
        fontSize: 10,
        color: '#000',
        fontWeight: 'bold',
        fontFamily: 'roboto'
    },
    texto:{
        fontSize: 25,
        color: '#000',
        fontFamily: 'roboto',
        marginLeft: 15,
        fontStyle: 'italic',
    },
    capa: {
        height: 70,
        width: '100%',
    }
})  