import { StyleSheet, Text, View, SectionList, TouchableOpacity, Button } from 'react-native';
import { Task } from '../types/task';
import { FontAwesome, FontAwesome6} from '@expo/vector-icons';

type DueStatus = 'overdue' | 'today' | 'future';

////////// DueDate-päivämäärän vertailu nykyhetkeen ja eron laskeminen ///////////////
const getDueInfo = (dueDateStr: string) => {
  const today = new Date(); 
  today.setHours(0, 0, 0, 0); // nollataan kellonaika vertailua varten

  const due = new Date(dueDateStr); // 'YYYY-MM-DD' muotoisen merkkijonon muuntaminen Date-objektiksi
  due.setHours(0, 0, 0, 0); 

  const diffTime = due.getTime() - today.getTime(); 
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // lasketaan ero päivinä

  // Palautetaan teksti ja väri eron perusteella
  if (diffDays < 0) {
    return {
      status: 'overdue' as DueStatus,
      label: `myöhässä ${Math.abs(diffDays)} pv`,
      topRowBackgroundColor: '#c3504e', // punainen
      cardBackgroundColor: '#f5a8a3',
      borderColor: '#dc857b',
      textDark: '#881f15',
      textLight: '#f0e5e4',
    };
  } else if (diffDays === 0) {
    return {
      status: 'today' as DueStatus,
      label: 'tänään',
      topRowBackgroundColor: '#c48827', // keltainen
      cardBackgroundColor: '#f1d19a', 
      borderColor: '#d4b06d',
      textDark: '#704503',
      textLight: '#f5f3ee',
    };
  } else {
    return {
      status: 'future' as DueStatus,
      label: diffDays === 1 ? 'huomenna' : `${diffDays} pv aikaa`,
      topRowBackgroundColor: '#548a58', // vihreä
      cardBackgroundColor: '#b5dab8', 
      borderColor: '#8bbf8b',
      textDark: '#185a21',
      textLight: '#e7f3e8',
    };
  }
};

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
        <TouchableOpacity style={[styles.iconButton, { borderLeftColor: due.borderColor }]} onPress={() => handleEdit(item.id)}>
          <FontAwesome6 name="gear" size={20} color={due.textDark} padding={4} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconButton, { borderLeftColor: due.borderColor }]} onPress={() => handleMarkDone(item.id)}>
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
    backgroundColor: '#fafafa',
    paddingHorizontal: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 5,
    color: '#333',
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
