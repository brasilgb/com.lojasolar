import {
    View,
    Text,
    Alert,
    Linking,
    TouchableOpacity,
    Platform,
    Animated,
} from 'react-native';
import React, {useContext, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootDrawerParamList} from '@screens/RootDrawerPrams';
import {AuthContext} from '@contexts/auth';
import AppLayout from '@components/AppLayout';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {MaterialIcons} from '@expo/vector-icons';

const StoreSelected = ({route}: any) => {
    const {data} = route?.params;
    const navigation =
        useNavigation<StackNavigationProp<RootDrawerParamList>>();
    const {positionGlobal} = useContext(AuthContext);
    const mapRef = useRef<any>();
    const [initialRegion, setInitialRegion] = useState({
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        latitudeDelta: 0.0043,
        longitudeDelta: 0.0034,
    });

    const handleMapDirection = () => {
        Alert.alert(
            'Atenção',
            'O mapa será aberto no navegador',
            [
                {
                    text: 'Sim',
                    onPress: () =>
                        Linking.openURL(
                            `https://www.google.com/maps/dir/?api=1&layer=transit&origin=${positionGlobal[0]},${positionGlobal[1]}&destination=${data.latitude},${data.longitude}&dir_action=replace`,
                        ),
                },
                {
                    text: 'Não',
                    style: 'cancel',
                },
            ],
            {cancelable: false},
        );
    };

    return (
        <AppLayout>
            <View className="flex-1 w-full bg-solar-gray-light ">
                <View className="h-2/4">
                    <MapView
                        ref={mapRef}
                        provider={PROVIDER_GOOGLE}
                        className="flex-1"
                        initialRegion={initialRegion}
                        showsUserLocation
                        loadingEnabled
                    >
                        <Marker
                            coordinate={{
                                latitude: parseFloat(data.latitude),
                                longitude: parseFloat(data.longitude),
                            }}
                        >
                            <Animated.View className="items-center justify-center w-12 h-12">
                                <Animated.Image
                                    source={require('@assets/map_marker.png')}
                                    className="w-12 h-12"
                                    resizeMode="cover"
                                />
                            </Animated.View>
                        </Marker>
                    </MapView>
                </View>

                <View className="px-2 py-4">
                    <View className="flex-row items-center justify-between">
                        <Text
                            allowFontScaling={false}
                            className="text-lg font-PoppinsRegular text-solar-blue-dark ml-2"
                        >
                            {data.cidade}
                        </Text>
                        <Text
                            allowFontScaling={false}
                            className="text-lg font-PoppinsRegular text-solar-yellow-dark ml-2"
                        >
                            {data.distancia}
                        </Text>
                    </View>
                    <Text
                        allowFontScaling={false}
                        className="text-lg font-PoppinsRegular text-gray-600 ml-2"
                    >
                        {data.endereco}
                    </Text>
                    <Text
                        allowFontScaling={false}
                        className="text-lg font-PoppinsRegular text-gray-600 ml-2"
                    >
                        {data.email}
                    </Text>
                    <Text
                        allowFontScaling={false}
                        className="text-lg font-PoppinsRegular text-solar-blue-dark ml-2"
                    >
                        {data.telefone}
                    </Text>
                </View>

                <View className="flex-1 px-4">
                    <View className="border-t border-gray-400 py-8 px-2">
                        <TouchableOpacity
                            className="flex-row items-center justify-start "
                            onPress={handleMapDirection}
                        >
                            <MaterialIcons
                                name="alt-route"
                                color="#0d3b85"
                                size={30}
                            />
                            <Text
                                allowFontScaling={false}
                                className="text-lg font-PoppinsRegular text-solar-blue-dark ml-2"
                            >
                                Traçar rota
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View
                    className={`flex-row items-center justify-between bg-solar-orange-middle px-4 ${
                        Platform.OS === 'ios' ? 'pt-4 pb-14' : 'py-4'
                    }`}
                >
                    <View>
                        <Text
                            allowFontScaling={false}
                            className="text-lg font-PoppinsRegular text-white"
                        >
                            Ligar para a loja
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => Linking.openURL(`tel:${data.telefone}`)}
                    >
                        <MaterialIcons
                            name="phone-in-talk"
                            color={'white'}
                            size={26}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </AppLayout>
    );
};

export default StoreSelected;
