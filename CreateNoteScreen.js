import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import styles from "./AppStyles";
import { useState } from "react";

const CreateNoteScreen = ({ navigation, route }) => {
  const [note, setNote] = useState(
    route.params?.note || { header: "", details: "" }
  );
  const index = route.params?.index;

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
    <SafeAreaView style={styles.createNoteScreenContainer}>
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

          if (route.params?.note?.id) {
            navigation.navigate("MainScreen", { updatedNote: note });
          } else {
            navigation.navigate("MainScreen", { note });
          }
        }}
        disabled={!isNoteValid}
      >
        <Text style={styles.buttonText}>Save Note</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CreateNoteScreen;
