let audioInRiproduzione = null;

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

async function caricaEpisodi() {
  try {
    const response = await fetch('/api/episodi');
    const episodi = await response.json();

    episodi.sort((a, b) => new Date(a.data) - new Date(b.data));

    const container = document.getElementById('episodi-container');

    episodi.forEach(episodio => {
      const div = document.createElement('div');
      div.className = 'episodio';

      const data = new Date(episodio.data);
      const dataFormattata = data.toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      });

      div.innerHTML = `
        <div class="episodio-row">
          <button class="play-button">
            <svg class="icon"width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>${episodio.titolo}
          </button>
            <audio class="audio-player" data-id="${episodio.id}">
              <source src="/audio/${episodio.file}" type="audio/mpeg">
            </audio>
            
           <div class="episodio-meta">${dataFormattata}</div>
           <div class="progress-container" data-id="${episodio.id}">
              <progress class="progress-bar" value="0" max="100" data-id="${episodio.id}"></progress>
            </div>
        </div>

    
      `;

      container.appendChild(div);

      const audioPlayer = div.querySelector('.audio-player');
      const playButton = div.querySelector('.play-button');
      const progressBar = div.querySelector('.progress-bar');
      const tempoCorrente = div.querySelector('.tempo-corrente');
      const tempoTotale = div.querySelector('.tempo-totale');

      audioPlayer.addEventListener('loadedmetadata', () => {
        tempoTotale.textContent = formatTime(audioPlayer.duration);
      });

      audioPlayer.addEventListener('timeupdate', () => {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = percent;
        tempoCorrente.textContent = formatTime(audioPlayer.currentTime);
      });

      progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audioPlayer.currentTime = percent * audioPlayer.duration;
      });

      playButton.addEventListener('click', () => {
        if (audioPlayer.paused) {
          if (audioInRiproduzione && audioInRiproduzione !== audioPlayer) {
            audioInRiproduzione.pause();
            audioInRiproduzione.currentTime = 0;
          }
          audioPlayer.play();
          audioInRiproduzione = audioPlayer;
          playButton.classList.add('playing');
          playButton.innerHTML = `<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg> ${episodio.titolo}`;
        } else {
          audioPlayer.pause();
          playButton.classList.remove('playing');
          playButton.innerHTML = `<svg class="icon"width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>${episodio.titolo}`;
        }
      });

      audioPlayer.addEventListener('play', () => {

        document.querySelectorAll('audio').forEach(audio => {
          if (audio !== audioPlayer) {
            audio.pause();
            audio.currentTime = 0;
          }
        });
        audioInRiproduzione = audioPlayer;
        playButton.classList.add('playing');
        playButton.innerHTML = `<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg> ${episodio.titolo}`;
      });

      audioPlayer.addEventListener('pause', () => {
        playButton.classList.remove('playing');
        playButton.innerHTML = `<svg class="icon"width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>${episodio.titolo}`;
      });

      audioPlayer.addEventListener('ended', () => {
        playButton.classList.remove('playing');
        playButton.innerHTML = `<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/></svg> ${episodio.titolo}`;
      });
    });
  } catch (error) {
    console.error('Errore nel caricamento episodi:', error);
  }
}

document.addEventListener('DOMContentLoaded', caricaEpisodi);