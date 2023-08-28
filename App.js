import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  FlatList,
  TouchableOpacity
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Page1">
        <Stack.Screen
          name="Page1"
          component={Page1}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Page2" component={Page2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Page1 = ({ navigation, route }) => {
  const [list, setList] = useState([]);

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

  return (
    <View style={styles.container}>
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
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const Page2 = ({ navigation, route }) => {
  const [note, setNote] = useState(
    route.params?.note || { header: "", details: "" }
  );
  const index = route.params?.index;

  return (
    <View style={styles.page2Container}>
      <TextInput
        placeholder="Header"
        style={styles.input}
        onChangeText={(text) => setNote({ ...note, header: text })}
        value={note.header}
      />
      <TextInput
        placeholder="Details"
        style={styles.detailsInput}
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
    </View>
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
});
