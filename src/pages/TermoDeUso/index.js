import React, { useState } from 'react';
import { View, Text, StatusBar, ScrollView, useWindowDimensions } from 'react-native';
import styles from './styles';
import Progresso from '../../componentes/Progresso';

export default function TermoDeUso({ navigation }) {
    const [percentage, setPercentage] = useState(0);
    const dimensions = useWindowDimensions();

    function scrollPercentage({ contentOffset, contentSize, layoutMeasurement }) {
        const visibleContent = Math.ceil((dimensions.height / contentSize.height) * 100)
        const value = Math.ceil(((layoutMeasurement.height + contentOffset.y) / contentSize.height) * 100)
        setPercentage(value < visibleContent ? 0 : value)
    }

    function concordarTermoUso() {
        navigation.navigate('CriarConta');
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#131313' barStyle='light-content' />
            <Text style={styles.subTitulo}>Termos de uso - Leia até o final</Text>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
                onScroll={(event) => scrollPercentage(event.nativeEvent)}
            >
                <Text style={styles.texto}>
                    Olá,
                    </Text>
                <Text style={styles.texto}>
                    Por meio deste documento, são estabelecidos os termos e as condições gerais para a utilização da Plataforma “Acão Entre Amigos”, por Você, que é nosso usuário.
                    Nosso maior objetivo é incentivar a leitura, proporcionando momentos incríveis nos seus dias. O nosso propósito é revolucionar o universo da leitura, por uma vida repleta de cultura e conhecimento!
</Text>
                <Text style={styles.texto}>
                    Sua Responsabilidade
                    </Text>
                <Text style={styles.texto}>
                    Esperamos de você uma comunicação respeitosa e não agressiva com todos os participantes, e o próprio “Espalhando Livros”, sempre zelando pela ética e integridade.  Lembramos que não toleramos qualquer forma de preconceito, assédio, bullying e incitação à violência. As condutas que envolverem homofobia, racismo, intolerância religiosa e/ou política, machismo, capacitismo, ou qualquer ação que tenha por objetivo diminuir e/ou ofender alguém, estão sujeitas à suspensão ou cancelamento da sua Conta de Usuário em nossa Plataforma “Espalhando Livros”, sem aviso prévio, e sem prejuízo da adoção de medidas judiciais cabíveis.
</Text>
                <Text style={styles.texto}>
                    Seu Direito
                    </Text>
                <Text style={styles.texto}>
                    Ao criar uma conta na Plataforma “Espalhando Livros”, nós poderemos coletar algumas informações importantes sobre você. Os dados que você cadastra em nossas Plataforma “Espalhando Livros”s são tratados de forma segura. Limitamos o tratamento dos dados para as suas devidas finalidades e em conformidade com a lei. Poderemos compartilhar dados com empresas parceiras. Nesse caso, os dados serão tratados de forma a proteger a sua privacidade, tendo essas empresas o dever contratual de garantir proteção compatível com a legislação aplicável.  Nós sinalizamos para que você fique tranquilo, pois suas informações de pagamento online são armazenadas somente de forma mascarada. Assim, os dados completos de seus cartões não ficam armazenados em nossas bases, e suas transações online são feitas com o mais alto padrão de segurança.
</Text>
                <Text style={styles.texto}>
                    Como funciona o nosso serviço
                    </Text>
                <Text style={styles.texto}>
                    A Plataforma “Espalhando Livros”, realiza somente a intermediação entre Você, e os outros participantes.
                    A Plataforma “Espalhando Livros” não é produtora, fornecedora, comercializadora, distribuidora, transportadora de nenhum dos Produtos exibidos na Plataforma “Espalhando Livros”.
                    A Plataforma “Espalhando Livros” também não presta serviços logísticos, portanto, não transporta ou entrega nenhum destes Produtos.
                    Assim, os participantes são os únicos responsáveis pela disponibilização e entrega dos livros.
                    A Plataforma “Espalhando Livros” reconhece que o acesso à Plataforma “Espalhando Livros” poderá ser interrompido temporariamente, sem aviso prévio, devido a: (a) manutenções programadas
                    e/ou emergenciais; (b) aspectos técnicos; (c) por motivos de caso fortuito ou força maior.
</Text>
                <Text style={styles.texto}>
                    Quem pode usar
                    </Text>
                <Text style={styles.texto}>
                    Os serviços prestados pela Plataforma “Espalhando Livros” estão disponíveis para maiores de 13 anos.
</Text>
                <Text style={styles.texto}>
                    Sobre a sua conta de usuário
                    </Text>
                <Text style={styles.texto}>
                    Ao criar uma conta na Plataforma “Espalhando Livros”  (a “Conta de Usuário”), nós poderemos coletar algumas informações importantes sobre Você.
                    Caso Você não concorde com alguma disposição destes Termos, é recomendado a suspensão imediata do uso da Plataforma “Espalhando Livros”, e  o cancelamento da sua Conta de Usuário.
                    A Plataforma “Espalhando Livros” pode cancelar sua conta de usuário, caso verifique qualquer descumprimento, ação e/ou omissão cuja intenção seja burlar o disposto nestes Termos, incluindo, mas não se limitando a descumprimentos ao nosso Código de Ética e Conduta, ou por determinação judicial e/ou descumprimento de quaisquer leis.
                    Você autoriza, neste ato, de livre e espontânea vontade, a Plataforma “Espalhando Livros”, disponibilizar seu email, para os membros da Plataforma “Espalhando Livros”, no sentido de facilitar a comunicação dos livros a serem recebidos ou entregues por você.
 </Text>
                <Text style={styles.texto}>
                    São suas responsabilidades
                    </Text>
                <Text style={styles.texto}>
                    Manter a confidencialidade e a segurança dos dispositivos utilizados para acesso à sua Conta de Usuário e/ou Plataforma “Espalhando Livros”, incluindo seu usuário e senha - essas informações são pessoais e intransferíveis! Todas as atividades ou ações que ocorram ou sejam tomadas em sua Conta de Usuário; Manter uma comunicação respeitosa e não agressiva com os participantes, sempre zelando pela ética e integridade; Prestar as informações exigidas com veracidade e exatidão, assumindo a responsabilidade pelo que é fornecido por Você durante o uso da Plataforma “Espalhando Livros”.
</Text>
                <Text style={styles.texto}>
                    Propriedade intelectual
                    </Text>
                <Text style={styles.texto}>
                    Não é permitido fazer nenhum tipo de utilização do conteúdo sem autorização prévia e expressa da Plataforma “Espalhando Livros”, seja reprodução, cópia ou outros meios,
                    de qualquer um dos elementos protegidos pela propriedade intelectual da Plataforma “Espalhando Livros”.
                    Fica expressamente proibido coletar, reunir e utilizar informações com o intuito de monitorar, classificar dados, prejudicar ou concorrer com a
                    Plataforma “Espalhando Livros”, seja por uso de softwares ou qualquer dispositivo que possua essa função na Plataforma “Espalhando Livros”.
</Text>
                <Text style={styles.texto}>
                    Legislação aplicável e resolução de conflitos
                    </Text>
                <Text style={styles.texto}>
                    A Plataforma “Espalhando Livros” trabalha constantemente para oferecer o melhor serviço possível a Você. Por isso, em caso de divergências ou conflitos entre Você e a Plataforma “Espalhando Livros”, sugerimos que entre em contato com nossos canais de atendimento, para solucionarmos a demanda de forma consensual e amigável.
                    Fica eleito o foro da Comarca de Orlândia, do Estado de São Paulo, como competente para dirimir eventuais dúvidas, controvérsias e conflitos decorrentes da interpretação e cumprimento destes Termos.

</Text>
                <Text style={styles.texto}>Atualizada 03/09/2023
                </Text>
                <Text style={styles.texto}> 
                </Text>
            </ScrollView>
            <Progresso
                value={percentage}
                onMoveTop={concordarTermoUso}
            />
        </View>
    );
}