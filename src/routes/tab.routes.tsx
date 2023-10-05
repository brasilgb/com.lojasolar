import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TouchableOpacity, Text, Platform} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import Location from '@screens/Location';
import Contact from '@screens/Contact';
import * as WebBrowser from 'expo-web-browser';
import Shopping from '@screens/Shopping';
import Home from '@screens/Home';

const Tab = createBottomTabNavigator();

const TabRoutes = () => {
    let colorBar = Platform.OS === 'ios' ? 'rgba(0, 162, 227, 0)' : '#00AEEF';
    const handlePressButtonAsync = async (url: any) => {
        await WebBrowser.openBrowserAsync(url, {
            toolbarColor: colorBar,
            controlsColor: '#FFF',
        });
    };

    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#00AEEF',
                    height: 60,
                    paddingBottom: 8,
                },
                tabBarInactiveTintColor: '#d3d2d2',
                tabBarActiveTintColor: '#FFFFFF',
                headerShown: false,
            }}
        >
            {/* <Tab.Screen
                name="home"
                component={Home}
                options={{
                    // tabBarBadge: 3 ,
                    tabBarIcon: ({color}: any) => (
                        <MaterialIcons name="home" color={color} size={26} />
                    ),
                    tabBarLabel: 'Inicio',
                }}
            /> */}

            <Tab.Screen
                name="Shopping"
                component={Shopping}
                options={{
                    tabBarIcon: ({color}: any) => (
                        <MaterialIcons
                            name="shopping-basket"
                            color={color}
                            size={26}
                        />
                    ),
                    tabBarLabel: 'Comprar',
                    tabBarButton: props => (
                        <TouchableOpacity
                            className="flex-col items-center justify-between mt-1.5 mx-6"
                            onPress={() =>
                                handlePressButtonAsync(
                                    'https://www.lojasolar.com.br/',
                                )
                            }
                        >
                            <MaterialIcons
                                name="shopping-basket"
                                color={'#d3d2d2'}
                                size={26}
                            />
                            <Text className="text-[#d3d2d2] text-[10px]">
                                Comprar
                            </Text>
                        </TouchableOpacity>
                    ),
                }}
            />

            <Tab.Screen
                name="Lojas"
                component={Location}
                options={{
                    tabBarIcon: ({color}: any) => (
                        <MaterialIcons
                            name="location-pin"
                            color={color}
                            size={26}
                        />
                    ),
                    tabBarLabel: 'Lojas',
                }}
            />

            <Tab.Screen
                name="Contato"
                component={Contact}
                options={{
                    tabBarIcon: ({color}: any) => (
                        <MaterialIcons
                            name="perm-phone-msg"
                            color={color}
                            size={26}
                        />
                    ),
                    tabBarLabel: 'Contato',
                }}
            />
        </Tab.Navigator>
    );
};

export default TabRoutes;
