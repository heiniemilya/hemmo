import { StyleSheet, Text, View, SectionList, TouchableOpacity, Alert} from 'react-native';
import { Task } from '../types/task';
import { FontAwesome, FontAwesome6} from '@expo/vector-icons';
import { getDueInfo, markTaskAsDone } from '../utils/taskUtils';
import { useEffect, useState } from 'react';
import { getDatabase, onValue, ref, update } from 'firebase/database';
import { app } from '../../firebaseConfig';

const db = getDatabase(app);

///////////// Tehtäväkortti /////////////
const TaskCard = ({ item }: { item: Task }) => {
  const due = getDueInfo(item.nextDueDate);

  // Tehtävän merkkaaminen valmiiksi
  const handleMarkDone = (task: Task) => {
    const updatedTask = markTaskAsDone(task);
    Alert.alert('Merkitse tehtävä valmiiksi', 'Oletko varma?', [
      {
        text: 'Peruuta',
        style: 'cancel'
      },
      {
        text: 'OK',
        onPress: () => {
          update(ref(db, `/tasks/${task.id}`), {
            lastDoneDate: updatedTask.lastDoneDate,
            nextDueDate: updatedTask.nextDueDate,
          });
        }
        
      }
    ])
  };

  return (
  <View style={[styles.card, { backgroundColor: due.cardBackgroundColor }]}>
    <View style={[styles.topRow, { backgroundColor: due.topRowBackgroundColor }]}>
      {/* Ylärivi: Kategoria ja deadline */}
      <View>
        <Text style={[styles.categoryText, { color: due.textLight}]}>
          {item.category.toUpperCase()}
        </Text>
      </View>
      <View>
        <Text style={[styles.dueText, { color: due.textLight }]}>{due.label}</Text>
      </View>
    </View>
    <View style={[styles.bottomRow, { backgroundColor: due.cardBackgroundColor }]}>
      {/* Alarivi: Tehtävän nimi ja ikonit */}
      <View style={styles.bottomRow}>
        <Text style={[styles.title, { color: due.textDark }]}>{item.title}</Text>
        <TouchableOpacity style={[styles.iconButton, { borderLeftColor: due.borderColor }]} onPress={() => handleEdit(item)}>
          <FontAwesome6 name="gear" size={20} color={due.textDark} padding={4} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconButton, { borderLeftColor: due.borderColor }]} onPress={() => handleMarkDone(item)}>
          <FontAwesome name="check" size={28} color={due.textDark} />
        </TouchableOpacity>
      </View>
    </View>
  </View>
  );
};

//////////// Pääkomponentti ////////////////
export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Haetaan tehtävät tietokannasta
  useEffect(() => {
    onValue(ref(db, '/tasks'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        //setTasks(Object.values(data) as Task[]);
        setTasks(Object.entries(data).map(([key, value]) => ({ id: key , ...(value as object), })) as Task[]);
      } else {
        setTasks([]);
      }
      console.log(Object.entries(data));
    })
  }, []);

  // Järjestetään tehtävät seuraavan deadline-päivämäärän mukaan nousevaan järjestykseen
  const sortedData = tasks.sort((a, b) => 
    new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime()
  );

  // Ryhmitellään ja järjestetään data deadlinen mukaan
  const overdueTasks = sortedData.filter(task => getDueInfo(task.nextDueDate).status === 'overdue');
  const todayTasks = sortedData.filter(task => getDueInfo(task.nextDueDate).status === 'today');
  const futureTasks = sortedData.filter(task => getDueInfo(task.nextDueDate).status === 'future');

  // Luodaan SectionList-osiot 
  const sections = [
    { title: 'Myöhässä', data: overdueTasks },
    { title: 'Tänään', data: todayTasks },
    { title: 'Tulevat', data: futureTasks },
  ].filter(section => section.data.length > 0); // Näytetään vain osiot, joissa on tehtäviä

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

///////////// Tyylit /////////////
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
    marginBottom: 5,
    color: '#7b96a1',
    textTransform: 'uppercase',
  },
  card: {
    borderRadius: 8,
    marginVertical: 6,
  },
  topRow: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
  dueText: {
    fontSize: 12,
    fontWeight: 'semibold',
  },
  iconButton: {
    borderLeftWidth: 1,
    padding:10,
    opacity: 0.9,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomEndRadius: 8,
    borderBottomStartRadius: 8,
  },
  title: {
    paddingHorizontal: 10,
    fontSize: 21,
    fontWeight: 'bold',
    flex: 1,
  },

});
