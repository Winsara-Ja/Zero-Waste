import { View, Text, Image, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/index';
import { collection, getDocs } from 'firebase/firestore';

export default function Category() {
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    GetCategories();
  }, []);

  const GetCategories = async () => {
    const snapshot = await getDocs(collection(db, 'Category'));
    snapshot.forEach((doc) => {
      console.log(doc.data()); // This logs the data fetched
      setCategoryList((categoryList) => [...categoryList, doc.data()]); // Correctly fetch the document data
    });
  };

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={{ fontFamily: 'outfit-medium', fontSize: 20 }}>Category</Text>

      <FlatList
        data={categoryList}
        renderItem={({ item }) => (
          <View>
            <Image
              source={{ uri: item?.imageUrl }} // Use the correct URI from the fetched data
              style={{ width: 40, height: 40 }}
            />
            <Text>{item?.name}</Text> {/* Add the category name for display */}
          </View>
        )}
        keyExtractor={(item, index) => index.toString()} // Adding keyExtractor
      />
    </View>
  );
}
