import React from "react";
import Register from "./components/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import LandingPage from "./components/LandingPage";
import DashBoard from "./components/DashBoard";
import Layout from "./components/Layout";
import Tasks from "./components/Tasks";
import Analytics from "./components/Analytics";
import Profile from "./components/Profile";
import Settings from "./components/Settings";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashBoard />}></Route>
          <Route path="/tasks" element={<Tasks/>}></Route>
          <Route path="/analytics" element={<Analytics/>}></Route>
          <Route path="/profile" element={<Profile/>}></Route>
          <Route path="/settings" element={<Settings/>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
