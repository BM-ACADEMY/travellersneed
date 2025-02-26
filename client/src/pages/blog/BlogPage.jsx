import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { fetchBlogByTitle } from "../../modules/admin/services/ApiService";
import "./BlogPage.css";

const BlogPage = () => {
  const { title } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const GET_IMAGE_FOR_BLOG_URL = import.meta.env.VITE_GET_IMAGE_FOR_BLOG.startsWith(
    "http"
  )
    ? import.meta.env.VITE_GET_IMAGE_FOR_BLOG
    : `${BASE_URL}${import.meta.env.VITE_GET_IMAGE_FOR_BLOG}`;

  const generateImageUrl = (imagePath) => {
    if (!imagePath) return "placeholder.jpg";
    const parts = imagePath.split("\\");
    const title = parts[0] || "";
    const fileName = parts[1] || "";
    return `${GET_IMAGE_FOR_BLOG_URL}?title=${encodeURIComponent(
      title
    )}&fileName=${encodeURIComponent(fileName)}`;
  };

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const response = await fetchBlogByTitle(title);

        if (response.data && response.data.blog) {
          setBlog(response.data.blog);
        } else {
          console.error("Blog not found in response.");
          setBlog(null);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    if (title) {
      fetchBlog();
    }
  }, [title]);

  const handleBook = (cityName) => {
    navigate(`/tour-packages/${encodeURIComponent(cityName)}`);
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!blog) {
    return <div className="text-center mt-5">Blog not found.</div>;
  }

  return (
    <motion.div
      className="container mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mt-3 mb-3 text-center">
        <motion.h4
          style={{ color: "#ef156c" }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Blogs
        </motion.h4>
      </div>
      <hr />
      <motion.h1
        className=""
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {blog.title}
      </motion.h1>
      <motion.p
        className="text-muted"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <FontAwesomeIcon icon={faCalendarAlt} style={{ color: "#ef156c" }} />{" "}
        {new Date(blog.date).toLocaleDateString()}{" "}
        <span className="mx-2">|</span>
        <FontAwesomeIcon icon={faUser} style={{ color: "#ef156c" }} />{" "}
        {blog.author}
      </motion.p>
      <motion.div
        className="mb-3"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <LazyLoadImage
          src={generateImageUrl(blog.images[0])}
          className="card-img-top"
          alt={blog.title}
          effect="blur"
          style={{
            width: "60vw",
            height: "auto",
            border: "1px solid rgb(217, 215, 215)",
            padding: "5px",
          }}
        />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {blog.description}
      </motion.p>

      <div className="related-cities">
        {blog.cityDetails.map((city, index) => {
          const imageIndex = index + 1;
          return (
            <motion.div
              className="related-city"
              key={city._id}
              style={{ marginBottom: "30px" }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 + index * 0.2 }}
            >
              <h4 style={{ color: "#ef156c" }}>{city.cityName}</h4>
              <motion.img
                // src={generateImageUrl(blog.images[imageIndex])}
                src={blog?.images[imageIndex]}
                alt={city.cityName}
                className="img-fluid img-responsive"
                style={{
                  width: "60vw",
                  height: "auto",
                  border: "1px solid rgb(217, 215, 215)",
                  padding: "5px",
                }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.2 }}
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 + index * 0.2 }}
              >
                {city.description}
              </motion.p>
              <motion.a
                onClick={() => handleBook(city.cityName)}
                className="btn"
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: "#ef156c", color: "white" }}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 + index * 0.2 }}
              >
                Book Here
              </motion.a>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default BlogPage;
