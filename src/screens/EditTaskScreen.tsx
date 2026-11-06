import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Platform, Switch } from 'react-native';
import { useEffect, useState } from 'react';
import { app } from '../../firebaseConfig';
import { getDatabase, ref, update } from 'firebase/database';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TimeUnit, TimeUnits, toIntervalDays } from '../utils/taskUtils';
import { useRoute } from '@react-navigation/native';

const db = getDatabase(app);

//////////// Pääkomponentti //////////////
export default function EditTaskScreen() {
  const route = useRoute<any>();
  const { task } = route.params; // Muokattavan tehtävän tiedot 

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [nextDueDate, setNextDueDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [isRepeating, setIsRepeating] = useState(true);
  const [intervalNum, setIntervalNum] = useState('1'); // Syötettävä numero
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('days');
  
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setCategory(task.category || '');
      setNextDueDate(task.nextDueDate ? new Date(task.nextDueDate) : new Date());
      setIntervalNum(task.intervalNum ? String(task.intervalNum) : '');
      setTimeUnit(task.timeUnit || 'kk');
      setIsRepeating(task.isRepeating ?? false);
    }
  }, [task]);

  ////////// Tehtävän tallennus ////////////
  const handleSave = () => {
    const num = parseInt(intervalNum); // merkkijono luvuksi 
    const days = isRepeating ? toIntervalDays(num, timeUnit) : 0; // Syötetyn numeron muuttaminen päiviksi jos tehtävä on toistuva

    // Syötettyjen tietojen tarkistus
    // Otsikko puuttuu
    if (!title.trim()) {
      Alert.alert('Otsikko puuttuu', 'Lisää otsikko');
      return;
    }
    // Päivämäärä on menneisyydessä
    const today = new Date(); // Tämä päivä
    today.setHours(0, 0, 0, 0); // Ajan poistaminen
    if (nextDueDate < today) { // Syötetyn päivämäärän vertaus tähän päivään 
      Alert.alert('Eräpäivä on menneisyydessä', 'Muokkaa eräpäivää');
      return;
    }

    // Tallennettava tehtävä
    const taskToSave = {
      title: title.trim(),
      category: category.trim() || 'Yleinen',
      intervalDays: days,
      nextDueDate: nextDueDate.toISOString().split('T')[0],
      timeUnit,
      intervalNum,
      isRepeating,
    };

    // Tietojen vienti tietokantaan
    update(ref(db, `/tasks/${task.id}`), taskToSave);
    
    // Lomakkeen tyhjennys
    setTitle('');
    setCategory('');
    setNextDueDate(new Date());
    setIsRepeating(true);
    setIntervalNum('1');
    setTimeUnit('days');

    // Ilmoitus tallentamisen onnistumisesta
    Alert.alert('Valmis', 'Tehtävä päivitetty');
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
      <Text style={styles.label}>Seuraava eräpäivä *</Text>
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowPicker(true)}>
        <Text style={styles.dateButtonText}>
          {nextDueDate.toLocaleDateString('fi-FI')}
        </Text>
      </TouchableOpacity>
      {/* Kalenteri */}
      {showPicker && (
        <DateTimePicker
          value={nextDueDate}
          mode="date"
          display="default"
          onValueChange={(event, selectedDate) => {
            setShowPicker(Platform.OS === 'ios');
            if (selectedDate) {
              setNextDueDate(selectedDate);
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
        <Text style={{color: 'white'}}>Päivitä tehtävä</Text>
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