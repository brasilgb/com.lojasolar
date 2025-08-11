import { registerRootComponent } from 'expo';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
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
            url: remoteMessage.data.url,
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

registerRootComponent(App);
