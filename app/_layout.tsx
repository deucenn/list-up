import { useFonts } from "expo-font";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "@/hooks/useColorScheme";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Button,
  Modal,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Typdefinition für ein Listenelement
interface ListItem {
  id: number;
  text: string;
  amount: number;
}

const App: React.FC = () => {
  const [item, setItem] = useState("");
  const [list, setList] = useState<ListItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ListItem | null>(null);
  const [newText, setNewText] = useState("");
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const addItem = () => {
    if (item.trim() !== "") {
      setList([...list, { id: Date.now(), text: item.trim() }]);
      setItem("");
    }
  };

  const deleteItem = (id: number) => {
    setList(list.filter((item) => item.id !== id));
  };

  const openModal = (item: ListItem) => {
    setModalVisible(true);
    setSelectedItem(item);
    setNewText(item.text);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
    setNewText("");
  };

  const changeItem = () => {
    if (selectedItem && newText.trim() !== '') {
      const updatedList = list.map((listItem) =>
        listItem.id === selectedItem.id ? { ...listItem, text: newText.trim() } : listItem
      );
      setList(updatedList);
      closeModal();
    }
  };

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <View style={styles.container}>
        <Text style={styles.title}>Einkaufsliste</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Artikel hinzufügen"
            value={item}
            onChangeText={(text) => setItem(text)}
          />
          <Button title="Hinzufügen" onPress={addItem} />
        </View>
        <FlatList
          data={list}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.itemDiv}>{item.text}</Text>
              <View style={styles.buttons}>
                <Button title="Ändern" onPress={() => openModal(item)} />
                <Button title="Löschen" onPress={() => deleteItem(item.id)} />
              </View>
            </View>
          )}
        />
        <Modal visible={modalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Artikel umbenennen</Text>
            <TextInput
              style={styles.modalInput}
              value={newText}
              onChangeText={(text) => setNewText(text)}
            />
            <View style={styles.modalButtons}>
              <Button title="Speichern" onPress={changeItem} />
              <Button title="Abbrechen" onPress={closeModal} />
            </View>
          </View>
        </Modal>
      </View>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginRight: 10,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  itemDiv: {
    flex: 1,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
});

export default App;
