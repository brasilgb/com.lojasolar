import {
    NativeStackScreenProps,
    createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {Account, CheckPassword, NoRegistered, Registered} from '@screens/Auth';
import Home from '@screens/Home';
import {RootStackParamList} from '@screens/RootStackPrams';
import {Text, Platform, TouchableOpacity} from 'react-native';
import {Image} from 'react-native';
import {ImagesSent, LoadImages} from '@screens/Crediary';
import {DrawerActions} from '@react-navigation/native';
import RegisterUser from '@screens/Auth/RegisterUser';
import RegisterPassword from '@screens/Auth/RegisterPassword';
import PasswordChanged from '@screens/Auth/PasswordChanged';
import ActionBillet from '@screens/Payments/Twobillet/ActionBillet';

const Stack = createNativeStackNavigator<RootStackParamList>();
type StackScreenProps = NativeStackScreenProps<RootStackParamList>;

function LogoTitle() {
    return (
        <Image
            style={{
                width: 110,
                height: 40,
                marginBottom: Platform.OS === 'ios' ? 7 : 0,
            }}
            source={require('@assets/logosolar.png')}
        />
    );
}

const StackRoutes = ({navigation}: StackScreenProps) => (
    <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
            headerShown: false,
            title: '',
            headerStyle: {
                backgroundColor: '#00AEEF',
            },
            headerTintColor: '#FFF',
            headerTitleAlign: 'center',
            headerTitle: (props: any) => <LogoTitle {...props} />,
        }}
    >
        <Stack.Screen
            name="Home"
            component={Home}
            options={{
                headerLeft: () => (
                    <TouchableOpacity
                        onPress={() =>
                            navigation.dispatch(DrawerActions.openDrawer)
                        }
                    >
                        <Text>Voltar</Text>
                    </TouchableOpacity>
                ),
            }}
        />
        <Stack.Screen name="Account" component={Account} />
        <Stack.Screen name="CheckPassword" component={CheckPassword} />
        <Stack.Screen name="LoadImages" component={LoadImages} />
        <Stack.Screen name="NoRegistered" component={NoRegistered} />
        <Stack.Screen name="RegisterUser" component={RegisterUser} />
        <Stack.Screen name="Registered" component={Registered} />
        <Stack.Screen name="RegisterPassword" component={RegisterPassword} />
        <Stack.Screen name="PasswordChanged" component={PasswordChanged} />
    </Stack.Navigator>
);

export default StackRoutes;
