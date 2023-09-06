import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useState, useEffect } from "react";
import styles from "./AppStyles";
import {
  doc,
  addDoc,
  getDocs,
  collection,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "./components/config";
function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

const MainScreen = ({ navigation, route }) => {
  const extraNotes = [
    {
      header: "Grocery Shopping",
      details: "Buy milk, bread, and eggs.",
      lastModified: formatDate(new Date()),
    },
    {
      header: "Meeting Notes",
      details: "Discuss project deadlines and next steps.",
      lastModified: formatDate(new Date()),
    },
    {
      header: "Exercise Plan",
      details: "Run 3 miles and do a 30-minute HIIT workout.",
      lastModified: formatDate(new Date()),
    },
    {
      header: "Read",
      details: "Finish chapter 5 of the new book.",
      lastModified: formatDate(new Date()),
    },
    {
      header: "Call Mom",
      details: "It's her birthday today, don't forget to call!",
      lastModified: formatDate(new Date()),
    },
    {
      header: "Dentist Appointment",
      details: "Tuesday at 3 PM.",
      lastModified: formatDate(new Date()),
    },
    {
      header: "Fix Sink",
      details: "The kitchen sink is leaking, call the plumber.",
      lastModified: formatDate(new Date()),
    },
    {
      header: "Cook Dinner",
      details: "Try that new pasta recipe.",
      lastModified: formatDate(new Date()),
    },
    {
      header: "Study Spanish",
      details: "Practice conversational phrases for 20 mins.",
      lastModified: formatDate(new Date()),
    },
    {
      header: "Clean Room",
      details: "It's a mess, needs tidying up.",
      lastModified: formatDate(new Date()),
    },
  ];

  const [list, setList] = useState([]);

  useEffect(() => {
    if (route.params?.updatedNote && route.params?.updatedNote.id) {
      const updatedNote = {
        ...route.params.updatedNote,
        lastModified: formatDate(new Date()),
      };
      const noteRef = doc(db, "notes", route.params.updatedNote.id);

      updateDoc(noteRef, updatedNote)
        .then(() => {
          console.log("Document successfully updated!");
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    } else if (route.params?.note) {
      addDoc(collection(db, "notes"), {
        header: route.params.note.header,
        details: route.params.note.details,
        lastModified: formatDate(new Date()),
      })
        .then((docRef) => {
          console.log("Note added with ID:", docRef.id);
        })
        .catch((error) => {
          console.error("Error adding note:", error);
        });
    }
  }, [route.params]);

  useEffect(() => {
    const notesCollection = collection(db, "notes");

    const unsubscribe = onSnapshot(
      notesCollection,
      (snapshot) => {
        const notesArray = [];
        snapshot.forEach((doc) => {
          const noteData = doc.data();
          noteData.id = doc.id; // Add the document ID to noteData for later usage
          notesArray.push(noteData);
        });
        setList(notesArray);
      },
      (error) => {
        console.error("Error listening for data changes:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleDelete = (noteId) => {
    const noteToDelete = list.find((note) => note.id === noteId);

    if (noteToDelete) {
      deleteDoc(doc(db, "notes", noteToDelete.id))
        .then(() => {
          console.log("Document successfully deleted!");
          const newList = list.filter((note) => note.id !== noteId);
          setList(newList);
        })
        .catch((error) => {
          console.error("Error deleting document: ", error);
        });
    }
  };

  const renderRightActions = (noteId) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(noteId)}
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
          onPress={() => navigation.navigate("CreateNoteScreen")}
        >
          <Text style={styles.buttonText}>Create Note</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={list}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => renderRightActions(item.id)}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() =>
                navigation.navigate("CreateNoteScreen", { note: item })
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
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

export default MainScreen;
