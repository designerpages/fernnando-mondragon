import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { theme } from "../libs/theme";

const ListItem = ({ item, onDelete, onSelect }) => {
  return (
    <View style={styles.itemBox}>
      <View style={styles.listItem}>
        <Text style={styles.itemText}>{item.name}</Text>
        <View style={styles.buttons}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.editButton,
              pressed && styles.pressed,
            ]}
            onPress={() => onSelect(item)}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.deleteButton,
              pressed && styles.pressed,
            ]}
            onPress={() => onDelete(item._id)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemBox: {
    width: "100%",
    paddingHorizontal: 30,
  },
  listItem: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
    borderWidth: 1,
    borderColor: theme.borderColor,
    padding: 10,
    marginBottom: 15,
    marginVertical: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  itemText: {
    fontSize: 18,
    flex: 1,
  },
  button: {
    padding: 5,
    borderRadius: 5,
  },
  editButton: {
    backgroundColor: theme.primaryColor,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
  },
  buttonText: {
    color: theme.buttonTextColor,
  },
  pressed: {
    opacity: 0.5,
  },
});

export default ListItem;
