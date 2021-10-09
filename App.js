import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { Fontisto } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  Alert,
} from 'react-native';
import { theme } from './color';
import { styles } from './style';

const STORAGE_KEY = '@toDos';
const height = Dimensions.get('screen').height;

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState('');
  const [toDos, setToDos] = useState({});
  const [loading, setLoading] = useState(false);

  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (value) => setText(value);

  useEffect(() => {
    setLoading(true);
    loadToDos();
    setLoading(false);
  }, []);

  const saveToDos = async (value) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  };

  const loadToDos = async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY);
      setToDos(JSON.parse(value));
    } catch (e) {
      console.log(e);
    }
  };

  const addToDo = async () => {
    if (text === '') {
      return;
    }
    const newToDos = { ...toDos, [Date.now()]: { text, working } };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText('');
  };

  const deleteToDo = async (id) => {
    const newToDos = { ...toDos };
    delete newToDos[id];
    setToDos(newToDos);
    saveToDos(newToDos);
  };

  const onDeletePress = (id) => {
    Alert.alert('Delete To Do', 'Are you sure?', [
      { text: 'Cancel', style: 'destructive' },
      { text: "I'm sure", onPress: () => deleteToDo(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{
              ...styles.btnText,
              color: working ? theme.white : theme.grey,
            }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: working ? theme.grey : theme.white,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onSubmitEditing={addToDo}
        returnKeyType="done"
        onChangeText={onChangeText}
        value={text}
        placeholder={working ? 'Add a To Do' : 'Where do you want to go?'}
        style={styles.input}
      />
      <ScrollView>
        {loading ? (
          <View
            style={{
              height: height / 1.5,
              justifyContent: 'center',
            }}
          >
            <ActivityIndicator size={24} color="white" />
          </View>
        ) : (
          Object.keys(toDos).map((id) => {
            if (toDos[id].working === working) {
              return (
                <View key={id} style={styles.toDo}>
                  <Text style={styles.toDoText}>{toDos[id].text}</Text>
                  <TouchableOpacity onPress={() => onDeletePress(id)}>
                    <Fontisto name="trash" size={16} color={theme.grey} />
                  </TouchableOpacity>
                </View>
              );
            }
          })
        )}
      </ScrollView>
    </View>
  );
}
