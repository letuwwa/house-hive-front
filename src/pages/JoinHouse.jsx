import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home as HomeIcon, KeyRound, ArrowLeft, Check } from "lucide-react";
import { joinHouse } from "../api/houses.js";
import "../css/JoinHouse.css";


export default function JoinHouse() {
  const [houseId, setHouseId] = useState("");
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!houseId.trim()) return;
    setJoining(true);
    setError("");
    try {
      await joinHouse(houseId.trim());
      setJoined(true);
    } catch (requestError) {
      if (requestError.status === 404) {
        setError("No house found with that ID. Double-check and try again.");
      } else if (requestError.status === 409) {
        setError("");
        setJoined(true);
      } else if (requestError.status === 422) {
        setError("Enter a valid house UUID.");
      } else {
        setError(requestError.message || "Couldn't join that house.");
      }
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
        <form onSubmit={handleJoin} className="jh-form">
          <input
            className="jh-code-input"
            value={houseId}
            onChange={(e) => setHouseId(e.target.value)}
            placeholder="House ID"
            disabled={joining || joined}
          />
          {error && <p className="jh-error">{error}</p>}
          <button
            type="submit"
            disabled={joining || !houseId.trim() || joined}
            className="jh-button jh-button-gradient"
          >
            {joining ? "Joining..." : "Join house"}
          </button>
        </form>

        {/* Joined confirmation */}
        {joined && (
          <div className="jh-confirm">
            <div className="jh-confirm-icon">
              <Check size={28} color="#d97706" />
            </div>
            <h2 className="jh-card-title">You've joined the house.</h2>
            <p className="jh-confirm-text">Welcome in. You can see the full house from your dashboard.</p>
            <button onClick={() => navigate("/FindHouse")} className="jh-button jh-button-dark jh-button-inline">
              Back to dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
