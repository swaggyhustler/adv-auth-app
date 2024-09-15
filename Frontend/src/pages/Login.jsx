import axios from 'axios';
import {useState} from 'react';
axios.defaults.withCredentials=true;
const Login = ()=>{
    const [loginData, setLoginData] = useState(null);
    const handleChange = (e)=>{        const {name, value} = e.target;
        setLoginData({...loginData, [name]: value});
    }
    const handleSubmit = async (e)=>{
        e.preventDefault();
        console.log("re-rendered");
        console.log(loginData);
        const response = await axios.post('http://localhost:5000/api/auth/login', loginData);
        console.log(response.data);
    }
    const handleLogout = async ()=>{
        const result = await axios.get('http://localhost:5000/api/auth/logout');
        console.log(result);
    }
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <h1 className="text-5xl font-bold">Login Page</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder='email' onChange={handleChange} name='email'/>
                <input type="text" placeholder='password' onChange={handleChange} name='password'/>
                <button type='submit'>Submit</button>
            </form>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default Login;