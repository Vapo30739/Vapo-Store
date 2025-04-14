import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://vapo-backend.vercel.app/",
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
  },
});
// dev env https://abomariamvapestorebackend.onrender.com
// prod env https://abomariambackend.vercel.app/

export default axiosInstance;

// Category Requests

export const getCategories = async () => {
  try {
    const response = await axiosInstance.get("/category");
    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error("Failed to fetch categories");
    }
  } catch (error) {
    throw error;
  }
};

export const getCategoryById = async (id) => {
  try {
    const response = await axiosInstance.get(`/category/${id}`);
    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error("Failed to fetch category");
    }
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};

export const addCategory = async (data, token) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.image?.[0]) formData.append("image", data.image[0]);

    const response = await axiosInstance.post("/category", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        auth: token,
      },
    });

    if (response.status === 201) {
      return response.data.data;
    } else {
      throw new Error("Failed to create the Category.");
    }
  } catch (error) {
    console.error(
      "Error creating Category:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateCategory = async (id, data, token) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.image?.[0]) formData.append("image", data.image[0]);

    const response = await axiosInstance.put(`/category/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        auth: token,
      },
    });

    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error("Failed to update category.");
    }
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

// SubCategory Requests

export const getSubCategories = async () => {
  try {
    const response = await axiosInstance.get("/sub_category");
    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error("Failed to fetch subcategories.");
    }
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    throw error;
  }
};

export const getSubCategoriesForSingleCategory = async (mainCategoryId) => {
  try {
    const response = await axiosInstance.get("/sub_category", {
      params: { main_category_id: mainCategoryId },
    });

    return response.data.data;
  } catch (err) {
    if (err.response?.status === 404) {
      throw new Error("There is no Subcategories yet for this category.");
    } else {
      throw new Error("Error fetching Subcategories. Please try again.");
    }
  }
};

export const createSubCategory = async (data, categoryId, token) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.description) {
      formData.append("description", data.description);
    }
    formData.append("main_category_id", categoryId);

    const response = await axiosInstance.post("/sub_category", formData, {
      headers: {
        auth: token,
      },
    });

    return response;
  } catch (error) {
    throw error.response?.data || new Error("Error creating SubCategory");
  }
};

// General Requests

export const loginUser = async (username, password) => {
  try {
    const response = await axiosInstance.post("/user/login", {
      user_name: username,
      password: password,
    });

    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error(response.message || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Unexpected error occurred");
  }
};

export const deleteItem = async (endpoint, id, token) => {
  try {
    const response = await axiosInstance.delete(`/${endpoint}/${id}`, {
      headers: {
        auth: token,
      },
    });
    if (response.status === 204) {
      return response.data;
    } else {
      throw new Error("Failed to delete item");
    }
  } catch (error) {
    throw error;
  }
};

export const deleteImageRequest = async (endpoint, id, index, token) => {
  try {
    const response = await axiosInstance.delete(`/${endpoint}/${id}/${index}`, {
      headers: {
        auth: token,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error deleting image:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const editImageRequest = async (
  endpoint,
  id,
  index,
  updatedFile,
  token
) => {
  try {
    const formData = new FormData();
    formData.append("image", updatedFile);

    const response = await axiosInstance.put(
      `/${endpoint}/${id}/${index}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          auth: token,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Update image error:", error.response?.data || error.message);
    throw error;
  }
};

// Products Requests

export const getProducts = async () => {
  try {
    const response = await axiosInstance.get(`/item`, {
      params: {
        include_hidden: true,
      },
    });

    if (response.status === 200) {
      return response.data.data.items;
    } else {
      throw new Error("Failed to get item");
    }
  } catch (error) {
    throw error;
  }
};

export const getProductDetails = async (id) => {
  try {
    const response = await axiosInstance.get(`/item/${id}`);
    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error("Failed to fetch product details");
    }
  } catch (error) {
    throw error;
  }
};

