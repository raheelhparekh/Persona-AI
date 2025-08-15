const API_URL = 'http://localhost:3000/api/chat';

export const getGeminiResponse = async (personaPrompt, userMessage) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ personaPrompt, userMessage }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Error calling API:', error);
    throw new Error('Failed to get response from API');
  }
};