import {
    View,
    Text,
    Platform,
    Modal,
    TouchableOpacity,
    TextInput,
    Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {MaterialIcons} from '@expo/vector-icons';
import {FlashList} from '@shopify/flash-list';

interface SelectProps {
    onChangeSelect: any;
    text: string;
    data: any;
    disabled?: boolean;
    value: any;
    onchangetext: any;
    onblur: any;
    showSearch?: boolean;
    height?: any;
}

const Select = ({
    onChangeSelect,
    text,
    data,
    disabled,
    onchangetext,
    onblur,
    value,
    showSearch,
    height,
}: SelectProps) => {
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
                onChangeSelect(item);
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
                <MaterialIcons name="check" size={22} color={'#154295'} />
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
            <Pressable onPress={() => setModalVisible(true)}>
                <View pointerEvents="none" className="relative">
                    <TextInput
                        className={`w-full flex-row items-center justify-between ${
                            Platform.OS === 'ios' ? 'h-[60px]' : 'h-[56px]'
                        } rounded-lg bg-white border placeholder:text-solar-blue-dark border-gray-300 text-lg px-4 font-PoppinsRegular`}
                        value={
                            value.length > 35
                                ? value.slice(0, 35) + '...'
                                : value
                        }
                        onBlur={onblur}
                        onChangeText={onchangetext}
                        editable={disabled}
                        placeholder={text}
                    />
                </View>
                <View className="absolute right-1 top-4">
                    <MaterialIcons name="expand-more" size={26} />
                </View>
            </Pressable>
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
                                    color={'#154295'}
                                />
                            </TouchableOpacity>
                            <Text className="text-base text-gray-700 font-PoppinsMedium">
                                {text}
                            </Text>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                            >
                                <MaterialIcons
                                    name="close"
                                    size={22}
                                    color={'#154295'}
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

export default Select;
