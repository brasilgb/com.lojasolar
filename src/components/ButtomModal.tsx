import {
    View,
    Text,
    Platform,
    Modal,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {MaterialIcons} from '@expo/vector-icons';
import {FlashList} from '@shopify/flash-list';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootDrawerParamList} from '@screens/RootDrawerPrams';

interface ButtonModalProps {
    onChangeSelect: any;
    text: string;
    data: any;
    disabled?: boolean;
    label: string;
    onchangetext: any;
    onblur: any;
    showSearch?: boolean;
    height?: any;
    classnameButtom?: string;
    classnameText?: string;
}

const ButtonModal = ({
    text,
    data,
    label,
    showSearch,
    height,
    classnameButtom,
    classnameText,
}: ButtonModalProps) => {
    const navigation =
        useNavigation<StackNavigationProp<RootDrawerParamList>>();
    const [txt, setTxt] = useState(text);
    const [modalVisible, setModalVisible] = useState(false);
    const [selected, setSelected] = useState('');
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    const RenderItem = ({item}: any) => (
        <TouchableOpacity
            onPress={() => {
                navigation.navigate('StoresLocation', {data: item});
                setTxt(item);
                setModalVisible(false);
                setSelected(item);
                setSearch('');
            }}
            className={`flex-row items-center justify-between px-4 py-2 border-b border-gray-200 ${
                item === selected ? 'bg-blue-50' : ''
            }`}
        >
            <Text
                className={`text-base ${
                    item === selected
                        ? 'text-gray-500 font-PoppinsBold'
                        : 'text-gray-700 font-PoppinsRegular'
                }`}
            >
                {item}
            </Text>
            {item === selected && (
                <MaterialIcons name="check" size={22} color={'#0d3b85'} />
            )}
        </TouchableOpacity>
    );

    const searchFilter = (text: any) => {
        if (text) {
            const newData = data.filter(function (item: any) {
                if (item) {
                    const itemData = item.toUpperCase();
                    const textData = text.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                }
            });
            setFilteredData(newData);
            setSearch(text);
        } else {
            setFilteredData(data);
            setSearch(text);
        }
    };

    return (
        <>
            <TouchableOpacity
                className={classnameButtom}
                onPress={() => setModalVisible(true)}
            >
                <Text allowFontScaling={false} className={classnameText}>
                    {label}
                </Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View
                    className={`flex-1 items-center justify-center p-2 ${
                        Platform.OS === 'ios' ? 'my-8' : ''
                    }`}
                >
                    <View
                        className={`bg-white ${height} w-full rounded-lg px-2 border border-gray-200 shadow-lg ${
                            Platform.OS === 'ios'
                                ? 'shadow shadow-gray-400'
                                : 'shadow-lg shadow-gray-800'
                        }`}
                    >
                        <View
                            className={`flex-row items-center justify-between border-b border-gray-200 pb-4 pl-0.5 px-4 mt-4`}
                        >
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                            >
                                <MaterialIcons
                                    name="arrow-back-ios"
                                    size={22}
                                    color={'#0d3b85'}
                                />
                            </TouchableOpacity>
                            <Text
                                allowFontScaling={false}
                                className="text-base text-gray-700 font-PoppinsMedium"
                            >
                                {text}
                            </Text>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                            >
                                <MaterialIcons
                                    name="close"
                                    size={22}
                                    color={'#0d3b85'}
                                />
                            </TouchableOpacity>
                        </View>
                        {showSearch && (
                            <>
                                <View className="border-b mx-2 my-2 p-2 bg-gray-100 rounded-lg border border-gray-200 flex-row items-center justify-start">
                                    <MaterialIcons
                                        name="search"
                                        size={26}
                                        color="#024D9F"
                                    />
                                    <TextInput
                                        className="py-1 px-4 placeholder:text-base placeholder:text-gray-600 text-base text-gray-600 w-[94%]"
                                        placeholder="Digite sua busca"
                                        onChangeText={text =>
                                            searchFilter(text)
                                        }
                                        value={search}
                                    />
                                </View>
                                <View className="border-b border-b-gray-300 mb-1 w-full" />
                            </>
                        )}

                        <FlashList
                            data={filteredData}
                            renderItem={({item}: any) => (
                                <RenderItem item={item} />
                            )}
                            estimatedItemSize={100}
                            keyboardShouldPersistTaps={'always'}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default ButtonModal;
