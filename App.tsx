import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome6} from '@expo/vector-icons';
import TasksScreen from './src/screens/TasksScreen';
import HomeScreen from './src/screens/HomeScreen';
import HouseholdScreen from './src/screens/HouseholdScreen';

export default function App() {

  const Tab = createBottomTabNavigator();

  return (
      <NavigationContainer>
        <Tab.Navigator>
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ 
            title: 'Ajankohtaista',
            tabBarShowLabel: false,
            tabBarIcon: ({ size, color }) =>  <FontAwesome6 name={'house'} size={size} color={color} />
          }} 
        />
        <Tab.Screen 
          name="Tasks" 
          component={TasksScreen} 
          options={{ 
            title: 'Tehtävälista',
            tabBarShowLabel: false,
            tabBarIcon: ({ size, color }) =>  <FontAwesome6 name={'list'} size={size} color={color} />
          }} 
        />
        <Tab.Screen 
          name="Household" 
          component={HouseholdScreen} 
          options={{ 
            title: 'Osallistujat',
            tabBarShowLabel: false,
            tabBarIcon: ({ size, color }) =>  <FontAwesome6 name={'user-group'} size={22} color={color} />
          }} 
        />
      </Tab.Navigator>
      </NavigationContainer>
  );
}
