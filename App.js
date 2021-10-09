import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { theme } from './color';
import { styles } from './style';

const STORAGE_KEY = '@toDos';

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState('');
  const [toDos, setToDos] = useState({});

  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (value) => setText(value);

  useEffect(() => {
    loadToDos();
  }, []);

  const saveToDos = async (value) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  };

  const loadToDos = async () => {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(value));
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
        {Object.keys(toDos).map((key) => {
          if (toDos[key].working === working) {
            return (
              <View key={key} style={styles.toDo}>
                <Text style={styles.toDoText}>{toDos[key].text}</Text>
              </View>
            );
          }
        })}
      </ScrollView>
    </View>
  );
}
