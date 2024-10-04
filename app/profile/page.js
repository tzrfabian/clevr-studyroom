'use client'
import React, { useState, useEffect } from "react";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAppContext } from "@/lib/AppContext";

export default function Profile() {
  const { user } = useAppContext();
  const [displayName, setDisplayName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setDisplayName(user.displayName);
      setPhotoUrl(user.photoURL);
    }
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      await updateProfile(user, {
        displayName: displayName,
        photoURL: photoUrl,
      });
      setDisplayName("");
      setPhotoUrl("");
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <h1 className="text-4xl font-bold mb-6">My Profile</h1>
        <div className="flex flex-col items-center justify-center">
            <img className="w-40 h-40 rounded-full" src={user?.photoURL} alt="pic"/>
          </div>
        <p className="my-5"><strong>Your Name: </strong>{user?.displayName}</p>
        <form onSubmit={handleUpdateProfile} className="space-y-6">
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your Name"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 text-black"
          required
        />
        <input
          type="url"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
          placeholder="Profile Picture URL"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 text-black"
        />
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:bg-gradient-to-l transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          Update Profile
        </button>
        {error && <p className="text-red-500 mb-4">{error}</p>}
      </form>
      </div>
    );
  }