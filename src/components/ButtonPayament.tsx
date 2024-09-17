import {Text, TouchableOpacity, Platform} from 'react-native';
import React from 'react';

interface ButtonProps {
    bgclassname: string;
    txcolor: string;
    onpress?: any;
    label: string;
}

const ButtonPayament = ({
    bgclassname,
    txcolor,
    onpress,
    label,
}: ButtonProps) => {
    return (
        <TouchableOpacity
            onPress={onpress}
            className={`flex items-center justify-center ${bgclassname} border-2 border-white ${
                Platform.OS == 'ios'
                    ? 'shadow-sm shadow-gray-300'
                    : 'shadow-sm shadow-black'
            } py-2 rounded-lg w-full`}
        >
            <Text
                allowFontScaling={false}
                className={`text-lg ${txcolor} font-PoppinsMedium`}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
};

export default ButtonPayament;
