import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./Chatbot.css";
import { BACKEND_URL } from "../../Constant";
import { BACKEND_URL1 } from "../../Constant1";
function Chatbot({ onHomeClick }) {
  const location = useLocation();
  const [username, setUsername] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [fileUrl, setFileUrl] = useState(null);
  const messagesEndRef = useRef(null);
  const [intents, setIntents] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchedUsername = location.state ? location.state.username : null;
    if (fetchedUsername) {
      setUsername(fetchedUsername);
      fetch(
        `${BACKEND_URL}/Signup-Login/get-user-name?username=${fetchedUsername}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data && data.name && data.email) {
            setName(data.name);
            setEmail(data.email);
            console.log("Email fetched:", data.email);
          }
        })
        .catch((error) => console.error("Error fetching user details:", error));
    }
    fetch("/intents.json")
      .then((response) => response.json())
      .then((data) => setIntents(data.intents))
      .catch((error) => console.error("Error loading intents:", error));
  }, [location.state]);

  useEffect(() => {
    if (username && name) {
      setMessages([
        {
          text: `Hello ${name || username}, I'm here to assist you.`,
          sender: "bot",
        },
      ]);
    }
  }, [username, name]);

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput("");

      setTimeout(() => {
        const botResponse = generateResponse(input);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: botResponse, sender: "bot" },
        ]);
      }, 1000);

      if (isIncident(input)) {
        sendIncidentData(input, fileUrl);
      }
    }
  };

  const isIncident = (input) => {
    const incidentKeywords = [
      "incident",
      "report",
      "evidence",
      "abuse",
      "harassment",
    ];
    return incidentKeywords.some((keyword) =>
      input.toLowerCase().includes(keyword)
    );
  };

  const sendIncidentData = (incidentText, imageUrl) => {
    fetch(`${BACKEND_URL}/Signup-Login/get-user-name?username=${username}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setName(data.name);
          setEmail(data.email);
          console.log("Email fetched:", data.email);
        }
      })
      .catch((error) => console.error("Error fetching user details:", error));

    const formData = new FormData();
    formData.append("incidentText", incidentText);
    formData.append("filePath", fileUrl);
    formData.append("username", username);
    formData.append("email", email); // Ensure email is appended
    console.log("Email in formData:", email);

    fetch(`${BACKEND_URL1}/Incident/store-incident`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: `Incident reported successfully!`, sender: "bot" },
          ]);
        } else {
          throw new Error("Failed to report incident");
        }
      })
      .catch((error) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text:
              error.message || "Failed to report incident. Please try again.",
            sender: "bot",
          },
        ]);
      });
  };

  const generateResponse = (input) => {
    const lowerInput = input.toLowerCase();
    for (let intent of intents) {
      if (
        intent.examples &&
        intent.examples.some((example) =>
          lowerInput.includes(example.toLowerCase())
        )
      ) {
        return intent.responses[
          Math.floor(Math.random() * intent.responses.length)
        ];
      }
    }
    return ``;
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "qsjm5e0f");

    // Set resource type based on file type
    const resourceType = file.type.startsWith("video/") ? "video" : "image";

    fetch(`https://api.cloudinary.com/v1_1/dj4dqxk4t/${resourceType}/upload`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setIsUploading(false);
        if (data.secure_url) {
          setFileUrl(data.secure_url);
          console.log("File uploaded successfully:", data.secure_url);
        } else {
          console.log("Cloudinary response:", data); // Log the whole response
          throw new Error(
            "Failed to upload file - " +
              (data.error.message || "No error message")
          );
        }
      })
      .catch((error) => {
        setIsUploading(false);
        console.error("Upload Error:", error);
        alert(
          "Error uploading file: " + (error.message || JSON.stringify(error))
        ); // Show more detailed error information
      });
  };

  const toggleChatbot = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <div className="chatbot-icon" onClick={toggleChatbot}>
        <span>💬</span>
      </div>
      <div className={`chatbot ${isChatOpen ? "open" : ""}`}>
        <div className="chatbot-header">
          <h3>Billy - Cyberbullying Support Chatbot</h3>
        </div>
        <div className="chatbot-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              <p>{message.text}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="chatbot-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
          />
          <button onClick={handleSend} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Send"}
          </button>
        </div>
        <div className="file-upload">
          <input
            type="file"
            onChange={handleFileChange}
            accept="*/*"
            id="file-input"
          />
          {fileUrl && <p>File uploaded successfully</p>}
        </div>
      </div>
    </>
  );
}

export default Chatbot;
