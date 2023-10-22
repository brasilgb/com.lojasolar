import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    Image,
    Platform,
    ScrollView,
} from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import ButtonHome from '@components/ButtonHome';
import AppLayout from '@components/AppLayout';
import * as WebBrowser from 'expo-web-browser';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { AuthContext } from '@contexts/auth';
import serviceapp from '@services/serviceapp';
import { RootDrawerParamList } from '@screens/RootStackPrams';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
export const SLIDER_WIDTH = Dimensions.get('window').width;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 1);

interface CarouselItemProps {
    item: any;
    index: any;
}

const Home = () => {
    const navigation =
        useNavigation<StackNavigationProp<RootDrawerParamList>>();
    const { setLoading, signed } = useContext(AuthContext);
    const isCarousel: any = useRef(null);
    const [index, setIndex] = useState(0);
    const [carrocelData, setCarrocelData] = useState<any>([]);

    useEffect(() => {
        async function getCarrocel() {
            setLoading(false);
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

    let colorBar = Platform.OS === 'ios' ? 'rgba(0, 162, 227, 0)' : '#00AEEF';
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
                <View className="flex-1 w-full bg-gray-200">
                    <Text
                        allowFontScaling={false}
                        className="bg-solar-gray-light text-lg font-PoppinsBold text-solar-blue-dark text-center py-3"
                    >
                        Olá, seja bem vindo!
                    </Text>
                    <View style={{ flex: 1, padding: 0, margin: 0 }}>
                        <Carousel
                            layout="default"
                            vertical={false}
                            layoutCardOffset={9}
                            ref={isCarousel}
                            data={carrocelData}
                            renderItem={CarouselCardItem}
                            sliderWidth={SLIDER_WIDTH}
                            itemWidth={ITEM_WIDTH}
                            inactiveSlideShift={0}
                            useScrollView={true}
                            onSnapToItem={(index: any) => setIndex(index)}
                            autoplay={true}
                            autoplayDelay={1000}
                            autoplayInterval={6000}
                            inactiveSlideScale={1}
                        />
                    </View>
                    <View>
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
                                width: 10,
                                height: 10,
                                borderRadius: 5,
                                marginHorizontal: 8,
                                backgroundColor: 'rgb(0, 174, 239)',
                            }}
                            inactiveDotOpacity={0.4}
                            inactiveDotScale={0.6}
                            tappableDots={true}
                            containerStyle={{
                                height: 10,
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
                        icon="shopping-basket"
                        nav={() =>
                            handlePressButtonAsync(
                                'https://www.lojasolar.com.br/',
                            )
                        }
                    />
                    <ButtonHome
                        label="Pagamentos"
                        icon="attach-money"
                        nav={() =>
                            signed
                                ? navigation.navigate('OpenPayments')
                                : navigation.navigate('SignIn')
                        }
                    />
                    <ButtonHome
                        label="2 via Boleto"
                        icon="qr-code"
                        nav={() =>
                            signed
                                ? navigation.navigate('Twobillet')
                                : navigation.navigate('SignIn')
                        }
                    />
                    <ButtonHome
                        label="Lojas"
                        icon="location-on"
                        nav={() =>
                            navigation.navigate('StoresLocation', { data: false })
                        }
                    />
                    <ButtonHome
                        label="Assistência"
                        icon="handyman"
                        nav={() =>
                            signed
                                ? navigation.navigate('Protocol')
                                : navigation.navigate('SignIn')
                        }
                    />
                    <ButtonHome
                        label="Fale conosco"
                        icon="perm-phone-msg"
                        nav={() => navigation.navigate('Contact')}
                    />
                    <ButtonHome
                        label="Historico"
                        icon="history"
                        nav={() =>
                            signed
                                ? navigation.navigate('History')
                                : navigation.navigate('SignIn')
                        }
                    />
                </ScrollView>
            </View>
        </AppLayout>
    );
};

export default Home;
