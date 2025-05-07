import {
    DrawerNavigationProp,
    createDrawerNavigator,
} from '@react-navigation/drawer';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, Platform, View } from 'react-native';
import { Crediary, ImagesSent, LoadImages } from '@screens/Crediary';
import CustomDrawer from '@components/CustomDrawer';
import { History } from '@screens/Purchase';
import Contact from '@screens/Contact';
import {
    Account,
    AlterPassword,
    CheckPassword,
    DataExclude,
    NoRegistered,
    Registered,
    SignIn,
} from '@screens/Auth';
import { useNavigation } from '@react-navigation/native';
import { PrivacyPolice, PrivacySettings } from '@screens/Privacy';
import { StoresLocation } from '@screens/Location';
import { useContext } from 'react';
import { AuthContext } from '@contexts/auth';
import StoreSelected from '@screens/Location/StoreSelected';
import StoreList from '@screens/Location/StoreList';
import RegisterUser from '@screens/Auth/RegisterUser';
import RegisterPassword from '@screens/Auth/RegisterPassword';
import PasswordChanged from '@screens/Auth/PasswordChanged';
import HistoryItem from '@screens/Purchase/HistoryItem';
import { Detail, Protocol } from '@screens/Assistance';
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
import Home from '@screens/Home';
import { RootDrawerParamList } from '@screens/RootDrawerPrams';
import Connected from '@screens/Connected';
import DataAnalise from '@screens/Auth/DataAnalise';
import VerifyVersion from '@screens/VerifyVersion';
import DocsAssign from '@screens/DocsAssign';
import ViewDoc from '@screens/DocsAssign/ViewDoc';
import Cashback from '@screens/CashBack';
import HistoricoCashback from '@screens/CashBack/HistoricoCashback';
import CashbackRequested from '@screens/CashBack/CashbackRequested';

const Drawer = createDrawerNavigator<RootDrawerParamList>();

function LogoTitle() {
    return (
        <Image
            className={`w-52 h-10 ${Platform.OS === 'ios' ? 'mb-2' : ''}`}
            source={require('@assets/logosolar.png')}
        />
    );
}

