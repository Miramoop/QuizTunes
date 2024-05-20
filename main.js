//QUIZ PART OF CODE:

//Creating the Quiz Questions
const questions = [
        {
            question: "What is your ideal way to spend a Saturday afternoon?", 
            choices: ["Reading a book", 
                      "Hiking in the Forest", 
                      "Hanging out with Friends", 
                      "Watching movies or TV shows", 
            ],
            choiceWeights: [
                { chill: +20, ambient: +20 }, 
                { country: +20, ambient: +20 }, 
                { indie: +20, pop: +20 }, 
                { movies: +20, anime: +20 }, 
            ],
            // imageURL: "img/question1.jpg",
        },
    
        {
            question: "What is your ideal vacation?", 
            choices: ["Beach Resort", 
                      "Mountain Retreat", 
                      "City Exploration", 
                      "Chilling at Home", 
            ],
            choiceWeights: [
                {chill: +20, dance: +20}, 
                {rock: +20, ambient: +20}, 
                {anime: +20, movies: +20}, 
                {chill: +20, piano: +20}, 
            ],
            // imageURL: "img/question2.jpg",
        },

        {
            question: "If you were able to travel to any of these countries, where would you choose?", 
            choices: ["Japan", 
                      "Australia", 
                      "France", 
                      "Mexico", 
            ],
            choiceWeights: [
                {anime: +20, movies: +20}, 
                {country: +20, ambient: +20}, 
                {indie: +20, piano: +20}, 
                {dance: +20, pop: +20}, 
            ],
            // imageURL: "img/question3.jpg",
        },

        {
            question: "What type of exercise do you prefer?", 
            choices: ["Dance", 
                      "Jogging", 
                      "Weight Training", 
                      "Yoga", 
            ],
            choiceWeights: [
                {dance: +20, movies: +20}, 
                {pop: +20, rock: +20}, 
                {rock: +20, anime: +20}, 
                {piano: +20, chill: +20}, 
            ],
            // imageURL: "img/question4.jpg",
        },

        {
            question: "What kind of music do you prefer to listen to?", 
            choices: ["Country", 
                      "Rock", 
                      "Dance", 
                      "Chill", 
            ],
            choiceWeights: [
                {country: +20, ambient: +20}, 
                {indie: +20, rock: +20}, 
                {pop: +20, dance: +20}, 
                {chill: +20, ambient: +20}, 
            ],
        },

        
        {
            question: "Which season do you enjoy the most?", 
            choices: ["Fall", 
                      "Winter", 
                      "Spring", 
                      "Summer", 
            ],
            choiceWeights: [
                {indie: +20, ambient: 0}, 
                {piano: +20, chill: +20}, 
                {chill: +20, anime: +20}, 
                {pop: +20, dance: +20}, 
            ],
        },

         
        {
            question: "What types of movies do you prefer?", 
            choices: ["Action", 
                      "Comedy", 
                      "Drama", 
                      "Horror", 
            ],
            choiceWeights: [
                {rock: +20, anime: +20}, 
                {indie: +20, chill: +20}, 
                {indie: +20, pop: +20}, 
                {pop: +20, rock: +20}, 
            ],
        },

        {
            question: "What is your favorite flower?", 
            choices: ["Rose", 
                      "Tulip", 
                      "Sunflower", 
                      "Orchids", 
            ],
            choiceWeights: [
                {indie: +20, movies: +20}, 
                {chill: +20, ambient: +20}, 
                {pop: +20, dance: +20}, 
                {rock: +20, piano: +20}, 
            ],
        },

        {
            question: "What type of cuisine do you enjoy the most?", 
            choices: ["Japanese", 
                      "Spanish", 
                      "French", 
                      "American", 
            ],
            choiceWeights: [
                {anime: +20, movies: +20}, 
                {dance: +20, pop: +20}, 
                {piano: +20, indie: +20}, 
                {movies: +20, country: +20}, 
            ],
        },
        
        {
            question: "What is your favorite time of day?",
            choices: ["Morning", 
                      "Afternoon", 
                      "Evening", 
                      "Night", 
            ],
            choiceWeights: [
                {piano: +20, ambient: +20}, 
                {pop: +20, dance: +20}, 
                {chill: +20, indie: +20}, 
                {rock: +20, movies: +20}, 
            ],
        },
    ];
    
    //Initializing the currentQuestionIndex to the element 0,
    //so it starts at the first question properly
    let currentQuestionIndex = 0;  
    
    //Creating an object to keep track of the choice weights given 
    //by each question answer
    let choiceWeights = {}; 
    
    //Creating the variables for the genres of the music
    let chill = 0;
    let pop = 0;
    let dance = 0;
    let ambient = 0;
    let anime = 0;
    let indie = 0;
    let movies = 0;
    let rock = 0;
    let country = 0;
    let piano = 0;

    //dominantGenre intialized at null
    let dominantGenre;
    
    //Creating a function that is triggered when the user clicks the 
    //Start Quiz button on home, Makes the home element invisible and
    //displays the quiz element
    function startQuiz(){
        document.getElementById("home").style.display = "none";
        document.getElementById("quiz").style.display = "block";
        displayQuestion();
    }

    function displayHome(){
        document.getElementById("quiz").style.display = "none";
        document.getElementById("results").style.display = "none";
        document.getElementById("home").style.display = "block";
        currentQuestionIndex = 0;
    }

    //Creating a function to display all the quiz questions
    //Uses the containers created in the HTML file to display
    //each element based on id
    function displayQuestion() {

        const questionContainer = document.getElementById("question");
        const choicesContainer = document.getElementById("choices");
        const currentQuestion = questions[currentQuestionIndex];

        // const imageContainer = document.getElementById("questionImage");
        // const currentImage = questions[currentQuestionIndex];
        
        questionContainer.textContent = currentQuestion.question;
        choicesContainer.innerHTML = "";
    
        currentQuestion.choices.forEach((choice, index) => {
            const button = document.createElement("button");
            button.textContent = choice;
            button.onclick = () => {
                updateChoiceWeights(currentQuestion.choiceWeights[index]);
                saveAnswer();
            };
            choicesContainer.appendChild(button);
        });
    }

    //Creating a function that keeps track of all the weights by merging 
    //the choiceWeights results from each question into the choiceWeights 
    //object
    function updateChoiceWeights(weights) {
        choiceWeights = { ...choiceWeights, ...weights};
        //console.log(choiceWeights)
    }
    
    //Creating a function that saves the answers for each question
    //As long as the currentQuestionIndex is less than the 
    //questions.length it displays the next question
    //If the questions have all been displayed then it makes the quiz
    //element invisible and displays the results page
    function saveAnswer(){
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length){
            displayQuestion();
        }
        else {
            document.getElementById("quiz").style.display = "none";
            document.getElementById("calculatingResults").style.display = "block";
        }
    }

    //Creating a function that displays the calculatingResults Page
    function calculateResults(){
        document.getElementById("calculatingResults").style.display = "none";
        document.getElementById("results").style.display = "block";
        displayResults();
    }
    
    //Creating a function to display the quiz results in terms of the 
    //calculated genre values
    async function displayResults() {
        const resultsContent = document.getElementById("resultsContent");
    
        //Calculating the dominant genre by using the choiceWeights
        const dominantGenre = calculateDominantGenre(choiceWeights);
    
        //Call Spotify API using the dominant genre
        const tokenResponse = await getToken(dominantGenre);
        const trackInfo = await getTrackInfo(tokenResponse.access_token, dominantGenre);
        console.log(trackInfo)
    
        //Display the recommended song on webpage
        displayRecommendedTracks(trackInfo);
    }
    
    function calculateDominantGenre(choiceWeights) {
        let maxScore = -Infinity;
    
        //Loop through each genre score in choiceWeights
        for (const genre in choiceWeights){
            if (choiceWeights.hasOwnProperty(genre)){
                //check through each genre's score to see if it is higher than current maxScore
                if(choiceWeights[genre] > maxScore){
                    maxScore = choiceWeights[genre];
                    dominantGenre = genre;
                }
            }
        }

        return dominantGenre;
    }
    
    function displayRecommendedTracks(trackInfo){
        const resultsContent = document.getElementById("resultsContent");
    
        //Clear any previous results
        resultsContent.innerHTML = "";
    
        //Create a heading to display the recommended track
        const heading = document.createElement("h2");
        heading.textContent = "Your Recommended Song is: ";
        resultsContent.appendChild(heading);
    
        //Loop through each track in the trackInfo response
        trackInfo.tracks.forEach(track => {

            //Create a div to hold track information
            const trackDiv = document.getElementById("trackDiv");

            //Reference HTML elements for album cover, trackName, artists, album
            const albumCover = document.getElementById("albumCover");
            albumCover.textContent = "Album Cover";
            albumCover.setAttribute("src", track.album.images[1].url);

            const trackName = document.getElementById("trackName");
            trackName.textContent = "Track Name: " + track.name;
    
            const artists = document.getElementById("artists");
            artists.textContent = "Artists: " + track.artists.map(artist => artist.name).join(", ");
    
            const album = document.getElementById("album");
            album.textContent = "Album: " + track.album.name;
            
            const genreId = document.getElementById("genreId");
            genreId.textContent = "Genre: " + dominantGenre;

            const spotifyLink = document.getElementById("spotifyLink");
            spotifyLink.textContent = "Link to Spotify";
            spotifyLink.setAttribute("href", track.external_urls.spotify);
    
            //Append track info to trackDiv
            trackDiv.appendChild(albumCover);
            trackDiv.appendChild(trackName);
            trackDiv.appendChild(artists);
            trackDiv.appendChild(album);
            trackDiv.appendChild(genreId);
            trackDiv.appendChild(spotifyLink);

            //Append trackDiv to resultsContent
            resultsContent.appendChild(trackDiv);
        });
    }
    
    //Must add these to ensure that the quiz and results pages are invisible
    //when the web quiz is first launched
    document.getElementById("quiz").style.display = "none";
    document.getElementById("results").style.display = "none";
    document.getElementById("calculatingResults").style.display = "none";


