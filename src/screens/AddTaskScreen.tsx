import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Task } from '../types/task';
import { useState } from 'react';
import { app } from '../../firebaseConfig';
import { getDatabase, ref, push } from 'firebase/database';

export default function AddTaskScreen() {

  const db = getDatabase(app);

  const [taskItem, setTaskItem] = useState<Task>({} as Task);

  const handleSave = () => {
    if (!taskItem.title.trim()) {
      Alert.alert('Otsikko puuttuu', 'Lisää otsikko');
      return;
    }
    push(ref(db, '/tasks'), taskItem);
    setTaskItem({
      id: '',
      title: '',
      category: '',
      intervalDays: 0,
      season: 'koko vuosi',
      notes: '',
      lastDoneDate: '',
      doneBy: '',
      nextDueDate: '',
    });
    Alert.alert('Valmis', 'Tehtävä lisätty');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tehtävän nimi *</Text>
      <TextInput
        style={styles.input}
        placeholder="Esim. imurointi"
        value={taskItem.title}
        onChangeText={text => setTaskItem({ ...taskItem, title: text })}
      />
      <Text style={styles.label}>Kohde / Huone</Text>
      <TextInput
        style={styles.input}
        placeholder="Esim. Keittiö"
        value={taskItem.category}
        onChangeText={text => setTaskItem({ ...taskItem, category: text })}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={{color: 'white'}}>Lisää tehtävä</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#f2f3f7',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button:{
    alignItems: 'center',
    backgroundColor: 'green',
    padding: 10.
  },
});