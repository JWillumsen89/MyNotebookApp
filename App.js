import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Swipeable } from "react-native-gesture-handler";
import styles from "./AppStyles";
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

function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

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
              title: "Note",
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
        const updatedNote = {
          ...route.params.updatedNote,
          lastModified: formatDate(new Date()),
        };
        newList[route.params.index] = updatedNote;
        return newList;
      });
    } else if (route.params?.note) {
      const newNote = {
        ...route.params.note,
        lastModified: formatDate(new Date()),
      };
      setList((prevList) => [...prevList, newNote]);
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
        <Text style={styles.headerText}>MyNotebook App</Text>
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
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() =>
                navigation.navigate("Page2", { note: item, index })
              }
            >
              <View style={styles.noteContainer}>
                <View style={styles.noteInnerContainer}>
                  <Text
                    style={styles.noteHeader}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.header}
                  </Text>
                  <Text style={styles.lastModifiedText}>
                    Last Modified: {item.lastModified}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
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

  // Function to add bullet points to each line in details
  const addBulletPoints = () => {
    const formattedDetails = note.details
      .split("\n")
      .map((line) => {
        if (line.startsWith("  • ")) {
          return line;
        }
        return `  • ${line}`;
      })
      .join("\n");

    setNote({
      ...note,
      details: formattedDetails,
    });
  };

  const isNoteValid = note.header.trim() !== "" && note.details.trim() !== "";

  return (
    <SafeAreaView style={styles.page2Container}>
      <TextInput
        placeholder="Enter Note Header...."
        style={styles.input}
        placeholderTextColor="white"
        onChangeText={(text) => setNote({ ...note, header: text })}
        value={note.header}
      />
      <TextInput
        placeholder="Enter Note Details...."
        style={styles.detailsInput}
        placeholderTextColor="white"
        onChangeText={(text) => setNote({ ...note, details: text })}
        value={note.details}
        multiline={true}
        numberOfLines={6}
      />
      <View style={styles.formattingButtonsContainer}>
        <TouchableOpacity
          style={styles.formattingButton}
          onPress={addBulletPoints}
        >
          <Text style={styles.buttonText}>Add •</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.formattingButton}
          onPress={() => console.log("Dummy button pressed")}
        >
          <Text style={styles.buttonText}>Italicize</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.formattingButton}
          onPress={() => console.log("Dummy button pressed")}
        >
          <Text style={styles.buttonText}>Underline</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={isNoteValid ? styles.button : styles.buttonDisabled}
        onPress={() => {
          if (!isNoteValid) return;

          if (typeof index === "number") {
            navigation.navigate("Page1", { updatedNote: note, index });
          } else {
            navigation.navigate("Page1", { note });
          }
        }}
        disabled={!isNoteValid}
      >
        <Text style={styles.buttonText}>Save Note</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
