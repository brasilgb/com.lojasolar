import {
    DrawerNavigationProp,
    createDrawerNavigator,
} from '@react-navigation/drawer';
import {MaterialIcons, MaterialCommunityIcons} from '@expo/vector-icons';
import {Image, Platform, View} from 'react-native';
import {Crediary, ImagesSent, LoadImages} from '@screens/Crediary';
import CustomDrawer from '@components/CustomDrawer';
import {History} from '@screens/Purchase';
import Contact from '@screens/Contact';
import {
    Account,
    AlterPassword,
    CheckPassword,
    NoRegistered,
    Registered,
    SignIn,
} from '@screens/Auth';
import {useNavigation} from '@react-navigation/native';
import StackRoutes from './stack.routes';
import {RootDrawerParamList, RootStackParamList} from '@screens/RootStackPrams';
import {PrivacyPolice, PrivacySettings} from '@screens/Privacy';
import {StoresLocation} from '@screens/Location';
import {useContext} from 'react';
import {AuthContext} from '@contexts/auth';
import {StackNavigationProp} from '@react-navigation/stack';
import StoreSelected from '@screens/Location/StoreSelected';
import StoreList from '@screens/Location/StoreList';
import RegisterUser from '@screens/Auth/RegisterUser';
import RegisterPassword from '@screens/Auth/RegisterPassword';
import PasswordChanged from '@screens/Auth/PasswordChanged';
import HistoryItem from '@screens/Purchase/HistoryItem';
import {Detail, Protocol} from '@screens/Assistance';
import Questions from '@screens/Questions';
import {
    CartPayment,
    HistoryPayments,
    Methods,
    OpenPayments,
    PixPayment,
    SlipPayment,
    Twobillet,
} from '@screens/Payments';
import ActionBillet from '@screens/Payments/Twobillet/ActionBillet';
import PasswordAltered from '@screens/Auth/PasswordAltered';
import PayCartOk from '@screens/Payments/PayCartOk';

const Drawer = createDrawerNavigator<RootDrawerParamList>();

function LogoTitle() {
    return (
        <Image
            className={`w-28 h-10 ${Platform.OS === 'ios' ? 'mb-2' : ''}`}
            source={require('@assets/logosolar.png')}
        />
    );
}

function ButtonRight() {
    const navigation =
        useNavigation<StackNavigationProp<RootDrawerParamList>>();
    const {dataMap} = useContext(AuthContext);
    return (
        <View className="pr-[15]">
            <MaterialIcons
                onPress={() =>
                    navigation.navigate('StoreList', {data: dataMap})
                }
                name="list-alt"
                size={26}
                color="white"
            />
        </View>
    );
}

function ButtonLeftStorage() {
    const navigation =
        useNavigation<StackNavigationProp<RootDrawerParamList>>();
    return (
        <View className="pl-[15]">
            <MaterialIcons
                onPress={() =>
                    navigation.navigate('StoresLocation', {data: false})
                }
                name="arrow-back-ios"
                size={26}
                color="white"
            />
        </View>
    );
}

const ButtonLeftReturn = (url: any) => {
    const navigation =
        useNavigation<StackNavigationProp<RootDrawerParamList>>();
    return (
        <View className="pl-[15]">
            <MaterialIcons
                onPress={() => navigation.goBack()}
                name="arrow-back-ios"
                size={26}
                color="white"
            />
        </View>
    );
};

function ButtonHome() {
    const navigation =
        useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
    return (
        <View className="pr-[15]">
            <MaterialIcons
                onPress={() => navigation.navigate('Home')}
                name="close"
                size={26}
                color="white"
            />
        </View>
    );
}