export const getProductsByCategory = async (id) => {
  try {
    const response = await axiosInstance.get("/item", {
      params: { main_category_id: id, include_hidden: true },
    });

    if (response.status === 200) {
      return response.data.data.items;
    } else {
      throw new Error("Failed to fetch Products.");
    }
  } catch (error) {
    console.error("Error fetching Products:", error);
    throw error;
  }
};

export const getDiscountedProductsRequest = async () => {
  try {
    const response = await axiosInstance.get("/item", {
      params: { discount: 1 },
    });

    if (response.status === 200) {
      return response.data.data.items;
    } else {
      throw new Error("Failed to fetch discounted Products.");
    }
  } catch (error) {
    console.error("Error fetching discounted Products:", error);
    throw error;
  }
};

export const createProduct = async (data, token) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    formData.append("price", data.price);
    if (data.discount) formData.append("discount", data.discount);
    formData.append("main_category_id", data.main_category_id);
    if (data.sub_category_id)
      formData.append("sub_category_id", data.sub_category_id);

    // Append images
    Array.from(data.image).forEach((file) => {
      formData.append("image", file);
    });

    formData.append("is_hidden", data.hidden);

    const response = await axiosInstance.post("/item", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        auth: token,
      },
    });

    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateProduct = async (id, data, token) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);

    if (data.price) formData.append("price", data.price);
    if (data.discount) formData.append("discount", data.discount);
    if (data.description) formData.append("description", data.description);
    if (data.main_category_id)
      formData.append("main_category_id", data.main_category_id);
    if (data.sub_category_id)
      formData.append("sub_category_id", data.sub_category_id);
    formData.append("is_hidden", data.is_hidden);

    const response = await axiosInstance.put(`/item/${id}`, formData, {
      headers: { auth: token },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const toggleHiddenStatus = async (productId, hidden, token) => {
  try {
    const newHiddenStatus = !hidden;
    await axiosInstance.put(
      `/item/${productId}`,
      { is_hidden: newHiddenStatus },
      {
        headers: {
          auth: token,
        },
      }
    );

    return newHiddenStatus;
  } catch (error) {
    console.error("Failed to update visibility:", error);
    throw error;
  }
};

// Social Media Requests

export const addWhatsappProfile = async (data, token) => {
  try {
    const formData = new FormData();
    formData.append("link", data.link);
    formData.append("phone_number", data.phone_number);
    formData.append("name", data.name);

    const response = await axiosInstance.post("/settings/whatsapp", formData, {
      headers: {
        auth: token,
      },
    });
    sessionStorage.setItem("settings", JSON.stringify(response.data.data));
    return response.data.data.social_media.whatsapp;
  } catch (error) {
    console.error("Error adding profile:", error);
    throw error;
  }
};

export const updateSocialMediaLink = async (
  platform,
  link,
  setLoading,
  setStatusMessage,
  token
) => {
  try {
    setLoading(true);
    setStatusMessage("");

    const response = await axiosInstance.put(
      `/settings/${platform}`,
      { [platform]: link },
      {
        headers: {
          "Content-Type": "application/json",
          auth: token,
        },
      }
    );

    if (response.status === 200) {
      sessionStorage.setItem("settings", JSON.stringify(response.data.data));

      setStatusMessage(`${platform} link changed successfully!`);
    } else {
      setStatusMessage(`Failed to change ${platform} link.`);
    }
  } catch (error) {
    console.error(
      `Failed to change ${platform} link`,
      error.response?.data || error.message
    );
    setStatusMessage(`Error changing ${platform} link. Please try again.`);
  } finally {
    setLoading(false);
  }
};

// FAQ Requests

export const getFAQs = async () => {
  try {
    const response = await axiosInstance.get("/faq");

    if (response.status === 200) {
      return response.data.data; // Return the FAQ list
    } else {
      throw new Error("Failed to fetch FAQs.");
    }
  } catch (error) {
    console.error("Error fetching FAQs:", error.message);
    throw error;
  }
};

export const getFAQById = async (id) => {
  try {
    const response = await axiosInstance.get(`/faq/${id}`);

    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error("Failed to fetch FAQ.");
    }
  } catch (error) {
    console.error("Error fetching FAQ:", error.message);
    throw error;
  }
};

export const addFAQ = async (data, token) => {
  try {
    const formData = new FormData();
    formData.append("question", data.question);
    formData.append("answer", data.answer);

    if (data.image?.length > 0) {
      Array.from(data.image).forEach((file) => formData.append("image", file));
    }

    const response = await axiosInstance.post("/faq", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        auth: token,
      },
    });

    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error("Failed to create the FAQ.");
    }
  } catch (error) {
    console.error("Error creating FAQ:", error.message);
    throw error;
  }
};

