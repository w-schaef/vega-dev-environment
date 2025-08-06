# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run in Google AI Studio

1. create an empty coding project in https://aistudio.google.com
2. upload these files
3. open preview tab -> take care on erros in the bottom of it
4. use gemini tab to interact withAI

### External data
AI Studio does not permit external data due to CORS limitations. 
You can ask AI to download the data and make it local

### History
All changes get lost on browser refresh if not saved. 
In the Gemini Tab you can revert to one of the states covered in this session.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
