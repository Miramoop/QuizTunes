// Step 1 - Code Challenge using a Code Verifier

//Defining the possible characters that can be used in the random string
//Creating an array of 8-bit unsigned integers with the specified length
//that contains the cryptographically secure random values
//Use the reduce method to build with the random string by iterating over
//each random value in the values array
//Then map each random value to a character from the possible string using modulus 
//which ensures that the index wraps around if it exceeds the length of the 'possible'
//string, which ensures that each value is mapped to one of the characters in 'possible'
//The accumlator (acc) as an empty string, the acc is used to accumulate all the 
//characters to form a random string
const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

//Set the codeVerifier to a random string generated by the function above with 64 characters
const codeVerifier = generateRandomString(64);

//Takes in the plain text input and converts it into a SHA-256 hash
//First it uses the textEncoder to convert the plain text into a byte array
//Then uses the digest method to compute the hash of the byte array
//Lastly it returns a promise that resolves to the hashed value
const sha256 = async (plain) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

//Takes in an input of an ArrayBuffer or a typed array and returns a URL-safe base64 encoded
//string. It first uses the btoa method to convert the byte array to a base64 string
//Then it replaces the characters to make the string URL-sage by removing any '=' characters
//that are usd for padding in the standard base64. Then replaces '+' with '-'. Next, replacing
// '/' with '_'
const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
}


//Takes a verifier string, computes its SHA-256 hash using the 'sha256' function, and then 
//encodes the hash in a URL-safe base64 format using the 'base64encode' function.
//Then the result is a URL-safe base64-encoded SHA-256 hash of the verifier
const getCodeChallenge = async (verifier) => {
  const hashed = await sha256(verifier);
  return base64encode(hashed);
}

// Step 2 - Request User Authorization
const clientId = '8a649d0e1cf74b1c89b6874845b17646';
//const redirectUri = 'http://localhost:5500';
const redirectUri = 'https://miramoop.github.io/Spotify-Recommender/';
const scope = 'user-read-private user-read-email user-library-modify user-library-read';
const authUrl = new URL("https://accounts.spotify.com/authorize");

//Creates the async function named initiateAuthFlow that begins with 
//generating a code challenge using the getCodeChallenge function,
//Then stores the codeVerifier in localStorage, sets the authrization
//parameters, then redirects to the authorization URL
const initiateAuthFlow = async () => {
  const codeChallenge = await getCodeChallenge(codeVerifier);
  window.localStorage.setItem('code_verifier', codeVerifier);

  const params = {
      response_type: 'code',
      client_id: clientId,
      scope,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: redirectUri,
  }

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();
}

//Creates a function that takes in the authorization code obtained from the URL
//after being redirected back from the Spotify Authorization screen
//Created a constant for the api token endpoint
//Created a constant for the storedCodeVerifier 
//Created a check for whether there is a stored code verifier
//Created the payload object that contains all the necessary elements for a
//token api request
//Then the request is sent 
//The response is given and there is a check that verifies whether a token was 
//given
const getToken = async (code) => {
  const url = "https://accounts.spotify.com/api/token";
  const storedCodeVerifier = localStorage.getItem('code_verifier');

  if (!storedCodeVerifier) {
      console.error("Code verifier not found in localStorage");
      return;
  }

  const payload = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
          client_id: clientId,
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          code_verifier: storedCodeVerifier,
      }),
  }

  const response = await fetch(url, payload);
  const data = await response.json();

  if (response.ok) {
      localStorage.setItem('access_token', data.access_token);
  } else {
      console.error("Error getting token: ", data);
  }
}

const getTrackInfo = async (access_token, genre) => {
  access_token = localStorage.getItem('access_token');

  const response = await fetch(`https://api.spotify.com/v1/recommendations?limit=1&seed_genres=${genre}`, {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + access_token },
  });

  return await response.json();
}

//Processes the authorization code from the URL and calls getToken to generate an access token
const handleRedirect = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
      await getToken(code);
  } else {
      console.log("Authorization code not found in URL parameters.");
  }
}

//Checks the URL for an authorization code
//No code found => starts the authorization flow by calling initiateAuthFlow
//Code found => handles the redirect by calling handleRedirect
const checkAuth = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (!code) {
      // Only initiate the auth flow if no authorization code is present
      await initiateAuthFlow();
  } else {
      // Handle the redirect and token exchange
      await handleRedirect();
  }
}

// Check if we need to initiate auth flow or handle redirect
checkAuth().catch(error => {
  console.error("Error in checkAuth function: ", error);
});

export {getTrackInfo, getToken};



  


