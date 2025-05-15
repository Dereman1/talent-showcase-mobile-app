
### 📱 Art Showcase Mobile App – README

This is the official mobile version of the **Art Showcase Platform**, built using **React Native**, **Expo**, and **TypeScript**. It connects to a local backend server (Node.js + MongoDB) and mirrors the key features of the web app: art posting, social interaction, ranking, messaging, and real-time notifications.

---

### 📦 Tech Stack

* **React Native** with **Expo**
* **TypeScript**
* **React Native Paper** for UI
* **Socket.IO** for real-time messaging and notifications
* **Axios** for HTTP requests

---

### 🚀 Getting Started

#### 1. **Clone the repo**

```bash
git clone https://github.com/yourusername/art-showcase-mobile.git
cd art-showcase-mobile
```

#### 2. **Install dependencies**

```bash
npm install
```

---

### 🔗 Backend Configuration

Since the backend runs locally, you must provide your local machine’s IP address to the mobile app.

#### 👉 Create `constants/env.ts`

Create a file called `constants/env.ts` in the root or appropriate config folder:

```ts
// constants/env.ts

// Replace YOUR_IP_ADDRESS with your actual local IP address
export const APP_URL = 'http://YOUR_IP_ADDRESS:4000';
```

📌 **Tip:**
You can get your IP address using:

* **macOS/Linux:** `ifconfig`
* **Windows:** `ipconfig`

Make sure both your **mobile device and backend server** are on the **same local network**.

---

### ▶️ Running the App

Start the Expo development server:

```bash
npx expo start
```

* Scan the QR code with your Expo Go app.
* Or run on an emulator.

---

### 📁 Project Structure (simplified)

```
.
├── app/
│   ├── tabs/               # Tab screens (Home, Ranks, Messages, etc.)
│── components/         # Reusable UI components
│── services/           # API calls
│── contexts/           # Auth and global contexts
│── constants/env.ts    # API base URL (local IP)
│── utils/              # Helper functions
├── assets/
├── App.tsx
├── app.json
└── tsconfig.json
```

---

### 🔐 Features

* 🔐 Authentication with JWT
* 🎨 Post art (image, video, or audio)
* ❤️ Like, comment, and evaluate art
* 🏆 View rankings
* 💬 Real-time chat
* 🔔 Notifications

---

### 🛠 Troubleshooting

* **404 errors for media:** Make sure your backend serves static files from the `uploads` folder:

```js
// In your Express app (e.g., server.js)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

* **Socket.IO issues:** Ensure your backend Socket.IO is correctly initialized and the client is using the same IP/port.

