import { SectionList, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../../firebaseConfig';
import { useState, useEffect } from 'react';
import { Task } from '../types/task';

const db = getDatabase(app);

///////////// Tehtäväkortti /////////////
const TaskCard = ({ item }: { item: Task }) => {

  return (
  <View style={[styles.card, ]}>
        <Text style={[styles.title, ]}>
          {item.id}: {item.title}
        </Text>
  </View>
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
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TaskCard item={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

////////// Tyyylit //////////////
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 5,
    color: '#7b96a1',
    textTransform: 'uppercase',
  },
  card: {
    marginVertical: 6,
  },
  title: {
    paddingHorizontal: 10,
    fontSize: 21,
    fontWeight: 'bold',
    flex: 1,
  },
});