export const updateFAQ = async (id, data, token) => {
  try {
    const formData = new FormData();
    formData.append("question", data.question);
    formData.append("answer", data.answer);

    const response = await axiosInstance.put(`/faq/${id}`, formData, {
      headers: {
        auth: token,
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to update FAQ.");
    }
  } catch (error) {
    console.error("Error updating FAQ:", error.response?.data || error.message);
    throw error;
  }
};

// Settings Section

export const getSettingsRequest = async () => {
  try {
    const response = await axiosInstance.get("/settings");

    if (response.status === 200) {
      return response.data.data[0];
    }
  } catch (error) {
    throw new Error(error.response?.data || "Error fetching settings");
  }
};

export const updateSettings = async (field, value, token) => {
  try {
    const key = field === "dollar" ? "dollar_price" : field;

    const response = await axiosInstance.put(
      `/settings/${field}`,
      { [key]: value },
      {
        headers: {
          "Content-Type": "application/json",
          auth: token,
        },
      }
    );

    if (response.status === 200) {
      sessionStorage.setItem(
        "dollar_value",
        response.data.data.dollar_price
      );
      sessionStorage.setItem("settings", JSON.stringify(response.data.data));
    

      return response.data;
    } else {
      throw new Error("Failed to update settings");
    }
  } catch (error) {
    throw new Error(error.response?.data || "Error updating settings");
  }
};


export const deleteHeroImage = async (id, token) => {
  try {
    const response = await axiosInstance.delete(`/settings/hero/${id}`, {
      headers: {
        auth: token,
      },
    });
    if (response.status === 204) {
      return response.data;
    } else {
      throw new Error("Failed to delete item");
    }
  } catch (error) {
    throw error;
  }
};

export const uploadImages = async (endpoint, itemId, images, token) => {
  if (!images.length) {
    throw new Error("Please select at least one image to upload.");
  }

  const formData = new FormData();
  images.forEach((image) => {
    if (image) {
      formData.append("image", image);
    }
  });

  try {
    const response = await axiosInstance.post(
      `/${endpoint}/${itemId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          auth: token,
        },
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const uploadHeroImages = async (endpoint, images, token) => {
  if (!images.length) {
    throw new Error("Please select at least one image to upload.");
  }

  const formData = new FormData();
  images.forEach((image) => {
    if (image) {
      formData.append("image", image);
    }
  });

  try {
    const response = await axiosInstance.post(
      `/settings/${endpoint}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          auth: token,
        },
      }
    );
   sessionStorage.setItem("dollar_value", response.data.data.dollar_price);
    sessionStorage.setItem("settings", JSON.stringify(response.data.data));
    return response;
  } catch (error) {
    throw error;
  }
};

export const editHeroImages = async (endpoint, index, updatedFile, token) => {
  if (!(updatedFile instanceof File)) {
    throw new Error("Please select a valid file.");
  }

  const formData = new FormData();
  formData.append("image", updatedFile);

  try {
    const response = await axiosInstance.put(
      `/settings/${endpoint}/${index}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          auth: token,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error updating image:",
      error.response?.data || error.message
    );
    throw error;
  }
};
