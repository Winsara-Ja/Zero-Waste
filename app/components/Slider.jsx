import { View, Image, StyleSheet, Text } from 'react-native';
import React, { memo } from 'react';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler'; // Import GestureHandlerRootView

// Create a memoized component for slider items
const SliderItem = memo(({ item }) => {
  return (
    <View>
      {item?.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.sliderImage}
        />
      ) : (
        <Text>No Image Available</Text>
      )}
    </View>
  );
});

export default function Slider({ sliderList }) {
  // Define renderItem function outside of the FlatList
  const renderSliderItem = ({ item }) => {
    return <SliderItem item={item} />;
  };

  return (
    <GestureHandlerRootView>
      <FlatList
        data={sliderList}
        keyExtractor={(item, index) => item.id || index.toString()} // Use a unique identifier if available
        renderItem={renderSliderItem} // Use the external render function
        initialNumToRender={5} // Adjust this based on your needs
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  sliderImage: {
    width: '80%',
    height: 160,
    marginVertical: 10,
  },
});
