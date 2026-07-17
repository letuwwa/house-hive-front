import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Home as HomeIcon, MapPin, Users } from "lucide-react";
import { getHouse, listHouseMembers } from "../api/houses.js";
import "../css/House.css";

export default function House() {
  const { houseId } = useParams();
  const [house, setHouse] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadHouse() {
      try {
        const [houseResult, membersResult] = await Promise.all([
          getHouse(houseId),
          listHouseMembers(houseId),
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
  }, [houseId]);

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
          </section>
        )}
      </main>
    </div>
  );
}
