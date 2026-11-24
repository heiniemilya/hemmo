import { ScrollView, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../../firebaseConfig';
import { useState, useEffect } from 'react';
import { Task } from '../types/task';
import { useNavigation } from '@react-navigation/native';

const db = getDatabase(app);

// Kategorioiden taustavärit
const CARD_COLORS = [
  '#588ca4', '#7ca1b5', '#617fab',  '#5b90c2', '#89accc',
];

///////////// Tehtäväkortti /////////////
const TaskCard = ({ item }: { item: Task }) => {

  // Tehtävän muokkaaminen
  const navigation = useNavigation<any>();
  const handleEdit = (task: Task) => {
    // Navigointi EditTaskScreenille 
    navigation.navigate('Muokkaa tehtävää', { task , from: 'Tasks'}); // vie mukanaan muokattavan tehtävän tiedot ja miltä sivulta siirrytään
  }

  return (
     <TouchableOpacity onPress={() => handleEdit(item)}>
      <View style={styles.card}>
        {/* Tehtävän nimi ja toistumisväli */}
        <Text style={[styles.title, styles.cardText]}>
          {item.title}
        </Text>
        <Text style={[styles.cardText]}>
          {item.intervalDays === 0 ? 'Ei toistu' : `${item.intervalDays} pv välein`}
        </Text> 
      </View>
    </TouchableOpacity>
  );
};

/////////// Pääkomponentti /////////////
export default function TasksScreen() {

  const [tasks, setTasks] = useState<Task[]>([]);

  // haetaan tehtävät tietokannasta
  useEffect(() => {
    onValue(ref(db, '/tasks'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        //setTasks(Object.values(data) as Task[]);
        setTasks(Object.entries(data).map(([key, value]) => ({ id: key , ...(value as object), })) as Task[]);
      } else {
        setTasks([]);
      }
    })
  }, []);

  // Luodaan SectionList-osiot 
  // 1. Haetaan kaikki eri kategoriat ilman tuplia
  const categories = [...new Set(tasks.map(task => task.category))];

  // 2. Muodostetaan SectionListin rakenne
  const sections = categories.map(category => ({
    title: category,
    data: tasks.filter(task => task.category === category),
  }));

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20}}>
        {sections.map((section, index) => (
          <View key={section.title} >
            <Text style={styles.sectionHeader}>{section.title}</Text>
            <View 
              style={[
                styles.sectionCard, 
                { backgroundColor: CARD_COLORS[index % CARD_COLORS.length] } // Kategorioiden värit 
              ]}
            >
              {section.data.map(item => (
                <TaskCard key={item.id} item={item} />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

////////// Tyyylit //////////////
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f3f7',
    paddingHorizontal: 10,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 4,
    paddingLeft: 3,
    color: '#6e858e',
    textTransform: 'uppercase',
  },
  sectionCard:{
    borderRadius: 8,
    paddingHorizontal: 6,    
    paddingVertical: 6,
    gap: 6,
  },
  card: {
    borderRadius: 8,
    paddingHorizontal: 10,    
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff89',
  },
  cardText: {
     color: '#274b5f',
  },
  title: {
    fontSize: 21,
    fontWeight: 'bold',
    flex: 1,
  },
});