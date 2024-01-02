import {View, Text, Platform, Animated, Dimensions} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import AppLayout from '@components/AppLayout';
import {MaterialIcons} from '@expo/vector-icons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {AuthContext} from '@contexts/auth';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootDrawerParamList} from '@screens/RootDrawerPrams';
import serviceapp from '@services/serviceapp';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Carousel from 'react-native-snap-carousel';
import ButtonModal from '@components/ButtomModal';
import StoreListModal from '@components/StoreListModal';

const {width, height} = Dimensions.get('window');
export const HEIGHT = Dimensions.get('window').height;
export const SLIDER_WIDTH = Dimensions.get('window').width;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.8);
const CARD_WIDTH = width * 0.8;

interface ListCitiesProps {
    item: any;
    index: any;
}

const StoresLocation = ({route}: any) => {
    const {data} = route?.params;
    const {positionGlobal, setDataMap} = useContext(AuthContext);
    const navigation =
        useNavigation<StackNavigationProp<RootDrawerParamList>>();
    const [location, setLocation] = useState<[any, any]>([0, 0]);
    const [locationLojasProxima, setLocationLojasProxima] = useState<any>([]);
    const [citiesStore, setCitiesStore] = useState<any>([]);
    const isFocused = useIsFocused();

    const mapRef = useRef<any>();
    let mapAnimation = new Animated.Value(0);

    const [region, setRegion] = useState({
        latitude: positionGlobal[0],
        longitude: positionGlobal[1],
        latitudeDelta: 0.0043,
        longitudeDelta: 0.0034,
    });

    useEffect(() => {
        async function getLocationLojasProxima() {
            let lojas = data ? 'WS_CARREGA_LOJAS' : 'WS_LOJAS_PROXIMA';
            let latitudel = parseFloat(positionGlobal[0]);
            let longitudel = parseFloat(positionGlobal[1]);
            await serviceapp
                .get(`(${lojas})?latitude=${latitudel}&longitude=${longitudel}`)
                .then(response => {
                    if (data) {
                        let result = response.data.resposta.data.filter(
                            (l: any) =>
                                l.cidade.split('-')[0] === data.split('-')[0] &&
                                l.latitude !== '' &&
                                l.longitude !== '',
                        );
                        setLocationLojasProxima(result);
                        setDataMap(result);
                        const {latitude, longitude} = result[0];
                        setTimeout(() => {
                            const setregion = {
                                latitude: parseFloat(latitude),
                                longitude: parseFloat(longitude),
                                latitudeDelta: 0.0043,
                                longitudeDelta: 0.0034,
                            };
                            if (mapRef.current) {
                                mapRef.current.animateToRegion(setregion, 300);
                            }
                        }, 1000);
                    } else {
                        setLocationLojasProxima(response.data.resposta.data);
                        setDataMap(response.data.resposta.data);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
        if (isFocused) {
            getLocationLojasProxima();
        }
    }, [location, data]);

    useEffect(() => {
        async function getLocationLojas() {
            await serviceapp
                .get(`(WS_CARREGA_LOJAS)`)
                .then(response => {
                    setCitiesStore(
                        response.data.resposta.data.map(
                            (c: any) => c.cidade.split('-')[0],
                        ),
                    );
                })
                .catch(err => {
                    console.log(err);
                });
        }
        if (isFocused) {
            getLocationLojas();
        }
    }, []);

    const renderItem = ({item, index}: ListCitiesProps) => (
        <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate('StoreSelected', {data: item})}
        >
            <View
                key={index}
                className={` ${
                    Platform.OS == 'ios'
                        ? 'shadow-sm shadow-gray-300'
                        : 'shadow-sm shadow-black'
                } bg-solar-gray-middle m-2 border border-white rounded-lg`}
            >
                <View className="p-4">
                    <Text
                        allowFontScaling={false}
                        numberOfLines={1}
                        className="text-base text-solar-blue-dark font-Poppins_700Bold pb-1.5"
                    >
                        {item.cidade}
                    </Text>
                    <Text
                        allowFontScaling={false}
                        numberOfLines={1}
                        className="text-xs text-gray-500 font-Poppins_400Regular pb-1.5"
                    >
                        {item.endereco}
                    </Text>
                    <Text
                        allowFontScaling={false}
                        numberOfLines={1}
                        className="text-xs text-gray-500 font-Poppins_400Regular pb-1.5"
                    >
                        {item.email}
                    </Text>
                </View>
                <View className="flex-row items-center justify-between bg-solar-gray-dark px-2 pt-2 border-t border-white">
                    <Text
                        allowFontScaling={false}
                        numberOfLines={1}
                        className="text-base text-solar-blue-dark font-Poppins_500Medium pb-1.5"
                    >
                        {item.telefone}
                    </Text>
                    <Text
                        allowFontScaling={false}
                        numberOfLines={1}
                        className="text-base text-solar-yellow-dark font-Poppins_500Medium pb-1.5"
                    >
                        {item.distancia}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const onCaroucelItemChange = (index: any) => {
        const {latitude, longitude} = locationLojasProxima[index];

        const setregion = {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            latitudeDelta: 0.0043,
            longitudeDelta: 0.0034,
        };
        if (mapRef.current) {
            mapRef.current.animateToRegion(setregion, 300);
        }
    };

    const interpolations = locationLojasProxima.map(
        (marker: any, index: any) => {
            const inputRange = [
                (index - 1) * CARD_WIDTH,
                index * CARD_WIDTH,
                (index + 1) * CARD_WIDTH,
            ];

            const scale = mapAnimation.interpolate({
                inputRange,
                outputRange: [1, 1.5, 1],
                extrapolate: 'clamp',
            });

            return {scale};
        },
    );

    return (
        <AppLayout>
            <StoreListModal dataModal={locationLojasProxima} />
            <View className="flex-1 bg-solar-gray-dark">
                <View className="py-4 flex items-center justify-center ">
                    <Text allowFontScaling={false} className="text-2xl text-solar-blue-dark font-PoppinsMedium mb-4 text-center">
                        Lojas mais próximas
                    </Text>
                    <Text allowFontScaling={false} className="text-base text-solar-blue-dark font-PoppinsRegular mb-4">
                        Encontre a loja solar mais próxima de você
                    </Text>
                </View>

                <View className="flex-row items-center justify-start bg-solar-blue-light py-1 px-2">
                    <View>
                        <MaterialIcons
                            name="location-on"
                            size={32}
                            color={'white'}
                        />
                    </View>
                    <View className="flex-grow items-start justify-between py-1 pl-3 h-14">
                        <Text allowFontScaling={false} className="text-base text-white">
                            Sua localização
                        </Text>
                        <Text allowFontScaling={false} className="text-base text-white uppercase">
                            {data ? data : ''}
                        </Text>
                    </View>
                    <View>
                        <ButtonModal
                            classnameButtom={`border-2 border-white ${
                                Platform.OS == 'ios'
                                    ? 'shadow-sm shadow-gray-700'
                                    : 'shadow-sm shadow-black'
                            } py-2 px-4 my-2 rounded-full bg-solar-orange-middle`}
                            classnameText="text-base font-PoppinsMedium self-center text-solar-blue-dark"
                            onChangeSelect={undefined}
                            text="Selecione a cidade"
                            data={citiesStore}
                            label="Alterar"
                            onchangetext={undefined}
                            onblur={undefined}
                            height="h-full"
                            showSearch={true}
                        />
                    </View>
                </View>

                <View className="flex-1">
                    <MapView
                        ref={mapRef}
                        provider={PROVIDER_GOOGLE}
                        className="flex-1"
                        initialRegion={region}
                        showsUserLocation
                        loadingEnabled
                    >
                        {locationLojasProxima.map((marker: any, index: any) => {
                            const scaleStyle = {
                                transform: [
                                    {
                                        scale: interpolations[index].scale,
                                    },
                                ],
                            };
                            return (
                                <Marker
                                    key={index}
                                    coordinate={{
                                        latitude: parseFloat(marker.latitude),
                                        longitude: parseFloat(marker.longitude),
                                    }}
                                >
                                    <Animated.View className="items-center justify-center w-14 h-14">
                                        <Animated.Image
                                            source={require('../../../../assets/map_marker.png')}
                                            style={[scaleStyle]}
                                            className="w-5 h-5"
                                            resizeMode="cover"
                                        />
                                    </Animated.View>
                                </Marker>
                            );
                        })}
                    </MapView>
                </View>

                <View className="absolute bottom-16">
                    <Carousel
                        layout={'default'}
                        vertical={false}
                        layoutCardOffset={9}
                        data={locationLojasProxima}
                        renderItem={renderItem}
                        sliderWidth={SLIDER_WIDTH}
                        itemWidth={ITEM_WIDTH}
                        inactiveSlideShift={0}
                        useScrollView={true}
                        onSnapToItem={index => onCaroucelItemChange(index)}
                        autoplay={false}
                        inactiveSlideScale={1}
                        inactiveSlideOpacity={1}
                        callbackOffsetMargin={5}
                    />
                </View>
            </View>
        </AppLayout>
    );
};

export default StoresLocation;
