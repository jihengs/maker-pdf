import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DataTable = ({ headers, data }) => {
    return (
        <View style={styles.container}>
            {/* Table Header */}
            <View style={styles.row}>
                {headers.map((header, index) => (
                    <Text key={index} style={styles.headerCell}>
                        {header}
                    </Text>
                ))}
            </View>

            {/* Table Data */}
            {data.map((rowData, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {headers.map((header, colIndex) => (
                        <Text key={colIndex} style={styles.cell}>
                            {rowData[header]}
                        </Text>
                    ))}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 5,
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        padding: 10,
    },
    cell: {
        flex: 1,
        padding: 10,
    },
});

export default DataTable;