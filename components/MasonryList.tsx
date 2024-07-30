import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';

const { width } = Dimensions.get('window');

type MasonryListProps = {
  data: { url: string; name: string }[];
  numColumns: number;
  renderItem: ({ item }: { item: { url: string; name: string } }) => JSX.Element;
};

const MasonryList: React.FC<MasonryListProps> = ({ data, numColumns, renderItem }) => {
  const columnWidth = width / numColumns;
  const columns: { url: string; name: string }[][] = Array.from({ length: numColumns }, () => []);

  data.forEach((item, index) => {
    columns[index % numColumns].push(item);
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {columns.map((column, columnIndex) => (
        <View key={`column-${columnIndex}`} style={{ width: columnWidth }}>
          {column.map((item) => (
            <View key={item.name} style={{ padding: 4 }}>
              {renderItem({ item })}
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

export default MasonryList;
