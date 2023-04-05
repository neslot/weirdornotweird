document.addEventListener('DOMContentLoaded', () => {
  const submitButton = document.getElementById('submit');
  const scenarioTextarea = document.getElementById('scenario');
  const resultDiv = document.getElementById('result');

  submitButton.addEventListener('click', async () => {
    const scenario = scenarioTextarea.value.trim();
    if (scenario === '') {
      alert('Please enter a scenario');
      return;
    }

    submitButton.disabled = true;
    resultDiv.textContent = 'Hmm, let me think...';

    try {
      const response = await fetch('/api/weird-or-not', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scenario }),
      });

      if (!response.ok) {
        throw new Error('Error processing request');
      }

      const { result } = await response.json();
      resultDiv.textContent = result;
    } catch (error) {
      console.error(error);
      resultDiv.textContent = 'Error processing request';
    } finally {
      submitButton.disabled = false;
    }
  });
});
