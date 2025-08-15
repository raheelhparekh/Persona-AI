import React, { useState } from 'react';
import Chat from './Chat';
import { getGeminiResponse } from './api';
import { PERSONA_PROMPTS } from './personas';
import './index.css';

const App = () => {
  // Store messages separately for each persona
  const [messagesByPersona, setMessagesByPersona] = useState({
    hitesh: [],
    piyush: []
  });
  const [userInput, setUserInput] = useState('');
  const [currentPersona, setCurrentPersona] = useState('hitesh');
  const [isLoading, setIsLoading] = useState(false);

  // Function to send the message to the Gemini API
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add user message to current persona's chat history
    const userMessage = { sender: 'user', text: userInput };
    setMessagesByPersona(prev => ({
      ...prev,
      [currentPersona]: [...prev[currentPersona], userMessage]
    }));
    setUserInput('');
    setIsLoading(true);

    try {
      const prompt = PERSONA_PROMPTS[currentPersona];
      const responseText = await getGeminiResponse(prompt, userInput);

      // Add persona's response to chat history
      setMessagesByPersona(prev => ({
        ...prev,
        [currentPersona]: [
          ...prev[currentPersona],
          { sender: currentPersona, text: responseText }
        ]
      }));
    } catch (error) {
      console.error("Error fetching from Gemini API:", error);
      setMessagesByPersona(prev => ({
        ...prev,
        [currentPersona]: [
          ...prev[currentPersona],
          { 
            sender: 'error', 
            text: 'Error: Could not get a response. Please check your API key and try again.' 
          }
        ]
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Function to clear messages for current persona
  const clearMessages = () => {
    setMessagesByPersona(prev => ({
      ...prev,
      [currentPersona]: []
    }));
  };

  return (
    <Chat
      messages={messagesByPersona[currentPersona]}
      setMessages={clearMessages}
      userInput={userInput}
      setUserInput={setUserInput}
      currentPersona={currentPersona}
      setCurrentPersona={setCurrentPersona}
      isLoading={isLoading}
      handleSendMessage={handleSendMessage}
    />
  );
};

export default App;