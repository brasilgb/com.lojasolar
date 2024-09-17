import {Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {FlashList} from '@shopify/flash-list';
import AppLayout from '@components/AppLayout';
import {ListStyle} from '@components/InputStyle';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootDrawerParamList} from '@screens/RootDrawerPrams';

const StoreList = ({route}: any) => {
    const navigation =
        useNavigation<StackNavigationProp<RootDrawerParamList>>();
    const {data} = route.params;

    const RenderItem = ({item}: any) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('StoreSelected', {data: item})}
            className={`flex-row items-center justify-between bg-solar-gray-light my-1 ${ListStyle}`}
        >
            <View className="p-2 w-full">
                <Text
                    className={`text-xl text-solar-blue-dark font-PoppinsBold mb-2`}
                >
                    {item.cidade}
                </Text>
                <Text
                    allowFontScaling={false}
                    className={`text-base text-gray-700 font-PoppinsRegular`}
                >
                    {item.endereco}
                </Text>
                <Text
                    allowFontScaling={false}
                    className={`text-base text-gray-700 font-PoppinsRegular`}
                >
                    {item.email}
                </Text>
                <View className="flex-row items-center justify-between border-t border-gray-200 mt-2 py-2">
                    <Text
                        className={`text-lg text-solar-blue-dark font-PoppinsMedium`}
                    >
                        {item.telefone}
                    </Text>
                    <Text
                        className={`text-lg text-solar-yellow-dark font-PoppinsMedium`}
                    >
                        {item.distancia}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <AppLayout>
            <View className="flex-1 items-center justify-center bg-solar-gray-dark w-full">
                <View className="flex-1 w-full px-4 ">
                    <View className="flex-col items-center justify-center mt-4">
                        <Text
                            allowFontScaling={false}
                            className="text-2xl text-solar-blue-dark font-PoppinsMedium mb-4 text-center"
                        >
                            Lojas mais próximas
                        </Text>
                        <Text
                            allowFontScaling={false}
                            className="text-base text-solar-blue-dark font-PoppinsRegular mb-4"
                        >
                            Encontre a loja solar mais próxima de você
                        </Text>
                    </View>

                    <FlashList
                        data={data}
                        renderItem={({item}: any) => <RenderItem item={item} />}
                        estimatedItemSize={10}
                        keyboardShouldPersistTaps={'always'}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </AppLayout>
    );
};

export default StoreList;
