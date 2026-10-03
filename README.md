# World Wall

World Wall is a collaborative digital mural web application designed as a continuous, infinitely expanding art installation. Users can sign in, decorate a portion of the wall using an interactive drawing canvas, and lock their artwork in place. The wall features a dynamic space-themed background and seamless click-and-drag momentum scrolling for an immersive, fast-paced viewing experience.

## Features

- **Continuous Gapless Mural:** Artworks are displayed side-by-side in an infinitely expanding flexbox carousel. Empty slots are natively prevented.
- **Interactive Drawing Canvas:** Users can click "Decorate a portion" to open a drawing overlay with adjustable brush sizes and colors to paint their piece of the wall.
- **Momentum Scrolling:** The mural container supports click-and-drag "sweep" mechanics with physics-based momentum, allowing users to quickly pan across large sections of the wall.
- **Dynamic Space Animation:** The background is an HTML5 canvas layer that continuously animates a "fly-by" of procedurally generated stars, shaded planets, and gas clouds.
- **Secure Authentication:** User registration and login are secured using `bcrypt` password hashing and JSON Web Tokens (JWT).
- **Data-Efficient Storage:** The application uses a lightweight SQLite3 database to store user information and Base64-encoded image data, keeping the installation portable and self-contained.

## Tech Stack

- **Backend:** Node.js, Express.js, SQLite3, bcrypt, jsonwebtoken
- **Frontend:** Vanilla HTML, CSS, JavaScript (No heavy frameworks, ensuring high performance)
- **Testing:** Mocha, Chai, Supertest

## Installation

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/richardjohnsonexe/world-wall.git
   cd world-wall
   ```

2. Install the necessary dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Start the backend server:
   ```bash
   node server.js
   ```
   *(Note: The server will automatically create a `database.sqlite` file in the root directory upon first startup to handle data persistence).*

2. Open your web browser and navigate to:
   ```
   http://localhost:3000
   ```

## Testing

The project includes an integration test suite for the backend API endpoints (authentication and artwork posting/retrieval).

To run the test suite, ensure your server is running (`node server.js`), and in a separate terminal run:
```bash
npx mocha test/api.test.js
```

## Contributing

When contributing to this project, ensure that no local development databases (`database.sqlite`) or logs (`server.log`) are committed to version control. They are ignored in the provided `.gitignore`.
