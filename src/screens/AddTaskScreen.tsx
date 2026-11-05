import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Platform, } from 'react-native';
import { useState } from 'react';
import { app } from '../../firebaseConfig';
import { getDatabase, ref, push } from 'firebase/database';
import DateTimePicker from '@react-native-community/datetimepicker';

//////////// Pääkomponentti //////////////
export default function AddTaskScreen() {

  const db = getDatabase(app);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [lastDoneDate, setLastDoneDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);

  ////////// Tehtävän tallennus ////////////
  const handleSave = () => {

    // Syötettyjen tietojen tarkistus
    if (!title.trim()) {
      Alert.alert('Otsikko puuttuu', 'Lisää otsikko');
      return;
    }

    // Tallennettava tehtävä
    const taskToSave = {
      title: title.trim(),
      category: category.trim() || 'Yleinen',
      lastDoneDate: lastDoneDate.toISOString().split('T')[0],
    };

    // Tietojen vienti tietokantaan
    push(ref(db, '/tasks'), taskToSave);
    
    // Lomakkeen tyhjennys
    setTitle('');
    setCategory('');
    setLastDoneDate(new Date());

    // Ilmoitus tallentamisen onnistumisesta
    Alert.alert('Valmis', 'Tehtävä lisätty');
  }

  return (
    // Lomake
    <View style={styles.container}>

      {/* Tehtävä */}
      <Text style={styles.label}>Tehtävän nimi *</Text>
      <TextInput
        style={styles.input}
        placeholder="Esim. imurointi"
        value={title}
        onChangeText={text => setTitle(text) }
      />

      {/* Kohde */}
      <Text style={styles.label}>Kohde / Huone</Text>
      <TextInput
        style={styles.input}
        placeholder="Esim. Keittiö"
        value={category}
        onChangeText={text => setCategory(text) }
      />

      {/* Päivämäärä */}
        <Text style={styles.label}>Aloituspäivä</Text>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowPicker(true)}>
          <Text style={styles.dateButtonText}>
            {lastDoneDate.toLocaleDateString('fi-FI')}
          </Text>
        </TouchableOpacity>
        {/* Kalenteri */}
        {showPicker && (
          <DateTimePicker
            value={lastDoneDate}
            mode="date"
            display="default"
            onValueChange={(event, selectedDate) => {
              setShowPicker(Platform.OS === 'ios');
              if (selectedDate) {
                setLastDoneDate(selectedDate);
              }
            }}
            onDismiss={() => setShowPicker(false)}
          />
        )}

      {/* Painike */}
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={{color: 'white'}}>Lisää tehtävä</Text>
      </TouchableOpacity>
    </View>
  );
}

/////////// Tyylit //////////////
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
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingHorizontal: 12,
  },
  dateButton: {
    height: 40,
    justifyContent: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  dateButtonText: {
    fontSize: 15,
    color: '#333',
  },
  button:{
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: 'green',
    padding: 10,
  },
});