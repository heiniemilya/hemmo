import { StyleSheet, Text, View, SectionList, TouchableOpacity} from 'react-native';
import { Task } from '../types/task';
import { FontAwesome, FontAwesome6} from '@expo/vector-icons';
import { getDueInfo } from '../utils/taskUtils';
  
///////////// Demo data //////////////
const DATA: Task[] = [
  {
    id: "1", title: "Imurointi", category: "Yleinen", intervalDays: 7, season: 'koko vuosi', 
    notes: "", lastDoneDate: "2026-10-10", doneBy: "user1", nextDueDate: "2026-10-17" 
  },
  {
    id: "2", title: "Ikkunoiden pesu", category: "Yleinen", intervalDays: 365, season: 'koko vuosi', 
    notes: "", lastDoneDate: "2026-09-12", doneBy: "user1", nextDueDate: "2027-09-13"
  },
  {
    id: "3", title: "Lakanoiden vaihto", category: "Makuuhuone", intervalDays: 7, season: 'koko vuosi', 
    notes: "", lastDoneDate: "2026-10-25", doneBy: "", nextDueDate: "2026-11-01"
  },
  {
    id: "4", title: "Pyykin pesu", category: "Yleinen", intervalDays: 7, season: 'koko vuosi', 
    notes: "", lastDoneDate: "2026-10-28", doneBy: "", nextDueDate: "2026-11-03"
  },
  {
    id: "5", title: "Tiskikoneen täyttö", category: "Keittiö", intervalDays: 2, season: 'koko vuosi', 
    notes: "", lastDoneDate: "2026-10-27", doneBy: "", nextDueDate: "2026-11-02"
  },
  {
    id: "6", title: "Nurmikon leikkuu", category: "Piha", intervalDays: 30, season: 'kesä', 
    notes: "", lastDoneDate: "2026-08-27", doneBy: "", nextDueDate: "2026-09-26"
  },
];

// Järjestetään tehtävät seuraavan deadline-päivämäärän mukaan nousevaan järjestykseen
const sortedData = [...DATA].sort((a, b) => 
  new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime()
);

///////////// Tehtäväkortti /////////////
const TaskCard = ({ item }: { item: Task }) => {
  const due = getDueInfo(item.nextDueDate);

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
