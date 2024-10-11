import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons'; // Icon library for the plus sign
import { Link, useNavigation } from 'expo-router'; // Navigation for routing

export default function Shop() {
  const [categories, setCategories] = useState([]);
  const [sliders, setSliders] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // State for selected category
  const [products, setProducts] = useState([]); // State for products
  const flatListRef = useRef(null); // Reference for FlatList
  const slideInterval = useRef(null); // Reference for the interval
  const navigation = useNavigation(); // Navigation instance

  useEffect(() => {
// When fetching data, use FIREBASE_DB
const fetchCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(FIREBASE_DB, 'Category'));
    const categoryList = querySnapshot.docs.map(doc => doc.data());
    setCategories(categoryList);
  } catch (error) {
    console.error("Error fetching categories: ", error);
  }
};

const fetchSliders = async () => {
  try {
    const querySnapshot = await getDocs(collection(FIREBASE_DB, 'Sliders'));
    const sliderList = querySnapshot.docs.map(doc => doc.data());
    setSliders(sliderList);
  } catch (error) {
    console.error("Error fetching sliders: ", error);
  }
};

    fetchCategories();
    fetchSliders();

    // Initialize currentIndex to 0
    if (flatListRef.current) {
      flatListRef.current.currentIndex = 0;
    }

    // Start auto sliding
    slideInterval.current = setInterval(() => {
      if (flatListRef.current && sliders.length > 0) {
        const nextIndex = (flatListRef.current.currentIndex + 1) % sliders.length; // Loop to the start
        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        flatListRef.current.currentIndex = nextIndex; // Update current index
      }
    }, 3000); // Change slide every 3 seconds

    // Clear interval on component unmount
    return () => clearInterval(slideInterval.current);
  }, [sliders]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedCategory) {
        try {
          const q = query(collection(db, 'Products'), where('category', '==', selectedCategory));
          const querySnapshot = await getDocs(q);
          const productList = querySnapshot.docs.map(doc => doc.data());
          setProducts(productList);
        } catch (error) {
          console.error("Error fetching products: ", error);
        }
      }
    };

    fetchProducts();
  }, [selectedCategory]); // Fetch products when the selected category changes

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => setSelectedCategory(item.name)} // Set selected category on press
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.categoryImage}
      />
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderSliderItem = ({ item }) => (
    <Image
      source={{ uri: item.imageUrl }}
      style={styles.sliderImage}
    />
  );

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('productdetail', { productId: item.id })} // Navigate to product detail
    >
      <View style={styles.productItem}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.productImage}
        />
        <Text style={styles.productName}>{item.name}</Text> {/* Only name displayed */}
      </View>
    </TouchableOpacity>
  );
  

  return (
    <View style={styles.container}>
      {/** Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Welcome to</Text>
          <Text style={styles.headerTitle}>Eco Store</Text>
        </View>

        {/** Add Product Button */}
        <Link href='/addpost'>Add product</Link>
      </View>

      {/** Slider */}
      <FlatList
        ref={flatListRef} // Assign the ref to the FlatList
        data={sliders}
        renderItem={renderSliderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.slider}
        onScrollToIndexFailed={() => {}}
        onMomentumScrollEnd={(event) => {
          const index = Math.floor(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
          flatListRef.current.currentIndex = index; // Track the current index
        }}
      />

      {/** Categories */}
      <Text style={styles.categoriesTitle}>Categories</Text>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
      />

      {/** Products List */}
      {selectedCategory && (
        <View>
          <Text style={styles.productsTitle}>Products in {selectedCategory}</Text>
          <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginLeft: 20,
  },
  headerContainer: {
    flexDirection: 'row', // Align header and button horizontally
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 40,
  },
  headerTextContainer: {
    flexDirection: 'column',
  },
  headerText: {
    fontSize: 24,
    color: 'black',
  },
  headerTitle: {
    fontSize: 30,
    color: 'darkgreen',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: 'green',
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slider: {
    height: 200,
    marginBottom: 20,
  },
  sliderImage: {
    width: 300,
    height: '100%',
    borderRadius: 10,
  },
  categoriesTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  categoryItem: {
    margin: 10,
    alignItems: 'center',
  },
  categoryImage: {
    width: 100, // Reduced width
    height: 100, // Reduced height
    borderRadius: 10,
  },
  categoryText: {
    marginTop: 5,
  },
  productsTitle: {
    fontSize: 24,
    marginTop: 20,
    marginBottom: 10,
  },
  productItem: {
    margin: 10,
    alignItems: 'center',
  },
  productImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productDescription: {
    textAlign: 'center',
    marginVertical: 5,
  },
  productPrice: {
    color: 'darkgreen',
    fontSize: 16,
  },
});
