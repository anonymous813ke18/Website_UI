document.addEventListener('DOMContentLoaded', function() {
    const triggers = document.querySelectorAll('.trigger');
  
    triggers.forEach(trigger => {
      trigger.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const dropdown = document.getElementById(targetId);
  
        // Display the dropdown
        dropdown.style.display = 'block';
  
        // Position the dropdown to the right of the trigger button
        const triggerRect = trigger.getBoundingClientRect();
        const triggerTop = triggerRect.top + window.scrollY;
        const triggerLeft = triggerRect.left + window.scrollX;
        const buttonWidth = trigger.offsetWidth; // Get the width of the button
  
        // Find the absolute top-left corner of the entire document
        const documentRect = document.documentElement.getBoundingClientRect();
        const docLeft = documentRect.left + window.scrollX;
  
        // Position the dropdown relative to the document
        dropdown.style.top = triggerTop + trigger.offsetHeight + 'px';
        dropdown.style.left = triggerLeft - docLeft + buttonWidth + 'px';
  
        // Append the dropdown to the .my-container
        const container = this.closest('.my-container');
        container.appendChild(dropdown);
      });
    });
  });
  