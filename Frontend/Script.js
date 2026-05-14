// SignalSense AI Home Page — Intelligent call drop prevention system
// Redirect to KeyPadPage.html on button click

document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startButton');

  if (startBtn) {
    startBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // smooth micro-interaction: slight visual feedback
      startBtn.style.transform = 'scale(0.97)';
      setTimeout(() => {
        startBtn.style.transform = '';
      }, 120);
      // redirect to KeyPadPage.html (same directory)
      window.location.href = 'KeyPadPage.html';
    });
  } else {
    console.warn('Start button not found in DOM');
  }

  // add any subtle page-load animation or analytics (optional)
  const heroCard = document.querySelector('.glass-card');
  if (heroCard) {
    heroCard.style.animation = 'fadeSlideUp 0.7s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards';
    heroCard.style.opacity = '0';
  }
});

// extra keyframe definition for entrance can be dynamically added, but we can also rely on CSS
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeSlideUp {
    0% { opacity: 0; transform: translateY(30px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .glass-card {
    animation: fadeSlideUp 0.65s ease-out forwards;
  }
`;
document.head.appendChild(styleSheet);