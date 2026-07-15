import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; //redux
import * as usersApi from "../api/users"; //for following stats

function Profile() {

  const navigate = useNavigate(); //for clicking a book
  const user = useSelector((state) => state.auth.user); //redux
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({ //for followers
  followers: 0,
  following: 0,
});

 async function loadData() {
  try {
    const booksData = await booksApi.getMyBooks();
    const statsData = await usersApi.getStats();

    setBooks(booksData);
    setStats(statsData);

  } catch (err) {
    console.error(err);
  }
}

  useEffect(() => {
    loadData();
  }, []);


  return (
    <div className="page dashboard-page">

      <section className="profile-header">

        <h1>
          {user?.display_name || user?.username}
        </h1>

        <p>
          @{user?.username}
        </p>

        <div className="profile-stats">

          <div>
            <strong>
              {stats.followers}
            </strong>
            <span>
              Followers
            </span>
          </div>

          <div>
            <strong>
              {stats.following}
            </strong>
            <span>
              Following
            </span>
          </div>

        </div>

      </section>

      <section className="library-section">

        <div className="section-header">
          <h2>My Library</h2>
          <Link to="/my-books" className="button button-primary">
            + Add Book
          </Link>
        </div>

        {books.length === 0 ? (

          <p>
            You haven't added any books yet.
          </p>

        ) : (

          <div className="books-grid">

            {books.map((book) => (

            <div key={book.id} className="book-card" onClick={() => navigate(`/my-books/${book.id}`)}>

            <h3>{book.title}</h3>

            <p> {book.author || "Unknown author"}</p>

          <span> {book.available ? "Available" : "Borrowed"}</span>

          <button className="button-secondary" onClick={async (e) => {
            e.stopPropagation();
            try {
              await booksApi.updateAvailability(book.id);
              loadData();
            } catch (err) {
            console.error(err);
            }
          }}
          >
          {book.available ? "Mark as unavailable" : "Mark as available"}
          </button>


          </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}


export default Profile;