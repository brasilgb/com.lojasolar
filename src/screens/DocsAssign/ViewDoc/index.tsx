import React from 'react'
import WebView from "react-native-webview";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootDrawerParamList } from "@screens/RootDrawerPrams";
import { View } from "react-native";
type Props = {}

const ViewDoc = ({ route }: any) => {
    const { data } = route?.params;
    const navigation = useNavigation<StackNavigationProp<RootDrawerParamList>>();
    return (
        <>
            <View className="absolute top-6 right-5 z-20">
                <Ionicons name="close" size={34} color={"white"} onPress={() => navigation.navigate("DocsAssign")} />
            </View>
            <WebView
                source={{ uri: data }}
                allowFileAccess={true}
            />
        </>

    )
}

export default ViewDoc