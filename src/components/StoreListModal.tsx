import {Text, Modal, TouchableOpacity, View, Platform} from 'react-native';
import React, {useContext} from 'react';
import {AuthContext} from '@contexts/auth';
import {FlashList} from '@shopify/flash-list';
import {MaterialIcons} from '@expo/vector-icons';
import {ListStyle} from './InputStyle';

interface StoreListProps {
    dataModal: any;
}

const StoreListModal = ({dataModal}: StoreListProps) => {
    const {modalVisible, setModalVisible, setModalSelectedVisible} =
        useContext(AuthContext);

    const RenderItem = ({item}: any) => (
        <TouchableOpacity
            onPress={() => {
                setModalVisible(false);
            }}
            className={`flex-row items-center justify-between bg-solar-gray-light my-1 mx-2 ${ListStyle}`}
        >
            <View className="p-2 w-full">
                <Text
                    className={`text-xl text-solar-blue-dark font-PoppinsBold mb-2`}
                >
                    {item.cidade}
                </Text>
                <Text allowFontScaling={false} className={`text-base text-gray-700 font-PoppinsRegular`}>
                    {item.endereco}
                </Text>
                <Text allowFontScaling={false} className={`text-base text-gray-700 font-PoppinsRegular`}>
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
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View className="flex-col items-center justify-center">
                <View
                    className={`h-full ${
                        Platform.OS === 'ios' ? 'mt-[115]' : 'mt-[29]'
                    }  w-full`}
                >
                    <View className=" flex-row items-center justify-between px-[15]">
                        <MaterialIcons
                            name="navigate-before"
                            color="white"
                            size={26}
                            onPress={() => setModalVisible(false)}
                        />
                        <MaterialIcons
                            name="map"
                            color="white"
                            size={26}
                            onPress={() => setModalVisible(false)}
                        />
                    </View>
                    <View className="flex-1 top-28 bg-solar-gray-dark pb-2">
                        <FlashList
                            data={dataModal}
                            renderItem={({item}: any) => (
                                <RenderItem item={item} />
                            )}
                            estimatedItemSize={10}
                            keyboardShouldPersistTaps={'always'}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default StoreListModal;
