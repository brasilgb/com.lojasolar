import { Image, View, Text, Button, Pressable, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const DrawerHeader = () => {
    const navigation = useNavigation() as any;
    const { top } = useSafeAreaInsets();
    return (
        <View className='bg-solar-blue-light h-24 flex-row items-center justify-between px-2' style={{ paddingTop: top }}>
            <View className='h-10 w-10'>
                <TouchableOpacity
                    className='h-10 w-10 flex-row items-center justify-center'
                    onPress={() => navigation.openDrawer()}
                >
                    <Ionicons name={'menu'} size={28}color={'white'} />
                </TouchableOpacity>
            </View>
            <Image source={require('@assets/logosolar.png')} style={{ width: 220, height: 40 }} />
            <View className='h-10 w-10'/>

        </View>
    )
}

export default DrawerHeader