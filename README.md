# Lokal Assignment

## Video Reference
Drive Link: [Click Here](https://drive.google.com/file/d/1FZ6H7LDKPr5wQ0uxxhyz4wQSuWgTmqZP/view?usp=drive_link)

## Project Setup & Execution

### Prerequisites
Ensure you have the following installed:
- Node.js (LTS version recommended)
- npm or yarn
- React Native CLI (if using React Native)
- Android Studio (for Android)
- Xcode (for iOS, macOS required)

### Installation
1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd lokal-assignment
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

### Firebase Configuration
This project uses Firebase for backend services. Ensure you have a Firebase project set up:

1. Create a `.env` file in the root directory and add your Firebase configuration:
   ```env
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_auth_domain
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   FIREBASE_APP_ID=your_app_id
   ```

2. Ensure you have `react-native-dotenv` installed to load environment variables:
   ```sh
   npm install react-native-dotenv
   # or
   yarn add react-native-dotenv
   ```

3. Add the Firebase configuration in `FirebaseConfig.ts`:
   ```ts
   import { initializeApp } from "firebase/app";
   import { getFirestore } from "firebase/firestore";
   import {
     FIREBASE_API_KEY,
     FIREBASE_AUTH_DOMAIN,
     FIREBASE_PROJECT_ID,
     FIREBASE_STORAGE_BUCKET,
     FIREBASE_MESSAGING_SENDER_ID,
     FIREBASE_APP_ID,
   } from "@env";

   const firebaseConfig = {
     apiKey: FIREBASE_API_KEY,
     authDomain: FIREBASE_AUTH_DOMAIN,
     projectId: FIREBASE_PROJECT_ID,
     storageBucket: FIREBASE_STORAGE_BUCKET,
     messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
     appId: FIREBASE_APP_ID,
   };

   const app = initializeApp(firebaseConfig);
   const db = getFirestore(app);

   export { db };
   ```

### Running the Project
#### For Android:
Ensure an Android emulator is running or a device is connected.
```sh
npm run android
# or
yarn android
```

#### For iOS:
Ensure you have Xcode installed and a simulator is running.
```sh
npx pod-install
npm run ios
# or
yarn ios
```

#### For Web (if applicable):
```sh
npm start
# or
yarn start
```

### Additional Notes
- If you face dependency issues, try running:
  ```sh
  npx react-native start --reset-cache
  ```
- Ensure the required environment variables are set up correctly.
- Refer to the video reference for UI/UX implementation details.