const DrawerRoutes = () => {
    const {signed} = useContext(AuthContext);
    const {modalVisible} = useContext(AuthContext);
    return (
        <Drawer.Navigator
            initialRouteName="Home"
            backBehavior="history"
            drawerContent={props => <CustomDrawer {...props} />}
            screenOptions={{
                headerShown: true,
                title: '',
                headerStyle: {
                    backgroundColor: '#00AEEF',
                },
                drawerStyle: {
                    backgroundColor: '#F8F8F8',
                },
                headerTintColor: modalVisible ? '#00AEEF' : 'white',
                headerTitleAlign: 'center',
                drawerActiveBackgroundColor: 'transparent',
                drawerActiveTintColor: '#666565',
                drawerInactiveTintColor: '#666565',
                drawerLabelStyle: {
                    marginLeft: -25,
                    fontFamily: 'Poppins_400Regular',
                },
            }}
        >
            <Drawer.Screen
                name="StackRoutes"
                component={StackRoutes}
                options={{
                    drawerItemStyle: {
                        marginVertical: 1,
                    },
                    drawerIcon: ({color, size}) => (
                        <MaterialCommunityIcons
                            name="home-outline"
                            color={color}
                            size={22}
                        />
                    ),
                    drawerLabel: 'Inicio',
                    headerTitle: (props: any) => <LogoTitle {...props} />,
                }}
            />

            {signed && (
                <>
                    <Drawer.Screen
                        name="Account"
                        component={Account}
                        options={{
                            drawerItemStyle: {
                                marginVertical: 1,
                            },
                            drawerIcon: ({color, size}) => (
                                <MaterialIcons
                                    name="person-outline"
                                    color={color}
                                    size={22}
                                />
                            ),
                            drawerLabel: 'Minha conta',
                            headerTitle: (props: any) => (
                                <LogoTitle {...props} />
                            ),
                        }}
                    />

                    <Drawer.Screen
                        name="Crediary"
                        component={Crediary}
                        options={{
                            drawerItemStyle: {
                                marginVertical: 1,
                            },
                            drawerIcon: ({color, size}) => (
                                <MaterialCommunityIcons
                                    name="handshake-outline"
                                    color={color}
                                    size={22}
                                />
                            ),
                            drawerLabel: 'Crediário',
                            headerTitle: (props: any) => (
                                <LogoTitle {...props} />
                            ),
                        }}
                    />

                    <Drawer.Screen
                        name="AlterPassword"
                        component={AlterPassword}
                        options={{
                            drawerItemStyle: {
                                marginVertical: 1,
                            },
                            drawerIcon: ({color, size}) => (
                                <MaterialCommunityIcons
                                    name="lock-reset"
                                    color={color}
                                    size={22}
                                />
                            ),
                            drawerLabel: 'Alterar senha',
                            headerTitle: (props: any) => (
                                <LogoTitle {...props} />
                            ),
                        }}
                    />

                    <Drawer.Screen
                        name="PrivacySettings"
                        component={PrivacySettings}
                        options={{
                            drawerItemStyle: {
                                marginVertical: 1,
                            },
                            drawerIcon: ({color, size}) => (
                                <MaterialCommunityIcons
                                    name="shield-account-outline"
                                    color={color}
                                    size={22}
                                />
                            ),
                            drawerLabel: 'Configurações de privacidade',
                            headerTitle: (props: any) => (
                                <LogoTitle {...props} />
                            ),
                        }}
                    />
                </>
            )}

            <Drawer.Screen
                name="StoresLocation"
                initialParams={{data: false}}
                component={StoresLocation}
                options={{
                    headerRight: (props: any) => <ButtonRight />,
                    drawerItemStyle: {
                        marginVertical: 1,
                    },
                    drawerIcon: ({color, size}) => (
                        <MaterialCommunityIcons
                            name="map-marker-outline"
                            color={color}
                            size={22}
                        />
                    ),
                    drawerLabel: 'Lojas próximas de você',
                    headerTitle: (props: any) => <LogoTitle {...props} />,
                }}
            />

            <Drawer.Screen
                name="Contact"
                component={Contact}
                options={{
                    drawerItemStyle: {
                        marginVertical: 1,
                    },
                    drawerIcon: ({color, size}) => (
                        <MaterialCommunityIcons
                            name="phone-message-outline"
                            color={color}
                            size={22}
                        />
                    ),
                    drawerLabel: 'Fale conosco',
                    headerTitle: (props: any) => <LogoTitle {...props} />,
                }}
            />

            {signed && (
                <>
                    <Drawer.Screen
                        name="OpenPayments"
                        component={OpenPayments}
                        options={{
                            drawerItemStyle: {
                                marginVertical: 1,
                            },
                            drawerIcon: ({color, size}) => (
                                <MaterialIcons
                                    name="attach-money"
                                    color={color}
                                    size={22}
                                />
                            ),
                            drawerLabel: 'Faça seu pagamento',
                            headerTitle: (props: any) => (
                                <LogoTitle {...props} />
                            ),
                        }}
                    />

                    <Drawer.Screen
                        name="History"
                        component={History}
                        options={{
                            drawerItemStyle: {
                                marginVertical: 1,
                            },
                            drawerIcon: ({color, size}) => (
                                <MaterialIcons
                                    name="history"
                                    color={color}
                                    size={22}
                                />
                            ),
                            drawerLabel: 'Histórico de compras',
                            headerTitle: (props: any) => (
                                <LogoTitle {...props} />
                            ),
                        }}
                    />

                    <Drawer.Screen
                        name="Protocol"
                        component={Protocol}
                        options={{
                            drawerItemStyle: {
                                marginVertical: 1,
                            },
                            drawerIcon: ({color, size}) => (
                                <MaterialIcons
                                    name="handyman"
                                    color={color}
                                    size={22}
                                />
                            ),
                            drawerLabel: 'Protocolo de assistência',
                            headerTitle: (props: any) => (
                                <LogoTitle {...props} />
                            ),
                        }}
                    />
                </>
            )}

            <Drawer.Screen
                name="Detail"
                initialParams={{data: []}}
                component={Detail}
                options={{
                    drawerItemStyle: {
                        height: 0,
                    },
                    headerTitle: (props: any) => <LogoTitle {...props} />,
                    headerLeft: () => {
                        const navigation =
                            useNavigation<
                                DrawerNavigationProp<RootDrawerParamList>
                            >();
                        return (
                            <View className="pl-[15]">
                                <MaterialIcons
                                    onPress={() =>
                                        navigation.navigate('Protocol')
                                    }
                                    name="arrow-back-ios"
                                    size={26}
                                    color="white"
                                />
                            </View>
                        );
                    },
                }}
            />

            <Drawer.Screen
                name="StoreSelected"
                initialParams={{data: []}}
                component={StoreSelected}
                options={{
                    drawerItemStyle: {
                        height: 0,
                    },
                    drawerLabel: 'Store selected',
                    headerTitle: (props: any) => <LogoTitle {...props} />,
                    headerLeft: () => <ButtonLeftStorage />,
                }}
            />

            <Drawer.Screen
                name="StoreList"
                initialParams={{data: []}}
                component={StoreList}
                options={{
                    drawerItemStyle: {
                        height: 0,
                    },
                    headerTitle: (props: any) => <LogoTitle {...props} />,
                    headerLeft: () => <ButtonLeftStorage />,
                }}
            />

            <Drawer.Screen
                name="NoRegistered"
                initialParams={{data: []}}
                component={NoRegistered}
                options={{
                    drawerItemStyle: {
                        height: 0,
                    },
                    headerTitle: (props: any) => <LogoTitle {...props} />,
                    headerLeft: () => <ButtonLeftReturn />,
                    headerRight: () => <ButtonHome />,
                }}
            />

            <Drawer.Screen
                name="RegisterUser"
                initialParams={{data: []}}
                component={RegisterUser}
                options={{
                    drawerItemStyle: {
                        height: 0,
                    },
                    headerTitle: (props: any) => <LogoTitle {...props} />,
                    headerLeft: () => {
                        const navigation =
                            useNavigation<
                                StackNavigationProp<RootStackParamList>
                            >();
                        return (
                            <View className="pl-[15]">
                                <MaterialIcons
                                    onPress={() =>
                                        navigation.navigate('NoRegistered', {
                                            data: [],
                                        })
                                    }
                                    name="arrow-back-ios"
                                    size={26}
                                    color="white"
                                />
                            </View>
                        );
                    },
                }}
            />

            <Drawer.Screen
                name="Registered"
                initialParams={{data: []}}
                component={Registered}
                options={{
                    drawerItemStyle: {
                        height: 0,
                    },
                    headerLeft: () => '',
                    headerRight: () => <ButtonHome />,
                }}
            />

            <Drawer.Screen
                name="RegisterPassword"
                initialParams={{data: []}}
                component={RegisterPassword}
                options={{
                    drawerItemStyle: {
                        height: 0,
                    },
                    headerTitle: (props: any) => <LogoTitle {...props} />,
                    headerLeft: () => {
                        const navigation =
                            useNavigation<
                                StackNavigationProp<RootStackParamList>
                            >();
                        return (
                            <View className="pl-[15]">
                                <MaterialIcons
                                    onPress={() =>
                                        navigation.navigate('Registered', {
                                            data: [],
                                        })
                                    }
                                    name="arrow-back-ios"
                                    size={26}
                                    color="white"
                                />
                            </View>
                        );
                    },
                    headerRight: () => <ButtonHome />,
                }}
            />

            <Drawer.Screen
                name="PasswordChanged"
                initialParams={{data: []}}
                component={PasswordChanged}
                options={{
                    drawerItemStyle: {
                        height: 0,
                    },
                    headerLeft: () => '',
                    headerRight: () => <ButtonHome />,
                }}
            />

            <Drawer.Screen
                name="LoadImages"
                initialParams={{user: []}}
                component={LoadImages}
                options={{
                    drawerItemStyle: {
                        height: 0,
                    },
                    headerTitle: (props: any) => <LogoTitle {...props} />,
                    headerLeft: () => {
                        const navigation =
                            useNavigation<
                                StackNavigationProp<RootDrawerParamList>
                            >();
                        return (
                            <View className="pl-[15]">
                                <MaterialIcons
                                    onPress={() =>
                                        navigation.navigate('Crediary')
                                    }
                                    name="arrow-back-ios"
                                    size={26}
                                    color="white"
                                />
                            </View>
                        );
                    },
                    headerRight: () => <ButtonHome />,
                }}
            />

            <Drawer.Screen
                name="CheckPassword"
                initialParams={{data: []}}
                component={CheckPassword}
                options={{
                    drawerItemStyle: {
                        height: 0,
                    },
                    headerTitle: (props: any) => <LogoTitle {...props} />,
                    headerLeft: () => {
                        const navigation =
                            useNavigation<
                                DrawerNavigationProp<RootDrawerParamList>
                            >();
                        return (
                            <View className="pl-[15]">
                                <MaterialIcons
                                    onPress={() =>
                                        navigation.navigate('SignIn')
                                    }
                                    name="arrow-back-ios"
                                    size={26}
                                    color="white"
                                />
                            </View>
                        );
                    },
                    headerRight: () => <ButtonHome />,
                }}
            />

            <Drawer.Screen
                name="HistoryItem"
                initialParams={{data: []}}
                component={HistoryItem}
                options={{
                    drawerItemStyle: {
                        height: 0,
                    },
                    headerTitle: (props: any) => <LogoTitle {...props} />,
                    headerLeft: () => {
                        const navigation =
                            useNavigation<
                                StackNavigationProp<RootDrawerParamList>
                            >();
                        return (
                            <View className="pl-[15]">
                                <MaterialIcons
                                    onPress={() =>
                                        navigation.navigate('History')
                                    }
                                    name="arrow-back-ios"
                                    size={26}
                                    color="white"
                                />
                            </View>
                        );
                    },
                }}
            />

            <Drawer.Screen
                name="PrivacyPolice"
                component={PrivacyPolice}
                options={{
                    drawerItemStyle: {
                        height: 0,
                    },
                    drawerLabel: 'Minha conta',
                    headerTitle: (props: any) => <LogoTitle {...props} />,
                }}
            />

            <Drawer.Screen
                name="Questions"
                component={Questions}
                options={{
                    drawerItemStyle: {
                        height: 0,
                    },
                    drawerLabel: 'Minha conta',
                    headerTitle: (props: any) => <LogoTitle {...props} />,
                }}
            />

            <Drawer.Screen
                name="HistoryPayments"
                component={HistoryPayments}
                options={{
                    drawerItemStyle: {
                        height: 0,
                    },
                    drawerLabel: 'Minha conta',
                    headerTitle: (props: any) => <LogoTitle {...props} />,
                }}
            />

            <Drawer.Screen
                name="Methods"
                component={Methods}
                options={{
                    drawerItemStyle: {
                        height: 0,
                    },
                    drawerLabel: 'Minha conta',
                    headerTitle: (props: any) => <LogoTitle {...props} />,
                    headerLeft: () => '',
                    headerRight: () => {
                        const navigation =
                            useNavigation<
                                StackNavigationProp<RootDrawerParamList>
                            >();
                        return (
                            <View className="pr-[15]">
                                <MaterialIcons
                                    onPress={() =>
                                        navigation.navigate('OpenPayments')
                                    }
                                    name="close"
                                    size={26}
                                    color="white"
                                />
                            </View>
                        );
                    },
                }}
            />

            <Drawer.Screen
                name="PixPayment"
                component={PixPayment}
                options={{
                    drawerItemStyle: {
                        height: 0,
                    },
                    headerTitle: (props: any) => <LogoTitle {...props} />,
                    headerLeft: () => {
                        const navigation =
                            useNavigation<
                                StackNavigationProp<RootDrawerParamList>
                            >();
                        return (
                            <View className="pl-[15]">
                                <MaterialIcons
                                    onPress={() =>
                                        navigation.navigate('OpenPayments')
                                    }
                                    name="arrow-back-ios"
                                    size={26}
                                    color="white"
                                />
                            </View>
                        );
                    },
                }}
            />

            <Drawer.Screen
                name="SlipPayment"
                component={SlipPayment}
                options={{
                    drawerItemStyle: {
                        height: 0,
                    },
                    headerTitle: (props: any) => <LogoTitle {...props} />,
                    headerLeft: () => {
                        const navigation =
                            useNavigation<
                                StackNavigationProp<RootDrawerParamList>
                            >();
                        return (
                            <View className="pl-[15]">
                                <MaterialIcons
                                    onPress={() =>
                                        navigation.navigate('OpenPayments')
                                    }
                                    name="arrow-back-ios"
                                    size={26}
                                    color="white"
                                />
                            </View>
                        );
                    },
                }}
            />

            <Drawer.Screen
                name="SignIn"
                component={SignIn}
                options={{
                    drawerItemStyle: {
                        height: 0,
                    },
                    headerTitle: (props: any) => <LogoTitle {...props} />,
                }}
            />

            <Drawer.Screen
                name="ImagesSent"
                component={ImagesSent}
                options={{
                    drawerItemStyle: {
                        height: 0,
                    },
                    headerTitle: (props: any) => <LogoTitle {...props} />,
                }}
            />

            <Drawer.Screen
                name="CartPayment"
                component={CartPayment}
                options={{
                    drawerItemStyle: {
                        height: 0,
                    },
                    headerTitle: (props: any) => <LogoTitle {...props} />,
                }}
            />

            <Drawer.Screen
                name="Twobillet"
                component={Twobillet}
                options={{
                    drawerItemStyle: {
                        height: 0,
                    },
                    headerTitle: (props: any) => <LogoTitle {...props} />,
                }}
            />

            <Drawer.Screen
                name="ActionBillet"
                component={ActionBillet}
                options={{
                    drawerItemStyle: {
                        height: 0,
                    },
                    headerTitle: (props: any) => <LogoTitle {...props} />,
                    headerLeft: () => {
                        const navigation =
                            useNavigation<
                                StackNavigationProp<RootDrawerParamList>
                            >();
                        return (
                            <View className="pl-[15]">
                                <MaterialIcons
                                    onPress={() =>
                                        navigation.navigate('Twobillet')
                                    }
                                    name="arrow-back-ios"
                                    size={26}
                                    color="white"
                                />
                            </View>
                        );
                    },
                }}
            />

            <Drawer.Screen
                name="PasswordAltered"
                component={PasswordAltered}
                options={{
                    drawerItemStyle: {
                        height: 0,
                    },
                    headerTitle: (props: any) => <LogoTitle {...props} />,
                    headerLeft: () => '',
                    headerRight: () => {
                        const navigation =
                            useNavigation<
                                StackNavigationProp<RootDrawerParamList>
                            >();
                        return (
                            <View className="pr-[15]">
                                <MaterialIcons
                                    onPress={() => navigation.navigate('Home')}
                                    name="close"
                                    size={26}
                                    color="white"
                                />
                            </View>
                        );
                    },
                }}
            />

            <Drawer.Screen
                name="PayCartOk"
                component={PayCartOk}
                options={{
                    drawerItemStyle: {
                        height: 0,
                    },
                    headerTitle: (props: any) => <LogoTitle {...props} />,
                    headerLeft: () => '',
                    headerRight: () => {
                        const navigation =
                            useNavigation<
                                StackNavigationProp<RootDrawerParamList>
                            >();
                        return (
                            <View className="pr-[15]">
                                <MaterialIcons
                                    onPress={() => navigation.navigate('Home')}
                                    name="close"
                                    size={26}
                                    color="white"
                                />
                            </View>
                        );
                    },
                }}
            />
        </Drawer.Navigator>
    );
};

export default DrawerRoutes;