import React, { useContext, useState, useEffect, useRef } from "react";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddService = () => {
  const [serviceImg, setServiceImg] = useState(null);
  const [name, setName] = useState("");
  const [categoryRef, setCategoryRef] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);

  const { backendUrl } = useContext(AppContext);
  const { aToken } = useContext(AdminContext);

  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(backendUrl + "/api/category/list");
        if (data.success) {
          setCategories(data.data);
          if (data.data.length > 0) {
            setCategoryRef(data.data[0]._id);
          }
        } else {
          toast.error(data.message || "Failed to load categories");
        }
      } catch (err) {
        toast.error("Error fetching categories");
        console.error("❌ Category fetch error:", err);
      }
    };
    fetchCategories();
  }, [backendUrl]);

  // Mutation
  const addServiceMutation = useMutation({
    mutationFn: async (formData) => {
      return axios.post(backendUrl + "/api/service/add", formData, {
        headers: {
          Authorization: `Bearer ${aToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: (res) => {
      toast.success(res.data.message);
      setServiceImg(null);
      setName("");
      setCategoryRef(categories[0]?._id || "");
      setPrice("");
      setDescription("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      queryClient.invalidateQueries(["services"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || error.message);
      console.error("Error adding service:", error);
    },
  });

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (!serviceImg) {
      return toast.error("Image Not Selected");
    }

    const formData = new FormData();
    formData.append("image", serviceImg); // ✅ must match backend
    formData.append("name", name);
    formData.append("categoryRef", categoryRef);
    formData.append("description", description);
    formData.append("hasPricing", "true");
    formData.append(
      "pricingOptions",
      JSON.stringify([
        {
          label: "Base Price",
          amount: Number(price),
          unit: "piece",
          currency: "INR",
          isDefault: true,
        },
      ])
    );

    addServiceMutation.mutate(formData);
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Service</p>

      <div className="bg-gray-900 px-8 py-8 border border-gray-700 rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll text-white">
        {/* Image Upload */}
        <div className="flex items-center gap-4 mb-8 text-gray-300">
          <label htmlFor="service-img">
            <img
              className="w-16 h-16 bg-gray-800 rounded-full cursor-pointer object-cover"
              src={
                serviceImg
                  ? URL.createObjectURL(serviceImg)
                  : assets.upload_area
              }
              alt="Upload"
            />
          </label>
          <input
            ref={fileInputRef}
            onChange={(e) => setServiceImg(e.target.files[0])}
            type="file"
            id="service-img"
            hidden
          />
          <p>Upload service image</p>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-4 text-gray-200">
          <div className="flex flex-col gap-1">
            <p>Service Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="border border-gray-700 bg-gray-800 rounded px-3 py-2"
              type="text"
              placeholder="e.g. Sliding Window"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <p>Category</p>
            <select
              onChange={(e) => setCategoryRef(e.target.value)}
              value={categoryRef}
              className="border border-gray-700 bg-gray-800 rounded px-2 py-2"
              required
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <p>Price</p>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className="border border-gray-700 bg-gray-800 rounded px-3 py-2"
              type="number"
              placeholder="Enter price"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <p>Description</p>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className="w-full px-4 pt-2 border border-gray-700 bg-gray-800 rounded"
              rows={5}
              placeholder="Write about the service"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={addServiceMutation.isLoading}
          className="bg-primary px-10 py-3 mt-6 text-white rounded-full hover:opacity-90 disabled:opacity-50"
        >
          {addServiceMutation.isLoading ? "Adding..." : "Add Service"}
        </button>
      </div>
    </form>
  );
};

export default AddService;