//SPOTIFY API PART OF CODE
//Creating the constants for client_id and client_secret
//Song Recommender
// const client_id = 'eb9584f3368842e2963869356c4cd09a';
// const client_secret = '0ae2f080ee224ca9bd236079d4083f20';

//Album Recommender
const client_id = 'd7ed26ea3e8d4b3096480eb9f06b86a2';
const client_secret = 'c1eac9aaa6c14ac2b482107a44994a18';

//An async function is used here so that our response is not given until the fetch is complete,
//Protecting us from having an execution order issue
//This function is meant to get the user's token to ensure that the token is valid before 
//allowing the function to continue
async function getToken(dominantGenre) {
    try {
        const response = await fetch('https://accounts.spotify.com/api/token',
        {
            method: 'POST',
            body: new URLSearchParams({
                'grant_type': 'client_credentials',
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret),
            },
        });
    
        if(!response.ok){
            throw new error('Failed to fetch token');
        }
    
        return await response.json();
    }
    catch (error) {
        console.error("Error in getting token", error);
        throw error;
    }
}

//An async function is used here so that our response is not given until the fetch is complete,
//Protecting us from having an execution order issue
//This function gets track info about a specific track using our access_token 
async function getTrackInfo(access_token, genre) {
    //This line can be used to see all of the available genre seeds in the Spotify API
    //const response = await fetch("https://api.spotify.com/v1/recommendations/available-genre-seeds", {
    const response = await fetch(`https://api.spotify.com/v1/recommendations?limit=1&seed_genres=${genre}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + access_token },
    });
    
    console.log(response);
    
    return await response.json();
}

getToken(dominantGenre).then(async response => {
    // console.log("Token response: ", response);
    const trackInfo = await getTrackInfo(response.access_token, dominantGenre);
    // console.log("Track Info: ", trackInfo);
    displayRecommendedTracks(trackInfo);
}).catch(error => {
    console.error("Error getting token: ",error);
});

