function floatingMessageBox(message, color, formname) {
  var floatingBox = document.getElementById('floatingBox');
  var messageText = document.getElementById('messageText');
  var okButton = document.getElementById('okButton');
  
  messageText.textContent = message;
    // Split the message into lines based on newline characters
    const lines = message.split('\n');

    // Clear the existing message content (if any)
    messageText.textContent = '';
  
    // Create and append paragraphs for each line
    lines.forEach(line => {
      const paragraph = document.createElement('p');
      
      paragraph.textContent = line;

      paragraph.style.lineHeight = '0.9'; // Adjust as needed

      messageText.appendChild(paragraph);
    });

  floatingBox.style.display = 'block';
  
  // Apply styles based on color parameter
  if (color === 'brown') {
    floatingBox.style.backgroundColor = '#8B4513'; // Brown background
    messageText.style.color = 'white'; // White font color
  } else if (color === 'green') {
    floatingBox.style.backgroundColor = 'white'; // Light Green background
    messageText.style.color = 'green'; // Green font color
  } else if (color === 'red') {
    floatingBox.style.backgroundColor = 'red'; // Red background
    messageText.style.color = 'white'; // White font color
  }

  // Apply styles to the OK button
  okButton.style.backgroundColor = 'white'; // White background color
  okButton.style.color = 'black'; // Black font color
  okButton.style.border = 'none'; // Remove border

  // Add hover effect to the OK button
  okButton.addEventListener('mouseover', function() {
    okButton.style.backgroundColor = 'lightgray'; // Light gray background color on hover
  });

  okButton.addEventListener('mouseout', function() {
    okButton.style.backgroundColor = 'white'; // Restore white background color on mouseout
  });

  // Add an event listener to the "OK" button
  okButton.addEventListener('click', function() {
    floatingBox.style.animation = 'slideUp 0.5s ease forwards';
    setTimeout(function() {
      floatingBox.style.display = 'none';
      floatingBox.style.animation = ''; // Reset animation
      // Redirect based on formname
      if (formname === 'receivertable') {
        window.location.href = '/receive_table';
      } else if (formname === 'approvetable') {
        window.location.href = '/approvetable';
      }
      
    }, 500);
  });
}
