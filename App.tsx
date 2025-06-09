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
import serviceapp from '@services/serviceapp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';

messaging().setBackgroundMessageHandler(async (remoteMessage: any) => {
    await messaging().requestPermission();
    const channelId = await notifee.createChannel({
        id: 'important',
        name: 'NotificacoesImportantes',
    });

    // Display a notification
    await notifee.displayNotification({
        title: remoteMessage.data.title,
        body: remoteMessage.data.body,
        data: {
            url: remoteMessage.data.url
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
        ios: {
            foregroundPresentationOptions: {
                badge: true,
                sound: true,
                banner: true,
                list: true,
            },
            targetContentId: '',
            attachments: [
                {
                    url: remoteMessage.data.image
                },
            ],
        },
    });
});
notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction }: any = detail;

    if (type === EventType.PRESS || pressAction?.id == 'important') {
        await Linking.openURL(notification.data.url);
    }
});

notifee.onForegroundEvent(async ({ type, detail }) => {

    const { notification, pressAction }: any = detail;

    if (type === EventType.PRESS || pressAction?.id == 'important') {
        await Linking.openURL(notification.data.url);
    }
});

const App = () => {
    const [appIsReady, setAppIsReady] = useState(false);
    
    const [deviceId, setDeviceId] = useState<string | null>(null);
    useEffect(() => {
        const getValueDevice = async () => {
            try {
                const value = await AsyncStorage.getItem("deviceid");
                if (value !== null) {
                    setDeviceId(value);
                } else {
                    const uniqueId = await DeviceInfo.getUniqueId();
                    if (uniqueId) {
                        await AsyncStorage.setItem("deviceid", uniqueId);
                        setDeviceId(uniqueId);
                    }
                }
            } catch (error) {
                console.error('AsyncStorage Error: ', error);
            }
        }
        getValueDevice();
    }, []);

    const requestUserPermission = async () => {
        await notifee.createChannel({
            id: 'important',
            name: 'NotificacoesImportantes',
        });
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {

            let tokenFirebase = (await messaging().getToken()).toString();
            registerDevice(tokenFirebase); // Insere pushToken e código do cliente em sce002
        }
    };

    notifee.onBackgroundEvent(async ({ type, detail }) => {
        const { notification, pressAction }: any = detail;
        if (type === EventType.PRESS || pressAction?.id === 'inportant') {
            await Linking.openURL(notification.data.url);
        }
    });

    useEffect(() => {
        requestUserPermission();

        const unsubscribe = messaging().onMessage(async remoteMessage => {
            fireNotification(remoteMessage.data);
        });

        const fireNotification = async (message: any) => {
            // Request permissions (required for iOS)

            await notifee.requestPermission();
            const channelId = await notifee.createChannel({
                id: 'important',
                name: 'NotificacoesImportantes',
            });
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
                        id: 'inportant2',
                    },
                },
                ios: {
                    foregroundPresentationOptions: {
                        badge: true,
                        sound: true,
                        banner: true,
                        list: true,
                    },
                    attachments: [
                        {
                            url: message.image
                        },
                    ]
                },
            });
        };

        messaging().getInitialNotification()
            .then((remoteMessage) => {
                console.log("Notification caused app to open from quit state:", remoteMessage?.notification)
            });

        messaging().onNotificationOpenedApp(async (remoteMessage: any) => {
            console.log(
                'A notificação fez com que o aplicativo fosse aberto em segundo plano:',
                remoteMessage.notification,
            );
        });


        return unsubscribe;
    }, []);

    // Registra ID do dispositivo e push token firbase
    async function registerDevice(
        pushToken: any
    ) {
        let deviceos = Platform.OS === 'ios' ? 'ios' : 'android';
        let versaoapp = process.env.EXPO_PUBLIC_APP_VERSION?.replace(/\./g, '');

        await serviceapp
            .get(
                `(WS_GRAVA_DEVICE)?deviceId=${deviceId}&pushToken=${pushToken}&deviceOs=${deviceos}&versaoApp=${versaoapp}`,
            )
            .then(response => {
                // console.log(response.data.resposta);
            })
            .catch(err => {
                // console.log(err);
            });
    }

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
