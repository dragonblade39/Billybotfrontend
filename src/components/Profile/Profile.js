import React, { useState, useEffect } from "react";
import "./Profile.css";
import { BACKEND_URL } from "../../Constant";

const Profile = ({ username }) => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [newPassword, setNewPassword] = useState("");

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/Signup-Login/get-user-details?username=${username}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json();
        if (data.success) {
          setUserData(data.user);
        } else {
          alert("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (username) fetchUserData();
  }, [username]);

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${BACKEND_URL}/Signup-Login/change-password`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, newPassword }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setNewPassword("");
        alert("Password changed successfully!");
      } else {
        alert("Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  return (
    <div className="profile-card">
      <h2>Profile</h2>
      <div className="profile-info">
        <p>
          <strong>Name:</strong> {userData.name}
        </p>
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
        <p>
          <strong>Phone:</strong> {userData.phone}
        </p>
      </div>
      <div className="change-password">
        <h3>Change Password</h3>
        <form onSubmit={handlePasswordChange}>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit">Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
