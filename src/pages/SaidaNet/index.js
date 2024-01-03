import React from 'react';
import { StyleSheet, useWindowDimensions } from "react-native";
import { WebView } from 'react-native-webview';
import { useRoute } from '@react-navigation/native';
 
export default function SaidaNet() {
    const { width } = useWindowDimensions();
    const route = useRoute();
    console.log('pages/SaidaNet ' + route.params?.link);

        return (
          <WebView style={styles.container}
            source={{uri: route.params?.link}}
          />
        );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '10%'
    }
}) 