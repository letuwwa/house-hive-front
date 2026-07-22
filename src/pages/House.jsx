import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Home as HomeIcon, MapPin, Users } from "lucide-react";
import { getHouse, listHouseMembers } from "../api/houses.js";
import { listHouseChores, createChore, updateChore, deleteChore } from "../api/chores.js";
import "../css/House.css";

export default function House() {
  const { house_Id } = useParams();
  const [house, setHouse] = useState(null);
  const [members, setMembers] = useState([]);
  const [chores, setChores] = useState([]);
  const [choresLoading, setChoresLoading] = useState(true);
  const [choresError, setChoresError] = useState("");
  const [choreForm, setChoreForm] = useState({ name: "", description: "" });
  const [editingChoreId, setEditingChoreId] = useState(null);
  const [savingChore, setSavingChore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadHouse() {
      try {
        const [houseResult, membersResult] = await Promise.all([
          getHouse(house_Id),
          listHouseMembers(house_Id),
        ]);
        if (active) {
          setHouse(houseResult);
          setMembers(membersResult);
          setError("");
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message || "Could not load this house.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadHouse();

    return () => {
      active = false;
    };
  }, [house_Id]);

  useEffect(() => {
    let active = true;

    async function loadChores() {
      setChoresLoading(true);
      try {
        const result = await listHouseChores(house_Id);
        if (active) {
          setChores(result);
          setChoresError("");
        }
      } catch (requestError) {
        if (active) {
          setChoresError(requestError.message || "Could not load chores.");
        }
      } finally {
        if (active) {
          setChoresLoading(false);
        }
      }
    }

    loadChores();

    return () => {
      active = false;
    };
  }, [house_Id]);

  const resetChoreForm = () => {
    setChoreForm({ name: "", description: "" });
    setEditingChoreId(null);
  };

  const handleChoreFieldChange = (event) => {
    const { name, value } = event.target;
    setChoreForm((current) => ({ ...current, [name]: value }));
  };

  const handleChoreSubmit = async (event) => {
    event.preventDefault();
    setSavingChore(true);

    const payload = {
      name: choreForm.name.trim(),
      description: choreForm.description.trim(),
      house_id: house_Id,
    };

    if (!payload.name || !payload.description) {
      setChoresError("Enter a chore name and description.");
      setSavingChore(false);
      return;
    }

    try {
      const result = editingChoreId
        ? await updateChore(editingChoreId, {
            name: payload.name,
            description: payload.description,
          })
        : await createChore(payload);

      setChores((current) => {
        if (editingChoreId) {
          return current.map((item) => (item.id === result.id ? result : item));
        }
        return [result, ...current];
      });
      resetChoreForm();
      setChoresError("");
    } catch (requestError) {
      setChoresError(requestError.message || "Unable to save chore.");
    } finally {
      setSavingChore(false);
    }
  };

  const handleEditChore = (chore) => {
    setEditingChoreId(chore.id);
    setChoreForm({ name: chore.name, description: chore.description });
    setChoresError("");
  };

  const handleDeleteChore = async (choreId) => {
    if (!window.confirm("Delete this chore?")) {
      return;
    }

    try {
      await deleteChore(choreId);
      setChores((current) => current.filter((item) => item.id !== choreId));
    } catch (requestError) {
      setChoresError(requestError.message || "Unable to delete chore.");
    }
  };

  if (loading) {
    return (
      <div className="house-loading" aria-label="Loading house">
        <div className="house-spinner" />
      </div>
    );
  }

  return (
    <div className="house-page">
      <nav className="house-nav">
        <Link to="/FindHouse" className="house-back-link">
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>
      </nav>

      <main className="house-container">
        {error ? (
          <section className="house-panel">
            <div className="house-icon house-icon-error">
              <HomeIcon size={28} />
            </div>
            <h1>House unavailable</h1>
            <p>{error}</p>
          </section>
        ) : (
          <section className="house-panel">
            <div className="house-icon">
              <HomeIcon size={28} />
            </div>
            <h1>{house.name}</h1>
            <div className="house-details">
              <p>
                <MapPin size={18} />
                {house.address}
              </p>
              <p>
                <Users size={18} />
                {house.rooms} room{house.rooms === 1 ? "" : "s"}
              </p>
            </div>
            <code className="house-id">House ID: {house.id}</code>

            <div className="house-members">
              <div className="house-section-header">
                <h2>Members</h2>
                <span>{members.length}</span>
              </div>

              {members.length === 0 ? (
                <p className="house-empty">No members found.</p>
              ) : (
                <ul className="member-list">
                  {members.map((member) => (
                    <li className="member-row" key={member.user.id}>
                      <div className="member-avatar" aria-hidden="true">
                        {(member.user.first_name?.[0] || member.user.username?.[0] || "?").toUpperCase()}
                      </div>
                      <div className="member-copy">
                        <strong>
                          {member.user.first_name} {member.user.last_name}
                        </strong>
                        <span>@{member.user.username} · {member.user.email}</span>
                      </div>
                      <span className="member-role">{member.role}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="house-chores">
              <div className="house-section-header">
                <div>
                  <h2>Chores</h2>
                  <p className="house-section-subtitle">Add, update, and remove tasks for your house.</p>
                </div>
                <span>{chores.length}</span>
              </div>

              <form className="chore-form" onSubmit={handleChoreSubmit}>
                <label htmlFor="chore-name">Chore name</label>
                <input
                  id="chore-name"
                  name="name"
                  value={choreForm.name}
                  onChange={handleChoreFieldChange}
                  placeholder="e.g. Take out trash"
                  disabled={savingChore}
                  required
                />

                <label htmlFor="chore-description">Description</label>
                <textarea
                  id="chore-description"
                  name="description"
                  value={choreForm.description}
                  onChange={handleChoreFieldChange}
                  placeholder="e.g. Empty the kitchen bin and recycle plastics"
                  disabled={savingChore}
                  required
                />

                {choresError && <p className="house-error" role="alert">{choresError}</p>}
                <div className="chore-actions">
                  <button type="submit" className="house-button" disabled={savingChore}>
                    {editingChoreId ? (savingChore ? "Saving chore..." : "Update chore") : (savingChore ? "Adding chore..." : "Add chore")}
                  </button>
                  {editingChoreId && (
                    <button type="button" className="house-button house-button-muted" onClick={resetChoreForm} disabled={savingChore}>
                      Cancel edit
                    </button>
                  )}
                </div>
              </form>

              {choresLoading ? (
                <p className="house-empty">Loading chores…</p>
              ) : chores.length === 0 ? (
                <p className="house-empty">No chores added yet.</p>
              ) : (
                <ul className="chore-list">
                  {chores.map((chore) => (
                    <li key={chore.id} className="chore-row">
                      <div>
                        <strong>{chore.name}</strong>
                        <p>{chore.description}</p>
                        <span className="chore-meta">Created by {chore.creator_username}</span>
                      </div>
                      <div className="chore-row-actions">
                        <button type="button" className="house-button house-button-inline" onClick={() => handleEditChore(chore)}>
                          Edit
                        </button>
                        <button type="button" className="house-button house-button-delete" onClick={() => handleDeleteChore(chore.id)}>
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
