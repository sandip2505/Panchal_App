import { StyleSheet, Text, View, ActivityIndicator, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { FlatList } from "react-native";
import { API_BASE_URL, API_KEY } from '@env';
console.log("API_BASE_URL village", API_BASE_URL)

const Villages = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [villagesData, setVillagesData] = useState([]);

    useEffect(() => {
        fetchVillagesData();
    }, []);

    const fetchVillagesData = async () => {

        try {
            const response = await axios.get(`${API_BASE_URL}/location`);
            if (response.status === 200) {
                setIsLoading(true)
                const data = response.data;
                setVillagesData(data); 
                setIsLoading(false);
            } else {
                setIsLoading(false);
                console.log('Request failed with status:', response.status);
            }
        } catch (error) {
            setIsLoading(false);
            console.error('An error occurred:', error);
        }
    };
    const renderItem = (data) => {
        return (
            <View key={data.index}>
                <View style={styles.box}>
                    <Text style={styles.boxText}>{data.item.village} {/*  - ( {data.item.pincode} ) */} </Text>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
                {isLoading ? (
                    <View style={{marginTop: 10}}>
                    <ActivityIndicator size="small" color="#00a9ff" />
                  </View>
                ) : (
                    <View style={{width: "100%"}}>
                        <FlatList data={villagesData} renderItem={renderItem} contentContainerStyle={styles.villageList} />
                    </View>
                )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: "#fff",
        width: "100%"
    },

    box: {
        backgroundColor: '#edf9ff',
        padding: 8,
        marginVertical: 5,
        borderRadius: 4,
        shadowColor: 'black',
        elevation: 5,
    },

    boxText: {
        fontSize: 18,
        fontWeight: '600',
        color:'black',
    },

    villageList: {
        paddingHorizontal: "4%",
        paddingVertical: 10,
    },

    pincode: {
        fontSize: 14,
        color: '#666',
    },
});

export default Villages;
