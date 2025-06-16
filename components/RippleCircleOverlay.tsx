import { Dimensions } from 'react-native';
import Animated, {
    Easing,
    useSharedValue,
    useAnimatedProps,
    withTiming,
    runOnJS
} from 'react-native-reanimated';
import { Circle, Svg } from 'react-native-svg';
import { useEffect } from 'react';

const { width, height } = Dimensions.get('window');

type Props = {
    x: number;
    y: number;
    onFinish: () => void;
};

export default function RippleCircleOverlay({ x, y, onFinish }: Props) {
    const radius = useSharedValue(0);
    const AnimatedCircle = Animated.createAnimatedComponent(Circle);

    useEffect(() => {
        radius.value = withTiming(Math.sqrt(width ** 2 + height ** 2), {
            duration: 400,
            easing: Easing.out(Easing.ease),
        }, () => {
            runOnJS(onFinish)();
        });
    }, []);

    const animatedProps = useAnimatedProps(() => ({
        r: radius.value,
    }));

    return (
        <Svg
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height,
                width,
                zIndex: 100,
            }}
        >
            <AnimatedCircle
                cx={x}
                cy={y}
                fill="#fff"
                animatedProps={animatedProps}
            />
        </Svg>
    );
}
