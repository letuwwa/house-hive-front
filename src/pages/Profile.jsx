import { useEffect, useState } from "react";
import { useSelector } from "react-redux"; //redux
import { listHouses } from "../api/houses.js";

function Profile() {

  const user = useSelector((state) => state.auth.user); //redux
  const [houses, setHouses] = useState([]);
  const [error, setError] = useState("");

 async function loadData() {
  try {
    setHouses(await listHouses());
    setError("");
  } catch (err) {
    console.error(err);
    setError(err.message || "Could not load your houses.");
  }
}

  useEffect(() => {
    loadData();
  }, []);


  return (
    <div className="page dashboard-page">

      <section className="profile-header">

        <h1>
          {user?.first_name || user?.username}
        </h1>

        <p>
          @{user?.username}
        </p>

        <div className="profile-stats">

          <div>
            <strong>
              {houses.length}
            </strong>
            <span>
              Houses
            </span>
          </div>

          <div>
            <strong>
              {user?.role || "regular"}
            </strong>
            <span>
              Role
            </span>
          </div>

        </div>

      </section>

      <section className="library-section">

        <div className="section-header">
          <h2>My Houses</h2>
        </div>

        {error && <p>{error}</p>}

        {houses.length === 0 ? (

          <p>
            You haven't joined any houses yet.
          </p>

        ) : (

          <div className="books-grid">

            {houses.map((house) => (

            <div key={house.id} className="book-card">
              <h3>{house.name}</h3>
              <p>{house.address}</p>
              <span>{house.rooms} room{house.rooms === 1 ? "" : "s"}</span>
          </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}


export default Profile;
