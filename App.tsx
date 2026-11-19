import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome, FontAwesome6} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import TasksScreen from './src/screens/TasksScreen';
import HomeScreen from './src/screens/HomeScreen';
import HouseholdScreen from './src/screens/HouseholdScreen';
import AddTaskScreen from './src/screens/AddTaskScreen';
import EditTaskScreen from './src/screens/EditTaskScreen';
import { TouchableOpacity } from 'react-native';

export default function App() {

  const Tab = createBottomTabNavigator();

  return (
        
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerBackground: () => (
            <LinearGradient
              colors={['#f2f2f8', '#e0e2e9']} // vaaleampi - tummempi
              style={{ flex: 1 }}
            />
          ),
          headerTintColor: '#568091',
          headerTitleStyle: {
            fontWeight: 'bold',
            letterSpacing: 0.5,
          },
          tabBarActiveTintColor: '#568091',
          tabBarInactiveTintColor: '#89b0bf',
          tabBarBackground: () => (
            <LinearGradient
              colors={['#e0e2e9','#f9f9fc']} // tummempi - vaaleampi
              style={{ flex: 1 }}
            />
          ),
          tabBarStyle: {
            paddingTop: 8,
            borderTopWidth: 0,
          },
        }}
      >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={({ navigation, route }) => ({
          title: 'Ajankohtaista',
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) =>  <FontAwesome6 name={'house'} size={20} color={color} />,
          headerRight: () => (
             <TouchableOpacity 
                style={{padding:10, marginRight: 10}} 
                onPress={() => navigation.navigate('Lisää tehtävä', { from: route.name } )}
              >
                <FontAwesome name="plus" size={30} color="#568091" />
              </TouchableOpacity>
          ),
        })}
      /> 
      <Tab.Screen 
        name="Tasks"
        component={TasksScreen} 
        options={({ navigation, route }) => ({
          title: 'Tehtävälista',
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) =>  <FontAwesome6 name={'list'} size={20} color={color} />,
          headerRight: () => (
             <TouchableOpacity 
                style={{padding:10, marginRight: 10}} 
                onPress={() => navigation.navigate('Lisää tehtävä', { from: route.name } )}
              >
                <FontAwesome name="plus" size={30} color="#568091" />
              </TouchableOpacity>
          ),
        })} 
      />
      <Tab.Screen 
        name="Household" 
        component={HouseholdScreen} 
        options={{ 
          title: 'Osallistujat',
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) =>  <FontAwesome6 name={'user-group'} size={17} color={color} />
        }} 
      />
      <Tab.Screen
        name="Lisää tehtävä"
        component={AddTaskScreen}
        options={{
          tabBarItemStyle: { display: 'none' }, // Piilota
        }}
      />
      <Tab.Screen
        name="Muokkaa tehtävää"
        component={EditTaskScreen}
        options={{
          tabBarItemStyle: { display: 'none' }, // Piilota
        }}
      />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
