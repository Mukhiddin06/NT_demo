import NT from "../assets/images/NT.png"
import Logo from "../assets/images/LOGO.svg"
import { Button, Input } from "antd"
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useAxios } from "../hooks/useAxios";
import { useNavigate } from "react-router-dom";

interface LoginType {
    login: string
    password: string
}

function Login() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false)
    const navigate = useNavigate()


    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        const data: LoginType = {
            login,
            password
        }
        try {
            const response = await useAxios().post("/api/staff/auth/sign-in", data)
            if (response) {
                toast.success('Successfully login!');
                localStorage.setItem("token", JSON.stringify(response.data.data.accessToken));
                navigate("/admin");
            }
        } catch (error) {
            console.error("Login failed:", error);
            toast.error(`${error}`);
            setError(true);
        }
    }

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="flex space-x-[100px]">
                <div>
                    <img className="h-[100vh]" src={NT} alt="Najot Ta'lim" width={500} height={"100%"} />
                </div>
                <div>
                    <img className="pl-[64px] pt-[60px] mb-[150px]" src={Logo} alt="Logo" width={202} height={41} />
                    <div className="pl-[80px]">
                        <h2 className="text-[32px] leading-[48px] mb-[32px]">Tizimga kirish</h2>
                        <form onSubmit={handleSubmit} className="w-[380px]">
                            <p className="text-[14px] leading-[21px] mb-[8px] font-semibold">Login</p>
                            <Input status={error ? "error" : ""} className="w-full" value={login} onChange={(e) => setLogin(e.target.value)} variant="outlined" type="text" placeholder="Loginni kiriting" size="large" required />
                            {!error ? <p className="text-[14px] leading-[21px] mt-[16px] mb-[8px] font-semibold">Parol</p> : <div className="flex justify-between mt-[16px] mb-[8px]">
                                <p className="text-[14px] leading-[21px] font-semibold">Parol</p>
                                <p className="text-[14px] leading-[21px] text-[#FC7857]">Parol yoki loginda xatolik</p>
                            </div>}
                            <Input.Password status={error ? "error" : ""} className="w-full" value={password} onChange={(e) => setPassword(e.target.value)} variant="outlined" type="password" placeholder="Parolni kiriting" size="large" required />
                            <Button htmlType="submit" type="primary" size="large" className="w-full bg-[#0EB182] mt-[32px]">Sign In</Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login