import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Input,
  Button,
  Text,
  Checkbox,
  VStack,
  HStack,
  Spacer,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

const TODO_STORAGE_KEY = "todo-list-storage-key";

const Index = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editTodo, setEditTodo] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all");
  const toast = useToast();

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem(TODO_STORAGE_KEY));
    if (storedTodos) {
      setTodos(storedTodos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      setTodos([...todos, { text: newTodo, completed: false }]);
      setNewTodo("");
      toast({
        title: "Todo added.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const toggleComplete = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  const editTodoItem = (index) => {
    setEditTodo(index);
    setEditText(todos[index].text);
  };

  const updateTodo = () => {
    const newTodos = [...todos];
    newTodos[editTodo].text = editText;
    setTodos(newTodos);
    setEditTodo(null);
    setEditText("");
    toast({
      title: "Todo updated.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const deleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
    toast({
      title: "Todo deleted.",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") {
      return !todo.completed;
    } else if (filter === "completed") {
      return todo.completed;
    }
    return true;
  });

  return (
    <Box maxWidth="500px" mx="auto" mt={8} p={4}>
      <Heading mb={8} textAlign="center">
        Todo App
      </Heading>
      <Box mb={8}>
        <HStack>
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter a new todo"
          />
          <Button onClick={addTodo} colorScheme="blue" px={8}>
            <FaPlus />
          </Button>
        </HStack>
      </Box>

      <VStack spacing={4} alignItems="stretch">
        {filteredTodos.map((todo, index) => (
          <HStack key={index} opacity={todo.completed ? 0.5 : 1}>
            <Checkbox
              isChecked={todo.completed}
              onChange={() => toggleComplete(index)}
            />
            {editTodo === index ? (
              <Input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
            ) : (
              <Text
                flex={1}
                textDecoration={todo.completed ? "line-through" : "none"}
              >
                {todo.text}
              </Text>
            )}
            <Spacer />
            {editTodo === index ? (
              <IconButton icon={<FaEdit />} onClick={updateTodo} />
            ) : (
              <IconButton
                icon={<FaEdit />}
                onClick={() => editTodoItem(index)}
              />
            )}
            <IconButton
              icon={<FaTrash />}
              onClick={() => deleteTodo(index)}
            />
          </HStack>
        ))}
      </VStack>

      <HStack mt={8} spacing={4} justifyContent="center">
        <Button
          onClick={() => setFilter("all")}
          variant={filter === "all" ? "solid" : "outline"}
        >
          All
        </Button>
        <Button
          onClick={() => setFilter("active")}
          variant={filter === "active" ? "solid" : "outline"}
        >
          Active
        </Button>
        <Button
          onClick={() => setFilter("completed")}
          variant={filter === "completed" ? "solid" : "outline"}
        >
          Completed
        </Button>
      </HStack>
    </Box>
  );
};

export default Index;