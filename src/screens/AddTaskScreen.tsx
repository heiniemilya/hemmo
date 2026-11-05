import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Platform, Switch } from 'react-native';
import { useState } from 'react';
import { app } from '../../firebaseConfig';
import { getDatabase, ref, push } from 'firebase/database';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TimeUnit, TimeUnits, toIntervalDays } from '../utils/taskUtils';

//////////// Pääkomponentti //////////////
export default function AddTaskScreen() {

  const db = getDatabase(app);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [lastDoneDate, setLastDoneDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [isRepeating, setIsRepeating] = useState(true);
  const [intervalNum, setIntervalNum] = useState('1'); // Syötettävä numero
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('days');

  ////////// Tehtävän tallennus ////////////
  const handleSave = () => {
    const num = parseInt(intervalNum); // merkkijono luvuksi 
    const days = isRepeating ? toIntervalDays(num, timeUnit) : 0; // Syötetyn numeron muuttaminen päiviksi jos tehtävä on toistuva

    // Syötettyjen tietojen tarkistus
    if (!title.trim()) {
      Alert.alert('Otsikko puuttuu', 'Lisää otsikko');
      return;
    }

    // Tallennettava tehtävä
    const taskToSave = {
      title: title.trim(),
      category: category.trim() || 'Yleinen',
      intervalDays: days,
      nextDueDate: lastDoneDate.toISOString().split('T')[0],
    };

    // Tietojen vienti tietokantaan
    push(ref(db, '/tasks'), taskToSave);
    
    // Lomakkeen tyhjennys
    setTitle('');
    setCategory('');
    setLastDoneDate(new Date());
    setIsRepeating(true);
    setIntervalNum('1');
    setTimeUnit('days');

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
      <Text style={styles.label}>Ajankohta</Text>
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

      {/* Toistuvuus */}
      <View style={{marginBottom: 10}}>
        <View style={styles.switchRow}>
          <Text style={styles.label}>Toistuva tehtävä</Text>
          {/* On/off nappi */}
          <Switch
            value={isRepeating}
            onValueChange={setIsRepeating}
            trackColor={{ false: '#cbcbcb', true: '#9ac194' }}
            thumbColor={isRepeating ? 'green' : '#858585'}
            style={{marginBottom: 5}}
          />
        </View>
        {isRepeating && (
          <View style={styles.unitRow}>
            {/* Määrä */}
            <TextInput
              style={styles.numberInput}
              keyboardType="number-pad"
              value={intervalNum}
              onChangeText={setIntervalNum}
              maxLength={3}
            />
            {/* Aikayksikkö */}
            {TimeUnits.map((unit) => {
              const isSelected = timeUnit === unit.key; // onko nappi valittu
              return (
                <TouchableOpacity style={[styles.unitBtn, isSelected && {backgroundColor: 'green'}]}
                  key={unit.key} onPress={() => setTimeUnit(unit.key)}
                >
                  <Text style={[styles.unitBtnText, isSelected && {color: 'white'}]}>
                    {unit.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <Text style={styles.text}>välein</Text>
          </View>
        )}
      </View>

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
    fontWeight: 'bold',
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
    marginBottom: 5,
    paddingHorizontal: 12,
  },
  dateButtonText: {
    fontSize: 15,
    color: '#333',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  numberInput: {
    width: 50,
    height: 40,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 16,
  },
  unitBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#d2d2d2',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  unitBtnText: {
    color: '#333',
    fontSize: 15,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  button: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: 'green',
    padding: 10,
  },
});