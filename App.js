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
  Platform,
} from 'react-native';
import { theme } from './color';
import { styles } from './style';

const TODOS = '@toDos';
const WORKING = '@working';
const height = Dimensions.get('screen').height;

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState('');
  const [updateText, setUpdateText] = useState('');
  const [toDos, setToDos] = useState({});
  const [loading, setLoading] = useState(false);

  const travel = () => {
    setWorking(false);
    saveWorking('false');
  };

  const work = () => {
    setWorking(true);
    saveWorking('true');
  };

  const onChangeText = (value) => setText(value);

  const onChangeUpdateText = (value) => setUpdateText(value);

  useEffect(() => {
    setLoading(true);
    load();
    setLoading(false);
  }, []);

  const saveToDos = async (value) => {
    await AsyncStorage.setItem(TODOS, JSON.stringify(value));
  };

  const saveWorking = async (value) => {
    await AsyncStorage.setItem(WORKING, value);
  };

  const load = async () => {
    try {
      const toDosValue = await AsyncStorage.getItem(TODOS);
      const workingValue = await AsyncStorage.getItem(WORKING);
      if (toDosValue) {
        setToDos(JSON.parse(toDosValue));
      }
      if (workingValue) {
        setWorking(JSON.parse(workingValue));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const addToDo = async () => {
    if (text === '') {
      return;
    }
    const newToDos = {
      ...toDos,
      [Date.now()]: { text, working, done: false, updating: false },
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText('');
  };

  const doneToDo = (id) => {
    const newToDos = { ...toDos };
    newToDos[id].done = !newToDos[id].done;
    setToDos(newToDos);
    saveToDos(newToDos);
  };

  const deleteToDo = async (id) => {
    const newToDos = { ...toDos };
    delete newToDos[id];
    setToDos(newToDos);
    saveToDos(newToDos);
  };

  const onDeletePress = (id) => {
    if (Platform.OS === 'web') {
      const ok = confirm('Do you want to delete this To Do?');
      ok && deleteToDo(id);
    } else {
      Alert.alert('Delete To Do', 'Are you sure?', [
        { text: 'Cancel', style: 'destructive' },
        { text: "I'm sure", onPress: () => deleteToDo(id) },
      ]);
    }
  };

  const onLongPress = (id) => {
    const newToDos = { ...toDos };
    newToDos[id].updating = true;
    setUpdateText(newToDos[id].text);
    setToDos(newToDos);
    saveToDos(newToDos);
  };

  const updateToDo = (id) => {
    const newToDos = { ...toDos };
    newToDos[id].updating = false;
    newToDos[id].text = updateText;
    setUpdateText('');
    setToDos(newToDos);
    saveToDos(newToDos);
  };

  const deleteAll = async () => {
    setToDos({});
    saveToDos({});
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: '500',
              color: working ? theme.white : theme.grey,
            }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: '500',
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
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => doneToDo(id)}>
                      {toDos[id].done ? (
                        <Fontisto
                          name="checkbox-active"
                          size={24}
                          color={theme.grey}
                        />
                      ) : (
                        <Fontisto
                          name="checkbox-passive"
                          size={24}
                          color={theme.grey}
                        />
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity onLongPress={() => onLongPress(id)}>
                      {toDos[id].updating ? (
                        <TextInput
                          style={{
                            fontSize: 16,
                            fontWeight: '500',
                            marginLeft: 15,
                            color: theme.inputGrey,
                          }}
                          value={updateText}
                          onChangeText={onChangeUpdateText}
                          returnKeyType="done"
                          onSubmitEditing={() => updateToDo(id)}
                        />
                      ) : (
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: '500',
                            marginLeft: 15,
                            textDecorationLine: toDos[id].done
                              ? 'line-through'
                              : 'none',
                            color: toDos[id].done ? theme.grey : theme.white,
                          }}
                        >
                          {toDos[id].text}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
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
