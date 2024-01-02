import {
    View,
    Text,
    ActivityIndicator,
    Dimensions,
    Platform,
} from 'react-native';
import React from 'react';
import AppLayout from '@components/AppLayout';
import WebView from 'react-native-webview';
import * as WebBrowser from 'expo-web-browser';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {MaterialIcons} from '@expo/vector-icons';

export const VIEW_WIDTH = Dimensions.get('window').width;
const PrivacyPolice = () => {
    function LoadingIndicatorView() {
        return (
            <ActivityIndicator
                size="large"
                color={'#154295'}
                animating={true}
            />
        );
    }
    const dataHtml = {
        uri: 'http://services.gruposolar.com.br:8082/midias/img/politica.html',
    };

    let colorBar = Platform.OS === 'ios' ? 'rgba(0, 162, 227, 0)' : '#00AEEF';
    const handlePressButtonAsync = async (url: any) => {
        let result = await WebBrowser.openBrowserAsync(url, {
            toolbarColor: colorBar,
            controlsColor: '#FFF',
        });
    };

    return (
        <AppLayout>
            <View className="flex-1 items-center justify-start bg-solar-gray-dark px-4">
                <View className="flex-col items-center justify-center">
                    <Text allowFontScaling={false} className="text-3xl text-solar-blue-dark py-4">
                        Política de privacidade
                    </Text>
                </View>

                {dataHtml && (
                    <WebView
                        originWhitelist={['*']}
                        source={dataHtml}
                        renderLoading={LoadingIndicatorView}
                        startInLoadingState={true}
                        style={{flex: 1, width: VIEW_WIDTH, marginTop: 20}}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                    />
                )}
            </View>
            <View className="py-4 w-full bg-solar-blue-light">
                <Text allowFontScaling={false} className="text-xs text-white text-center font-PoppinsRegular">
                    Para saber mais sobre nossa política de privacidade acesse
                </Text>
                <TouchableOpacity
                    className="flex-row items-center justify-center"
                    onPress={() =>
                        handlePressButtonAsync(
                            'https://www.lojasolar.com.br/duvidas?page=politica-de-privacidade',
                        )
                    }
                >
                    <MaterialIcons name="link" size={22} color={'#555'} />
                    <Text allowFontScaling={false} className="text-xs pl-2 text-[#555] text-center font-PoppinsRegular py-2 underline">
                        Política de privacidade Lojas Solar
                    </Text>
                </TouchableOpacity>
            </View>
        </AppLayout>
    );
};

export default PrivacyPolice;
