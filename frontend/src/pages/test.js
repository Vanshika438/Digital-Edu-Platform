const API_Key = 'AIzaSyATX-3q4V9ybSxtyuzZv80yEkMOYnvDoVQ';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_Key}`;

fetch(API_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    contents: [{ parts: [{ text: "Hello!" }] }],
  }),
})
  .then(response => response.json())
  .then(data => console.log("Response from API:", data))
  .catch(error => console.error("Error fetching response:", error));
