import { Container } from './styles';
import LottieView from 'lottie-react-native';
import ok from '../../assets/33184-succeeded-done-checked-20.json';
import { useNavigation } from '@react-navigation/native';

export default function OkL() {
    const navigation = useNavigation();
    function fimAnimacao(){
        navigation.reset({
            index: 0,
            routes: [{ name: "LiberarRifas" }]
        })
    }
    return (
        <Container>
            <LottieView
                source={ok}
                loop={false}
                autoPlay={true}
                onAnimationFinish={fimAnimacao}
            />
        </Container>
    );
}