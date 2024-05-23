//Authorization Code with Proof Key for Code Exchange (PKCE) Flow:

//Step 1 - Code Challenge using a Code Verifier

const generateRandomString = (length) => {
    //Define the possible characters that can be used in the random string
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //Create an array of 8-bit unsigned integers with the specified length
    //filled with cryptographically secure random values
    const values = crypto.getRandomValues(new Uint8Array(length));
    //Use the reduce method to build the random string by iterating over each 
    //random value in the values array
    return values.reduce((acc, x) => 
        //Map each random value (x) to a character from the possible string using modulus
        //which ensures that the index (x) wraps around if it exceeds the length of the 
        //'possible' string, which ensures that each value is mapped to one of the characters 
        //in 'possible'
        acc + possible[x % possible.length], ""); 
        //"" - Initialize the accumulator (acc) as an empty string, the acc is used to 
        //accumulate all the characters to form a random string
  }
  
  //Sets the codeVerifier to a random string generated by the function above with 64 characters
  const codeVerifier  = generateRandomString(64);  

  const sha256 = async (plain) => {
    //Create a new TextEncoder instance
    const encoder = new TextEncoder()

    //Encode the plain text string to a Uint8Array
    const data = encoder.encode(plain)

    //Compute the SHA-256 digest of the encoded data
    return window.crypto.subtle.digest('SHA-256', data)
  }

  const base64encode = (input) => {
    //Encodes the converted string to Base64 
    return btoa
    //Converts the input from an ArrayBuffer to a Uint8Array
    //uses spread operator to expand the array into individual 
    //arguments for the string.fromCharCode to convert the byte 
    //values into a string removing padding characters like '='
    //and replacing '+' with '-' and '/' with '_' to ensure 
    //the output is URL safe
    (String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

//Initializing the constant hashed as the value obtained from the sha256 function
//when the codeVerifier is inputted
const hashed = sha256(codeVerifier)
//Initilizing the constant codeChallenge as the value obtained from the base64encode 
//function when the hashed constant is inputted
const codeChallenge = base64encode(hashed);


//Step 2 - Request User Authorization
//Creates a constant using the clientID of the web application
const clientId = '8a649d0e1cf74b1c89b6874845b17646';

//Creates a constant of the redirect uri to send the user to after
//authorization
const redirectUri = 'http://localhost:5500';

//Creates a constant of the scopes that will be made available to the 
//web app after authorization
const scope = 'user-read-private user-read-email';
//Creates a constant of the authentication url which is the spotify 
//authorization website
const authUrl = new URL("https://accounts.spotify.com/authorize")

//Adds the codeverifier set in the previous step to the local storage
window.localStorage.setItem('code_verifier', codeVerifier);

//Creates the constant parameters 
const params =  {
  response_type: 'code',
  client_id: clientId,
  scope,
  code_challenge_method: 'S256',
  code_challenge: codeChallenge,
  redirect_uri: redirectUri,
}

//Takes the authentication url and adds our parameters to the url
authUrl.search = new URLSearchParams(params).toString();

//Creating the function that sends the user to the spotify authenication 
//website (using a button)
function openSpotify() {
    window.location.href = authUrl.toString();
} 

//Creates a constant of the urlParams that are present in the browser's url
//when the user is redirected back to our site after authenication
const urlParams = new URLSearchParams(window.location.search);

//Creates a variable named code that parses the url to retrieve the code
//parameter
let code = urlParams.get('code');

//Creates a constant for obtaining the token by inputting the code saved from the url
//and the code verifier that was added to the browser's local storage
const getToken = async code => {

    // stored in the previous step
    let codeVerifier = localStorage.getItem('code_verifier');
  
    //Creating a constant named payload that attempts the POST request to 
    //the Spotify API using the method, headers, and body 
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
        code_verifier: codeVerifier,
      }),
    }
  
    //Creating a new constant named body that awaits fetching 
    //the url and payload
    const body = await fetch(url, payload);
    //Creating a new constant named response that awaits the 
    //response to the body.json
    const response =await body.json();
  
    //Storing the access token that we got in the response in the 
    //local storage to ensure we can use it again without doing
    //another request
    localStorage.setItem('access_token', response.access_token);
  }


