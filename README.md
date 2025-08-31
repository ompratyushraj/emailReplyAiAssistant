<p align="center">
  <img width="90" height="90" alt="Email AI Assistand Logo" src="https://github.com/user-attachments/assets/3f4bf893-a21d-4ab6-ada7-94f104485afd" /> 
  <h1 align="center"> Email AI Assistant <br>~ Google Gemini ~</h1>
  
</p>


## **Introduction**  

<p align="center">
The <b>Email AI Assistant</b> is a full-stack project integrating <b>Spring Boot backend</b>, <b>React frontend</b>, and a <b>Chrome extension</b> to generate AI-powered email replies.  
It leverages Google's <b>Gemini API</b> for natural language generation, offering professional, casual, or friendly tones.  
</p>

---

## **Key Features**  
1. **AI-Powered Email Reply (Gemini Integration)** – Uses **Google Gemini**, a generative AI model by Google DeepMind, to automatically generate context-aware replies based on input emails. It processes the original email and produces coherent, professional-quality responses.  
2. **Tone Customization** – With prompt engineering, Gemini adapts replies into **professional, casual, or friendly tones**, enabling personalization for different scenarios.  
3. **React Web Interface** – User-friendly dark-themed UI for entering email content and previewing AI-generated replies.  
4. **Clipboard Integration** – One-click copy of generated replies for quick usage in any platform.  
5. **Gmail Extension** – Injects an "AI Reply" button directly into Gmail’s compose toolbar, letting users generate and insert AI replies inside Gmail.  
6. **Real-Time API Requests** – Backend connects to Gemini API in real time to fetch generated replies instantly for both web and extension.  
7. **CORS-Enabled API** – Backend configured to support requests from localhost React frontend and Gmail extension securely.  


---

## **Working Flow**  
1. **User Input Stage**  
   - In the React web app, the user pastes an email and selects a tone.  
   - In Gmail, the extension automatically extracts the original email content.  

2. **API Request**  
   - Email content and tone are sent to the Spring Boot backend endpoint `/api/email/generate`.  

3. **Backend Processing**  
   - Backend builds a structured **prompt**.  
   - Sends the prompt as JSON to **Gemini API**.  
   - Extracts and returns the generated reply text from the API response.  

4. **Frontend & Extension Handling**  
   - Web app displays the reply in a styled card with copy functionality.  
   - Gmail extension inserts the reply directly into the compose textbox.  

---

## **Working Logic**  
- **Backend (Spring Boot)**  
  - Uses **WebClient** to make API requests to Gemini.  
  - Constructs request body with email content and desired tone.  
  - Extracts only the relevant text portion from Gemini’s JSON response.  
  - Returns plain string to frontend/extension.  

- **Frontend (React)**  
  - Collects email input and tone via form.  
  - Sends POST request to backend using Axios.  
  - Displays generated reply in a read-only text area.  
  - Includes **copy-to-clipboard** feature for easy reuse.  

- **Extension (Content Script + Manifest v3)**  
  - Detects Gmail compose windows with Mutation Observer.  
  - Injects "AI Reply" button into compose toolbar.  
  - Extracts email content from Gmail DOM using selectors.  
  - On button click, sends content to backend, retrieves reply, and pastes it into Gmail’s editor.  

---

## **Project View**  

### 1️⃣ Web App – Email Input Screen  
<p align="center">
  <img width="1511" height="742" alt="Screenshot 2025-08-29 151621" src="https://github.com/user-attachments/assets/c40a16ed-b030-4916-a2f3-a5d6df8728bb" />
</p>

### 2️⃣ Web App – Generated Email Reply  
<p align="center">
  <img width="1554" height="842" alt="Screenshot 2025-08-29 151912" src="https://github.com/user-attachments/assets/60e91764-5520-4c99-824c-de43a9570107" />
</p>

### 3️⃣ Chrome Extension – Description Card  
<p align="center">
  <img width="384" height="502" alt="Screenshot 2025-08-29 160812" src="https://github.com/user-attachments/assets/40a1d82d-7358-4d26-a7e1-81f851307233" />
</p>

### 4️⃣ Gmail Integration – AI Reply in Action  
<p align="center">
  <img width="1120" height="858" alt="Screenshot 2025-08-29 162745" src="https://github.com/user-attachments/assets/e4a00108-9a78-46b0-bb97-2ed698dd5d0c" />
</p>

### 5️⃣ Chrome Extension – Installed View  
<p align="center">
  <img width="535" height="323" alt="Screenshot 2025-08-29 162852" src="https://github.com/user-attachments/assets/be36daed-ad11-4abf-9fae-5028e6a46844" />
</p>

---

## **Setup Procedure**  
1. **Backend Setup**  
   - Install Java 17+ and Maven.  
   - Configure `application.properties` with Gemini API key and base URL.  
   - Run backend:  
     ```bash
     mvn spring-boot:run
     mvn clean install
     
     ```
   - API runs on `http://localhost:8080`.  

2. **Frontend Setup**  
   - Navigate to frontend folder.  
   - Install dependencies:  
     ```bash
     npm install
     npm install @emotion/react @emotion/styled @mui/icons-material @mui/material
     npm install axios
     npm install concurrently --save-dev
     ```
   - Start app:  
     ```bash
     npm run dev
     ```
   - Accessible on `http://localhost:5173`.
3. **Run [Frontend + Backend] at one time
   - Integrated the dependency concurrently, installed above.
   - For running the frontend and backend at a single code instance from the frontend:
     ```bash
     npm i concurrently
     ```
  - Integrate these script in the package.json file:
    ```bash
    "start": "java -jar \"D:\\Computer Science\\Spring\\springAIpproject\\springAIpproject\\target\\springAIpproject-0.0.1-SNAPSHOT.jar\"",
    "both": "concurrently \"npm run dev\" \"npm run start\""
    ```
    Example: 
    ```bash
     "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "start": "java -jar \"D:\\Computer Science\\Spring\\springAIpproject\\springAIpproject\\target\\springAIpproject-0.0.1-SNAPSHOT.jar\"",
    "both": "concurrently \"npm run dev\" \"npm run start\""
    }
     ```
- Run:
  ```bash
  npm run both
  ```

5. **Extension Setup**  
   - Go to `chrome://extensions`.  
   - Enable **Developer Mode**.  
   - Load unpacked extension from extension project folder.  
   - Open Gmail and verify the "AI Reply" button appears.  

---

## **Real-World Application**  
- Professionals can quickly draft **formal email replies**.  
- Customer service teams can use **consistent tone replies**.  
- Students and casual users can generate **quick friendly responses**.  
- Productivity boost by reducing repetitive typing in email communication.  

---

## **Future Feature Upgrades**  
- **Multiple Language Support** – Generate replies in non-English languages.  
- **Context Memory** – Retain past conversations for better reply accuracy.  
- **Template Library** – Save and reuse frequently used reply structures.  
- **Voice Integration** – Convert generated replies into speech.  
- **Cloud Deployment** – Host backend on AWS/Azure for public accessibility.  
- **OAuth Gmail Integration** – Securely fetch and send replies via Gmail API.  

---

## **Conclusion**  
The Email AI Assistant provides a seamless way to automate email responses, usable through a standalone React web app or directly inside Gmail with an injected button. It demonstrates practical integration of **AI-powered text generation** with modern full-stack architecture. With further upgrades like language support, template libraries, and Gmail API integration, it can evolve into a robust productivity assistant for individuals and organizations.  
