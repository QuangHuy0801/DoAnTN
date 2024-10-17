import React, { useEffect, useState } from 'react';
import { changePassword, updateProfile } from '../services/UserService';
import { useNavigate } from 'react-router-dom';

function MyProfile() {
  const navigate = useNavigate(); 
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')));
  const [previewAvatar, setPreviewAvatar] = useState();
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessagepw, setSuccessMessagePW] = useState('');
  const [errorMessagepw, setErrorMessagePW] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add an error state

  useEffect(() => {
    if (!user) {
      setError(new Error('User not found'));
      setLoading(false);
    } else {
      setPreviewAvatar(user.avatar)
      setFullname(user.user_Name);
      setEmail(user.email)
      setPhoneNumber(user.phone_Number)
      setAddress(user.address)
      setLoading(false); // Set loading to false when user data is available
    }
  }, [user]);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChange = async (event) => {
    event.preventDefault();
    try {
      const response = await updateProfile(user.id, event.target.avatar.files[0], fullname, email, phoneNumber, address);
      sessionStorage.setItem('user', JSON.stringify(response.data));
      setSuccessMessage('Profile updated successfully.');
    } catch (error) {
      setErrorMessage('Failed to update profile. Please try again.');
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setSuccessMessagePW('');
    setErrorMessagePW('');
    try {
      if (currentPassword === "" || confirmPassword === "" || newPassword === "") {
        setErrorMessagePW('All password fields are required.');
      } else {
        if (currentPassword === user.password) {
          if (newPassword === confirmPassword || newPassword === "") {
            await changePassword(user.id, newPassword);
            setSuccessMessagePW('Password changed successfully.');
            setTimeout(() => {
              sessionStorage.removeItem('user');
              navigate('/signin');
            }, 2000);
          } else {
            setErrorMessagePW('New password and confirm password do not match.');
          }
        } else {
          setErrorMessagePW('Current password is incorrect.');
        }
      }
    } catch (error) {
      setErrorMessagePW('Failed to change password. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading MyProfile: {error.message}</div>;
  }
  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-12">
          <h2>My Profile</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/home">Home</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                My Profile
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6 col-md-12">
          <div className="card mb-4">
            <div className="card-header">
              <h4 className="mb-0">Profile Details</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSaveChange}>
                <div className="text-center mb-4">
                  <div className="avatar-container">
                    <img
                      src={previewAvatar}
                      alt=""
                      className="avatar rounded-circle"
                      style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                    />
                    <div className="avatar-overlay">
                      <div className="photoUpload">
                        <label htmlFor="avatar-upload" className="btn btn-primary btn-sm">
                          <i className="fas fa-upload"></i> Upload Photo
                        </label>
                        <input
                          id="avatar-upload"
                          name="avatar"
                          type="file"
                          accept="image/*"
                          className="upload d-none"
                          onChange={handleAvatarChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="fullname">Your Name</label>
                  <input
                    id="fullname"
                    name="fullname"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    id="address"
                    name="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="text-success mb-3">{successMessage}</div>
                <div className="text-danger mb-3">{errorMessage}</div>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-6 col-md-12">
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">Change Password</h4>
            </div>
            <div className="card-body">
              <div className="my-profile">
                <form onSubmit={handleChangePassword}>
                  <div className="form-group">
                    <label htmlFor="current_password">Current Password</label>
                    <input
                      id="current_password"
                      name="current_password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      type="password"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="new_password">New Password</label>
                    <input
                      id="new_password"
                      name="new_password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      type="password"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirm_password">Confirm New Password</label>
                    <input
                      id="confirm_password"
                      name="confirm_password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      type="password"
                      className="form-control"
                    />
                  </div>
                  <div className="text-danger mb-3">{/* Error message for password change */}</div>
                  <div className="text-success mb-3">{successMessagepw}</div>
                <div className="text-danger mb-3">{errorMessagepw}</div>
                  <button type="submit" className="btn btn-primary">
                    Change Password
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
