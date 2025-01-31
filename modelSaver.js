const fs = require('fs').promises;
const path = require('path');

function customSaveHandler(model, callback) {
  const savePath = path.join(__dirname, 'saved_models', `${model.id}_${model.name}.json`);
  const modelJson = JSON.stringify(model, null, 2);

  fs.writeFile(savePath, modelJson)
    .then(() => {
      console.log('Model saved to:', savePath);
      callback();
    })
    .catch((error) => {
      console.error('Failed to save model:', error);
      callback(error);
    });
}

function saveModel(model) {
  customSaveHandler(model, (error) => {
    if (error) {
      console.error('Error saving model:', error);
    } else {
      console.log('Model saved using custom save handler with callback.');
    }
  });
}

// Export the function(s) you want to use in other files
module.exports = {
  saveModel
};