import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Swipeable } from "react-native-gesture-handler";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  FlatList,
  TouchableOpacity,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Page1">
          <Stack.Screen
            name="Page1"
            component={Page1}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Page2"
            component={Page2}
            options={{
              headerShown: true,
              title: "Note", // Setting title to "Note"
              headerStyle: {
                backgroundColor: "#1F1F1F",
              },
              headerTintColor: "#FFFFFF",
              headerTitleStyle: {
                fontSize: 24,
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const Page1 = ({ navigation, route }) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const savedNotes = await AsyncStorage.getItem("notes");
      if (savedNotes) {
        setList(JSON.parse(savedNotes));
      }
    };

    fetchNotes();
  }, []);

  useEffect(() => {
    if (route.params?.updatedNote && typeof route.params?.index === "number") {
      setList((prevList) => {
        const newList = [...prevList];
        newList[route.params.index] = route.params.updatedNote;
        return newList;
      });
    } else if (route.params?.note) {
      setList((prevList) => [...prevList, route.params.note]);
    }
  }, [route.params]);

  useEffect(() => {
    AsyncStorage.setItem("notes", JSON.stringify(list));
  }, [list]);

  const handleDelete = (index) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  const renderRightActions = (index) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(index)}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Your Notes</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Page2")}
        >
          <Text style={styles.buttonText}>Create Note</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={list}
        renderItem={({ item, index }) => (
          <Swipeable renderRightActions={() => renderRightActions(index)}>
            <View style={styles.noteContainer}>
              <Text
                style={styles.noteHeader}
                onPress={() =>
                  navigation.navigate("Page2", { note: item, index })
                }
              >
                {item.header}
              </Text>
            </View>
          </Swipeable>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
};

const Page2 = ({ navigation, route }) => {
  const [note, setNote] = useState(
    route.params?.note || { header: "", details: "" }
  );
  const index = route.params?.index;

  return (
    <SafeAreaView style={styles.page2Container}>
      <TextInput
        placeholder="Header"
        style={styles.input}
        placeholderTextColor="white"
        onChangeText={(text) => setNote({ ...note, header: text })}
        value={note.header}
      />
      <TextInput
        placeholder="Details"
        style={styles.detailsInput}
        placeholderTextColor="white"
        onChangeText={(text) => setNote({ ...note, details: text })}
        value={note.details}
        multiline={true}
        numberOfLines={6}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (typeof index === "number") {
            navigation.navigate("Page1", { updatedNote: note, index });
          } else {
            navigation.navigate("Page1", { note });
          }
        }}
      >
        <Text style={styles.buttonText}>Save Note</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1F1F1F",
    padding: 15,
  },
  headerText: {
    fontSize: 24,
    color: "#FFFFFF",
  },
  noteContainer: {
    backgroundColor: "#1F1F1F",
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 1,
  },
  noteHeader: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  input: {
    backgroundColor: "#333333",
    borderColor: "#555555",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    margin: 10,
    fontSize: 16,
    color: "#FFFFFF",
    height: 50,
  },
  page2Container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 15,
  },
  detailsInput: {
    backgroundColor: "#333333",
    borderColor: "#555555",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    margin: 10,
    fontSize: 16,
    height: 120,
    textAlignVertical: "top",
    color: "#FFFFFF",
  },
  button: {
    backgroundColor: "#444444",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "red",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "flex-end",
    width: 100,
    height: "100%",
  },
  deleteText: {
    color: "white",
    padding: 20,
  },
});
