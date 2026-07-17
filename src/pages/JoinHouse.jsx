import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home as HomeIcon, KeyRound, ArrowLeft, Users, MapPin, Check } from "lucide-react";
import api from "../api/client.js";
import "../css/JoinHouse.css";


async function findHouseById(id) {
  try {
    return await api.get(`/api/v1/houses/${encodeURIComponent(id)}`);
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
}

async function joinHouse(house) {
  return api.post(`/api/v1/houses/${house.id}/join`);
}

export default function JoinHouse() {
  const [houseId, setHouseId] = useState("");
  const [house, setHouse] = useState(null);
  const [searching, setSearching] = useState(false);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!houseId.trim()) return;
    setSearching(true);
    setError("");
    setHouse(null);
    try {
      const result = await findHouseById(houseId.trim());
      if (!result) {
        setError("No house found with that ID. Double-check and try again.");
      } else {
        setHouse(result);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const handleJoin = async () => {
    if (!house) return;
    setJoining(true);
    setError("");
    try {
      await joinHouse(house);
      setJoined(true);
    } catch {
      setError("Couldn't join that house. You might need to log in first.");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="jh-page">
      {/* Nav */}
      <nav className="jh-nav">
        <Link to="/FindHouse" className="jh-brand">
          <div className="jh-brand-icon">
            <HomeIcon size={20} color="#fff" />
          </div>
          <span className="jh-brand-name">HouseHive</span>
        </Link>
        <Link to="/FindHouse" className="jh-back-link">
          <ArrowLeft size={16} />
          Back
        </Link>
      </nav>

      <div className="jh-container">
        <div className="jh-header">
          <div className="jh-header-icon">
            <KeyRound size={28} color="#fff" />
          </div>
          <h1 className="jh-title">Join a group house</h1>
          <p className="jh-subtitle">Enter the house ID your housemate shared with you.</p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="jh-form">
          <input
            className="jh-code-input"
            value={houseId}
            onChange={(e) => setHouseId(e.target.value)}
            placeholder="House ID"
            disabled={searching || joined}
          />
          {error && <p className="jh-error">{error}</p>}
          <button
            type="submit"
            disabled={searching || !houseId.trim() || joined}
            className="jh-button jh-button-dark"
          >
            {searching ? "Searching..." : "Find house"}
          </button>
        </form>

        {/* House result */}
        {house && !joined && (
          <div className="jh-card jh-card-enter">
            <div className="jh-card-body">
              <h2 className="jh-card-title">{house.name}</h2>
              <p className="jh-card-meta">
                <MapPin size={14} /> {house.address}
              </p>
              <p className="jh-card-meta">
                <Users size={14} /> {house.rooms} room{house.rooms === 1 ? "" : "s"}
              </p>
              <button onClick={handleJoin} disabled={joining} className="jh-button jh-button-gradient">
                {joining ? "Joining..." : "Join house"}
              </button>
            </div>
          </div>
        )}

        {/* Joined confirmation */}
        {joined && house && (
          <div className="jh-confirm">
            <div className="jh-confirm-icon">
              <Check size={28} color="#d97706" />
            </div>
            <h2 className="jh-card-title">You've joined {house.name}!</h2>
            <p className="jh-confirm-text">Welcome in. You can see the full house from your dashboard.</p>
            <button onClick={() => navigate("/")} className="jh-button jh-button-dark jh-button-inline">
              Back to home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
