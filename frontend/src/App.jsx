import React, { useState } from 'react';
import Chat from './Chat';
import { getGeminiResponse } from './api';
import { PERSONA_PROMPTS } from './personas';
import './index.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [currentPersona, setCurrentPersona] = useState('hitesh');
  const [isLoading, setIsLoading] = useState(false);

  // Function to send the message to the Gemini API
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add user message to chat history
    const userMessage = { sender: 'user', text: userInput };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      const prompt = PERSONA_PROMPTS[currentPersona];
      const responseText = await getGeminiResponse(prompt, userInput);

      // Add persona's response to chat history
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: currentPersona, text: responseText },
      ]);
    } catch (error) {
      console.error("Error fetching from Gemini API:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'error', text: 'Error: Could not get a response. Please check your API key and try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Chat
      messages={messages}
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
