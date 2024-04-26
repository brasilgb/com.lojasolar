import {Text, Platform} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';

interface ButtomProps {
    title: string;
    isValid: boolean;
    onPress: () => void;
}

const ButtomForm = ({title, isValid, onPress}: ButtomProps) => {
    return (
        <TouchableOpacity
            className={`flex items-center justify-center border-2 border-white ${
                Platform.OS == 'ios'
                    ? 'shadow-sm shadow-gray-300'
                    : 'shadow-sm shadow-black'
            } ${
                !isValid ? 'bg-solar-gray-dark' : 'bg-solar-orange-middle'
            } py-3 rounded-full`}
            onPress={onPress}
        >
            <Text
                className={`text-lg font-PoppinsMedium self-center ${
                    !isValid ? 'text-gray-300' : 'text-solar-blue-dark'
                }`}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
};

export default ButtomForm;
