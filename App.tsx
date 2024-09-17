import 'react-native-gesture-handler';
import React, { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import {
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
    Poppins_900Black,
} from '@expo-google-fonts/poppins';
import Routes from './src/routes';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-get-random-values';
import notifee, {
    AndroidBadgeIconType,
    AndroidImportance,
    AndroidStyle,
    EventType,
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { Linking, Platform } from 'react-native';
import { AuthProvider } from '@contexts/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import serviceapp from "@services/serviceapp";
import DeviceInfo from "react-native-device-info";

import { v4 as uuid } from 'uuid';
import * as SecureStore from 'expo-secure-store';
import * as Application from 'expo-application';

messaging().setBackgroundMessageHandler(async (remoteMessage: any) => {
    await notifee.requestPermission();
    const channelId = await notifee.createChannel({
        id: 'important',
        name: 'NotificacoesImportantes',
    });

    // Display a notification
    await notifee.displayNotification({
        title: remoteMessage.data.title,
        body: remoteMessage.data.body,
        data: {
            url: remoteMessage.data.url,
        },
        android: {
            channelId,
            style: {
                type: AndroidStyle.BIGPICTURE,
                picture: remoteMessage.data.image,
            },
            badgeIconType: AndroidBadgeIconType.SMALL,
            importance: AndroidImportance.HIGH,
            pressAction: {
                id: 'inportant',
            },
        },
    });
});

notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction }: any = detail;
    if (type === EventType.PRESS && pressAction?.id === 'inportant') {
        await Linking.openURL(notification.data.url);
    }
});

const App = () => {
    const [appIsReady, setAppIsReady] = useState(false);
    const [pushToken, setPushToken] = useState('');
    const [userStore, setUserStore] = useState<any>([]);
    const [deviceKeyStore, setDeviceKeyStore] = useState<string>('');

    useEffect(() => {
        const getKeyDevice = async () => {
            const newUniqueId = Platform.OS === 'android'
                ? Application.getAndroidId()  ?? uuid()
                : await Application.getIosIdForVendorAsync() ?? uuid();

            let uniqueId = null;
            try {
                uniqueId = await SecureStore.getItemAsync('uniqueId');
            } catch (error) {
                console.log(error);
            }
            try {
                if (!uniqueId) {
                    uniqueId = newUniqueId;
                    await SecureStore.setItemAsync('uniqueId', JSON.stringify(uniqueId));
                }
            } catch (error) {
                uniqueId = newUniqueId;
                console.log(error);
            }
            setDeviceKeyStore(JSON.parse(uniqueId));
        }
        getKeyDevice();
    }, []);

    useEffect(() => {
        const getUserStore = async () => {
            const user = await AsyncStorage.getItem('Auth_user');
            if (user) {
                setUserStore(JSON.parse(user));
            }
        };
        getUserStore();
    }, []);

    //*******Notifications push************************************************************** */
    const requestUserPermission = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            let tokenFirebase = (await messaging().getToken()).toString();
            setPushToken(tokenFirebase);
        }
    };

    useEffect(() => {
        console.log(deviceKeyStore);
        
        requestUserPermission();
        registerDevice(deviceKeyStore,pushToken, userStore?.codigoCliente); // Insere pushToken e código do cliente em sce002
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            fireNotification(remoteMessage.data);
        });

        const fireNotification = async (message: any) => {
            // Request permissions (required for iOS)
            await notifee.requestPermission();
            //   // Create a channel (required for Android)
            const channelId = await notifee.createChannel({
                id: 'important',
                name: 'NotificacoesImportantes',
            });

            // Display a notification
            await notifee.displayNotification({
                title: message.title,
                body: message.body,
                data: {
                    url: message.url,
                },
                android: {
                    channelId,
                    style: {
                        type: AndroidStyle.BIGPICTURE,
                        picture: message.image,
                    },
                    badgeIconType: AndroidBadgeIconType.SMALL,
                    importance: AndroidImportance.HIGH,
                    pressAction: {
                        id: 'inportant',
                    },
                },
            });
        };

        messaging().onNotificationOpenedApp(async (remoteMessage: any) => {
            console.log(
                'A notificação fez com que o aplicativo fosse aberto em segundo plano:',
                remoteMessage.notification,
            );
        });

        notifee.onForegroundEvent(async ({ type, detail }) => {
            const { notification, pressAction }: any = detail;
            if (type === EventType.PRESS && pressAction?.id === 'inportant') {
                await Linking.openURL(notification.data.url);
            }
        });
        return unsubscribe;
    }, [deviceKeyStore, pushToken, userStore]);

    // Registra ID do dispositivo e push token firbase
    async function registerDevice(deviceKeyStore: string, pushToken: any, codcli: any) {
        
        let deviceos = Platform.OS === 'ios' ? 'ios' : 'android';
        let versaoapp = process.env.EXPO_PUBLIC_APP_VERSION?.replace(/\./g, '');
        await serviceapp
            .get(
                `(WS_GRAVA_DEVICE)?deviceId=${deviceKeyStore}&pushToken=${pushToken}&deviceOs=${deviceos}&versaoApp=${versaoapp}&codcli=${codcli}`,
            )
            .then(response => {
                console.log(response.data.resposta.success);
            })
            .catch(err => {
                console.log(err);
            });
    };

    useEffect(() => {
        async function prepare() {
            try {
                await SplashScreen.preventAutoHideAsync();
                await Font.loadAsync({
                    Poppins_300Light,
                    Poppins_400Regular,
                    Poppins_500Medium,
                    Poppins_700Bold,
                    Poppins_900Black,
                });

                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (e) {
                // console.warn(e);
            } finally {
                // Tell the application to render
                setAppIsReady(true);
            }
        }
        prepare();
    }, []);

    const onLayout = useCallback(async () => {
        if (appIsReady) {
            await setTimeout(SplashScreen.hideAsync, 200);
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return null;
    }

    return (
        <SafeAreaProvider onLayout={onLayout}>
            <NavigationContainer>
                <AuthProvider>
                    <Routes />
                </AuthProvider>
            </NavigationContainer>
        </SafeAreaProvider>
    );
};

export default App;
