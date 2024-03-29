(function(){ // START: Hide our code from the global scope

// App Settings
const STARTING_TOPIC_ITEMS = [
    'steven universe',
    'rose quartz',
    'pearl',
    'garnet',
    'amethyst',
    'peridot',
    'lapis lazuli',
    'connie',
];

// Set up element generators for our dynamic HTML elements using templates
const generateTopicItemButton = function(topicName) {
    return $(`<button class="topic-item-button" role="menuitem">${topicName}</button>`);
};
const generateTopicResultItem = function(imageSrc, animatedSrc, alt, rating) {
    return $(`
<figure class="topic-result-item">
    <!-- Display: Topic Result Image -->
    <img src="${imageSrc}" data-static="${imageSrc}" data-animated="${animatedSrc}" alt="${alt}" class="topic-result-image">
    <figcaption>
        <!-- Display: Topic Result Rating -->
        <p><b>Rating:</b> <span class="topic-result-rating">${rating}</span></p>
    </figcaption>
</figure>`);
};

// Get permanent references to our static HTML elements so jQuery isn't run more than needed
const MENU = {
    'topic-item-buttons': $('#topic-item-buttons'),
};

const CONTAINER = {
    'topic-result-images': $('#topic-result-images'),
};

const FORM = {
    'new-topic-item-form': $('#new-topic-item-form'),
};

const INPUT = {
    'new-topic-item-input': $('#new-topic-item-input'),
};

const BUTTON = {
    'new-topic-item-submit-button': $('new-topic-item-submit-button'),
};

// Create an object for our app and all of its logic
let app = {
    
    // Create the necessary variables to track the app state
    topics: [...STARTING_TOPIC_ITEMS], // Make a shallow copy of our starting query items
    
    // Initialize the app (this happens once on page load)
    initialize: function(){
        console.log('initializing the app');

        // Render the starter topic buttons
        app.renderButtons();
        
        // Attach a click handler to our form submission to create a new topic button
        FORM['new-topic-item-form'].on('submit', app.handleFormSubmission);

        // Attach click event handler to handle all dynamicly-added buttons
        $(document).on('click', '.topic-item-button', app.handleTopicButtonClicked);

        // Attach click event handler to handle all loaded images switching between still and animated images
        $(document).on('click', '.topic-result-image', app.handleTopicImageClicked);

        // Attach a mouse enter event handler to handle the fading out of the rating label
        $('#topic-result-images').on('mouseenter', '.topic-result-image', function(){
            console.log('handling mouse enter of retrieved item');

            $(this).parent().find('figcaption').css({
                'opacity': '0',
                'top': '-100px',
            });
        });

        // Attach a mouse leave event handler to handle the fading in of the rating label
        $('#topic-result-images').on('mouseleave', '.topic-result-image', function(){
            console.log('handling mouse leave of retrieved item');

            $(this).parent().find('figcaption').css({
                'opacity': '1',
                'top': '0px',
            });
        });
    },

    // Render the topic buttons
    renderButtons: function(){
        console.log('rendering topic buttons');

        // Clear the topics menu of buttons so we don't get duplicates when we render the buttons
        MENU['topic-item-buttons'].empty();

        // Loop through all topics and create buttons for them
        for (let i = 0; i < app.topics.length; i++) {
            const currentTopic = app.topics[i];
            MENU['topic-item-buttons'].append(generateTopicItemButton(currentTopic));
        }
    },

    // Handle the form submission that adds new topic buttons
    handleFormSubmission: function(event){
        console.log('handling form submission');
        
        // Keep the form from actually submitting
        event.preventDefault();
        
        let newTopic = INPUT['new-topic-item-input'].val();
        app.topics.push(newTopic);
        INPUT['new-topic-item-input'].val('');
        app.renderButtons();
    },

    // Handle the button click that retrieves images for its related topic
    handleTopicButtonClicked: function(){
        console.log('handling topic button click');

        // Store our topic
        let topic = $(this).text();

        // Grab images related to the topic button we just clicked
        const queryUrl = `https://api.giphy.com/v1/gifs/search?q=${topic}&api_key=BkaUZZWcFij6J7AoQj3WtPb1R2p9O6V9&limit=10`;
        $.ajax({
            url: queryUrl,
            method: 'GET',
        }).then(function (response) {
            console.log('handling ajax response containing images');

            // Grab the array of images related to our topic
            var topicImages = response.data;

            // For each topic image, display it on the page
            for (let i = 0; i < topicImages.length; i++) {
                const currentImageData = topicImages[i];

                // Add our topic image with related data to the top of the list
                CONTAINER['topic-result-images'].prepend(
                    generateTopicResultItem(currentImageData.images.original_still.url, currentImageData.images.original.url, 'A randomly found photo related to our topic of: ' + topic, currentImageData.rating.toUpperCase())
                );
            }
        });
    },

    // Handle the image click that toggles its view between static and animated
    handleTopicImageClicked: function(){
        console.log('handling image click event');

        // Grab initial image source values from the clicked image
        let currentImage = $(this);
        let currentSrc = currentImage.attr('src');
        let srcStatic = currentImage.attr('data-static');
        let srcAnimated = currentImage.attr('data-animated');
    
        // If our source is currently static
        if (currentSrc === srcStatic) {
    
            // Set our image to be animated
            currentImage.attr('src', srcAnimated);
        }
        // If our source is currently animated
        else if (currentSrc === srcAnimated) {
    
            // Set our image to be static
            currentImage.attr('src', srcStatic);
        }
        // If our source is unrecognized
        else {
    
            // Throw a descriptive error if our image source is neither static nor animated
            throw new Error(`Current src attribute '${currentSrc}' is not recognized as a static or animated source.`);
        }
    },
};

// Initialize the app
app.initialize();

})(); // END: Hide our code from the global scope