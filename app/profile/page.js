'use client'
import React, { useState, useEffect } from "react";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAppContext } from "@/lib/AppContext";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Link from "next/link";

export default function Profile() {
  const { user } = useAppContext();
  const [displayName, setDisplayName] = useState("");
  const [photoFile, setPhotoFile] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUserData = () => {
    const user = auth.currentUser;
    if (user) {
      setDisplayName(user.displayName);
    }
  }

  useEffect(() => {
    handleUserData()
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const user = auth.currentUser;
      let photoURL = user.photoURL;
      // check is file ready to upload
      if(photoFile) {
        const storage = getStorage();
        const storageRef = ref(storage, `profile_pictures/${user.uid}`);
        await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(storageRef);
      }

      await updateProfile(user, {
        displayName: displayName,
        photoURL: photoURL,
      });
      await user.reload();
      handleUserData();
      setLoading(false);
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
        <div className="font-[sans-serif] max-w-md mx-auto">
          <label class="text-base text-gray-500 font-semibold mb-2">Update Your Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your Name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 text-black"
          />
        </div>
        <div className="font-[sans-serif] max-w-md mx-auto">
        <label class="text-base text-gray-500 font-semibold mb-2">Upload file</label>
          <input 
            type="file"
            onChange={(e) => setPhotoFile(e.target.files[0])}
            className="w-full text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded"
          />
          <p class="text-xs text-gray-400 mt-2">PNG, GIF, WEBP, & JPG are Allowed.</p>
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-lg font-semibold hover:bg-gradient-to-l transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          Update Profile
        </button>
        <Link href={'/dashboard'}>
          <button type="button" className="w-full btn btn-error my-3 text-white rounded-lg text-lg hover:bg-gradient-to-l transition-all duration-300 transform hover:scale-105 hover:shadow-lg ">Back</button>
        </Link>
        {error && <p className="text-red-500 mb-4">{error}</p>}
      </form>
      </div>
    );
  }