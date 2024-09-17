import {Text, TouchableOpacity} from 'react-native';
import React from 'react';

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
            {icon}
            <Text
                allowFontScaling={false}
                className="text-xs text-solar-gray-light font-poppinsmedium"
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
};

export default ButtonHome;
