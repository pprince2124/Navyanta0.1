import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);

  const { token, backendUrl, userData, setUserData, loadUserProfileData } =
    useContext(AppContext);

  // ✅ Update profile API call
  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData?.name || "");
      formData.append("email", userData?.email || "");
      formData.append("phone", userData?.phone || "");
      formData.append("address", JSON.stringify(userData?.address || {}));
      formData.append("gender", userData?.gender || "Not Selected");
      formData.append("dob", userData?.dob || "");
      if (image) formData.append("image", image);

      const { data } = await axios.put(
        backendUrl + "/api/user/profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // ✅ Helper to resolve image URL
  const getImageUrl = (img) => {
    if (!img) return assets.default_avatar;
    return img.startsWith("http") ? img : `${backendUrl}/${img}`;
  };

  return userData ? (
    <div className="max-w-lg flex flex-col gap-4 text-sm pt-5 text-white">
      {/* Profile Image */}
      {isEdit ? (
        <label htmlFor="image">
          <div className="inline-block relative cursor-pointer">
            <img
              className="w-36 rounded-lg border-2 border-primary shadow-lg opacity-75"
              src={image ? URL.createObjectURL(image) : getImageUrl(userData?.image)}
              alt="Profile"
            />
            {!image && (
              <img
                className="w-10 absolute bottom-12 right-12"
                src={assets.upload_icon}
                alt="Upload"
              />
            )}
          </div>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
          />
        </label>
      ) : (
        <img
          className="w-36 rounded-lg border-2 border-primary shadow-lg"
          src={getImageUrl(userData?.image)}
          alt="Profile"
        />
      )}

      {/* Name */}
      {isEdit ? (
        <input
          className="bg-gray-800 text-white text-3xl font-semibold max-w-60 rounded px-2 py-1"
          type="text"
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, name: e.target.value }))
          }
          value={userData?.name || ""}
        />
      ) : (
        <p className="font-semibold text-3xl mt-4">{userData?.name || "Unnamed User"}</p>
      )}

      <hr className="border-gray-600" />

      {/* Contact Info */}
      <div>
        <p className="text-gray-400 uppercase tracking-wide mt-3">Contact Information</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3">
          <p className="font-medium">Email:</p>
          {isEdit ? (
            <input
              className="bg-gray-800 text-white rounded px-2 py-1"
              type="email"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, email: e.target.value }))
              }
              value={userData?.email || ""}
            />
          ) : (
            <p className="text-blue-400">{userData?.email || "No email"}</p>
          )}

          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input
              className="bg-gray-800 text-white rounded px-2 py-1"
              type="text"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, phone: e.target.value }))
              }
              value={userData?.phone || ""}
            />
          ) : (
            <p className="text-blue-400">{userData?.phone || "No phone"}</p>
          )}

          <p className="font-medium">Address:</p>
          {isEdit ? (
            <div>
              <input
                className="bg-gray-800 text-white rounded px-2 py-1 mb-2"
                type="text"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value },
                  }))
                }
                value={userData?.address?.line1 || ""}
              />
              <input
                className="bg-gray-800 text-white rounded px-2 py-1"
                type="text"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value },
                  }))
                }
                value={userData?.address?.line2 || ""}
              />
            </div>
          ) : (
            <p className="text-gray-300">
              {userData?.address?.line1} <br /> {userData?.address?.line2}
            </p>
          )}
        </div>
      </div>

      {/* Basic Info */}
      <div>
        <p className="text-gray-400 uppercase tracking-wide mt-3">Basic Information</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3">
          <p className="font-medium">Gender:</p>
          {isEdit ? (
            <select
              className="bg-gray-800 text-white rounded px-2 py-1"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, gender: e.target.value }))
              }
              value={userData?.gender || "Not Selected"}
            >
              <option value="Not Selected">Not Selected</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className="text-gray-300">{userData?.gender || "Not Selected"}</p>
          )}

          <p className="font-medium">Birthday:</p>
          {isEdit ? (
            <input
              className="bg-gray-800 text-white rounded px-2 py-1"
              type="date"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, dob: e.target.value }))
              }
              value={userData?.dob && userData?.dob !== "Not Selected" ? userData?.dob : ""}
            />
          ) : (
            <p className="text-gray-300">{userData?.dob || "Not Selected"}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-10 flex gap-4">
        {isEdit ? (
          <>
            <button
              onClick={updateUserProfileData}
              className="bg-gradient-to-r from-primary via-blue-700 to-primary text-white px-8 py-2 rounded-full hover:opacity-90 transition"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEdit(false);
                setImage(null);
                loadUserProfileData(); // reset to server state
              }}
              className="border border-gray-500 px-8 py-2 rounded-full hover:bg-gray-700 transition"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="bg-gradient-to-r from-primary via-blue-700 to-primary text-white px-8 py-2 rounded-full hover:opacity-90 transition"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  ) : null;
};

export default MyProfile;