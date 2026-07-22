import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, Copy, Home as HomeIcon, MapPin, Users } from "lucide-react";
import { getHouse, listHouseMembers } from "../api/houses.js";
import {
  listHouseChores,
  createChore,
  updateChore,
  deleteChore,
  listChoreCompletions,
  createChoreCompletion,
} from "../api/chores.js";
import "../css/House.css";

export default function House() {
  const { house_Id } = useParams();
  const [house, setHouse] = useState(null);
  const [members, setMembers] = useState([]);
  const [chores, setChores] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [choresLoading, setChoresLoading] = useState(true);
  const [choresError, setChoresError] = useState("");
  const [choreForm, setChoreForm] = useState({ name: "", description: "" });
  const [editingChoreId, setEditingChoreId] = useState(null);
  const [savingChore, setSavingChore] = useState(false);
  const [completingChoreId, setCompletingChoreId] = useState(null);
  const [copiedHouseId, setCopiedHouseId] = useState(false);
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
        const completionGroups = await Promise.all(
          result.map((chore) => listChoreCompletions(chore.id))
        );
        if (active) {
          setChores(result);
          setCompletions(completionGroups.flat());
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
      setCompletions((current) => current.filter((item) => item.chore_id !== choreId));
    } catch (requestError) {
      setChoresError(requestError.message || "Unable to delete chore.");
    }
  };

  const handleCompleteChore = async (choreId) => {
    setCompletingChoreId(choreId);
    setChoresError("");

    try {
      const completion = await createChoreCompletion(choreId);
      setCompletions((current) => [completion, ...current]);
      if (editingChoreId === choreId) {
        resetChoreForm();
      }
    } catch (requestError) {
      setChoresError(requestError.message || "Unable to complete chore.");
    } finally {
      setCompletingChoreId(null);
    }
  };

  const handleCopyHouseId = async () => {
    try {
      await navigator.clipboard.writeText(house.id);
      setCopiedHouseId(true);
      window.setTimeout(() => setCopiedHouseId(false), 1600);
    } catch {
      setError("Could not copy house ID.");
    }
  };

  const completedChoreIds = new Set(completions.map((completion) => completion.chore_id));
  const activeChores = chores.filter((chore) => !completedChoreIds.has(chore.id));
  const completedChores = completions.map((completion) => ({
    ...completion,
    chore: chores.find((chore) => chore.id === completion.chore_id),
  }));

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
          <div className="house-layout">
            <aside className="house-sidebar">
              <section className="house-panel house-summary-panel">
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
                <div className="house-id-field">
                  <button type="button" onClick={handleCopyHouseId} aria-label="Copy house ID">
                    <Copy size={15} />
                    {copiedHouseId ? "Copied house ID" : "Copy house ID"}
                  </button>
                </div>
              </section>

              <section className="house-panel house-members-panel">
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
                          <span className="member-username">@{member.user.username}</span>
                          <span className="member-email">{member.user.email}</span>
                        </div>
                        <span className="member-role">{member.role}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </aside>

            <section className="house-panel house-chores-panel">
              <div className="house-chores">
                <div className="house-section-header">
                  <div>
                    <h2>Chores</h2>
                    <p className="house-section-subtitle">Create and complete active house tasks.</p>
                  </div>
                  <span>{activeChores.length}</span>
                </div>

                <form className="chore-form" onSubmit={handleChoreSubmit}>
                  <div className="chore-field">
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
                  </div>

                  <div className="chore-field">
                    <label htmlFor="chore-description">Description</label>
                    <textarea
                      id="chore-description"
                      name="description"
                      value={choreForm.description}
                      onChange={handleChoreFieldChange}
                      placeholder="e.g. Empty the kitchen bin"
                      disabled={savingChore}
                      required
                    />
                  </div>

                  {choresError && <p className="house-error" role="alert">{choresError}</p>}
                  <div className="chore-actions">
                    <button type="submit" className="house-button" disabled={savingChore}>
                      {editingChoreId ? (savingChore ? "Saving..." : "Update") : (savingChore ? "Adding..." : "Add")}
                    </button>
                    {editingChoreId && (
                      <button type="button" className="house-button house-button-muted" onClick={resetChoreForm} disabled={savingChore}>
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                {choresLoading ? (
                  <p className="house-empty">Loading chores...</p>
                ) : activeChores.length === 0 ? (
                  <p className="house-empty">No active chores.</p>
                ) : (
                  <ul className="chore-list">
                    {activeChores.map((chore) => {
                      const isCompleting = completingChoreId === chore.id;

                      return (
                        <li key={chore.id} className="chore-row">
                          <div>
                            <strong>{chore.name}</strong>
                            <p>{chore.description}</p>
                            <span className="chore-meta">Created by {chore.creator_username}</span>
                          </div>
                          <div className="chore-row-actions">
                            <button
                              type="button"
                              className="house-button house-button-complete"
                              onClick={() => handleCompleteChore(chore.id)}
                              disabled={isCompleting}
                            >
                              <Check size={15} />
                              {isCompleting ? "Completing..." : "Complete"}
                            </button>
                            <button type="button" className="house-button house-button-inline" onClick={() => handleEditChore(chore)}>
                              Edit
                            </button>
                            <button type="button" className="house-button house-button-delete" onClick={() => handleDeleteChore(chore.id)}>
                              Delete
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="completed-chores">
                <div className="house-section-header">
                  <h2>Completed Chores</h2>
                  <span>{completedChores.length}</span>
                </div>

                {choresLoading ? (
                  <p className="house-empty">Loading completed chores...</p>
                ) : completedChores.length === 0 ? (
                  <p className="house-empty">No completed chores yet.</p>
                ) : (
                  <ul className="completed-list">
                    {completedChores.map((completion) => (
                      <li key={completion.id} className="completed-row">
                        <div className="completed-icon">
                          <Check size={16} />
                        </div>
                        <div>
                          <strong>{completion.chore?.name || "Deleted chore"}</strong>
                          <span>Completed by {completion.completed_by_username}</span>
                          {completion.chore?.description && <p>{completion.chore.description}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
