import { useRef, useState } from "react";
import { Dimensions, FlatList, Image, StyleSheet, View, ViewToken } from "react-native";
import Pagination from "./Pagination";

type Props = {
    images: string[]
}

const width = Dimensions.get("screen").width;

export default function ImageSlider({images}: Props) {
    const [paginationIndex, setPaginationIndex] = useState(0);
    const viewabilityConfig = {
        itemVisiblePercentThreshold: 50
    };

    const onViewableItemsChanged = ({viewableItems}: {viewableItems: ViewToken[]}) =>{
        if(viewableItems[0].index !== undefined && viewableItems[0].index !== null){
            setPaginationIndex(viewableItems[0].index % images.length)
        }
    }

    const viewabilityConfigCallbackPairs = useRef([{
        viewabilityConfig, onViewableItemsChanged
    }])
    return (
        <View>
            <FlatList
                data={images}
                renderItem={({item}) => (
                    <View style={styles.slider}>
                        <Image source={{uri: item}} style={styles.image}/>
                    </View>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
            />
            <Pagination items={images} paginationIndex={paginationIndex} />
        </View>
    )
}

const styles = StyleSheet.create({
    slider: {
        width: width,
        justifyContent: "center",
        alignItems: "center"
    },
    image: {
        width: "100%",
        height: 300,
    }
})