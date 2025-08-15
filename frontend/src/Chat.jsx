import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const WELCOME_MESSAGES = {
  hitesh: "👋 Hi! I'm Hitesh Choudhary, a tech educator passionate about web development and programming. I love teaching complex concepts in simple ways. Feel free to ask me anything about web development, JavaScript, or programming in general!",
  piyush: "👋 Hello! I'm Piyush Garg, a full-stack developer and tech enthusiast. I specialize in modern web technologies and system design. Ask me about React, Node.js, System Design, or any tech topic you're curious about!"
};

const Chat = ({
  messages,
  userInput,
  setUserInput,
  currentPersona,
  setCurrentPersona,
  isLoading,
  handleSendMessage,
  setMessages
}) => {
  const chatHistoryRef = React.useRef(null);
  const [showWelcome, setShowWelcome] = React.useState(true);

  const handlePersonaSwitch = (persona) => {
    if (currentPersona !== persona) {
      setUserInput('');
      setCurrentPersona(persona);
      setShowWelcome(true);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setShowWelcome(true);
  };

  React.useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Format text content: paragraphs, bullets, numbered lists
  const formatTextContent = (text) => {
    return text.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return null;

      // Numbered list
      const numberedMatch = trimmed.match(/^(\d+)\./);
      if (numberedMatch) {
        return (
          <div key={idx} className="flex gap-2 mb-1">
            <span className="font-semibold">{numberedMatch[0]}</span>
            <span>{trimmed.slice(numberedMatch[0].length).trim()}</span>
          </div>
        );
      }

      // Bullet points
      if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
        return (
          <div key={idx} className="flex gap-2 mb-1">
            <span className="font-bold text-primary">•</span>
            <span>{trimmed.slice(1).trim()}</span>
          </div>
        );
      }

      // Regular paragraph
      return (
        <p key={idx} className="mb-2 leading-relaxed">
          {trimmed}
        </p>
      );
    });
  };

  // Full message formatter with code blocks + text formatting
  const formatMessage = (text) => {
    const codeBlockRegex = /```([\w]*)\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Text before code block
      if (match.index > lastIndex) {
        const textPart = text.slice(lastIndex, match.index);
        parts.push(
          <div key={`text-${lastIndex}`}>
            {formatTextContent(textPart)}
          </div>
        );
      }

      // Code block
      const language = match[1] || 'javascript';
      parts.push(
        <div key={`code-${match.index}`} className="my-3 rounded-lg overflow-hidden bg-base-300">
          <div className="bg-base-300 px-4 py-1 text-xs font-mono text-base-content/70">
            {language}
          </div>
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            className="!rounded-t-none !m-0"
          >
            {match[2].trim()}
          </SyntaxHighlighter>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    // Remaining text
    if (lastIndex < text.length) {
      parts.push(
        <div key={`text-${lastIndex}`}>
          {formatTextContent(text.slice(lastIndex))}
        </div>
      );
    }

    return <div className="space-y-2">{parts.length ? parts : formatTextContent(text)}</div>;
  };

  return (
    <div className="min-h-screen bg-base-300 flex justify-center py-6">
      <div className="w-full max-w-4xl bg-base-100 rounded-xl shadow-xl flex flex-col overflow-hidden">
        {/* Navbar */}
        <div className="navbar sticky top-0 z-30 bg-base-100/80 backdrop-blur-lg shadow-md rounded-t-xl">
          <div className="flex-1 px-4">
            <h1 className="text-2xl font-bold">💬 Tech Gurus Chat</h1>
          </div>
          <div className="flex-none gap-2 pr-4">
            <button onClick={clearChat} className="btn btn-ghost btn-sm" title="Clear Chat">
              🧹 Clear Chat
            </button>
            <div className="join">
              <button
                onClick={() => handlePersonaSwitch('hitesh')}
                className={`btn join-item rounded-xl transition ${
                  currentPersona === 'hitesh' ? 'btn-primary' : 'btn-outline btn-primary'
                }`}
              >
                Hitesh
              </button>
              <button
                onClick={() => handlePersonaSwitch('piyush')}
                className={`btn join-item rounded-xl transition ${
                  currentPersona === 'piyush' ? 'btn-primary' : 'btn-outline btn-primary'
                }`}
              >
                Piyush
              </button>
            </div>
          </div>
        </div>

        {/* Chat history */}
        <div className="flex-1 flex flex-col h-[calc(100vh-10rem)]">
          <div ref={chatHistoryRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && showWelcome && (
              <div className="chat chat-start">
                <div className="chat-header capitalize mb-1 text-sm opacity-70">
                  {currentPersona}
                </div>
                <div className="chat-bubble bg-base-200 text-base-content">
                  {WELCOME_MESSAGES[currentPersona]}
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat ${msg.sender === 'user' ? 'chat-end' : 'chat-start'}`}
              >
                <div className="chat-header capitalize mb-1 text-sm opacity-70">
                  {msg.sender === 'user' ? 'You' : msg.sender}
                </div>
                <div
                  className={`chat-bubble shadow-md max-w-[85%] ${
                    msg.sender === 'user' ? 'chat-bubble-primary' : 'bg-base-200 text-base-content'
                  }`}
                >
                  {formatMessage(msg.text)}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="chat chat-start">
                <div className="chat-header capitalize mb-1 text-sm opacity-70">
                  {currentPersona}
                </div>
                <div className="chat-bubble bg-base-200 shadow-md">
                  <span className="loading loading-dots loading-md"></span>
                </div>
              </div>
            )}
          </div>

          {/* Input form */}
          <div className="p-4 bg-base-200 border-t border-base-300">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowWelcome(false);
                handleSendMessage(e);
              }}
              className="flex gap-2 items-center"
            >
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={`Ask ${currentPersona === 'hitesh' ? 'Hitesh' : 'Piyush'} anything...`}
                className="input input-bordered input-primary w-full rounded-xl"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="btn btn-primary rounded-xl px-4"
                disabled={isLoading || !userInput.trim()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
