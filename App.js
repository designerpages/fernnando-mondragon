import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  Keyboard,
  Pressable,
} from "react-native";
import axios from "axios";
import ListItem from "./src/components/ListItem";
import { theme } from "./src/libs/theme";

export default function App() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get(
        "https://crudcrud.com/api/29d1c180c0df498a90c5e3289d26f7ca/todo-list"
      );
      setItems(response.data);
    } catch (error) {
      console.error(error);
      setError("Failed to load items. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdate = async () => {
    if (!textInput.trim()) {
      Alert.alert("Validation", "Please enter a valid item name.");
      return;
    }
    const action = selectedItem ? "Update" : "Create";
    try {
      const url = `https://crudcrud.com/api/29d1c180c0df498a90c5e3289d26f7ca/todo-list${
        selectedItem ? `/${selectedItem._id}` : ""
      }`;
      const method = selectedItem ? "put" : "post";
      await axios[method](url, { name: textInput.trim() });
      fetchItems();
      setTextInput("");
      setSelectedItem(null);
      Keyboard.dismiss();
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        `Failed to ${action.toLowerCase()} item. Please try again.`
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://crudcrud.com/api/29d1c180c0df498a90c5e3289d26f7ca/todo-list/${id}`
      );
      fetchItems();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to delete item. Please try again.");
    }
  };

  const handleInputChange = (text) => {
    setTextInput(text);
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setTextInput(item.name);
  };

  return (
    <View onPress={Keyboard.dismiss} style={styles.container}>
      {selectedItem && (
        <Pressable
          style={[styles.backButton]}
          onPress={() => {
            setSelectedItem(null);
            setTextInput("");
          }}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
      )}
      <View style={styles.header}>
        <Text style={styles.headerText}>To-Do List</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter item name"
          value={textInput}
          onChangeText={handleInputChange}
        />
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          selectedItem ? styles.updateButton : styles.createButton,
          pressed && styles.pressedButton,
        ]}
        onPress={handleCreateOrUpdate}
      >
        {({ pressed }) => (
          <Text style={styles.buttonText}>
            {pressed
              ? selectedItem
                ? "Updating..."
                : "Creating..."
              : selectedItem
              ? "Update Item"
              : "Create Item"}
          </Text>
        )}
      </Pressable>
      {isLoading ? (
        <ActivityIndicator
          style={{ flexGrow: 1 }}
          size="large"
          color={theme.primaryColor}
        />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : items.length === 0 ? (
        <Text style={styles.emptyState}>No items found</Text>
      ) : (
        <FlatList
          data={items}
          style={{ width: "100%" }}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <ListItem
              item={item}
              onDelete={handleDelete}
              onSelect={handleSelectItem}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 120,
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  headerText: {
    fontSize: 36,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
 },
  input: {
    borderWidth: 1,
    borderColor: theme.borderColor,
    padding: 10,
    margin: 10,
    fontSize: 16,
    borderRadius: 5,
    flex: 1,
  },
  button: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  createButton: {
    backgroundColor: theme.primaryColor,
  },
  updateButton: {
    backgroundColor: theme.secondaryColor,
  },
  buttonText: {
    color: theme.buttonTextColor,
    textAlign: "center",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  emptyState: {
    marginTop: 20,
    color: theme.textColor,
    flexGrow: 1,
  },
  pressedButton: {
    opacity: 0.5,
  },
  backButton: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#CCCCCC",
    borderRadius: 5,
    position: "absolute",
    top: 40,
    left: 10,
    zIndex: 1,
  },
  backButtonText: {
    color: "#000000",
    textAlign: "center",
  },
});