function ButtonRight() {
    const navigation =
        useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
    const { dataMap } = useContext(AuthContext);
    return (
        <View className="pr-[15]">
            <MaterialIcons
                onPress={() =>
                    navigation.navigate('StoreList', { data: dataMap })
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
        useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
    return (
        <View className="pl-[15]">
            <MaterialIcons
                onPress={() =>
                    navigation.navigate('StoresLocation', { data: false })
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
        useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
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
    const { signed } = useContext(AuthContext);
    const { modalVisible } = useContext(AuthContext);
    return (
        <Drawer.Navigator
            initialRouteName="Connected"
            backBehavior="none"
            drawerContent={props => <CustomDrawer {...props} />}
            screenOptions={{
                headerShown: true,
                title: '',
                headerStyle: {
                    backgroundColor: '#1a9cd9',
                    height: 100,
                },
                drawerStyle: {
                    backgroundColor: '#F8F8F8',
                },
                headerTintColor: modalVisible ? '#1a9cd9' : 'white',
                headerTitleAlign: 'center',
                drawerActiveBackgroundColor: 'transparent',
                drawerActiveTintColor: '#0d3b85',
                drawerInactiveTintColor: '#0d3b85',
                drawerLabelStyle: {
                    marginLeft: -25,
                    fontFamily: 'Poppins_400Regular',
                    padding: 0,
                    margin: -3,
                },
            }}
        >
            <Drawer.Screen
                name="Connected"
                component={Connected}
                options={{
                    drawerItemStyle: {
                        height: 0,
                    },
                }}
            />

            <Drawer.Screen
                name="Home"
                component={Home}
                options={{
                    drawerItemStyle: {
                        marginVertical: 1,
                    },
                    drawerIcon: ({ color, size }) => (
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
                            drawerIcon: ({ color, size }) => (
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
                            drawerIcon: ({ color, size }) => (
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
                            drawerIcon: ({ color, size }) => (
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
                        name="DocsAssign"
                        component={DocsAssign}
                        options={{
                            drawerItemStyle: {
                                marginVertical: 1,
                            },
                            drawerIcon: ({ color, size }) => (
                                <MaterialCommunityIcons
                                    name="file-document-edit"
                                    color={color}
                                    size={22}
                                />
                            ),
                            drawerLabel: 'Assinar documentos',
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
                            drawerIcon: ({ color, size }) => (
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
                initialParams={{ data: false }}
                component={StoresLocation}
                options={{
                    headerRight: (props: any) => <ButtonRight />,
                    drawerItemStyle: {
                        marginVertical: 1,
                    },
                    drawerIcon: ({ color, size }) => (
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
                    drawerIcon: ({ color, size }) => (
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
                            drawerIcon: ({ color, size }) => (
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
                        name="CashBack"
                        component={Cashback}
                        options={{
                            drawerItemStyle: {
                                marginVertical: 1,
                            },
                            drawerIcon: ({ color, size }) => (
                                <MaterialIcons
                                    name="currency-exchange"
                                    color={color}
                                    size={22}
                                />
                            ),
                            drawerLabel: 'Cashback',
                            headerTitle: (props: any) => (
                                <LogoTitle {...props} />
                            ),
                        }}
                    />

                    <Drawer.Screen
                        name="HistoricoCashback"
                        component={HistoricoCashback}
                        options={{
                            drawerItemStyle: {
                                height: 0
                            },
                            drawerIcon: ({ color, size }) => (
                                <MaterialIcons
                                    name="currency-exchange"
                                    color={color}
                                    size={22}
                                />
                            ),
                            drawerLabel: '',
                            headerTitle: (props: any) => (
                                <LogoTitle {...props} />
                            ),
                            drawerStatusBarAnimation: "slide"
                        }}
                    />

                    <Drawer.Screen
                        name="CashbackRequested"
                        component={CashbackRequested}
                        options={{
                            drawerItemStyle: {
                                height: 0
                            },
                            drawerIcon: ({ color, size }) => (
                                <MaterialIcons
                                    name="currency-exchange"
                                    color={color}
                                    size={22}
                                />
                            ),
                            drawerLabel: '',
                            headerTitle: (props: any) => (
                                <LogoTitle {...props} />
                            ),
                            drawerStatusBarAnimation: "slide"
                        }}
                    />

                    <Drawer.Screen
                        name="History"
                        component={History}
                        options={{
                            drawerItemStyle: {
                                marginVertical: 1,
                            },
                            drawerIcon: ({ color, size }) => (
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
                            drawerIcon: ({ color, size }) => (
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
                component={RegisterUser}
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
                component={RegisterPassword}
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
                initialParams={{ user: [] }}
                component={LoadImages}
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
                component={HistoryItem}
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
                                DrawerNavigationProp<RootDrawerParamList>
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
                                DrawerNavigationProp<RootDrawerParamList>
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
                                DrawerNavigationProp<RootDrawerParamList>
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
                name="VerifyVersion"
                component={VerifyVersion}
                options={{
                    drawerItemStyle: {
                        height: 0,
                    },
                    headerShown: false,
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
                name="DataExclude"
                component={DataExclude}
                options={{
                    drawerItemStyle: {
                        height: 0,
                    },
                    headerTitle: (props: any) => <LogoTitle {...props} />,
                }}
            />

            <Drawer.Screen
                name="ViewDoc"
                component={ViewDoc}
                options={{
                    drawerItemStyle: {
                        height: 0,
                    },
                    headerTitle: (props: any) => <LogoTitle {...props} />,
                }}
            />

            <Drawer.Screen
                name="DataAnalise"
                component={DataAnalise}
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
                                DrawerNavigationProp<RootDrawerParamList>
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
                                DrawerNavigationProp<RootDrawerParamList>
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
                                DrawerNavigationProp<RootDrawerParamList>
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
