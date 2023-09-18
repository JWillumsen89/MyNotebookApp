import { Text, View, TextInput, TouchableOpacity, SafeAreaView, Alert, Image, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import styles from './AppStyles';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

const CreateNoteScreen = ({ navigation, route }) => {
    const [note, setNote] = useState(route.params?.note || { header: '', details: '', images: [] });
    const index = route.params?.index;

    const addBulletPoints = () => {
        const formattedDetails = note.details
            .split('\n')
            .map(line => {
                if (line.startsWith('  • ')) {
                    return line;
                }
                return `  • ${line}`;
            })
            .join('\n');

        setNote({
            ...note,
            details: formattedDetails,
        });
    };

    const isNoteValid = note.header.trim() !== '' && note.details.trim() !== '';

    const [isModalVisible, setModalVisible] = useState(false);

    const askForPermissions = async () => {
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
        const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (cameraPermission.status !== 'granted' || mediaLibraryPermission.status !== 'granted') {
            alert('Sorry, we need both camera and media library permissions to make this work!');
            return false;
        }
        return true;
    };

    const [latestImage, setLatestImage] = useState(null);

    const fetchLatestImage = async () => {
        const { assets } = await MediaLibrary.getAssetsAsync({
            first: 1,
            sortBy: MediaLibrary.SortBy.creationTime,
        });
        if (assets.length > 0) {
            setLatestImage(assets[0]);
        }
    };

    useEffect(() => {
        fetchLatestImage();
    }, []);

    const takeAndAddPhoto = async () => {
        const hasPermission = await askForPermissions();
        if (!hasPermission) return;
        Alert.alert(
            'Choose an option',
            'Would you like to take a photo or choose from the gallery?',
            [
                {
                    text: 'Take Photo',
                    onPress: async () => {
                        let result = await ImagePicker.launchCameraAsync({
                            allowsEditing: true,
                            aspect: [4, 3],
                            quality: 1,
                        });

                        if (!result.canceled && result.assets && result.assets.length > 0) {
                            const updatedImages = note.images ? [...note.images, result.assets[0].uri] : [result.assets[0].uri];
                            setNote({ ...note, images: updatedImages });
                        }
                    },
                },
                {
                    text: 'Choose from Gallery',
                    onPress: async () => {
                        let result = await ImagePicker.launchImageLibraryAsync({
                            allowsEditing: true,
                            aspect: [4, 3],
                            quality: 1,
                        });

                        if (!result.canceled && result.assets && result.assets.length > 0) {
                            const updatedImages = note.images ? [...note.images, result.assets[0].uri] : [result.assets[0].uri];
                            setNote({ ...note, images: updatedImages });
                        }
                    },
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ],
            { cancelable: true }
        );
    };

    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={styles.createNoteScreenContainer}>
                <TextInput
                    placeholder="Enter Note Header...."
                    style={styles.input}
                    placeholderTextColor="white"
                    onChangeText={text => setNote({ ...note, header: text })}
                    value={note.header}
                />
                <TextInput
                    placeholder="Enter Note Details...."
                    style={styles.detailsInput}
                    placeholderTextColor="white"
                    onChangeText={text => setNote({ ...note, details: text })}
                    value={note.details}
                    multiline={true}
                    numberOfLines={6}
                />
                <View style={styles.formattingButtonsContainer}>
                    <TouchableOpacity style={styles.formattingButton} onPress={addBulletPoints}>
                        <Text style={styles.buttonText}>Add •</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.formattingButton} onPress={() => console.log('Dummy button pressed')}>
                        <Text style={styles.buttonText}>Italicize</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.formattingButton} onPress={() => console.log('Dummy button pressed')}>
                        <Text style={styles.buttonText}>Underline</Text>
                    </TouchableOpacity>
                </View>
                {note.images && note.images.length > 0 && (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {note.images.map((img, index) => (
                            <TouchableOpacity
                                key={index}
                                style={{ width: '32%', margin: 10 }}
                                onPress={() => {
                                    setSelectedImage(img);
                                    setModalVisible(true);
                                }}
                            >
                                <Image source={{ uri: img }} style={{ width: '100%', height: 100 }} />
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {isModalVisible && (
                    <Modal animationType="slide" transparent={false} visible={isModalVisible} onRequestClose={() => setModalVisible(false)}>
                        <View style={styles.createNoteScreenContainer}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={{ uri: selectedImage }} style={{ width: '100%', height: '70%', resizeMode: 'contain' }} />
                                <View style={styles.formattingButtonsContainer}>
                                    <TouchableOpacity
                                        style={styles.formattingButton}
                                        onPress={() => {
                                            const updatedImages = note.images.filter(img => img !== selectedImage);
                                            setNote(prevNote => ({ ...prevNote, images: updatedImages }));
                                            setSelectedImage(null);
                                            setModalVisible(false);
                                        }}
                                    >
                                        <Text style={styles.buttonText}>Delete</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.formattingButton} onPress={() => setModalVisible(false)}>
                                        <Text style={styles.buttonText}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                )}

                <View style={styles.formattingButtonsContainer}>
                    <TouchableOpacity style={styles.formattingButton} onPress={takeAndAddPhoto}>
                        <Text style={styles.buttonText}>Add Photo</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={isNoteValid ? styles.button : styles.buttonDisabled}
                    onPress={() => {
                        if (!isNoteValid) return;

                        if (route.params?.note?.id) {
                            navigation.navigate('MainScreen', { updatedNote: note });
                        } else {
                            navigation.navigate('MainScreen', { note });
                        }
                    }}
                    disabled={!isNoteValid}
                >
                    <Text style={styles.buttonText}>Save Note</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default CreateNoteScreen;
