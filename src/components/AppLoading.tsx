import {View, Text, Modal, ActivityIndicator, Platform} from 'react-native';
import React from 'react';

interface LoadingProps {
    visible: boolean;
}

const AppLoading = ({visible}: LoadingProps) => {
    return (
        <Modal transparent visible={visible}>
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator
                    size="large"
                    color={'#154295'}
                    animating={true}
                />
            </View>
        </Modal>
    );
};

export default AppLoading;
