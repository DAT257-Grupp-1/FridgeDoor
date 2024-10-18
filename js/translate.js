// import config from './config.js';

const subscriptionKey = '7e01db2a63bc4effa9ccdd239b93e634'; // Replace with your subscription key
const endpoint = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0'; // Microsoft Translator endpoint
const region = 'swedencentral'; // Replace with your region, e.g., 'westus'

// The text you want to translate and the target language
// const textToTranslate = 'Hello, how are you?';
const targetLanguage = 'sv'; // Target language, e.g., 'es' for Spanish

// Build the URL with the target language
const url = `${endpoint}&to=${targetLanguage}`;

const translate_text = async (textToTranslate) => {
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

  
  if (response.ok) {  // If the response is successful, return the translations
    const data = await response.json();
    return data[0].translations[0].text;
  } else {            // If the response is not successful, log the error and return the original text
    console.error('Error:', response.statusText);
    return textToTranslate;
  }
};

export { translate_text };