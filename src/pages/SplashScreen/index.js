import { Container } from './styles';
import LottieView from 'lottie-react-native';
import splash from '../../assets/animation_lohmig5g.json';
import { useNavigation } from '@react-navigation/native';

export default function SplashScreen() {
    console.log('SplashScreen')
    const navigation = useNavigation();
    function fimAnimacao(){
        navigation.reset({
            index: 0,
            routes: [{ name: "Apresentacao" }]
        })
    }
    return (
        <Container>
            <LottieView
                source={splash}
                loop={false}
                autoPlay={true}
                onAnimationFinish={fimAnimacao}
            />
        </Container>
    );
}