import { StyleSheet, Text, View, } from 'react-native';

export default function TasksScreen() {

  return (
    <View style={styles.container}>
      <Text>Tehtävälista</Text> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});