import { Route, Routes } from "react-router-dom"
import { Admin, Login } from "../pages"

function LoginRoutes() {
  return (
    <>
    <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/admin" element={<Admin/>}/>
    </Routes>
    </>
  )
}

export default LoginRoutes