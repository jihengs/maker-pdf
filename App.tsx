/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import axios from 'axios';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  PermissionsAndroid,
  Button,
  TextInput,
  FlatList,
  ScrollView
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { useCallback, useState, useEffect } from 'react';
import RNFS from 'react-native-fs';
function App(): React.JSX.Element {
  const [fileResponse, setFileResponse] = useState([]);
  const [fileData, setFileData] = useState();
  const [tableData, setTableData] = useState([]);
  const Apikey = "K87877518688957";
  const [resText, setResText] = useState('');
  try {
  } catch (err) { console.error(err); }
  const handleDocumentSelection = useCallback(async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
    } catch (err) {
      console.warn(err);
    }
    const readGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
    const writeGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    if (!readGranted || !writeGranted) {
      console.log('Read and write permissions have not been granted');
      return;
    }
    try {
      //load PDF File path
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',

      });
      const PDFuri = response[0].uri;
      console.log(PDFuri);
      setFileResponse(response);
      // Send PDF file to OCR API and receive OCR result
      sendToOcrApi(PDFuri, Apikey);
    } catch (err) {
      console.warn(err);
    }
  }, []);
  const sendToOcrApi = (pdfuri, apiKey) => {
    const playlist = [];
    // Construct the API request
    const formData = new FormData();
    formData.append('file', {
      uri: pdfuri,
      type: 'application/pdf',
      name: 'document.pdf',
    });
    // formData.append('url', pdfuri)
    formData.append('apiKey', apiKey);
    formData.append('isTable', true);
    // console.log(formData);
    // Send the request to the OCR API endpoint
    axios.post('https://api.ocr.space/parse/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        apiKey
      },
    }).then((response) => {
      //convert JSON Data into every String.
      setResText(JSON.stringify(response.data));
      response.data.ParsedResults.forEach((row: any) => {
        let rowData = row.ParsedText.split('\t\r\n');
        rowData.map((value, index) => playlist.push(value))
        setTableData(playlist);
      });

    }
    ).catch(err => {
      console.log(err);
    });
  }
  const renderItem = ({ item }) => (
    <View>
      <Text >{item}</Text>
    </View>
  );
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
        {fileResponse.map((file, index) => (
          <Text
            key={index.toString()}
            style={styles.uri}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            PATH:{file?.uri}
          </Text>
        ))}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', padding: 10 }}>
        <TouchableOpacity style={{ backgroundColor: "#F7D068", borderRadius: 5 }} onPress={handleDocumentSelection} ><Text style={{ color: 'black', fontSize: 12, fontWeight: '500', padding: 10 }}>Select CSV file 📑</Text>
        </TouchableOpacity>

      </View>
      <ScrollView style={{ padding: 10 }}>
        {tableData.map((data, index) => (
          <Text
            key={index}
            style={{ borderWidth: 1, borderColor: '#B9B9B9', paddingLeft: 20, fontSize: 12, fontFamily: 'roboto', fontWeight: '500' }}
          >{data}</Text>
        ))}
      </ScrollView>
    </View >
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',

  }
});
export default App;
