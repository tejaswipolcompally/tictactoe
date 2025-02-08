import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
 function Login({setUser}) {    
    const [name, setName] = useState("");  // Updated from userName to name
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/login", 
                { name, password }, 
                { withCredentials: true }
            );

            console.log("Login Response:", response.data);  
            if (response.data === "Success") {
                console.log("logged in")
                setUser(name);  
                navigate("/tictactoe");
            } else {
                alert(response.data.error || "Invalid credentials. Please try again.");
            }
        } catch (error) {
            console.error("Login error:", error.response?.data || error);
            alert("Login failed. Please check your credentials.");
        }
    };


    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900">
            <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h1 className="text-5xl text-center mb-10"><u>Login</u></h1>
                <form onSubmit={handleSubmit} className="text-3xl flex flex-col gap-4 space-y-3">
                    <input 
                        type="text" 
                        placeholder="Username" 
                        className="border p-2 rounded" 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className="border p-2 rounded" 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <button type="submit" className="bg-black text-white text-2xl rounded p-2 mt-4">
                        Log In
                    </button>
                </form>
                <div className="text-center mt-4">
                    <p>Don't have an account?</p>
                    <Link to="/register" className="border w-full bg-light rounded p-2 block mt-2">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
