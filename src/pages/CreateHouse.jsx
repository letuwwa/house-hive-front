import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Home as HomeIcon, MapPin, Plus, Users } from "lucide-react";
import "../css/CreateHouse.css";

async function createHouse(houseData) {
  // Retrieve token if you are using localStorage for JWTs
  const token = localStorage.getItem("token"); 

  
  const response = await fetch("http://localhost:8000/api/v1/houses", { 
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` })
    },
    body: JSON.stringify(houseData),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const errorMessage = typeof data.detail === "string" 
      ? data.detail 
      : "Could not create the house. Please check your inputs.";
    throw new Error(errorMessage);
  }

  return response.json();
}

export default function CreateHouse() {
  const [form, setForm] = useState({ name: "", address: "", rooms: "" });
  const [creating, setCreating] = useState(false);
  const [createdHouse, setCreatedHouse] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const name = form.name.trim();
    const address = form.address.trim();
    const rooms = Number(form.rooms);

    if (!name || !address || !Number.isInteger(rooms) || rooms < 1) {
      setError("Enter a house name, address, and at least one room.");
      return;
    }

    setCreating(true);
    try {
      const house = await createHouse({ name, address, rooms });
      setCreatedHouse(house);
    } catch (requestError) {
      setError(requestError.message || "Something went wrong. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="ch-page">
      <nav className="ch-nav">
        <Link to="/FindHouse" className="ch-brand">
          <span className="ch-brand-icon"><HomeIcon size={20} /></span>
          <span>HouseHive</span>
        </Link>
        <Link to="/" className="ch-back-link"><ArrowLeft size={16} /> Back</Link>
      </nav>

      <main className="ch-container">
        {!createdHouse ? (
          <>
            <header className="ch-header">
              <div className="ch-header-icon"><Plus size={28} /></div>
              <h1>Create a group house</h1>
              <p>Set up your house and invite your housemates when you&apos;re ready.</p>
            </header>

            <form className="ch-form" onSubmit={handleSubmit}>
              <label htmlFor="name">House name</label>
              <input id="name" name="name" value={form.name} onChange={updateField} placeholder="e.g. Maple House" disabled={creating} required />

              <label htmlFor="address">Address</label>
              <div className="ch-input-icon"><MapPin size={17} /><input id="address" name="address" value={form.address} onChange={updateField} placeholder="e.g. 12 Maple Street" disabled={creating} required /></div>

              <label htmlFor="rooms">Number of rooms</label>
              <div className="ch-input-icon"><Users size={17} /><input id="rooms" name="rooms" type="number" min="1" step="1" value={form.rooms} onChange={updateField} placeholder="e.g. 4" disabled={creating} required /></div>

              {error && <p className="ch-error" role="alert">{error}</p>}
              <button type="submit" className="ch-button" disabled={creating}>
                {creating ? "Creating house..." : "Create house"}
              </button>
            </form>
          </>
        ) : (
          <section className="ch-confirm">
            <div className="ch-confirm-icon"><Check size={28} /></div>
            <h1>{createdHouse.name || form.name} is ready!</h1>
            <p>Your house has been saved. Share its ID with people you&apos;d like to invite.</p>
            {createdHouse.id && <code className="ch-house-id">House ID: {createdHouse.id}</code>}
            {/* Dynamic routing strategy to direct user straight into their new home asset */}
            <button type="button" className="ch-button" onClick={() => navigate(`/houses/${createdHouse.id}`)}>Go to your house</button>
          </section>
        )}
      </main>
    </div>
  );
}