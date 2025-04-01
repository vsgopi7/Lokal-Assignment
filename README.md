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

