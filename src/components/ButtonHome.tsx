import {Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {MaterialIcons} from '@expo/vector-icons';

interface ButtonProps {
    label?: string;
    icon?: any;
    nav?: any;
}

const ButtonHome = ({label, icon, nav}: ButtonProps) => {
    return (
        <TouchableOpacity
            onPress={nav}
            className="flex-col items-center justify-around w-20 h-20 py-2"
        >
            <MaterialIcons name={icon} size={30} color="#FAFAFA" />
            <Text className="text-xs text-solar-gray-light font-poppinsmedium">
                {label}
            </Text>
        </TouchableOpacity>
    );
};

export default ButtonHome;
