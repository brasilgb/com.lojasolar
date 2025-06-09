import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    Image,
    Platform,
    ScrollView,
    BackHandler,
} from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import ButtonHome from '@components/ButtonHome';
import AppLayout from '@components/AppLayout';
import * as WebBrowser from 'expo-web-browser';
import Carousel, { Pagination } from 'react-native-snap-carousel-v4';
import { AuthContext } from '@contexts/auth';
import serviceapp from '@services/serviceapp';
import { RootDrawerParamList } from '@screens/RootDrawerPrams';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const CAROUSEL_VERTICAL_OUTPUT = 1;
export const CAROUSEL_ITEM_WIDTH = SCREEN_WIDTH - CAROUSEL_VERTICAL_OUTPUT;

interface CarouselItemProps {
    item: any;
    index: any;
}

const Home = () => {
    const navigation =
        useNavigation<StackNavigationProp<RootDrawerParamList>>();
    const { signed } = useContext(AuthContext);
    const isCarousel: any = useRef(null);
    const [index, setIndex] = useState(0);
    const [carrocelData, setCarrocelData] = useState<any>([]);

    useEffect(() => {
        const getVersionCheck = async () => {
            let versionApp: any = process.env.EXPO_PUBLIC_APP_VERSION?.replace(
                /\./g,
                '',
            );
            await serviceapp
                .get('WS_VERSAO_APP')
                .then(response => {
                    const { android, ios } = response.data.resposta.data;
                    const version = Platform.OS === 'ios' ? ios : android; // Sistema opreacional
                    let versionNew: any = version?.split('').join('.'); // Adiciona pontos após unidade
                    const data = {
                        atual: process.env.EXPO_PUBLIC_APP_VERSION,
                        nova: versionNew,
                    };
                    if (version > versionApp) {
                        navigation.navigate('VerifyVersion', { data: data });
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        };
        getVersionCheck();
    }, []);

    function handleBackButtonClick() {
        navigation.dispatch(DrawerActions.openDrawer());
        return true;
    }

    useEffect(() => {
        const subscription = BackHandler.addEventListener(
            'hardwareBackPress',
            handleBackButtonClick,
        );
        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        async function getCarrocel() {
            await serviceapp
                .get(`(WS_CARROCEL_PROMOCAO)`)
                .then(response => {
                    const { data } = response.data.resposta;
                    setCarrocelData(data.carrocel);
                })
                .catch(err => {
                    console.log(err);
                });
        }
        getCarrocel();
    }, []);

    let colorBar = Platform.OS === 'ios' ? 'rgba(0, 162, 227, 0)' : '#1a9cd9';
    const handlePressButtonAsync = async (url: any) => {
        let result = await WebBrowser.openBrowserAsync(url, {
            toolbarColor: colorBar,
            controlsColor: '#FFF',
        });
    };

    const CarouselCardItem = ({ item, index }: CarouselItemProps) => {
        return (
            <View
                key={index}
                className="flex-1 items-center justify-center w-full bg-green-300"
            >
                <View className="bg-solar-gray-dark w-full">
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => handlePressButtonAsync(item.carLink)}
                    >
                        <Image
                            source={{ uri: item.carLinkImagem }}
                            className="h-full "
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <AppLayout>
            <View className="flex-grow bg-slate-500">
                <View className="flex-1 w-full bg-gray-50">
                    <View className=" h-24 flex items-center justify-center">

                        <Text
                            allowFontScaling={false}
                            className="text-2xl font-PoppinsBold text-solar-blue-dark text-center"
                        >
                            Seja bem vindo
                        </Text>
                        <Text className="text-solar-blue-dark">
                            ao app das Lojas Solar
                        </Text>
                    </View>
                    <View className="flex-1 py-8 bg-white border-y border-y-gray-100">
                        <Carousel
                            vertical={false}
                            layout="default"
                            layoutCardOffset={9}
                            ref={isCarousel}
                            data={carrocelData}
                            renderItem={CarouselCardItem}
                            sliderWidth={SCREEN_WIDTH}
                            itemWidth={CAROUSEL_ITEM_WIDTH}
                            inactiveSlideShift={0}
                            useScrollView={true}
                            onSnapToItem={(index: any) => setIndex(index)}
                            autoplay={true}
                            autoplayDelay={1500}
                            autoplayInterval={4000}
                            inactiveSlideScale={1}
                            inactiveSlideOpacity={1}
                            loop={true}
                            hasParallaxImages={true}
                        />
                    </View>
                    <View className="">
                        <Pagination
                            dotsLength={carrocelData?.length}
                            activeDotIndex={index}
                            carouselRef={isCarousel}
                            dotContainerStyle={{
                                height: 0,
                                padding: 0,
                                margin: 0,
                            }}
                            dotStyle={{
                                width: 15,
                                height: 10,
                                borderRadius: 5,
                                marginHorizontal: 0,
                                backgroundColor: 'rgb(0, 174, 239)',
                            }}
                            inactiveDotOpacity={0.4}
                            inactiveDotScale={0.6}
                            tappableDots={true}
                            containerStyle={{
                                height: 15,
                                padding: 0,
                                margin: 0,
                                backgroundColor: '#FAFAFA',
                            }}
                        />
                    </View>
                </View>
            </View>

            <View className="flex-none bg-solar-blue-light">
                <ScrollView
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    className="flex-row"
                >
                    <ButtonHome
                        label="Comprar"
                        icon={
                            <MaterialIcons
                                name="shopping-basket"
                                size={30}
                                color="#FAFAFA"
                            />
                        }
                        nav={() =>
                            handlePressButtonAsync(
                                'https://www.lojasolar.com.br/',
                            )
                        }
                    />
                    <ButtonHome
                        label="Assinar Doc."
                        icon={
                            <MaterialCommunityIcons
                                name="file-document-edit"
                                size={30}
                                color="#FAFAFA"
                            />
                        }
                        nav={() =>
                            signed
                                ? navigation.navigate('DocsAssign')
                                : navigation.navigate('SignIn')
                        }
                    />
                    <ButtonHome
                        label="Pagamentos"
                        icon={
                            <MaterialIcons
                                name="attach-money"
                                size={30}
                                color="#FAFAFA"
                            />
                        }
                        nav={() =>
                            signed
                                ? navigation.navigate('OpenPayments')
                                : navigation.navigate('SignIn')
                        }
                    />
                    <ButtonHome
                        label="Cashback"
                        icon={
                            <MaterialIcons
                                name="currency-exchange"
                                size={30}
                                color="#FAFAFA"
                            />
                        }
                        nav={() =>
                            signed
                                ? navigation.navigate('CashBack')
                                : navigation.navigate('SignIn')
                        }
                    />
                    <ButtonHome
                        label="Lojas"
                        icon={
                            <MaterialIcons
                                name="location-on"
                                size={30}
                                color="#FAFAFA"
                            />
                        }
                        nav={() =>
                            navigation.navigate('StoresLocation', { data: false })
                        }
                    />
                    <ButtonHome
                        label="Assistência"
                        icon={
                            <MaterialIcons
                                name="handyman"
                                size={30}
                                color="#FAFAFA"
                            />
                        }
                        nav={() =>
                            signed
                                ? navigation.navigate('Protocol')
                                : navigation.navigate('SignIn')
                        }
                    />
                    <ButtonHome
                        label="Fale conosco"
                        icon={
                            <MaterialIcons
                                name="perm-phone-msg"
                                size={30}
                                color="#FAFAFA"
                            />
                        }
                        nav={() => navigation.navigate('Contact')}
                    />
                    <ButtonHome
                        label="Historico"
                        icon={
                            <MaterialIcons
                                name="history"
                                size={30}
                                color="#FAFAFA"
                            />
                        }
                        nav={() =>
                            signed
                                ? navigation.navigate('History')
                                : navigation.navigate('SignIn')
                        }
                    />
                    <ButtonHome
                        label="2 via Boleto"
                        icon={
                            <MaterialIcons
                                name="qr-code"
                                size={30}
                                color="#FAFAFA"
                            />
                        }
                        nav={() =>
                            signed
                                ? navigation.navigate('Twobillet')
                                : navigation.navigate('SignIn')
                        }
                    />
                </ScrollView>
            </View>
        </AppLayout>
    );
};

export default Home;
