import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Toolbar, Typography, Container, TextField, Button, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { addMessage } from './actions';
import apiClient from './apiClient';
import messageObservable from './observer';
import BotIcon from '@mui/icons-material/Android';  // Import bot icon
import TypingMessage from './TypingMessage';  // Import the new TypingMessage component
import './App.css';

const App = () => {
  const [input, setInput] = useState('');
  const dispatch = useDispatch();
  const messages = useSelector(state => state.messages.messages);

  useEffect(() => {
    const handleNewMessage = (message) => {
      dispatch(addMessage(message));
    };

    messageObservable.subscribe(handleNewMessage);

    return () => {
      messageObservable.unsubscribe(handleNewMessage);
    };
  }, [dispatch]);

  const sendMessage = async () => {
    const userMessage = input.trim();
    if (!userMessage) {
      return; // Do not send if the message is empty
    }
    
    messageObservable.notify({ text: userMessage, sender: 'user' });
    setInput('');

    try {
      const response = await apiClient.postMessage(userMessage);
      messageObservable.notify({ text: response.data.response, sender: 'bot' });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            UNY Admission Chatbot Demo
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <List>
          {messages.map((message, index) => (
            <ListItem key={index} className={message.sender === 'user' ? 'user-message' : 'bot-message'}>
              {message.sender === 'bot' && (
                <ListItemAvatar>
                  <Avatar>
                    <BotIcon />
                  </Avatar>
                </ListItemAvatar>
              )}
              <ListItemText>
                <TypingMessage sender={message.sender} text={message.text} />
              </ListItemText>
            </ListItem>
          ))}
        </List>
        <TextField 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Type a message..." 
          fullWidth 
        />
        <Button onClick={sendMessage} variant="contained" color="primary">
          Send
        </Button>
      </Container>
    </>
  );
};

export default App;
