import React, { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "../../app/api";

type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
};

type PasswordData = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });
  const [originalProfile, setOriginalProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });
  const [editable, setEditable] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        const userProfile = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role,
        };
        setProfile(userProfile);
        setOriginalProfile(userProfile);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setMessage("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name in profile && name !== "role") {
      setProfile((prev) => ({ ...prev, [name]: value }));
    } else if (name in passwordData) {
      setPasswordData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditToggle = () => {
    setEditable(true);
  };

  const handleReset = () => {
    setProfile(originalProfile);
    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setEditable(false);
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const nameRegex = /^[A-Za-zА-Яа-яЁё\s-]+$/;
    if (!nameRegex.test(profile.firstName) || !nameRegex.test(profile.lastName)) {
      setMessage("First Name and Last Name can only contain letters, spaces, or hyphens.");
      setSaving(false);
      return;
    }

    if (passwordData.newPassword || passwordData.confirmPassword) {
      if (!passwordData.newPassword.length || !passwordData.confirmPassword.length) {
        setMessage("Please fill in both new password fields.");
        setSaving(false);
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setMessage("New password must be at least 6 characters long.");
        setSaving(false);
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setMessage("New password and confirmation do not match.");
        setSaving(false);
        return;
      }
    }


    try {
      const payload: any = {
        first_name: profile.firstName,
        last_name: profile.lastName,
        email: profile.email,
      };

      if (
        passwordData.oldPassword || 
        profile.email !== originalProfile.email
      ) {
        if (!passwordData.oldPassword) {
          setMessage("Please enter your current password to save changes.");
          setSaving(false);
          return;
        }
        payload.current_password = passwordData.oldPassword;
      }

      if (passwordData.newPassword) {
        payload.password = passwordData.newPassword;
        payload.password_confirmation = passwordData.confirmPassword;
      }

      await updateUserProfile(payload);

      setMessage("Profile updated successfully!");
      setEditable(false);
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setOriginalProfile(profile);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setMessage(error.response.data.errors.join(", "));
      } else {
        setMessage("Failed to update profile.");
      }
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };



  if (loading) return <p>Loading profile...</p>;

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto" }}>
      <h2>My Profile</h2>

      {message && (
        <div
          style={{
            marginBottom: "12px",
            padding: "10px",
            backgroundColor: "#28a745",
            color: "white",
            borderRadius: "6px",
          }}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={profile.firstName}
            onChange={handleChange}
            className="form-control"
            disabled={!editable}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={profile.lastName}
            onChange={handleChange}
            className="form-control"
            disabled={!editable}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="form-control"
            disabled={!editable}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Role:</label>
          <input
            type="text"
            name="role"
            value={profile.role}
            className="form-control"
            disabled
          />
        </div>

        {editable && (
          <>
            <div style={{ marginBottom: "10px" }}>
              <label>Current Password:</label>
              <input
                type="password"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>New Password:</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>Confirm New Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </>
        )}

        {!editable ? (
          <button type="button" className="btn btn-secondary" onClick={handleEditToggle}>
            Edit
          </button>
        ) : (
          <div style={{ marginTop: "10px" }}>
            <button type="submit" className="btn btn-primary me-2" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" className="btn btn-warning" onClick={handleReset}>
              Reset
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;
