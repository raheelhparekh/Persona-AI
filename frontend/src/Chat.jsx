import React from 'react';

const Chat = ({
  messages,
  userInput,
  setUserInput,
  currentPersona,
  setCurrentPersona,
  isLoading,
  handleSendMessage,
}) => {
  const chatHistoryRef = React.useRef(null);

  React.useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const formatMessage = (text) => {
    return text
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line, idx) => (
        <p key={idx} className="mb-2 leading-relaxed">
          {line}
        </p>
      ));
  };

  return (
    <div className="min-h-screen bg-base-300 flex justify-center py-6">
      {/* Main Chat Card */}
      <div className="w-full max-w-4xl bg-base-100 rounded-xl shadow-xl flex flex-col overflow-hidden">
        
        {/* Navbar */}
        <div className="navbar sticky top-0 z-30 bg-base-100/80 backdrop-blur-lg shadow-md rounded-t-xl">
          <div className="flex-1 px-4">
            <h1 className="text-2xl font-bold">💬 Tech Gurus Chat</h1>
          </div>
          <div className="flex-none gap-2 pr-4">
            <div className="join">
              <button
                onClick={() => setCurrentPersona('hitesh')}
                className={`btn join-item rounded-xl transition ${
                  currentPersona === 'hitesh'
                    ? 'btn-primary'
                    : 'btn-outline btn-primary'
                }`}
              >
                Hitesh
              </button>
              <button
                onClick={() => setCurrentPersona('piyush')}
                className={`btn join-item rounded-xl transition ${
                  currentPersona === 'piyush'
                    ? 'btn-primary'
                    : 'btn-outline btn-primary'
                }`}
              >
                Piyush
              </button>
            </div>
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 flex flex-col h-[calc(100vh-10rem)]">
          {/* Messages */}
          <div
            ref={chatHistoryRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.length === 0 ? (
              <div className="hero min-h-[50vh] bg-base-200 rounded-lg shadow-inner">
                <div className="hero-content text-center">
                  <div className="max-w-md">
                    <h2 className="text-2xl font-bold">
                      Welcome to Tech Gurus Chat!
                    </h2>
                    <p className="py-4 text-base-content/70">
                      Select a guru and start chatting to begin your learning
                      journey.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat ${
                    msg.sender === 'user' ? 'chat-end' : 'chat-start'
                  }`}
                >
                  <div className="chat-header capitalize mb-1 text-sm opacity-70">
                    {msg.sender === 'user' ? 'You' : msg.sender}
                  </div>
                  <div
                    className={`chat-bubble shadow-md max-w-[85%] whitespace-pre-line leading-relaxed ${
                      msg.sender === 'user'
                        ? 'chat-bubble-primary'
                        : 'bg-base-200 text-base-content'
                    }`}
                  >
                    {formatMessage(msg.text)}
                  </div>
                </div>
              ))
            )}

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

          {/* Input Form */}
          <div className="p-4 bg-base-200 border-t border-base-300">
            <form
              onSubmit={handleSendMessage}
              className="flex gap-2 items-center"
            >
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={`Chat with ${
                  currentPersona === 'hitesh' ? 'Hitesh' : 'Piyush'
                }...`}
                className="input input-bordered input-primary w-full rounded-xl"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="btn btn-primary rounded-xl px-4"
                disabled={isLoading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
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
