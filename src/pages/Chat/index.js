import React, { useContext, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { Text } from 'react-native';
import {GiftedChat,InputToolbar} from 'react-native-gifted-chat';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../config/firebase';
import {collection, addDoc, onSnapshot, query, orderBy} from 'firebase/firestore';
import { AuthContext } from '../../contexts/auth';

export default function Chat() {
    console.log('Chat')
    const navigation = useNavigation();
    const route = useRoute(); 
    const [messages, setMessages] = useState([]);
    const refChat =  'chat-' + `${route.params?.titulo}` + '-' + `${route.params?.id}`;
    const { user } = useContext(AuthContext);
    
useEffect(() => {
    async function getMessages(){
        console.log('useEffect')
        const values = query(collection(db,refChat),orderBy('createdAt','desc'))
        onSnapshot(values,(snapshot) => setMessages(
            snapshot.docs.map(doc => ({
                _id: doc.data()._id,
                createdAt: doc.data().createdAt.toDate(),
                text: doc.data().text,
                user: doc.data().user,
            }))
        ));
    }
    getMessages();
}, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: (props) => (
                <Text {...props} style={{color: 'white', fontWeight: 'bold'}}>
                  Rifa: {route.params?.titulo}
                </Text>
              ),
              headerStyle: {
                backgroundColor: '#008080', 
              },   
        })
    })

    useLayoutEffect(() => {
            const collectionRef = collection(db, refChat)
            const q = query(collectionRef, orderBy('createdAt', 'desc'));
            const unsubscribe = onSnapshot(q, snapshot => {
                console.log('snapshot')
                setMessages(
                    snapshot.docs.map(doc => ({
                        _id: doc.id,
                        createdAt: doc.data().createdAt.toDate(),
                        text: doc.data().text,
                        user: doc.data().user,
                }))
            )
        });
        return unsubscribe();
    }, []);

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages,messages));
        const {_id,createdAt, text, user} = messages[0];
        addDoc(collection(db, refChat), {
            _id,
            createdAt,
            text,
            user
        });
    }, []);

    return (        
        <GiftedChat 
            messages={messages}
            showAvatarForEveryMessage={true}
            showUserAvatar={true}
            renderUsernameOnMessage={true}
            onSend={messages => onSend(messages)}
            user={{
                _id: user.uid,
                avatar: user.imagemAvatar,
                name: user.nome,
            }}
            renderInputToolbar={(props) => (
                <InputToolbar {...props} containerStyle={{backgroundColor: '#008080'}} />
              )}
        />        
    )
} 
 