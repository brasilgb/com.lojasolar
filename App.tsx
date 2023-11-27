import 'react-native-gesture-handler';
import React, {useCallback, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
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
import {SafeAreaProvider} from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import notifee, {
    AndroidBadgeIconType,
    AndroidImportance,
    AndroidStyle,
    EventType,
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {Linking, Platform} from 'react-native';
import serviceapp from '@services/serviceapp';
import {AuthProvider} from '@contexts/auth';

const App = () => {
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        const getUidDevice = async () => {
            let uuid = uuidv4();
            let fetchUUID = await SecureStore.getItemAsync('secure_deviceid');
            if (fetchUUID === null) {
                await SecureStore.setItemAsync(
                    'secure_deviceid',
                    JSON.stringify(uuid),
                );
            }
            let token = await SecureStore.getItemAsync('secure_deviceid');
            // console.log('token telefone ' + token);
        };
        getUidDevice();
    }, []);

    //*******Notifications push************************************************************** */
    const requestUserPermission = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            // console.log('Authorization status:', authStatus);
            let tokenFirebase = (await messaging().getToken()).toString();
            // console.log('token firebase' + tokenFirebase && tokenFirebase);
            registerDevice(tokenFirebase);
        }
    };

    useEffect(() => {
        requestUserPermission();

        const unsubscribe = messaging().onMessage(async remoteMessage => {
            // Alert.alert('FCM Message', JSON.stringify(remoteMessage));
            fireNotification(remoteMessage.data);
        });

        // Register background handler
        messaging().setBackgroundMessageHandler(async (remoteMessage: any) => {
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

        notifee.onBackgroundEvent(async ({type, detail}) => {
            const {notification, pressAction}: any = detail;
            if (type === EventType.PRESS && pressAction?.id === 'inportant') {
                await Linking.openURL(notification.data.url);
                await notifee.cancelNotification(notification?.id);
            }
        });

        notifee.onForegroundEvent(async ({type, detail}) => {
            const {notification, pressAction}: any = detail;
            if (type === EventType.PRESS && pressAction?.id === 'inportant') {
                await Linking.openURL(notification.data.url);
                await notifee.cancelNotification(notification.id);
            }
        });
        return unsubscribe;
    }, []);

    // Registra ID do dispositivo e push token firbase
    const registerDevice = useCallback(async (tokenFirebase: any) => {
        let deviceos = Platform.OS === 'ios' ? 'IOS' : 'Android';
        let tokenId: any = await SecureStore.getItemAsync('secure_deviceid');
        console.log(JSON.parse(tokenId));
        await serviceapp
            .get(
                `(WS_GRAVA_DEVICE)?deviceId=${JSON.parse(
                    tokenId,
                )}&pushToken=${tokenFirebase}&deviceOs=${deviceos}&versaoApp=${process.env.EXPO_PUBLIC_APP_VERSION?.replace(
                    /\./g,
                    '',
                )}`,
            )
            .then(response => {
                console.log(response.data.resposta);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

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
