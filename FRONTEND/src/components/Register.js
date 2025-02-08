import { useState } from "react";
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom"; 
export default function Register() {
    const [name, setName] = useState("");  
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/register", 
                { name, password }, 
                { withCredentials: true } 
            );
            alert("Registration successful! Redirecting to login...");
            navigate("/login");
        } catch (err) {
            console.error("Registration error:", err);
            alert("Registration failed. Try again.");
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900">
            <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h1 className="text-5xl text-center mb-10"><u>REGISTER</u></h1>
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
                        Register
                    </button>
                </form>
                <div className="text-center mt-4">
                    <p>Already have an account?</p>
                    <Link to="/login" className="border w-full bg-light rounded p-2 block mt-2">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
