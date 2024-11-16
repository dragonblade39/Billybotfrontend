import React, { useState, useEffect } from "react";
import logo_icon from "../../assets/logo.png";
import bullying_icon from "../../assets/bullying.png";
import Profile from "../Profile/Profile";
import { useLocation, useNavigate } from "react-router-dom";
import Chatbot from "../Chatbot/Chatbot";
import { BiLogOut, BiUserCircle } from "react-icons/bi";
import "./Home.css";
import { BACKEND_URL } from "../../Constant";
import { BACKEND_URL1 } from "../../Constant1";
function Home() {
  const [activeComponent, setActiveComponent] = useState("home");
  const [name, setName] = useState("");
  const [activeRecordsCount, setActiveRecordsCount] = useState(0);
  const [activeRecords, setActiveRecords] = useState([]);
  const [historyRecords, setHistoryRecords] = useState([]); // State for history records
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();
  const [intents, setIntents] = useState([]);
  const location = useLocation();
  let username = location.state ? location.state.username : null;

  useEffect(() => {
    if (username === null) {
      navigate("/");
    }
  }, [username, navigate]);

  useEffect(() => {
    if (username) {
      fetchActiveRecordsCount();
    }
  }, [username]);

  useEffect(() => {
    const fetchedUsername = location.state ? location.state.username : null;
    if (fetchedUsername) {
      fetch(
        `${BACKEND_URL}/Signup-Login/get-user-name?username=${fetchedUsername}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data && data.name) {
            setName(data.name);
          }
        })
        .catch((error) => console.error("Error fetching user details:", error));
    }
    fetch("/intents.json")
      .then((response) => response.json())
      .then((data) => setIntents(data.intents))
      .catch((error) => console.error("Error loading intents:", error));
  }, [location.state]);

  const getGreetingTime = (date = new Date()) => {
    const hour = date.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleLogout = () => {
    navigate("/");
  };

  const toggleChatbot = () => {
    setIsChatOpen(!isChatOpen);
  };

  const fetchActiveRecordsCount = () => {
    if (!username) return;

    const url = `${BACKEND_URL1}/Incident/get-active-records/${username}`;
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setActiveRecordsCount(data.count);
        } else {
          console.error("Failed to fetch active records count.");
        }
      })
      .catch((error) =>
        console.error("Error fetching active records count:", error)
      );
  };

  const fetchActiveRecords = () => {
    if (!username) return;

    const url = `${BACKEND_URL1}/Incident/get-all-active-records/${username}`;
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setActiveRecords(data.records);
        } else {
          console.error("Failed to fetch active records count.");
        }
      })
      .catch((error) => console.error("Error fetching active records:", error));
  };

  const fetchHistoryRecords = () => {
    if (!username) return;

    const url = `${BACKEND_URL1}/Incident/get-history-records/${username}`;
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setHistoryRecords(data.records.filter((record) => !record.isActive));
        } else {
          console.error("Failed to fetch history records.");
        }
      })
      .catch((error) =>
        console.error("Error fetching history records:", error)
      );
  };
  const deleteRecord = (recordId) => {
    if (!username) return;

    const url = `${BACKEND_URL1}/Incident/mark-inactive/${username}/${recordId}`;
    fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Refresh the list or remove the item from state
          const filteredRecords = activeRecords.filter(
            (record) => record._id !== recordId
          );
          setActiveRecords(filteredRecords);
          setActiveRecordsCount((prevCount) => prevCount - 1); // Update count as well
        } else {
          console.error("Failed to delete the record.");
        }
      })
      .catch((error) => console.error("Error deleting record:", error));
  };

  const displayRecords = () => (
    <div className="records-display">
      {Array.isArray(activeRecords) && activeRecords.length > 0 ? (
        activeRecords.map((record, index) => (
          <div key={index} className="record">
            <p className="record-title">
              <b>Record ID: </b>
              {record._id}
            </p>
            <p>
              <b>Description:</b> {record.text}
            </p>
            {record.file && (
              <p>
                <b>Attached File:</b>
                <a
                  href={`${record.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View File
                </a>
              </p>
            )}
            <p>
              <b>Status: </b>
              {record.isActive ? "Active" : "Inactive"}
            </p>
            <p>
              <b>Created At: </b>
              {new Date(record.createdAt).toLocaleString()}
            </p>
            <button
              onClick={() => deleteRecord(record._id)}
              style={{ cursor: "pointer" }}
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <p>No active records to display.</p>
      )}
    </div>
  );

  const displayHistoryRecords = () => (
    <div className="records-display">
      {Array.isArray(historyRecords) && historyRecords.length > 0 ? (
        historyRecords.map((record, index) => (
          <div key={index} className="record">
            <p className="record-title">
              <b>Record ID: </b>
              {record._id}
            </p>
            <p>
              <b>Description:</b> {record.text}
            </p>
            {record.file && (
              <p>
                <b>Attached File:</b>{" "}
                <a
                  href={`${record.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View File
                </a>
              </p>
            )}
            <p>
              <b>Status: </b>
              {record.isActive ? "Active" : "Inactive"}
            </p>
            <p>
              <b>Created At: </b>
              {new Date(record.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <p>No history records to display.</p>
      )}
    </div>
  );

  const renderContent = () => {
    const greeting = `${getGreetingTime()}${name ? ", " + name : ""}`;
    switch (activeComponent) {
      case "chatbot":
        return (
          <Chatbot
            username={username}
            onHomeClick={() => setActiveComponent("home")}
          />
        );
      case "profile":
        return <Profile username={username} />;

      case "records":
        return displayRecords();
      case "history":
        return displayHistoryRecords();
      default:
        return (
          <div className="content-container">
            <div className="text-section">
              <h2>{greeting}</h2>
              <h2>Welcome to Billy - Buddy against Cyber Bullying</h2>
              <p>
                Our website aims to provide a supportive and safe environment
                for victims of cyberbullying, particularly among teenagers.
                Through our user-friendly chatbot, "Billy," we offer instant
                support and comfort to those affected by cyberbullying.
              </p>
              <p>
                The platform enables users to report incidents anonymously to
                the cyber-crime department and provides statistics to monitor
                cybercrime trends. We also foster a community where users can
                share experiences and learn from one another while accessing
                valuable resources and tips to empower themselves against
                cyberbullying.
              </p>
            </div>
            <div className="image-section">
              <img
                src={bullying_icon}
                alt="Cyberbullying Awareness"
                className="awareness-image"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="App">
      <header className="header">
        <div
          className="title"
          onClick={() => setActiveComponent("home")}
          style={{ cursor: "pointer" }}
        >
          <img src={logo_icon} alt="Logo" className="logo" />
          <h1>Billy - Buddy against Cyber Bullying</h1>
        </div>

        <nav className="nav-buttons">
          <BiUserCircle
            className="profile-icon"
            size={24}
            onClick={() => setActiveComponent("profile")}
            style={{ cursor: "pointer", marginRight: "20px" }}
          />
          <button
            onClick={() => {
              fetchActiveRecords();
              setActiveComponent("records");
            }}
            style={{ cursor: "pointer", marginRight: "20px" }}
          >
            Active Records: {activeRecordsCount}
          </button>
          <button
            onClick={() => {
              fetchHistoryRecords();
              setActiveComponent("history");
            }}
            style={{ cursor: "pointer", marginRight: "20px" }}
          >
            History Records
          </button>
          <BiLogOut
            className="logout-icon"
            size={24}
            onClick={handleLogout}
            style={{ cursor: "pointer" }}
          />
        </nav>
      </header>

      <main className="content">{renderContent()}</main>

      <footer className="footer">
        <p>© 2024 Billy - Buddy against Cyber Bullying. All rights reserved.</p>
        <p>
          Contact us: <a href="mailto:support@billy.com">support@billy.com</a>|
          Phone: <a href="tel:+1234567890">+1 (234) 567-890</a>
        </p>

        <div className="social-media">
          <a
            href="https://www.facebook.com/billy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>{" "}
          |
          <a
            href="https://www.twitter.com/billy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>{" "}
          |
          <a
            href="https://www.instagram.com/billy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>{" "}
          |
          <a
            href="https://www.linkedin.com/company/billy"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </footer>

      <div className="chatbot-icon" onClick={toggleChatbot}>
        <span>💬</span>
      </div>

      {isChatOpen && (
        <Chatbot
          username={username}
          onHomeClick={() => setActiveComponent("home")}
        />
      )}
    </div>
  );
}

export default Home;
