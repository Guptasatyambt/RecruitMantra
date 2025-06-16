import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get("t");
  const email=new URLSearchParams(location.search).get("h");
  const otp=new URLSearchParams(location.search).get("r")

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Redirect if no token
  useEffect(() => {
    if (!token&&email&&otp) {
      navigate("/"); // Redirect to home
    }
  }, [token,email,otp, navigate]);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    console.log(password,otp,email,token);
    try {
        const res = await axios.post(
            "https://api.recruitmantra.com:5001/user/edit-password",
            {
              password: password,
              otp:otp,
              urlEmail:email,
            },
            {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
          );
      

    //   const data = await res.json();
    console.log(res);
      setMessage(res.data.message);
    
      if (res.status==200) {
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Reset Your Password</h2>
      {error && (
          <motion.div
            className="mt-4 bg-red-100 text-red-600 text-center py-2 px-4 rounded-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}
      <form onSubmit={handleReset} style={styles.form}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Updating..." : "Reset Password"}
        </button>
        {message && <p style={styles.message}>{message}</p>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "auto",
    padding: "20px",
    marginTop: "100px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    boxShadow: "0 0 10px #eee",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  message: {
    marginTop: "10px",
    color: "green",
  },
};

export default ResetPassword;