import config from './config.js';

const subscriptionKey = config.subscriptionKey; // Replace with your subscription key
const endpoint = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0'; // Microsoft Translator endpoint
const region = config.region; // Replace with your region, e.g., 'westus'

// The text you want to translate and the target language
// const textToTranslate = 'Hello, how are you?';
const targetLanguage = 'sv'; // Target language, e.g., 'es' for Spanish

// Build the URL with the target language
const url = `${endpoint}&to=${targetLanguage}`;

const translateText = async (textToTranslate) => {
  const requestBody = [{
    'Text': textToTranslate
  }];

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': subscriptionKey,
      'Ocp-Apim-Subscription-Region': region, // Include the region if required
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (response.ok) {
    const data = await response.json();
    console.log('Translated text:', data[0].translations[0].text);
  } else {
    console.error('Error:', response.statusText);
  }
};

translateText('Hello, how are you my dear?');
