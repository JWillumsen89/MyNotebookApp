import { Text, View, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useState, useEffect } from 'react';
import styles from './AppStyles';
import { doc, addDoc, getDocs, collection, updateDoc, deleteDoc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

import { app, db, storage } from './components/config';
function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
}

const MainScreen = ({ navigation, route }) => {
    const [list, setList] = useState([]);

    useEffect(() => {
        async function handleSave() {
            let noteToSave = route.params?.note || route.params?.updatedNote;

            // If there are images, upload them to Firebase Storage
            if (noteToSave?.images && noteToSave.images.length > 0) {
                const uploadedImageURLs = [];

                for (const image of noteToSave.images) {
                    const imageURL = await uploadImageToFirebase(image);
                    uploadedImageURLs.push(imageURL);
                }

                noteToSave.images = uploadedImageURLs; // Reassign the images property to the URLs
            }

            if (route.params?.updatedNote && noteToSave.id) {
                noteToSave.lastModified = formatDate(new Date());

                const noteRef = doc(db, 'notes', noteToSave.id);

                updateDoc(noteRef, noteToSave)
                    .then(() => {
                        console.log('Document successfully updated!');
                    })
                    .catch(error => {
                        console.error('Error updating document: ', error);
                    });
            } else if (route.params?.note) {
                noteToSave.lastModified = formatDate(new Date());

                addDoc(collection(db, 'notes'), noteToSave)
                    .then(docRef => {
                        console.log('Note added with ID:', docRef.id);
                    })
                    .catch(error => {
                        console.error('Error adding note:', error);
                    });
            }
        }

        handleSave();
    }, [route.params]);

    useEffect(() => {
        const notesCollectionQuery = query(collection(db, 'notes'), orderBy('header', 'asc'));

        const unsubscribe = onSnapshot(
            notesCollectionQuery,
            snapshot => {
                const notesArray = [];
                snapshot.forEach(doc => {
                    const noteData = doc.data();
                    noteData.id = doc.id;
                    notesArray.push(noteData);
                });
                setList(notesArray);
            },
            error => {
                console.error('Error listening for data changes:', error);
            }
        );
        return () => unsubscribe();
    }, []);

    const handleDelete = noteId => {
        const noteToDelete = list.find(note => note.id === noteId);

        if (noteToDelete) {
            deleteDoc(doc(db, 'notes', noteToDelete.id))
                .then(() => {
                    console.log('Document successfully deleted!');
                    const newList = list.filter(note => note.id !== noteId);
                    setList(newList);
                })
                .catch(error => {
                    console.error('Error deleting document: ', error);
                });
        }
    };

    const renderRightActions = noteId => {
        return (
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(noteId)}>
                <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
        );
    };

    async function fetchImageBlob(imageUri) {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        return blob;
    }

    async function uploadImageToFirebase(imageUri) {
        const imageBlob = await fetchImageBlob(imageUri);

        const storageRef = ref(storage, 'notes_images/' + new Date().toISOString() + '.jpeg'); // Name your image file

        await uploadBytesResumable(storageRef, imageBlob);

        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>MyNotebook App</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CreateNoteScreen')}>
                    <Text style={styles.buttonText}>Create Note</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={list}
                renderItem={({ item }) => (
                    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
                        <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate('CreateNoteScreen', { note: item })}>
                            <View style={styles.noteContainer}>
                                <View style={styles.noteInnerContainer}>
                                    <Text style={styles.noteHeader} numberOfLines={1} ellipsizeMode="tail">
                                        {item.header}
                                    </Text>
                                    <Text style={styles.lastModifiedText}>Last Modified: {item.lastModified}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Swipeable>
                )}
                keyExtractor={item => item.id}
            />
        </SafeAreaView>
    );
};

export default MainScreen;
